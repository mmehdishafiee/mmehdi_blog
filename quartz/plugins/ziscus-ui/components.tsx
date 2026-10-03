import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"

type ZiscusComment = {
  id: string
  author: string
  body: string
  status: string
  createdAt: string
  approved_at: string | null
}

type ZiscusFileData = QuartzComponentProps["fileData"] & {
  ziscusComments?: {
    commentId: string
    comments: ZiscusComment[]
  }
}

interface Options {
  endpoint: string
  title?: string
  emptyText?: string
}

export const ZiscusComments: QuartzComponentConstructor<Options> = (opts) => {
  const Component = ({ fileData, cfg }) => {
    const data = fileData as ZiscusFileData
    const ziscus = data.ziscusComments

    if (!ziscus?.commentId) {
      return null
    }

    const comments = ziscus.comments ?? []
    const currentSlug = fileData.slug ?? ""
    const redirectPath = currentSlug ? `https://${cfg.baseUrl}/${currentSlug}` : `https://${cfg.baseUrl}/`;

    return (
      <section class="ziscus-comments" id="comments" dir="rtl">
        <div class="ziscus-comments-inner">
          <div class="ziscus-comments-header">
            <h2>{opts.title ?? "نظرات"}</h2>
            {comments.length > 0 && (
              <span class="ziscus-comments-count">
                {comments.length}
              </span>
            )}
          </div>

          {comments.length > 0 ? (
            <div class="ziscus-comments-list">
              {comments.map((comment) => (
                <article class="ziscus-comment" key={comment.id}>
                  <div class="ziscus-comment-meta">
                    <strong>{comment.author}</strong>
                    <time dateTime={comment.createdAt}>
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </time>
                  </div>

                  <div class="ziscus-comment-body">
                    {comment.body}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p class="ziscus-comments-empty">
              {opts.emptyText ??
                "هنوز نظری ثبت نشده. اولین نفری باشید که نظر می‌دهد."}
            </p>
          )}

          <form
            class="ziscus-comments-form"
            action={`${opts.endpoint}/submit`}
            method="POST"
          >
            <input type="hidden" name="slug" value={ziscus.commentId} />
            <input type="hidden" name="redirect" value={redirectPath} />

            <div class="ziscus-comments-field">
              <label for="ziscus-author">نام</label>
              <input
                id="ziscus-author"
                name="author"
                type="text"
                maxlength={100}
                required
                autocomplete="name"
              />
            </div>

            <div class="ziscus-comments-field">
              <label for="ziscus-body">نظر شما</label>
              <textarea
                id="ziscus-body"
                name="body"
                rows={5}
                maxlength={5000}
                required
              />
            </div>

            <button type="submit">ارسال نظر</button>

            <p class="ziscus-comments-note">
              نظر شما پس از بررسی منتشر می‌شود.
            </p>
          </form>
        </div>
      </section>
    )
  }

  Component.css = `
    .ziscus-comments {
      margin: 3rem 0 1rem;
      width: 100%;
    }

    .ziscus-comments-inner {
      max-width: 700px;
      margin: 0 auto;
      padding: 1.5rem;
      border: 1px solid var(--lightgray);
      border-radius: 12px;
      background: var(--light);
    }

    .ziscus-comments-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.5rem;
    }

    .ziscus-comments-header h2 {
      margin: 0;
    }

    .ziscus-comments-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.7rem;
      height: 1.7rem;
      padding: 0 0.45rem;
      border-radius: 999px;
      background: var(--highlight);
      color: var(--dark);
      font-size: 0.85rem;
    }

    .ziscus-comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .ziscus-comment {
      padding: 1rem 0;
      border-bottom: 1px solid var(--lightgray);
    }

    .ziscus-comment:last-child {
      border-bottom: 0;
    }

    .ziscus-comment-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.6rem;
      color: var(--dark);
    }

    .ziscus-comment-meta time {
      color: var(--gray);
      font-size: 0.85rem;
      white-space: nowrap;
    }

    .ziscus-comment-body {
      color: var(--darkgray);
      line-height: 1.9;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .ziscus-comments-empty {
      margin: 0 0 2rem;
      color: var(--gray);
      line-height: 1.8;
    }

    .ziscus-comments-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .ziscus-comments-field {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .ziscus-comments-field label {
      font-weight: 600;
    }

    .ziscus-comments-field input,
    .ziscus-comments-field textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      background: var(--light);
      color: var(--dark);
      font: inherit;
      direction: rtl;
    }

    .ziscus-comments-field textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.8;
    }

    .ziscus-comments-field input:focus,
    .ziscus-comments-field textarea:focus {
      outline: 2px solid var(--secondary);
      outline-offset: 1px;
    }

    .ziscus-comments-form button {
      width: fit-content;
      padding: 0.7rem 1.2rem;
      border: 0;
      border-radius: 8px;
      background: var(--dark);
      color: var(--light);
      font: inherit;
      cursor: pointer;
    }

    .ziscus-comments-form button:hover {
      opacity: 0.9;
    }

    .ziscus-comments-note {
      margin: 0;
      color: var(--gray);
      font-size: 0.85rem;
    }

    @media all and (max-width: 600px) {
      .ziscus-comments-inner {
        padding: 1rem;
      }

      .ziscus-comment-meta {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `

  return Component
}