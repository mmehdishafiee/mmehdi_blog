import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../components/types"
import type { QuartzPluginData } from "../../plugins/vfile"

interface Comment {
  id: string
  author: string
  body: string
  createdAt: string
}

interface ZiscusFileData extends QuartzPluginData {
  ziscusComments?: {
    commentId: string
    comments: Comment[]
  }
}

interface ZiscusCommentsOptions {
  endpoint: string
  title?: string
  emptyText?: string
}

function formatDate(date: string, locale: string): string {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return ""

  return parsed.toLocaleDateString(locale || "fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const ZiscusComments = ((options: ZiscusCommentsOptions) => {
  const endpoint = options.endpoint.replace(/\/$/, "")
  const title = options.title ?? "نظرات"
  const emptyText =
    options.emptyText ?? "هنوز نظری ثبت نشده. اولین نفری باشید که نظر می‌دهد."

  const Component: QuartzComponent = ({
    cfg,
    fileData,
  }: QuartzComponentProps) => {
    const data = fileData as ZiscusFileData
    const ziscus = data.ziscusComments

    if (!ziscus?.commentId) return null

    const currentSlug = fileData.slug ?? ""
    const redirectPath = currentSlug ? `/${currentSlug}` : "/"

    return (
      <section class="ziscus-comments" id="comments" dir="rtl">
        <div class="ziscus-comments__header">
          <h2>{title}</h2>
          <span class="ziscus-comments__count">
            {ziscus.comments.length}
          </span>
        </div>

        {ziscus.comments.length > 0 ? (
          <div class="ziscus-comments__list">
            {ziscus.comments.map((comment) => (
              <article class="ziscus-comments__comment" key={comment.id}>
                <div class="ziscus-comments__comment-meta">
                  <strong>{comment.author}</strong>
                  <time datetime={comment.createdAt}>
                    {formatDate(comment.createdAt, cfg.locale)}
                  </time>
                </div>

                <div class="ziscus-comments__comment-body">
                  {comment.body}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p class="ziscus-comments__empty">{emptyText}</p>
        )}

        <form
          class="ziscus-comments__form"
          method="POST"
          action={`${endpoint}/submit`}
        >
          <input type="hidden" name="slug" value={ziscus.commentId} />
          <input type="hidden" name="redirect" value={redirectPath} />

          <div class="ziscus-comments__field">
            <label for="ziscus-author">نام</label>
            <input
              id="ziscus-author"
              name="author"
              type="text"
              autocomplete="name"
              required
            />
          </div>

          <div class="ziscus-comments__field">
            <label for="ziscus-body">نظر شما</label>
            <textarea
              id="ziscus-body"
              name="body"
              rows={5}
              required
            />
          </div>

          <p class="ziscus-comments__notice">
            نظر شما پس از بررسی منتشر می‌شود.
          </p>

          <button type="submit">ارسال نظر</button>
        </form>
      </section>
    )
  }

  Component.css = `
    .ziscus-comments {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--lightgray);
    }

    .ziscus-comments__header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.5rem;
    }

    .ziscus-comments__header h2 {
      margin: 0;
    }

    .ziscus-comments__count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.8rem;
      height: 1.8rem;
      padding: 0 0.45rem;
      border-radius: 999px;
      background: var(--highlight);
      color: var(--darkgray);
      font-size: 0.8rem;
    }

    .ziscus-comments__list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .ziscus-comments__comment {
      padding: 1rem 1.1rem;
      border: 1px solid var(--lightgray);
      border-radius: 0.8rem;
      background: var(--light);
    }

    .ziscus-comments__comment-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.6rem;
    }

    .ziscus-comments__comment-meta time {
      color: var(--gray);
      font-size: 0.8rem;
      white-space: nowrap;
    }

    .ziscus-comments__comment-body {
      white-space: pre-wrap;
      line-height: 1.9;
    }

    .ziscus-comments__empty,
    .ziscus-comments__notice {
      color: var(--gray);
    }

    .ziscus-comments__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .ziscus-comments__field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .ziscus-comments__field label {
      font-weight: 600;
    }

    .ziscus-comments__field input,
    .ziscus-comments__field textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 0.8rem 0.9rem;
      border: 1px solid var(--lightgray);
      border-radius: 0.6rem;
      background: var(--light);
      color: var(--dark);
      font: inherit;
    }

    .ziscus-comments__field textarea {
      resize: vertical;
    }

    .ziscus-comments__form button {
      align-self: flex-start;
      padding: 0.7rem 1.1rem;
      border: 0;
      border-radius: 0.6rem;
      background: var(--secondary);
      color: var(--light);
      font: inherit;
      cursor: pointer;
    }

    @media all and (max-width: 700px) {
      .ziscus-comments__comment-meta {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.25rem;
      }

      .ziscus-comments__form button {
        width: 100%;
      }
    }
  `

  return Component
}) satisfies QuartzComponentConstructor<ZiscusCommentsOptions>

export { ZiscusComments }