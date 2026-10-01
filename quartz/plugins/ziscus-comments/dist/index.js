const COMMENT_ID_PATTERN = /^[a-z0-9_-]+$/

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
  try {
    const response = await fetch(
      `${endpoint}/comments/${encodeURIComponent(commentId)}`,
      { signal: AbortSignal.timeout(timeoutMs) },
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      return []
    }

    return data.map((comment) => ({
      id: String(comment.id),
      author: decodeHtmlEntities(String(comment.author ?? "")),
      body: decodeHtmlEntities(String(comment.body ?? "")),
      createdAt: String(comment.created_at ?? comment.createdAt ?? ""),
    }))
  } catch (err) {
    console.error(`[ziscus] fetch failed for "${commentId}":`, err instanceof Error ? err.message : err)
    return []
  }
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