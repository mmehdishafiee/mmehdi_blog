import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"

/**
 * "Life in weeks" calendar for the weekly posts.
 *
 * The post's `week` frontmatter field is the number of completed weeks of life,
 * so week N is the interval [birth + (N-1)*7d, birth + N*7d - 1]. Every week
 * below N is painted as lived, the week right after N is the ongoing one, and
 * everything above it stays empty.
 *
 * The whole grid is rendered at build time, so the page ships with zero JS.
 */
interface Options {
  /** ISO date (YYYY-MM-DD) of the first day of life. */
  birthDate?: string
  /** Columns per row (weeks in a year). */
  weeksPerYear?: number
  /** Years drawn in the grid. */
  lifeYears?: number
}

const DEFAULT_BIRTH_DATE = "2000-11-08"
const DEFAULT_WEEKS_PER_YEAR = 52
const DEFAULT_LIFE_YEARS = 90
const DAY_MS = 24 * 60 * 60 * 1000

function addDays(iso: string, days: number): Date {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day) + days * DAY_MS)
}

function faNumber(value: number): string {
  try {
    return new Intl.NumberFormat("fa-IR").format(value)
  } catch {
    return String(value)
  }
}

function faDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date)
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

export const WeeksCalendar: QuartzComponentConstructor<Options | undefined> = (opts) => {
  const birthDate = opts?.birthDate ?? DEFAULT_BIRTH_DATE
  const weeksPerYear = opts?.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR
  const lifeYears = opts?.lifeYears ?? DEFAULT_LIFE_YEARS

  const Component: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const slug = fileData.slug ?? ""

    // Only the weekly posts themselves, never the folder listing.
    if (!slug.startsWith("weeks/") || slug === "weeks/index") {
      return null
    }

    const rawWeek = fileData.frontmatter?.week as unknown
    const week = typeof rawWeek === "number" ? rawWeek : Number(rawWeek)
    if (!Number.isFinite(week) || week < 1) {
      return null
    }

    const totalWeeks = weeksPerYear * lifeYears
    const lived = Math.min(Math.floor(week), totalWeeks)
    const percent = Math.round((lived / totalWeeks) * 100)
    const remaining = totalWeeks - lived

    const start = addDays(birthDate, (lived - 1) * 7)
    const end = addDays(birthDate, lived * 7 - 1)

    const cells = []
    for (let i = 0; i < totalWeeks; i++) {
      // `lived` weeks are already behind us; the next box is this week.
      const cls = i < lived ? "wc-lived" : i === lived ? "wc-current" : "wc-empty"
      cells.push(<i class={cls} />)
    }

    return (
      <section class="wc">
        <div class="wc-head">
          <div class="wc-stat">
            <strong>{faNumber(lived)}</strong>
            <span>
              از {faNumber(totalWeeks)} هفته ({faNumber(percent)}٪)
            </span>
          </div>
          <div class="wc-range">
            هفته {faNumber(lived)}: {faDate(start)} تا {faDate(end)}
          </div>
        </div>

        <div
          class="wc-grid"
          role="img"
          aria-label={`${faNumber(lived)} هفته از ${faNumber(totalWeeks)} هفته سپری شده`}
        >
          {cells}
        </div>

        <div class="wc-legend">
          <span>
            <i class="wc-lived" />
            گذشته
          </span>
          <span>
            <i class="wc-current" />
            جاری
          </span>
          <span>
            <i class="wc-empty" />
            آینده ({faNumber(remaining)})
          </span>
        </div>
      </section>
    )
  }

  Component.css = `
.wc {
  margin: 2rem 0 2.5rem;
  padding: 1.25rem 1.25rem 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 12px;
  background: var(--light);
}

.wc-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.wc-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.wc-stat strong {
  font-size: 1.6rem;
  line-height: 1;
  color: var(--secondary);
}

.wc-stat span,
.wc-range {
  font-size: 0.9rem;
  color: var(--gray);
}

.wc-grid {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  gap: 2px;
  direction: rtl;
}

.wc-grid i {
  display: block;
  aspect-ratio: 1 / 1;
  border-radius: 2px;
}

.wc-grid i.wc-lived,
.wc-legend i.wc-lived {
  background-color: var(--secondary);
}

.wc-grid i.wc-current,
.wc-legend i.wc-current {
  background-color: var(--tertiary);
  outline: 2px solid var(--dark);
  outline-offset: 1px;
}

.wc-grid i.wc-empty,
.wc-legend i.wc-empty {
  background-color: var(--lightgray);
}

.wc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.25rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--gray);
}

.wc-legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.wc-legend i {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 2px;
}

@media all and (max-width: 800px) {
  .wc {
    padding: 0.9rem 0.75rem 0.75rem;
  }

  .wc-grid {
    gap: 1px;
  }

  .wc-grid i {
    border-radius: 1px;
  }
}
`

  return Component as QuartzComponent
}