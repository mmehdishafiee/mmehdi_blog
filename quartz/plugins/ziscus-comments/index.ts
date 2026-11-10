import type { Root } from "mdast"
import type { VFile } from "vfile"
import https from "node:https"

interface ZiscusCommentsOptions {
  endpoint: string
  timeoutMs?: number
}

interface ZiscusComment {
  id: string
  author: string
  body: string
  createdAt: string
}

const COMMENT_ID_PATTERN = /^[a-z0-9_-]+$/

// Some networks (and some TLS middleboxes) drop TLS 1.3 handshakes to
// `*.workers.dev`, which makes every fetch time out and silently bakes empty
// comment sections into the build. Probe the default transport once, then fall
// back to a plain TLS 1.2 request for the rest of the build.
type Transport = "fetch" | "tls12"

const PROBE_TIMEOUT_MS = 5000
const USER_AGENT = "ziscus-quartz-build"

let transport: Transport | null = null

// One handshake per socket instead of one per page: the connections to the
// worker are the flaky part, not the requests themselves.
const tls12Agent = new https.Agent({
  keepAlive: true,
  maxSockets: 4,
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.2",
})

function getCommentId(file: VFile): string | undefined {
  const frontmatter = file.data.frontmatter as Record<string, unknown> | undefined
  const raw = frontmatter?.commentId

  if (typeof raw !== "string") return

  const commentId = raw.trim().toLowerCase()

  if (!COMMENT_ID_PATTERN.test(commentId)) {
    throw new Error(
      `Invalid commentId "${commentId}" in ${file.data.relativePath ?? file.path}. ` +
        `Use only lowercase letters, numbers, and hyphens.`,
    )
  }

  return commentId
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
}

async function requestWithFetch(url: string, timeoutMs: number): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

function requestWithTls12(url: string, timeoutMs: number): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent: tls12Agent,
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        timeout: timeoutMs,
      },
      (res) => {
        const chunks: Buffer[] = []

        res.on("data", (chunk) => chunks.push(chunk as Buffer))
        res.on("end", () => {
          const status = res.statusCode ?? 0

          if (status < 200 || status >= 300) {
            reject(new Error(`HTTP ${status}`))
            return
          }

          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
          } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)))
          }
        })
      },
    )

    req.on("timeout", () => req.destroy(new Error("The operation was aborted due to timeout")))
    req.on("error", reject)
  })
}

async function requestJson(url: string, timeoutMs: number): Promise<unknown> {
  if (transport !== "tls12") {
    try {
      const data = await requestWithFetch(
        url,
        transport === null ? Math.min(timeoutMs, PROBE_TIMEOUT_MS) : timeoutMs,
      )
      transport = "fetch"
      return data
    } catch {
      transport = "tls12"
    }
  }

  return requestWithTls12(url, timeoutMs)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchComments(
  commentId: string,
  endpoint: string,
  timeoutMs: number,
): Promise<ZiscusComment[]> {
  const url = `${endpoint}/comments/${encodeURIComponent(commentId)}`
  const attempts = 3
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const data = await requestJson(url, timeoutMs)

      if (!Array.isArray(data)) {
        throw new Error("Invalid Ziscus response (expected an array)")
      }

      return data.map((comment: any) => ({
        id: String(comment.id),
        author: decodeHtmlEntities(String(comment.author ?? "")),
        body: decodeHtmlEntities(String(comment.body ?? "")),
        createdAt: String(comment.created_at ?? comment.createdAt ?? ""),
      }))
    } catch (error) {
      lastError = error
      if (attempt < attempts) await delay(250 * attempt)
    }
  }

  console.error(
    `[ziscus] could not load comments for "${commentId}" after ${attempts} attempts ` +
      `(${lastError instanceof Error ? lastError.message : String(lastError)}) — ` +
      `the comment section of this page will be empty.`,
  )

  return []
}

export const manifest = {
  name: "ziscus-comments",
  displayName: "Ziscus Comments Data",
  description: "Fetches Ziscus comments during Quartz build.",
  version: "0.1.0",
  category: "transformer",
}

export default function ziscusCommentsPlugin(options: ZiscusCommentsOptions) {
  const endpoint = options.endpoint.replace(/\/$/, "")
  const timeoutMs = options.timeoutMs ?? 5000

  return {
    name: "ZiscusComments",

    markdownPlugins() {
      return [
        () => async (_tree: Root, file: VFile) => {
          const commentId = getCommentId(file)

          if (!commentId) return

          const comments = await fetchComments(commentId, endpoint, timeoutMs)

          file.data.ziscusComments = {
            commentId,
            comments,
          }
        },
      ]
    },
  }
}
