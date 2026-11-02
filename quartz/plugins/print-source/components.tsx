import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"
import { simplifySlug } from "@quartz-community/utils"

/**
 * Canonical URL line printed at the bottom of the page. Hidden on screen and
 * only revealed by quartz/styles/print.scss.
 */
export const PrintSource: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
    if (!cfg.baseUrl || !fileData.slug) return null

    const base = cfg.baseUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "")
    const slug = fileData.slug === "index" ? "" : simplifySlug(fileData.slug)
    const url = `https://${base}/${slug}`

    return (
      <div class="print-source" dir="rtl">
        <span>منبع: {cfg.pageTitle}</span>
        <a href={url} dir="ltr">
          {url}
        </a>
      </div>
    )
  }

  Component.css = `.print-source { display: none; }`

  return Component as QuartzComponent
}
