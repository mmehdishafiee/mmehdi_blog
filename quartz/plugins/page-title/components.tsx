import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"
import { pathToRoot, joinSegments, type FullSlug } from "@quartz-community/utils"

/**
 * Sidebar header: site logo icon above the site title, both linking home.
 * Replaces @quartz-community/page-title so the logo can sit in the title block.
 */
export const PageTitle: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
    const title = cfg?.pageTitle ?? "میم"
    const slug = (fileData.slug === "404" ? "index" : fileData.slug!) as FullSlug
    const baseDir = pathToRoot(slug)
    const homeHref = baseDir === "." ? "/" : baseDir

    return (
      <div class="page-title-container">
        <h1 class={[displayClass, "page-title"].filter(Boolean).join(" ")}>
          <div class="title-logo">
            <a href={homeHref}>
              <img id="icon-header" src={joinSegments(baseDir, "static/icon-header.png")} alt="" />
            </a>
            <a href={homeHref} class={displayClass} id="header-text">
              {title}
            </a>
          </div>
        </h1>
      </div>
    )
  }

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
`

  return Component as QuartzComponent
}
