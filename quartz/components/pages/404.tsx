import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

const NotFound: QuartzComponent = ({ cfg, ctx, displayClass }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = ctx.argv.serve ? "/" : url.pathname

  return (
    <article class={classNames(displayClass, "popover-hint", "nf-page")}>
      <div class="nf-badge" aria-hidden="true">
        <span class="nf-code">۴۰۴</span>
      </div>
      <h1 class="nf-title">این برگه پیدا نشد</h1>
      <p class="nf-path-line">
        <span class="nf-path-label">مسیر:</span>
        <code class="nf-path" dir="ltr" id="nf-path"></code>
      </p>
      <p class="nf-desc">{i18n(cfg.locale).pages.error.notFound}</p>
      <p class="nf-hint">شاید لینک جابه‌جا شده یا حرفی جا افتاده — از یکی از راه‌های زیر ادامه بده:</p>
      <div class="nf-actions">
        <a class="nf-btn nf-btn-solid" href={baseDir}>{i18n(cfg.locale).pages.error.home}</a>
        <a class="nf-btn nf-btn-ghost" href="https://blog.mmehdi.ir/tags/">برچسب‌ها</a>
        <a class="nf-btn nf-btn-ghost" href="https://mmehdi.ir/">mmehdi.ir ↗</a>
      </div>
      <p class="nf-suggest" id="nf-suggest" hidden>
        <span>شاید منظورت این بود:</span> <a id="nf-suggest-link" href="#"></a>
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            var pathEl = document.getElementById("nf-path");
            if (pathEl) {
              var p = window.location.pathname;
              pathEl.textContent = p.length > 60 ? p.slice(0, 57) + "…" : p;
              pathEl.title = p;
            }
          })();
          if (typeof fetchData !== "undefined") {
            fetchData.then(function(index) {
              var basePath = document.body.dataset.basepath || "";
              if (basePath.length > 1 && basePath.endsWith("/")) {
                basePath = basePath.slice(0, -1);
              }
              var pathname = window.location.pathname;
              var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
              if (hasBasePrefix) {
                pathname = pathname.slice(basePath.length);
              }
              if (pathname.startsWith("/")) {
                pathname = pathname.slice(1);
              }
              if (pathname.endsWith("/")) {
                pathname = pathname.slice(0, -1);
              }
              if (pathname.endsWith(".html")) {
                pathname = pathname.slice(0, -5);
              }
              if (pathname.endsWith("/index")) {
                pathname = pathname.slice(0, -6);
              }
              var lowered = pathname.toLowerCase();
              if (lowered !== pathname && index[lowered] != null) {
                var prefix = hasBasePrefix ? basePath : "";
                var target = prefix + (prefix.endsWith("/") ? "" : "/") + lowered;
                window.location.replace(target);
              }
              // Near-match suggestion: pick the closest slug by Levenshtein distance.
              try {
                var last = decodeURIComponent(pathname).split("/").pop() || "";
                if (last.length > 2) {
                  var dist = function(a, b) {
                    var m = a.length, n = b.length, d = [], i, j;
                    for (i = 0; i <= m; i++) d[i] = [i];
                    for (j = 0; j <= n; j++) d[0][j] = j;
                    for (i = 1; i <= m; i++)
                      for (j = 1; j <= n; j++)
                        d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1,
                                           d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
                    return d[m][n];
                  };
                  var best = null, bestD = Infinity;
                  Object.keys(index).forEach(function(slug) {
                    var tail = slug.split("/").pop() || slug;
                    [slug, tail].forEach(function(cand) {
                      if (cand === "index" || cand === "404") return;
                      var dd = dist(last.toLowerCase(), cand.toLowerCase());
                      if (dd < bestD) { bestD = dd; best = slug; }
                    });
                  });
                  var threshold = Math.max(2, Math.floor(last.length * 0.4));
                  var box = document.getElementById("nf-suggest");
                  var link = document.getElementById("nf-suggest-link");
                  if (best && box && link && bestD <= threshold) {
                    var base = hasBasePrefix ? basePath : "";
                    link.href = base + "/" + best;
                    var entry = index[best];
                    link.textContent = (entry && entry.title) ? entry.title : best;
                    box.hidden = false;
                  }
                }
              } catch (e) {}
            });
          }
          `,
        }}
      />
    </article>
  )
}

NotFound.css = `
.nf-page {
  text-align: center;
  padding-top: 6vh;
  padding-bottom: 4vh;
}

.nf-badge {
  margin: 0 auto;
}

.nf-code {
  display: inline-block;
  font-family: var(--headerFont);
  font-weight: 800;
  font-size: clamp(4rem, 16vw, 5.8rem);
  line-height: 1.05;
  color: #06160c;
  background:
    radial-gradient(120% 140% at 30% 0%, rgba(255,255,255,.28), transparent 50%),
    linear-gradient(125deg, var(--tertiary), var(--secondary));
  color: var(--light);
  padding: 0.06em 0.3em 0.12em;
  border-radius: 22px;
  transform: rotate(-2deg);
  box-shadow:
    0 14px 30px -14px color-mix(in srgb, var(--secondary) 55%, transparent),
    0 0 0 1px var(--lightgray);
}

.nf-title {
  margin-top: 1.2rem;
  font-size: 1.6rem;
}

.nf-path-line {
  margin-top: 0.6rem;
  font-size: 0.85rem;
  color: var(--gray);
}

.nf-path-label { opacity: 0.8; margin-inline-end: 0.4em; }

.nf-path {
  direction: ltr;
  unicode-bidi: embed;
  font-family: var(--codeFont);
  font-size: 0.85em;
  color: var(--secondary);
  background: var(--highlight);
  border: 1px dashed color-mix(in srgb, var(--secondary) 45%, transparent);
  border-radius: 8px;
  padding: 0.15em 0.7em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 24em;
  display: inline-block;
  vertical-align: middle;
}

.nf-desc {
  margin-top: 1.1rem;
  color: var(--darkgray);
  line-height: 2;
}

.nf-hint {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: var(--gray);
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.4rem;
}

.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.6em 1.5em;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
}

.nf-btn-solid {
  background: var(--secondary);
  color: var(--light);
}

.nf-btn-solid:hover { background: var(--tertiary); transform: translateY(-2px); }

.nf-btn-ghost {
  border: 1px solid var(--lightgray);
  color: var(--dark);
}

.nf-btn-ghost:hover {
  border-color: var(--secondary);
  color: var(--secondary);
  transform: translateY(-2px);
}

.nf-suggest {
  margin: 1.4rem auto 0;
  max-width: 30rem;
  font-size: 0.92rem;
  color: var(--darkgray);
  background: var(--highlight);
  border: 1px solid color-mix(in srgb, var(--secondary) 35%, transparent);
  border-radius: 12px;
  padding: 0.6em 1.1em;
}

.nf-suggest[hidden] { display: none; }

.nf-suggest a {
  color: var(--secondary);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
`

export default (() => NotFound) satisfies QuartzComponentConstructor
