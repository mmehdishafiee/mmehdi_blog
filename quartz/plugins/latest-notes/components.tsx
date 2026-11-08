import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"
import { formatDate, getDate, resolveRelative } from "@quartz-community/utils"

/** "یادداشت‌ها" — the on-disk folder that holds the notes. */
const NOTES_FOLDER = "\u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627"
/** "آخرین یادداشت‌ها" */
const TITLE = "\u0622\u062e\u0631\u06cc\u0646 \u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627"
/** "بدون عنوان" */
const UNTITLED = "\u0628\u062f\u0648\u0646 \u0639\u0646\u0648\u0627\u0646"

/**
 * Homepage module: the ten most recent notes from the notes folder, shown in
 * place of the old about block. Only renders on the site index.
 */
export const LatestNotes: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    if (fileData.slug !== "index") {
      return null
    }

    const locale = cfg.locale ?? "fa-IR"
    const notes = allFiles
      .filter((file) => {
        const relativePath = file.relativePath
        return (
          !!relativePath &&
          relativePath.startsWith(`${NOTES_FOLDER}/`) &&
          file.unlisted !== true &&
          !file.slug?.endsWith("/index")
        )
      })
      .sort((a, b) => (getDate(b)?.getTime() ?? 0) - (getDate(a)?.getTime() ?? 0))
      .slice(0, 10)

    if (notes.length === 0) {
      return null
    }

    return (
      <>
        <h2 class="latest-notes-title">{TITLE}</h2>
        <ul class="latest-notes-list">
          {notes.map((note) => {
            const date = getDate(note)
            return (
              <li class="latest-note">
                <a href={resolveRelative(fileData.slug!, note.slug!)} class="internal">
                  {note.frontmatter?.title ?? UNTITLED}
                </a>
                {date && (
                  <time class="latest-note-date" datetime={date.toISOString()}>
                    {formatDate(date, locale)}
                  </time>
                )}
              </li>
            )
          })}
        </ul>
      </>
    )
  }

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
`

  return Component as QuartzComponent
}