// components.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var PrintButton = () => {
  const Component = ({ displayClass }) => /* @__PURE__ */ jsx("div", { class: [displayClass, "print-actions"].filter(Boolean).join(" "), children: /* @__PURE__ */ jsxs("button", { type: "button", class: "print-button", title: "\u0686\u0627\u067E \u06CC\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0628\u0647 \u0635\u0648\u0631\u062A PDF", children: [
    /* @__PURE__ */ jsxs(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.75",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsx("path", { d: "M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }),
          /* @__PURE__ */ jsx("path", { d: "M6 14h12v7H6zM18 12h.01" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("span", { children: "\u0686\u0627\u067E" })
  ] }) });
  Component.css = `
.print-actions {
  display: flex;
  justify-content: flex-end;
  margin-block: 0 0.75rem;
}
.print-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-control);
  background: var(--content-surface);
  color: var(--darkgray);
  font: inherit;
  cursor: pointer;
}
.print-button:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}
`;
  Component.afterDOMLoaded = `
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest(".print-button")) {
    window.print();
  }
});
`;
  return Component;
};
export {
  PrintButton
};
