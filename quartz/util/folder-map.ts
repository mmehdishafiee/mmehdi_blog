/**
 * The content tree keeps its Persian folder names because it is also an
 * Obsidian vault. Public URLs, however, must stay English (`/pages/...`,
 * `/notes/...`). Only the first path segment is translated here; everything
 * below it is already English.
 *
 * Keys are written as unicode escapes on purpose: several folder names contain
 * ZWNJ (U+200C) and typing them literally is unreliable across editors.
 */
export const LEGACY_FOLDER_TO_SLUG: Readonly<Record<string, string>> = {
  "\u0628\u0631\u06af\u0647\u200c\u0647\u0627": "pages", // برگه‌ها
  "\u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627": "notes", // یادداشت‌ها
  "\u062a\u0631\u062c\u0645\u0647\u200c\u0647\u0627": "translations", // ترجمه‌ها
  "\u0633\u0637\u0631\u0686\u06cc\u0646": "satrchin", // سطرچین
  "\u0644\u06cc\u0633\u062a\u200c\u0647\u0627": "lists", // لیست‌ها
  "\u067e\u06cc\u0634\u0646\u0647\u0627\u062f\u0647\u0627": "recommendations", // پیشنهادها
}

export const SLUG_FOLDER_TO_LEGACY: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(LEGACY_FOLDER_TO_SLUG).map(([legacy, slug]) => [slug, legacy]),
)

/** Replace a legacy Persian top-level folder with its English slug. */
export function mapLegacyFolder(slug: string): string {
  const slash = slug.indexOf("/")
  const head = slash === -1 ? slug : slug.slice(0, slash)
  const mapped = LEGACY_FOLDER_TO_SLUG[head]
  if (!mapped) return slug
  return slash === -1 ? mapped : mapped + slug.slice(slash)
}

/** Replace an English top-level folder with the legacy Persian folder. */
export function unmapSlugFolder(slug: string): string {
  const slash = slug.indexOf("/")
  const head = slash === -1 ? slug : slug.slice(0, slash)
  const mapped = SLUG_FOLDER_TO_LEGACY[head]
  if (!mapped) return slug
  return slash === -1 ? mapped : mapped + slug.slice(slash)
}