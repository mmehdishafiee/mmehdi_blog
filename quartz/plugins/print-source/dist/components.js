// components.tsx
import { simplifySlug } from "@quartz-community/utils";
import { jsx, jsxs } from "preact/jsx-runtime";
var PrintSource = () => {
  const Component = ({ cfg, fileData }) => {
    if (!cfg.baseUrl || !fileData.slug) return null;
    const base = cfg.baseUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const slug = fileData.slug === "index" ? "" : simplifySlug(fileData.slug);
    const url = `https://${base}/${slug}`;
    return /* @__PURE__ */ jsxs("div", { class: "print-source", dir: "rtl", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "\u0645\u0646\u0628\u0639: ",
        cfg.pageTitle
      ] }),
      /* @__PURE__ */ jsx("a", { href: url, dir: "ltr", children: url })
    ] });
  };
  Component.css = `.print-source { display: none; }`;
  return Component;
};
export {
  PrintSource
};
