// plugins/bidi-text/src/transformer.ts
import { visit } from "unist-util-visit";
var farsiRange = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
var letter = /\p{L}/u;
var DIR_TAGS = /* @__PURE__ */ new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "dt",
  "dd",
  "td",
  "th",
  "figcaption",
  "blockquote"
]);
function firstLetterDirection(text) {
  for (const char of text) {
    if (!letter.test(char)) {
      continue;
    }
    return farsiRange.test(char) ? "rtl" : "ltr";
  }
  return void 0;
}
function getTextContent(node) {
  let out = "";
  for (const child of node.children) {
    if (child.type === "text") {
      out += child.value;
    } else if (child.type === "element") {
      out += getTextContent(child);
    }
  }
  return out;
}
var BidiText = () => {
  return {
    name: "BidiText",
    htmlPlugins() {
      return [
        () => (tree) => {
          visit(tree, "element", (node) => {
            if (!DIR_TAGS.has(node.tagName)) {
              return;
            }
            const direction = firstLetterDirection(getTextContent(node));
            if (!direction) {
              return;
            }
            node.properties = node.properties || {};
            node.properties.dir = direction;
          });
        }
      ];
    }
  };
};
export {
  BidiText
};
