// Re-export shared path utilities from @quartz-community/utils
import {
  slugifyFilePath as baseSlugifyFilePath,
  type FilePath,
  type FullSlug,
} from "@quartz-community/utils"
import { mapLegacyFolder } from "./folder-map"

/**
 * Slugify a file path and translate the legacy Persian top-level folder name to
 * its English URL slug (see ./folder-map). Every other segment is untouched, so
 * the on-disk vault layout and the public URL scheme stay independent.
 */
export function slugifyFilePath(fp: FilePath, excludeExt?: boolean): FullSlug {
  return mapLegacyFolder(baseSlugifyFilePath(fp, excludeExt)) as FullSlug
}

export {
  isFilePath,
  isFullSlug,
  isSimpleSlug,
  isRelativeURL,
  isAbsoluteURL,
  getFullSlug,
  simplifySlug,
  joinSegments,
  endsWith,
  trimSuffix,
  stripSlashes,
  getFileExtension,
  isFolderPath,
  getAllSegmentPrefixes,
  pathToRoot,
  resolveRelative,
  splitAnchor,
  slugTag,
  transformInternalLink,
  transformLink,
  normalizeHastElement,
} from "@quartz-community/utils"

export type {
  FilePath,
  FullSlug,
  SimpleSlug,
  RelativeURL,
  TransformOptions,
} from "@quartz-community/utils"

// --- v5-specific exports below ---

export const QUARTZ = "quartz"

// from micromorph/src/utils.ts
// https://github.com/natemoo-re/micromorph/blob/main/src/utils.ts#L5
const _rebaseHtmlElement = (el: Element, attr: string, newBase: string | URL) => {
  const rebased = new URL(el.getAttribute(attr)!, newBase)
  el.setAttribute(attr, rebased.pathname + rebased.hash)
}
export function normalizeRelativeURLs(el: Element | Document, destination: string | URL) {
  el.querySelectorAll('[href=""], [href^="./"], [href^="../"]').forEach((item) => {
    _rebaseHtmlElement(item, "href", destination)
  })
  el.querySelectorAll('[src=""], [src^="./"], [src^="../"]').forEach((item) => {
    _rebaseHtmlElement(item, "src", destination)
  })
}
