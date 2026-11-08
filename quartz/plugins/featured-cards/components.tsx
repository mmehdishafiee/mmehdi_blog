import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"
import { resolveRelative } from "@quartz-community/utils"

/**
 * Bento-style cards for the site homepage.
 *
 * A note becomes a card by setting `featured: true` in its frontmatter.
 * `order` controls the position, `image` gives the card its background and
 * `description` becomes the caption. Without `image` the card falls back to the
 * neutral gradient in the `.no-image` rule below.
 */

interface Options {
  /** Heading of the section. Defaults to "یادداشت‌های منتخب". */
  title?: string
  /** Maximum number of cards. */
  limit?: number
}

/** "یادداشت‌های منتخب" */
const DEFAULT_TITLE = "\u06cc\u0627\u062f\u062f\u0627\u0634\u062a\u200c\u0647\u0627\u06cc \u0645\u0646\u062a\u062e\u0628"

export const FeaturedCards: QuartzComponentConstructor<Options | undefined> = (opts) => {
  const title = opts?.title ?? DEFAULT_TITLE
  const limit = opts?.limit ?? 4

  const Component: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") {
      return null
    }

    const featured = allFiles
      .filter((file) => file.frontmatter?.featured)
      .sort((a, b) => {
        const orderA = (a.frontmatter?.order as number | undefined) ?? Infinity
        const orderB = (b.frontmatter?.order as number | undefined) ?? Infinity

        if (orderA !== orderB) {
          return orderA - orderB
        }

        const dateA = new Date((a.frontmatter?.date as string | number | Date) ?? 0).getTime()
        const dateB = new Date((b.frontmatter?.date as string | number | Date) ?? 0).getTime()
        return dateB - dateA
      })
      .slice(0, limit)

    if (featured.length === 0) {
      return null
    }

    return (
      <>
        <h2 class="featured-cards-title">{title}</h2>
        <div class="card-grid-container">
          <div class="card-grid">
            {featured.map((page) => {
              const title = page.frontmatter?.title as string | undefined
              const description = page.frontmatter?.description as string | undefined
              const image = page.frontmatter?.image as string | undefined
              const style = image ? { "--card-bg": `url(${image})` } : {}

              return (
                <a
                  href={resolveRelative(fileData.slug!, page.slug!)}
                  class={`card-container ${image ? "has-image" : "no-image"}`}
                  style={style}
                >
                  <div class="card-bg"></div>
                  <div class="card-content">
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  Component.css = `
.featured-cards-title {
  margin-bottom: 1rem;
  font-size: clamp(1.55rem, 1.25rem + 1vw, 1.85rem);
  text-align: start;
}

.card-grid-container {
  container: featured-cards / inline-size;
  margin: 1rem 0 2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

.card-container {
  display: block;
  position: relative;
  min-height: 15rem;
  padding: 1.5rem;
  overflow: hidden;
  border: none;
  border-radius: var(--radius-card, 18px);
  background: rgba(255, 255, 255, 0.1);
  text-align: start;
  text-decoration: none;
  z-index: 0;
}

.card-container::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.18) 0%,
    rgba(0, 0, 0, 0.38) 48%,
    rgba(0, 0, 0, 0.78) 100%
  );
  pointer-events: none;
}

.card-container:focus-visible {
  outline: 3px solid var(--secondary);
  outline-offset: 4px;
  box-shadow:
    0 0 0 6px var(--light),
    0 0 0 9px var(--secondary);
  z-index: 2;
}

.card-bg {
  position: absolute;
  inset: 0;
  background-image: var(--card-bg);
  background-position: center;
  background-size: cover;
}

.card-container.no-image .card-bg {
  background: linear-gradient(135deg, #655f6c, #45434c 55%, #30343a);
}

.card-content {
  display: flex;
  position: relative;
  z-index: 2;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  text-align: start;
}

.card-content h3 {
  margin: 0 0 0.5rem;
  color: #ffffff !important;
  font-size: clamp(1.85rem, 1.5rem + 1cqi, 2.4rem);
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.45);
}

.card-content p {
  margin: 0;
  color: #f3f4f6 !important;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

@container featured-cards (max-width: 35.99rem) {
  .card-grid {
    gap: 0.75rem;
  }

  .card-container:not(:first-child) {
    min-height: 9rem;
    padding: 1rem 1.25rem;
  }

  .card-container:not(:first-child) .card-content h3 {
    font-size: 1.5rem;
  }

  .card-container:not(:first-child) .card-content p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    font-size: 0.9rem;
  }
}

@container featured-cards (min-width: 36rem) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .card-container:nth-child(1),
  .card-container:nth-child(4) {
    grid-column: span 2;
  }

  .card-container:nth-child(1) {
    min-height: 20rem;
  }
}

@container featured-cards (min-width: 60rem) {
  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }

  .card-container:nth-child(1) {
    grid-column: span 2;
    grid-row: span 2;
    min-height: 24rem;
  }

  .card-container:nth-child(4) {
    grid-column: span 3;
  }
}

.card-container.has-image .card-bg {
  filter: grayscale(70%);
  transform: scale(1);
  transition: filter 400ms ease-in-out, transform 400ms ease-in-out;
}

.card-container.has-image:is(:hover, :focus-visible) .card-bg {
  filter: grayscale(0%);
  transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .card-container.has-image .card-bg {
    transition: none;
  }

  .card-container.has-image:is(:hover, :focus-visible) .card-bg {
    transform: none;
  }
}

[saved-theme="dark"] .card-container {
  background: rgba(30, 30, 30, 0.8);
}
`

  return Component as QuartzComponent
}
