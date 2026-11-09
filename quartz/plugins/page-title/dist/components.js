// quartz/plugins/page-title/components.tsx
import { pathToRoot, joinSegments } from "@quartz-community/utils";
import { jsx, jsxs } from "preact/jsx-runtime";
var PageTitle = (opts) => {
  const subtitle = opts?.subtitle ?? "\u0648\u0628\u0644\u0627\u06AF \u0645\u062D\u0645\u062F \u0645\u0647\u062F\u06CC";
  const Component = ({ fileData, cfg, displayClass }) => {
    const title = cfg?.pageTitle ?? "\u0645\u06CC\u0645";
    const slug = fileData.slug === "404" ? "index" : fileData.slug;
    const baseDir = pathToRoot(slug);
    const homeHref = baseDir === "." ? "/" : baseDir;
    return /* @__PURE__ */ jsx("div", { class: "page-title-container", children: /* @__PURE__ */ jsx("h1", { class: [displayClass, "page-title"].filter(Boolean).join(" "), children: /* @__PURE__ */ jsxs("div", { class: "title-logo", children: [
      /* @__PURE__ */ jsx("a", { class: "title-logo-link", href: homeHref, children: /* @__PURE__ */ jsx("img", { id: "icon-header", src: joinSegments(baseDir, "static/icon-header.png"), alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { class: "title-text", children: [
        /* @__PURE__ */ jsx("a", { href: homeHref, class: displayClass, id: "header-text", children: title }),
        subtitle && /* @__PURE__ */ jsx("span", { class: "title-subtitle", children: subtitle })
      ] })
    ] }) }) });
  };
  Component.css = `
.page-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
  width: 100%;
}

.title-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

#header-text {
  text-decoration: none;
  color: var(--secondary);
  transition: color 0.2s ease;
}

#header-text:hover {
  color: var(--tertiary);
}

/* Shown only in the mobile lockup (logo + title + subtitle). */
.title-subtitle {
  display: none;
}
`;
  return Component;
};
export {
  PageTitle
};
