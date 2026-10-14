// ../../util/lang.ts
import { capitalize, classNames } from "@quartz-community/utils";

// components.tsx
import { jsx } from "preact/jsx-runtime";
var Footer = (opts) => {
  const Component = ({ displayClass }) => {
    const links = opts?.links ?? {};
    return /* @__PURE__ */ jsx("footer", { class: classNames(displayClass), children: /* @__PURE__ */ jsx("ul", { children: Object.entries(links).map(([text, link]) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: link, children: text }) })) }) });
  };
  Component.css = `
  footer {
    text-align: left;
    margin-bottom: 4rem;
    opacity: 0.7;
  }
  footer ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  `;
  return Component;
};
export {
  Footer
};
