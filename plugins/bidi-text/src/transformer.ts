import type { PluggableList } from "unified"
import type { Root as HastRoot, Element } from "hast"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

const farsiRange = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
const letter = /\p{L}/u

// Block-level elements whose own text gets an explicit direction. List items,
// table cells and figure captions are included: mixed-direction text reorders
// there just as badly as inside a paragraph.
const DIR_TAGS = new Set([
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
  "blockquote",
])

// Bidi rule: direction is decided by the first *letter*, not the first
// non-whitespace character. Digits, punctuation and emoji are "weak"
// characters — e.g. "## 1: خواب" should still be rtl.
function firstLetterDirection(text: string): "rtl" | "ltr" | undefined {
  for (const char of text) {
    if (!letter.test(char)) {
      continue
    }
    return farsiRange.test(char) ? "rtl" : "ltr"
  }
  return undefined
}

// Collect text from the whole subtree — content is frequently nested two or
// more levels deep (e.g. <p><em><strong>متن</strong></em></p>).
function getTextContent(node: Element): string {
  let out = ""
  for (const child of node.children) {
    if (child.type === "text") {
      out += child.value
    } else if (child.type === "element") {
      out += getTextContent(child)
    }
  }
  return out
}

export const BidiText: QuartzTransformerPlugin = () => {
  return {
    name: "BidiText",
    htmlPlugins(): PluggableList {
      return [
        () => (tree: HastRoot) => {
          visit(tree, "element", (node: Element) => {
            if (!DIR_TAGS.has(node.tagName)) {
              return
            }
            const direction = firstLetterDirection(getTextContent(node))
            // No letters at all (only digits, punctuation or emoji): keep the
            // document direction instead of forcing `ltr` onto it.
            if (!direction) {
              return
            }
            node.properties = node.properties || {}
            node.properties.dir = direction
          })
        },
      ]
    },
  }
}
