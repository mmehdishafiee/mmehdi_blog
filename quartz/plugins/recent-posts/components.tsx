import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"
import type { QuartzPluginData } from "../../plugins/vfile"

type ValidDateType = "created" | "modified" | "published"

function getDate(data: QuartzPluginData): Date | undefined {
  const defaultDateType = data.defaultDateType as ValidDateType | undefined
  if (!defaultDateType) return undefined
  const dates = data.dates
  return dates?.[defaultDateType]
}

function byDateAndAlphabetical() {
  return (f1: QuartzPluginData, f2: QuartzPluginData) => {
    const f1Date = getDate(f1)
    const f2Date = getDate(f2)
    if (f1Date && f2Date) {
      return f2Date.getTime() - f1Date.getTime()
    } else if (f1Date && !f2Date) {
      return -1
    } else if (!f1Date && f2Date) {
      return 1
    }
    const f1Title = (f1.frontmatter?.title ?? "").toLowerCase()
    const f2Title = (f2.frontmatter?.title ?? "").toLowerCase()
    return f1Title.localeCompare(f2Title)
  }
}

function formatDate(d: Date, locale = "en-US") {
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" })
}

const POST_FOLDERS = ["notes/", "satrcin/", "translations/", "lists/", "offers/"]

interface Options {
  title?: string
  limit?: number
  showTags?: boolean
  folders?: string[]
}

export const RecentPosts: QuartzComponentConstructor<Partial<Options> | undefined> = (
  userOpts,
) => {
  const opts = {
    limit: 5,
    showTags: true,
    folders: POST_FOLDERS,
    ...userOpts,
  }

  const Component = ({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) => {
    const slug = fileData.slug ?? ""
    const rootPath =
      slug
        .split("/")
        .filter((x) => x !== "")
        .slice(0, -1)
        .map(() => "..")
        .join("/") || "."
    const resolveRelative = (target: string) =>
      `${rootPath}/${target.replace(/^\/+|\/+$/g, "")}`.replace(/\/+/g, "/")

    const pages = (allFiles ?? [])
      .filter((p) => p.unlisted !== true)
      .filter((p) => {
        const pageSlug = p.slug ?? ""
        if (pageSlug === "404") return false
        if (pageSlug === "tags" || pageSlug.startsWith("tags/")) return false
        if (pageSlug.endsWith("/index") || pageSlug === "index") return false
        if (!opts.folders?.length) return true
        return opts.folders.some((folder) => pageSlug.startsWith(folder))
      })
      .filter((p) => Boolean(getDate(p)))
      .sort(byDateAndAlphabetical())

    const locale = cfg.locale ?? "en-US"

    return (
      <div class={`recent-posts ${displayClass ?? ""}`}>
        <h3>{opts.title ?? "Recent Notes"}</h3>
        <ul class="recent-ul">
          {pages.slice(0, opts.limit).map((page) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const tags = page.frontmatter?.tags ?? []
            const date = getDate(page)
            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a href={resolveRelative(page.slug ?? "")} class="internal">
                        {title}
                      </a>
                    </h3>
                  </div>
                  {date && (
                    <p class="meta">
                      <time datetime={date.toISOString()}>{formatDate(date, locale)}</time>
                    </p>
                  )}
                  {opts.showTags && (
                    <ul class="tags">
                      {tags.map((tag) => (
                        <li>
                          <a class="internal tag-link" href={resolveRelative(`tags/${tag}`)}>
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

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
  `

  return Component as QuartzComponent
}
