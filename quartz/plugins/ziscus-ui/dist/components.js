// components.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var ZiscusComments = (opts) => {
const Component = ({ fileData, cfg }) => {
    const data = fileData;
    const ziscus = data.ziscusComments;
    if (!ziscus?.commentId) {
      return null;
    }
    const comments = ziscus.comments ?? [];
    const currentSlug = fileData.slug ?? "";
    const redirectPath = currentSlug ? `https://${cfg.baseUrl}/${currentSlug}` : `https://${cfg.baseUrl}/`;
    return /* @__PURE__ */ jsx("section", { class: "ziscus-comments", id: "comments", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { class: "ziscus-comments-inner", children: [
      /* @__PURE__ */ jsxs("div", { class: "ziscus-comments-header", children: [
        /* @__PURE__ */ jsx("h2", { children: opts.title ?? "\u0646\u0638\u0631\u0627\u062A" }),
        comments.length > 0 && /* @__PURE__ */ jsx("span", { class: "ziscus-comments-count", children: comments.length })
      ] }),
      comments.length > 0 ? /* @__PURE__ */ jsx("div", { class: "ziscus-comments-list", children: comments.map((comment) => /* @__PURE__ */ jsxs("article", { class: "ziscus-comment", children: [
        /* @__PURE__ */ jsxs("div", { class: "ziscus-comment-meta", children: [
          /* @__PURE__ */ jsx("strong", { children: comment.author }),
          /* @__PURE__ */ jsx("time", { dateTime: comment.createdAt, children: new Date(comment.createdAt).toLocaleDateString("fa-IR") })
        ] }),
        /* @__PURE__ */ jsx("div", { class: "ziscus-comment-body", children: comment.body })
      ] }, comment.id)) }) : /* @__PURE__ */ jsx("p", { class: "ziscus-comments-empty", children: opts.emptyText ?? "\u0647\u0646\u0648\u0632 \u0646\u0638\u0631\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647. \u0627\u0648\u0644\u06CC\u0646 \u0646\u0641\u0631\u06CC \u0628\u0627\u0634\u06CC\u062F \u06A9\u0647 \u0646\u0638\u0631 \u0645\u06CC\u200C\u062F\u0647\u062F." }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          class: "ziscus-comments-form",
          action: `${opts.endpoint}/submit`,
          method: "POST",
          children: [
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "slug", value: ziscus.commentId }),
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "redirect", value: redirectPath }),
            /* @__PURE__ */ jsxs("div", { class: "ziscus-comments-field", children: [
              /* @__PURE__ */ jsx("label", { for: "ziscus-author", children: "\u0646\u0627\u0645" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "ziscus-author",
                  name: "author",
                  type: "text",
                  maxlength: 100,
                  required: true,
                  autocomplete: "name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { class: "ziscus-comments-field", children: [
              /* @__PURE__ */ jsx("label", { for: "ziscus-body", children: "\u0646\u0638\u0631 \u0634\u0645\u0627" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "ziscus-body",
                  name: "body",
                  rows: 5,
                  maxlength: 5e3,
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx("button", { type: "submit", children: "\u0627\u0631\u0633\u0627\u0644 \u0646\u0638\u0631" }),
            /* @__PURE__ */ jsx("p", { class: "ziscus-comments-note", children: "\u0646\u0638\u0631 \u0634\u0645\u0627 \u067E\u0633 \u0627\u0632 \u0628\u0631\u0631\u0633\u06CC \u0645\u0646\u062A\u0634\u0631 \u0645\u06CC\u200C\u0634\u0648\u062F." })
          ]
        }
      )
    ] }) });
  };
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
  `;
  return Component;
};
export {
  ZiscusComments
};
