// components.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var DEFAULT_BIRTH_DATE = "2000-11-08";
var DEFAULT_WEEKS_PER_YEAR = 52;
var DEFAULT_LIFE_YEARS = 90;
var DAY_MS = 24 * 60 * 60 * 1e3;
function addDays(iso, days) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day) + days * DAY_MS);
}
function faNumber(value) {
  try {
    return new Intl.NumberFormat("fa-IR").format(value);
  } catch {
    return String(value);
  }
}
function faDate(date) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
var WeeksCalendar = (opts) => {
  const birthDate = opts?.birthDate ?? DEFAULT_BIRTH_DATE;
  const weeksPerYear = opts?.weeksPerYear ?? DEFAULT_WEEKS_PER_YEAR;
  const lifeYears = opts?.lifeYears ?? DEFAULT_LIFE_YEARS;
  const Component = ({ fileData }) => {
    const slug = fileData.slug ?? "";
    if (!slug.startsWith("weeks/") || slug === "weeks/index") {
      return null;
    }
    const rawWeek = fileData.frontmatter?.week;
    const week = typeof rawWeek === "number" ? rawWeek : Number(rawWeek);
    if (!Number.isFinite(week) || week < 1) {
      return null;
    }
    const totalWeeks = weeksPerYear * lifeYears;
    const lived = Math.min(Math.floor(week), totalWeeks);
    const percent = Math.round(lived / totalWeeks * 100);
    const remaining = totalWeeks - lived;
    const start = addDays(birthDate, (lived - 1) * 7);
    const end = addDays(birthDate, lived * 7 - 1);
    const cells = [];
    for (let i = 0; i < totalWeeks; i++) {
      const cls = i < lived ? "wc-lived" : i === lived ? "wc-current" : "wc-empty";
      cells.push(/* @__PURE__ */ jsx("i", { class: cls }));
    }
    return /* @__PURE__ */ jsxs("section", { class: "wc", children: [
      /* @__PURE__ */ jsxs("div", { class: "wc-head", children: [
        /* @__PURE__ */ jsxs("div", { class: "wc-stat", children: [
          /* @__PURE__ */ jsx("strong", { children: faNumber(lived) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "\u0627\u0632 ",
            faNumber(totalWeeks),
            " \u0647\u0641\u062A\u0647 (",
            faNumber(percent),
            "\u066A)"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { class: "wc-range", children: [
          "\u0647\u0641\u062A\u0647 ",
          faNumber(lived),
          ": ",
          faDate(start),
          " \u062A\u0627 ",
          faDate(end)
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          class: "wc-grid",
          role: "img",
          "aria-label": `${faNumber(lived)} \u0647\u0641\u062A\u0647 \u0627\u0632 ${faNumber(totalWeeks)} \u0647\u0641\u062A\u0647 \u0633\u067E\u0631\u06CC \u0634\u062F\u0647`,
          children: cells
        }
      ),
      /* @__PURE__ */ jsxs("div", { class: "wc-legend", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("i", { class: "wc-lived" }),
          "\u06AF\u0630\u0634\u062A\u0647"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("i", { class: "wc-current" }),
          "\u062C\u0627\u0631\u06CC"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("i", { class: "wc-empty" }),
          "\u0622\u06CC\u0646\u062F\u0647 (",
          faNumber(remaining),
          ")"
        ] })
      ] })
    ] });
  };
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
`;
  return Component;
};
export {
  WeeksCalendar
};
