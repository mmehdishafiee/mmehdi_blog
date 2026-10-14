// components.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
function getDate(data) {
  const defaultDateType = data.defaultDateType;
  if (!defaultDateType) return void 0;
  const dates = data.dates;
  return dates?.[defaultDateType];
}
function byDateAndAlphabetical() {
  return (f1, f2) => {
    const f1Date = getDate(f1);
    const f2Date = getDate(f2);
    if (f1Date && f2Date) {
      return f2Date.getTime() - f1Date.getTime();
    } else if (f1Date && !f2Date) {
      return -1;
    } else if (!f1Date && f2Date) {
      return 1;
    }
    const f1Title = (f1.frontmatter?.title ?? "").toLowerCase();
    const f2Title = (f2.frontmatter?.title ?? "").toLowerCase();
    return f1Title.localeCompare(f2Title);
  };
}
function formatDate(d, locale = "en-US") {
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" });
}
var POST_FOLDERS = ["notes/", "satrcin/", "translations/", "lists/", "offers/"];
var RecentPosts = (userOpts) => {
  const opts = {
    limit: 5,
    showTags: true,
    folders: POST_FOLDERS,
    ...userOpts
  };
  const Component = ({ allFiles, fileData, displayClass, cfg }) => {
    const slug = fileData.slug ?? "";
    const rootPath = slug.split("/").filter((x) => x !== "").slice(0, -1).map(() => "..").join("/") || ".";
    const resolveRelative = (target) => `${rootPath}/${target.replace(/^\/+|\/+$/g, "")}`.replace(/\/+/g, "/");
    const pages = (allFiles ?? []).filter((p) => p.unlisted !== true).filter((p) => {
      const pageSlug = p.slug ?? "";
      if (pageSlug === "404") return false;
      if (pageSlug === "tags" || pageSlug.startsWith("tags/")) return false;
      if (pageSlug.endsWith("/index") || pageSlug === "index") return false;
      if (!opts.folders?.length) return true;
      return opts.folders.some((folder) => pageSlug.startsWith(folder));
    }).filter((p) => Boolean(getDate(p))).sort(byDateAndAlphabetical());
    const locale = cfg.locale ?? "en-US";
    return /* @__PURE__ */ jsxs("div", { class: `recent-posts ${displayClass ?? ""}`, children: [
      /* @__PURE__ */ jsx("h3", { children: opts.title ?? "Recent Notes" }),
      /* @__PURE__ */ jsx("ul", { class: "recent-ul", children: pages.slice(0, opts.limit).map((page) => {
        const title = page.frontmatter?.title ?? "Untitled";
        const tags = page.frontmatter?.tags ?? [];
        const date = getDate(page);
        return /* @__PURE__ */ jsx("li", { class: "recent-li", children: /* @__PURE__ */ jsxs("div", { class: "section", children: [
          /* @__PURE__ */ jsx("div", { class: "desc", children: /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsx("a", { href: resolveRelative(page.slug ?? ""), class: "internal", children: title }) }) }),
          date && /* @__PURE__ */ jsx("p", { class: "meta", children: /* @__PURE__ */ jsx("time", { datetime: date.toISOString(), children: formatDate(date, locale) }) }),
          opts.showTags && /* @__PURE__ */ jsx("ul", { class: "tags", children: tags.map((tag) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { class: "internal tag-link", href: resolveRelative(`tags/${tag}`), children: tag }) })) })
        ] }) });
      }) })
    ] });
  };
  Component.css = `
  .recent-posts > h3 {
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
  }
  .recent-posts > ul.recent-ul {
    list-style: none;
    margin-top: 1rem;
    padding-left: 0;
  }
  .recent-posts > ul.recent-ul > li {
    margin: 1rem 0;
  }
  .recent-posts > ul.recent-ul > li .section > .desc > h3 > a {
    background-color: transparent;
  }
  .recent-posts > ul.recent-ul > li .section > .meta {
    margin: 0 0 0.5rem 0;
    opacity: 0.6;
  }
  `;
  return Component;
};
export {
  RecentPosts
};
