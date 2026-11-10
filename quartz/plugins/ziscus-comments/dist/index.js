// index.ts
import https from "node:https";
var COMMENT_ID_PATTERN = /^[a-z0-9_-]+$/;
var PROBE_TIMEOUT_MS = 5e3;
var USER_AGENT = "ziscus-quartz-build";
var transport = null;
var tls12Agent = new https.Agent({
  keepAlive: true,
  maxSockets: 4,
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.2"
});
function getCommentId(file) {
  const frontmatter = file.data.frontmatter;
  const raw = frontmatter?.commentId;
  if (typeof raw !== "string") return;
  const commentId = raw.trim().toLowerCase();
  if (!COMMENT_ID_PATTERN.test(commentId)) {
    throw new Error(
      `Invalid commentId "${commentId}" in ${file.data.relativePath ?? file.path}. Use only lowercase letters, numbers, and hyphens.`
    );
  }
  return commentId;
}
function decodeHtmlEntities(value) {
  return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
async function requestWithFetch(url, timeoutMs) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
function requestWithTls12(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent: tls12Agent,
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        timeout: timeoutMs
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const status = res.statusCode ?? 0;
          if (status < 200 || status >= 300) {
            reject(new Error(`HTTP ${status}`));
            return;
          }
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
          } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        });
      }
    );
    req.on("timeout", () => req.destroy(new Error("The operation was aborted due to timeout")));
    req.on("error", reject);
  });
}
async function requestJson(url, timeoutMs) {
  if (transport !== "tls12") {
    try {
      const data = await requestWithFetch(
        url,
        transport === null ? Math.min(timeoutMs, PROBE_TIMEOUT_MS) : timeoutMs
      );
      transport = "fetch";
      return data;
    } catch {
      transport = "tls12";
    }
  }
  return requestWithTls12(url, timeoutMs);
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchComments(commentId, endpoint, timeoutMs) {
  const url = `${endpoint}/comments/${encodeURIComponent(commentId)}`;
  const attempts = 3;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const data = await requestJson(url, timeoutMs);
      if (!Array.isArray(data)) {
        throw new Error("Invalid Ziscus response (expected an array)");
      }
      return data.map((comment) => ({
        id: String(comment.id),
        author: decodeHtmlEntities(String(comment.author ?? "")),
        body: decodeHtmlEntities(String(comment.body ?? "")),
        createdAt: String(comment.created_at ?? comment.createdAt ?? "")
      }));
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(250 * attempt);
    }
  }
  console.error(
    `[ziscus] could not load comments for "${commentId}" after ${attempts} attempts (${lastError instanceof Error ? lastError.message : String(lastError)}) \u2014 the comment section of this page will be empty.`
  );
  return [];
}
var manifest = {
  name: "ziscus-comments",
  displayName: "Ziscus Comments Data",
  description: "Fetches Ziscus comments during Quartz build.",
  version: "0.1.0",
  category: "transformer"
};
function ziscusCommentsPlugin(options) {
  const endpoint = options.endpoint.replace(/\/$/, "");
  const timeoutMs = options.timeoutMs ?? 5e3;
  return {
    name: "ZiscusComments",
    markdownPlugins() {
      return [
        () => async (_tree, file) => {
          const commentId = getCommentId(file);
          if (!commentId) return;
          const comments = await fetchComments(commentId, endpoint, timeoutMs);
          file.data.ziscusComments = {
            commentId,
            comments
          };
        }
      ];
    }
  };
}
export {
  ziscusCommentsPlugin as default,
  manifest
};
