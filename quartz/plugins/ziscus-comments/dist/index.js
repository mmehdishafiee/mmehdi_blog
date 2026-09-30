const COMMENT_ID_PATTERN = /^[a-z0-9-]+$/

function getCommentId(file) {
  const frontmatter = file.data.frontmatter
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

function decodeHtmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
}

async function fetchComments(commentId, endpoint, timeoutMs) {
  const response = await fetch(
    `${endpoint}/comments/${encodeURIComponent(commentId)}`,
    { signal: AbortSignal.timeout(timeoutMs) },
  )

  if (!response.ok) {
    throw new Error(
      `Ziscus returned HTTP ${response.status} for commentId "${commentId}".`,
    )
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error(`Invalid Ziscus response for commentId "${commentId}".`)
  }

  return data.map((comment) => ({
    id: String(comment.id),
    author: decodeHtmlEntities(String(comment.author ?? "")),
    body: decodeHtmlEntities(String(comment.body ?? "")),
    createdAt: String(comment.created_at ?? comment.createdAt ?? ""),
  }))
}

export const manifest = {
  name: "ziscus-comments",
  displayName: "Ziscus Comments Data",
  description: "Fetches Ziscus comments during Quartz build.",
  version: "0.1.0",
  category: "transformer",
}

export default function ziscusCommentsPlugin(options) {
  const endpoint = options.endpoint.replace(/\/$/, "")
  const timeoutMs = options.timeoutMs ?? 5000

  return {
    name: "ZiscusComments",

    markdownPlugins() {
      return [
        () => async (_tree, file) => {
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