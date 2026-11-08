// quartz/plugins/latest-notes/components.tsx
import { formatDate, getDate, resolveRelative } from "@quartz-community/utils";
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
var NOTES_FOLDER = "\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627";
var TITLE = "\u0622\u062E\u0631\u06CC\u0646 \u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627";
var UNTITLED = "\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646";
var LatestNotes = () => {
  const Component = ({ allFiles, fileData, cfg }) => {
    if (fileData.slug !== "index") {
      return null;
    }
    const locale = cfg.locale ?? "fa-IR";
    const notes = allFiles.filter((file) => {
      const relativePath = file.relativePath;
      return !!relativePath && relativePath.startsWith(`${NOTES_FOLDER}/`) && file.unlisted !== true && !file.slug?.endsWith("/index");
    }).sort((a, b) => (getDate(b)?.getTime() ?? 0) - (getDate(a)?.getTime() ?? 0)).slice(0, 10);
    if (notes.length === 0) {
      return null;
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h2", { class: "latest-notes-title", children: TITLE }),
      /* @__PURE__ */ jsx("ul", { class: "latest-notes-list", children: notes.map((note) => {
        const date = getDate(note);
        return /* @__PURE__ */ jsxs("li", { class: "latest-note", children: [
          /* @__PURE__ */ jsx("a", { href: resolveRelative(fileData.slug, note.slug), class: "internal", children: note.frontmatter?.title ?? UNTITLED }),
          date && /* @__PURE__ */ jsx("time", { class: "latest-note-date", datetime: date.toISOString(), children: formatDate(date, locale) })
        ] });
      }) })
    ] });
  };
  Component.css = `
.latest-notes-title {
  margin-bottom: 1rem;
  font-size: clamp(1.55rem, 1.25rem + 1vw, 1.85rem);
  text-align: start;
}

.latest-notes-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 1rem 0 2rem;
  padding: 0;
  list-style: none;
}

.latest-note {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--lightgray);
}

.latest-note:last-child {
  border-bottom: none;
}

.latest-note > a {
  font-family: var(--headerFont);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--dark);
  text-decoration: none;
}

.latest-note > a:hover {
  color: var(--secondary);
}

.latest-note-date {
  flex-shrink: 0;
  color: var(--gray);
  font-size: 0.85rem;
  white-space: nowrap;
}
`;
  return Component;
};
export {
  LatestNotes
};
