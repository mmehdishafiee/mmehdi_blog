# میم — وبلاگ شخصیِ فارسی روی Quartz 5

قالب و ریپوی آمادهٔ یک **وبلاگ فارسی، راست‌چین و اُبسیدیان‌محور** بر پایهٔ [Quartz 5](https://quartz.jzhao.xyz/)، منتشرشده روی Cloudflare Pages.

> 🌐 نمونهٔ زنده: **[blog.mmehdi.ir](https://blog.mmehdi.ir)**
>
> این ریپو یک fork است: از [`eledah/quartz`](https://github.com/eledah/quartz) (که خودش fork [`jackyzha0/quartz`](https://github.com/jackyzha0/quartz) است) منشعب شده و رویش انواع پست، پلاگین‌های محلی، برند و استایل RTL اضافه شده است.

<p align="center">
  <a href="#english">English</a> &nbsp;·&nbsp; <a href="#fa">فارسی</a> &nbsp;·&nbsp; <a href="#ar">العربية</a>
</p>

---

<a name="english"></a>

## English (short summary)

A **Persian (RTL) blog starter** built on **Quartz 5**, tailored for Obsidian notes and deployed on **Cloudflare Pages** (live demo: `blog.mmehdi.ir`).

It forks `eledah/quartz` — itself a fork of `jackyzha0/quartz` — and adds:

- **RTL-first UI** — Vazirmatn for body/UI, IBM Plex Mono for code, Ray-ExtraBold for titles; a custom `bidi-text` plugin picks the direction of every paragraph/heading (mixed Persian + English).
- **Post types as a content convention** (a content folder + a tag + an Obsidian template): notes, translations, book highlights («سطرچین»), recommendations, lists, standalone pages, and a "life in weeks" post type with a 52×90 grid.
- **Custom Quartz plugins** (`quartz/plugins/`, `plugins/`): featured cards, featured image, latest-notes, weeks-calendar, Ziscus comments (Cloudflare Worker backend), footer links, legacy Persian-URL redirects, and a page-title lockup.
- **Brand palette** — purple `#5b2f84` / magenta `#b43eb6`; the third-party `@quartz-themes/core` is turned off so these colors actually apply.
- **Checks in CI** — `tsc --noEmit`, 163 tests, `npx quartz build`, and a frontmatter-image guard that runs before every build.

**Requirements:** Node 22+ and npm 10.9.2+.

```bash
git clone https://github.com/mmehdishafiee/mmehdi_blog.git
cd mmehdi_blog
npm install
npx quartz build --serve     # http://localhost:8080
```

Full documentation in **Persian** and **Arabic** below.

---

<a name="fa"></a>

## فارسی

### این ریپو چیست؟

یک وبلاگ شخصیِ **فارسی و راست‌چین** که با [Quartz 5](https://quartz.jzhao.xyz/) ساخته شده و از **اُبسیدیان** تغذیه می‌کند. کل محتوا در پوشهٔ `content/` به‌صورت Markdown (با فرانتمتر YAML) نوشته می‌شود و کوارتز آن را به یک سایت استاتیک تبدیل می‌کند.

از قالب پایهٔ [`eledah/quartz`](https://github.com/eledah/quartz) (forkِ [`jackyzha0/quartz`](https://github.com/jackyzha0/quartz)) شروع شده و این چیزها به آن اضافه شده است:

- انواع پست (یادداشت، ترجمه، سطرچین، پیشنهاد، لیست، برگه، هفته‌ها)
- پلاگین‌های محلی برای کارت‌های منتخب، تقویم «زندگی در هفته‌ها»، نظرات Ziscus، فوتر، و ریدایرکت URLهای قدیمیِ فارسی
- پالت برند بنفش/سرخابی، فونت وزیرمتن و کد IBM Plex Mono

**نمونهٔ زنده:** [blog.mmehdi.ir](https://blog.mmehdi.ir)

### پیش‌نیازها

| ابزار   | نسخه                                        |
| ------- | ------------------------------------------- |
| Node.js | 22 یا بالاتر (`.node-version` = `v22.16.0`) |
| npm     | 10.9.2 یا بالاتر (در `engines` پکیج)        |
| Git     | هر نسخهٔ جدید                               |

> ⚠️ فایل `.npmrc` دو تنظیم دارد: `engine-strict=true` (اگر نسخهٔ Node کمتر از 22 باشد نصب رد می‌شود) و `legacy-peer-deps=true`.

### راه‌اندازی سریع

```bash
git clone https://github.com/mmehdishafiee/mmehdi_blog.git
cd mmehdi_blog
npm install
npx quartz build --serve
```

سایت روی `http://localhost:8080` بالا می‌آید. برای ساخت فقط (بدون سرور):

```bash
npx quartz build          # خروجی در پوشهٔ public/
```

### دستورهای npm

| دستور                       | کار                                  |
| --------------------------- | ------------------------------------ |
| `npx quartz build`          | ساخت سایت در `public/`               |
| `npx quartz build --serve`  | ساخت + سرور محلی با live-reload      |
| `npx quartz plugin install` | نصب/همگام‌سازی پلاگین‌های config     |
| `npm run typecheck`         | بررسی تایپ‌ها (`tsc --noEmit`)       |
| `npm test`                  | اجرای تست‌ها (`tsx --test`)          |
| `npm run check`             | `typecheck` + بررسی قالب با Prettier |
| `npm run check:images`      | بررسی تصاویر فرانتمتر (قبل از build) |
| `npm run format`            | فرمت‌دهی با Prettier                 |
| `npm run docs`              | ساخت و نمایش مستندات خود کوارتز      |

`prebuild` به‌صورت خودکار `check:images` و `install-plugins` را قبل از هر build اجرا می‌کند.

### ساختار پروژه

```
mmehdi_blog/
├── content/                      # همهٔ یادداشت‌های Markdown
│   ├── یادداشتها/                # گاه‌نوشت
│   ├── ترجمهها/                  # ترجمهٔ مقاله‌ها
│   ├── سطرچین/                   # برجسته‌نوشتهٔ کتاب
│   ├── پیشنهادها/                # books/  films/  musics/
│   ├── لیستها/                   # فهرست‌ها
│   ├── هفتهها/                   # «زندگی در هفته‌ها»
│   ├── برگهها/                   # برگه‌های ثابت (درباره من و ...)
│   ├── Templates/                # تمپلیت‌های Obsidian (tpl-*.md)
│   ├── attachments/              # تصاویر
│   └── index.md                  # صفحهٔ خانه
├── plugins/bidi-text/            # پلاگین محلی دوجهته (RTL/LTR هر بلوک)
├── quartz/plugins/               # پلاگین‌های محلی دیگر
│   ├── featured-cards/           # کارت‌های «یادداشت‌های منتخب»
│   ├── featured-image/           # تصویر هیرو بالای پست
│   ├── latest-notes/             # آخرین یادداشت‌ها (صفحهٔ خانه)
│   ├── weeks-calendar/           # گرید ۵۲×۹۰ زندگی در هفته‌ها
│   ├── ziscus-comments/          # فراخوانی کامنت‌ها از ورکر
│   ├── ziscus-ui/                # رابط کاربری نظرات
│   ├── footer/                   # فوتر سفارشی
│   ├── legacy-redirects/         # ریدایرکت URLهای قدیمیِ فارسی
│   └── page-title/               # لوگو/عنوان ستون کنار
├── quartz/styles/custom.scss     # استایل RTL، فونت و برند
├── theme/palettes.ts             # پالت‌های رنگ آماده
├── scripts/                      # ابزارهای کمک‌کننده (تصاویر، UI، لوگو)
├── quartz.config.yaml            # تنظیمات سایت و پلاگین‌ها
├── quartz.ts                     # بارگذاری config و layout
└── .github/workflows/            # CI/CD
```

### تنظیمات سایت — `quartz.config.yaml`

مهم‌ترین کلیدها:

```yaml
configuration:
  pageTitle: "میم" # نام سایت
  pageTitleSuffix: " – وبلاگ شخصی محمد مهدی شفیعی" # پسوند <title>
  baseUrl: blog.mmehdi.ir # دامنه (بدون https)
  locale: fa-IR # زبان تاریخ/منو
  enableSPA: true
  enablePopovers: true
  analytics: null # غیرفعال
  ignorePatterns: [private, Templates, .obsidian]
  theme:
    fontOrigin: local
    typography:
      header: Ray-ExtraBold
      body: Vazirmatn
      code: IBM Plex Mono
    colors:
      lightMode: { secondary: "#5b2f84", tertiary: "#b43eb6" }
      darkMode: { secondary: "#c46aa9", tertiary: "#e08fd0" }
```

برای راه‌انداختن قالب خودت، حداقل `pageTitle`، `pageTitleSuffix` و `baseUrl` را عوض کن.

### انواع پست (Post Types)

در این قالب، «نوع پست» یک چیز کدنویسی‌شده نیست؛ ترکیبی است از **پوشه + تگ + تمپلیت**. هر پوشه زیر `content/` خودش یک صفحهٔ فهرست می‌گیرد و هر تگ یک صفحهٔ تگ. تشخیص این‌که هر فایل چه نوع صفحه‌ای شود در موتور کوارتز (`pageTypes` با matcherهای `ext` / `slugPrefix` / `frontmatter` / `and` / `or` / `not`) انجام می‌شود.

| نوع                   | پوشه                 | تگ          | فیلدهای ویژهٔ فرانتمتر                          |
| --------------------- | -------------------- | ----------- | ----------------------------------------------- |
| یادداشت (گاه‌نوشت)    | `content/یادداشتها/` | `گاه‌نوشت`  | —                                               |
| ترجمه                 | `content/ترجمهها/`   | `ترجمه`     | `source_title`, `source_author`, `source_url`   |
| سطرچین (برجسته‌نوشته) | `content/سطرچین/`    | `سطرچین`    | `book_title`, `book_author`, `rating`           |
| پیشنهاد               | `content/پیشنهادها/` | `پیشنهاد`   | `item_title`, `item_creator`, `recommend_level` |
| لیست                  | `content/لیستها/`    | `لیست`      | —                                               |
| هفته                  | `content/هفتهها/`    | `هفته`      | `week` (شمارهٔ هفته)                            |
| برگه                  | `content/برگهها/`    | — (بدون تگ) | —                                               |

**افزودن یک پست جدید:** از تمپلیت متناظر در `content/Templates/` شروع کن (نه از کپی یک پست دیگر — به «دام تصویر» پایین نگاه کن).

### تمپلیت‌های اُبسیدیان

در `content/Templates/`:

| فایل                 | برای                        |
| -------------------- | --------------------------- |
| `tpl-note.md`        | یادداشت گاه‌نوشت            |
| `tpl-translation.md` | ترجمه                       |
| `tpl-satrcin.md`     | سطرچین                      |
| `tpl-offer.md`       | پیشنهاد                     |
| `tpl-list.md`        | لیست                        |
| `tpl-week.md`        | هفته                        |
| `tpl-page.md`        | برگهٔ ثابت                  |
| `tpl-featured.md`    | راهنمای «یادداشت‌های منتخب» |

### فرانتمتر

هر یادداشت با یک بلاک YAML بین `---` شروع می‌شود:

```yaml
---
title: عنوان مطلب
date: 2026-11-20
tags:
  - گاه‌نوشت
draft: false # true = منتشر نشود
featured: false # true = بیاید در کارت‌های صفحهٔ خانه
order: # جای کارت منتخب (کوچک‌تر = جلوتر)
description: # جملهٔ زیر عنوانِ کارت
image: "" # تصویر هیرو — مسیر محلی داخل content/
socialImage: # (اختیاری) og:image — باید URL مطلق باشد
---
```

نکات:

- **`draft: true`** یعنی منتشر نشود (فیلتر `remove-draft`).
- **`featured: true`** یادداشت را وارد بخش «یادداشت‌های منتخب» در صفحهٔ خانه می‌کند؛ `order` جایش را تعیین می‌کند.
- **`image`** هم تصویر هیرو بالای پست را می‌سازد و هم (اگر کارت منتخب باشد) پس‌زمینهٔ کارت.
- **`socialImage`** باید URL **مطلق** باشد؛ وگرنه خروجی خراب (`/static//...` = 404) می‌شود.
- در اُبسیدیان همهٔ این کلیدها از پنل **Properties** قابل ویرایش‌اند — به همین دلیل به‌صورت پیش‌فرض و خالی در همهٔ یادداشت‌ها حاضرند.

### پلاگین‌های محلی

| پلاگین             | مسیر                               | کار                                                                           |
| ------------------ | ---------------------------------- | ----------------------------------------------------------------------------- |
| `bidi-text`        | `plugins/bidi-text/`               | جهت هر پاراگراف/سرتیتر را از روی اولین حرف معنادار (فارسی/لاتین) تعیین می‌کند |
| `featured-cards`   | `quartz/plugins/featured-cards/`   | کارت‌های «یادداشت‌های منتخب» در صفحهٔ خانه                                    |
| `featured-image`   | `quartz/plugins/featured-image/`   | تصویر هیرو بالای پست                                                          |
| `latest-notes`     | `quartz/plugins/latest-notes/`     | فهرست «آخرین یادداشت‌ها» در صفحهٔ خانه                                        |
| `weeks-calendar`   | `quartz/plugins/weeks-calendar/`   | گرید ۵۲×۹۰ «زندگی در هفته‌ها»                                                 |
| `ziscus-comments`  | `quartz/plugins/ziscus-comments/`  | واکشی کامنت‌ها از ورکر Ziscus                                                 |
| `ziscus-ui`        | `quartz/plugins/ziscus-ui/`        | رابط کاربری نظرات                                                             |
| `footer`           | `quartz/plugins/footer/`           | فوتر با لینک‌های تلگرام/گیت‌هاب                                               |
| `legacy-redirects` | `quartz/plugins/legacy-redirects/` | ریدایرکت ۳۰۱ از URLهای قدیمیِ فارسی به جدید                                   |
| `page-title`       | `quartz/plugins/page-title/`       | لوگو و عنوان در ستون کناری                                                    |

> پلاگین‌های محلی یک فایل `dist/` دارند. اگر سورس (`index.ts`/`components.tsx`) را عوض کردی، باید دوباره با esbuild بیلد کنی تا `dist/` به‌روز شود — جزئیات در بخش عیب‌یابی.

### تم، فونت و برند

- **رنگ‌های برند:** بنفش `#5b2f84` (secondary) و سرخابی `#b43eb6` (tertiary).
- **فونت متن/رابط:** وزیرمتن · **کد:** IBM Plex Mono · **عنوان‌ها:** Ray-ExtraBold (به‌صورت `@font-face` محلی از `/static/fonts/Ray-ExtraBold.ttf`).
- پلاگین `@quartz-themes/core` عمداً **غیرفعال** است؛ چون لایهٔ تم‌های آماده رنگ‌های `configuration.theme.colors` را بازنویسی می‌کند و برند را خراب می‌کند.
- `theme/palettes.ts` چند پالت آمادهٔ دیگر (royalPurple، persianAzure، ...) دارد؛ `currentPaletteName` را عوض کن.

### استایل راست‌چین — `quartz/styles/custom.scss`

این فایل ۱۵۰۰+ خط است و چیزهای زیر را اصلاح می‌کند:

- فاصله‌ها/padding راست‌چین برای breadcrumbs، فهرست مطالب، تگ‌ها و درایور
- تراز ستون‌های صفحهٔ فهرست پوشه‌ها (گرید ثابت `minmax(0,1fr) 7rem 8.5rem`)
- حذف «پانوشت»ها به سبک فارسی و `direction: ltr` برای بلوک کد
- شیت منوی موبایل که از سمت راست باز می‌شود و هنگام ناوبری SPA فلاش نمی‌زند
- پوستهٔ هدر چسبانِ موبایل و اَسکرول منوی دسکتاپ

### نظرات — Ziscus

نظرات از یک **Cloudflare Worker** جداگانه واکشی می‌شوند (نه giscus). تنظیمات در `quartz.config.yaml`:

```yaml
- source: ./quartz/plugins/ziscus-comments
  enabled: true
  options:
    endpoint: https://ziscus-comments.lumg.workers.dev
    timeoutMs: 15000
```

برای استفادهٔ خودت، `endpoint` را به ورکر خودت عوض کن (پلاگین `comments` پیش‌فرض گیسکوس غیرفعال است).

### اسکریپت‌ها — `scripts/`

| فایل                           | کار                                                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-frontmatter-images.mjs` | نگهبان دو فیلد تصویر: فایل محلیِ نبود، `socialImage` غیرمطلق، و تصویری که بین دو پست منتشرشده تکرار شده را fail می‌کند (`npm run check:images`) |
| `port-ui.mjs`                  | اسکریپت یک‌بارمصرف برای بازتولید manifest/dist پلاگین‌های رابطِ پورت‌شده                                                                        |
| `make-logo-assets.py`          | ساخت دارایی‌های لوگو                                                                                                                            |

### استقرار (Deploy)

سایت روی **Cloudflare Pages** منتشر می‌شود و با هر push به شاخهٔ **`v5`** دوباره ساخته می‌شود؛ دامنهٔ `blog.mmehdi.ir` با فایل `CNAME` به آن وصل است.

برای راه‌اندازی روی حساب خودت (Cloudflare Pages):

1. ریپو را به Cloudflare Pages وصل کن.
2. تنظیمات build: **Build command** = `npx quartz build`، **Output directory** = `public`، نسخهٔ Node = `22`.
3. شاخهٔ production = `v5`.

> ⚠️ فایل `.github/workflows/deploy.yml` برای **GitHub Pages** است و در این fork بی‌اثر است (چون GitHub Pages روی این ریپو فعال نیست). فایل‌های `deploy-v5.yaml`/`deploy-preview.yaml` هم مخصوص خودِ `jackyzha0/quartz` هستند و در fork رد می‌شوند. انتشار واقعی این سایت Cloudflare Pages است.

### همگام‌سازی با upstream

`.github/workflows/sync-upstream.yaml` هر شب upstream را fetch می‌کند، روی یک شاخهٔ sync تلاش merge می‌کند، و اگر تعارض داشت یک PR/issue باز می‌کند تا دستی حل شود.

### عیب‌یابی

| مشکل                              | راه‌حل                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install` در ایران گیر می‌کند | `npm install --registry https://registry.npmjs.org/`                                                                                                                          |
| پلاگین محلی اثر نمی‌کند           | سورس را عوض و با esbuild دوباره build کن: `npx esbuild index.ts --bundle --format=esm --platform=node --target=es2022 --external:@quartz-community/* --outfile=dist/index.js` |
| متن انگلیسی، RTL شده              | پلاگین `bidi-text` باید `enabled: true` باشد                                                                                                                                  |
| رنگ‌های برند اعمال نمی‌شود        | `@quartz-themes/core` را غیرفعال نگه دار                                                                                                                                      |
| `check:images` خطا می‌دهد         | `image` گم‌شده یا `socialImage` غیرمطلق یا تصویر تکرارشده را درست کن                                                                                                          |

**دام تصویر:** چون به همهٔ یادداشت‌ها `image: ""` اضافه شده، وقتی کاور را با Obsidian کپی می‌کنی مقدارِ پست قبلی می‌ماند. همیشه از تمپلیت شروع کن یا بعد از build `npm run check:images` بزن.

### اعتبار و مجوز

این پروژه روی شانهٔ این‌ها ایستاده:

- [Quartz](https://github.com/jackyzha0/quartz) — © jackyzha0، مجوز MIT
- [eledah/quartz](https://github.com/eledah/quartz) — قالب فارسی پایه

مجوز خود این ریپو هم **MIT** است (فایل `LICENSE.txt`).

- تلگرام: [@Mmehdi_ir](https://t.me/Mmehdi_ir)
- گیت‌هاب: [mmehdishafiee/mmehdi_blog](https://github.com/mmehdishafiee/mmehdi_blog)

---

<a name="ar"></a>

## العربية

### ما هذا المستودع؟

مدوّنة شخصية **بالفارسية ومن اليمين إلى اليسار** مبنية على [Quartz 5](https://quartz.jzhao.xyz/) وتتغذّى من **Obsidian**. كل المحتوى يُكتب بصيغة Markdown (مع ترويسة YAML) داخل مجلد `content/`، ويحوّله Quartz إلى موقع ثابت.

انطلقنا من القالب الأساس [`eledah/quartz`](https://github.com/eledah/quartz) (وهو بدوره fork من [`jackyzha0/quartz`](https://github.com/jackyzha0/quartz)) وأضفنا عليه:

- أنواع منشورات (ملاحظة، ترجمة، «سطرچین»، اقتراح، قائمة، صفحة، أسابيع)
- إضافات محلية لبطاقات «الملاحظات المختارة»، وتقويم «الحياة بالأسابيع»، وتعليقات Ziscus، والتذييل، وإعادة توجيه روابط URL الفارسية القديمة
- لوحة ألوان بنفسجية/أرجوانية، وخطّ Vazirmatn للنصّ و IBM Plex Mono للكود

**النسخة الحيّة:** [blog.mmehdi.ir](https://blog.mmehdi.ir)

### المتطلّبات

| الأداة  | الإصدار                                   |
| ------- | ----------------------------------------- |
| Node.js | 22 أو أحدث (`.node-version` = `v22.16.0`) |
| npm     | 10.9.2 أو أحدث                            |
| Git     | أي إصدار حديث                             |

> ⚠️ يحتوي `.npmrc` على `engine-strict=true` و `legacy-peer-deps=true`.

### البدء السريع

```bash
git clone https://github.com/mmehdishafiee/mmehdi_blog.git
cd mmehdi_blog
npm install
npx quartz build --serve      # http://localhost:8080
```

وللبناء فقط: `npx quartz build` (الناتج في مجلد `public/`).

### أوامر npm

| الأمر                       | الوظيفة                                 |
| --------------------------- | --------------------------------------- |
| `npx quartz build`          | بناء الموقع في `public/`                |
| `npx quartz build --serve`  | بناء + خادم محلي مع إعادة تحميل فورية   |
| `npx quartz plugin install` | تثبيت/مزامنة إضافات الإعداد             |
| `npm run typecheck`         | فحص الأنواع (`tsc --noEmit`)            |
| `npm test`                  | تشغيل الاختبارات (`tsx --test`)         |
| `npm run check`             | `typecheck` + تدقيق التنسيق بـ Prettier |
| `npm run check:images`      | فحص صور الترويسة قبل البناء             |
| `npm run format`            | تنسيق بـ Prettier                       |

ينفّذ `prebuild` تلقائياً `check:images` و `install-plugins` قبل كل بناء.

### بنية المشروع

```
mmehdi_blog/
├── content/                      # كل ملفات Markdown
│   ├── یادداشتها/                # الملاحظات
│   ├── ترجمهها/                  # الترجمات
│   ├── سطرچین/                   # مقتطفات الكتب
│   ├── پیشنهادها/                # books/ films/ musics/
│   ├── لیستها/                   # القوائم
│   ├── هفتهها/                   # «الحياة بالأسابيع»
│   ├── برگهها/                   # صفحات ثابتة
│   ├── Templates/                # قوالب Obsidian (tpl-*.md)
│   └── index.md                  # الصفحة الرئيسية
├── plugins/bidi-text/            # إضافة الاتجاه ثنائي اللغة
├── quartz/plugins/               # إضافات محلية أخرى
├── quartz/styles/custom.scss     # أنماط RTL والهوية البصرية
├── quartz.config.yaml            # إعدادات الموقع والإضافات
└── .github/workflows/            # CI/CD
```

### الإعداد — `quartz.config.yaml`

أهمّ المفاتيح: `pageTitle`، `pageTitleSuffix`، `baseUrl`، `locale` (يساوي `fa-IR`)، وألوان `theme.colors`. لتشغيل قالبك الخاص غيّر على الأقل `pageTitle` و `pageTitleSuffix` و `baseUrl`.

### أنواع المنشورات

«نوع المنشور» ليس برمجةً، بل **مجلد + وسم (tag) + قالب**. لكل مجلد تحت `content/` صفحة فهرس، ولكل وسم صفحة وسم. يُحدَّد نوع كل ملف داخل محرّك Quartz عبر `pageTypes` و matcher‏ات `ext` / `slugPrefix` / `frontmatter` / `and` / `or` / `not`.

| النوع  | المجلد       | الوسم      | حقول خاصة                                       |
| ------ | ------------ | ---------- | ----------------------------------------------- |
| ملاحظة | `یادداشتها/` | `گاه‌نوشت` | —                                               |
| ترجمة  | `ترجمهها/`   | `ترجمه`    | `source_title`, `source_author`, `source_url`   |
| سطرچین | `سطرچین/`    | `سطرچین`   | `book_title`, `book_author`, `rating`           |
| اقتراح | `پیشنهادها/` | `پیشنهاد`  | `item_title`, `item_creator`, `recommend_level` |
| قائمة  | `لیستها/`    | `لیست`     | —                                               |
| أسبوع  | `هفتهها/`    | `هفته`     | `week`                                          |
| صفحة   | `برگهها/`    | —          | —                                               |

### الترويسة (Frontmatter)

```yaml
---
title: عنوان المقال
date: 2026-11-20
tags: [گاه‌نوشت]
draft: false # true = لا يُنشر
featured: false # true = يظهر في بطاقات الصفحة الرئيسية
order: # ترتيب البطاقة (الأصغر أولاً)
description: # السطر أسفل عنوان البطاقة
image: "" # صورة الغلاف — مسار محلي داخل content/
socialImage: # (اختياري) og:image — يجب أن يكون رابطاً مطلقاً
---
```

- `image` تبني صورة الغلاف أعلى المنشور، وخلفية البطاقة إن كانت مختارة.
- `socialImage` يجب أن يكون رابطاً **مطلقاً**، وإلا يصبح `/static//...` ويعطي 404.
- كل هذه الحقول قابلة للتحرير من لوحة **Properties** في Obsidian.

### الإضافات المحلية

| الإضافة            | المسار                             | الوظيفة                            |
| ------------------ | ---------------------------------- | ---------------------------------- |
| `bidi-text`        | `plugins/bidi-text/`               | تحديد اتجاه كل فقرة/عنوان تلقائياً |
| `featured-cards`   | `quartz/plugins/featured-cards/`   | بطاقات «الملاحظات المختارة»        |
| `featured-image`   | `quartz/plugins/featured-image/`   | صورة الغلاف                        |
| `latest-notes`     | `quartz/plugins/latest-notes/`     | قائمة «آخر الملاحظات»              |
| `weeks-calendar`   | `quartz/plugins/weeks-calendar/`   | شبكة ٥٢×٩٠ «الحياة بالأسابيع»      |
| `ziscus-comments`  | `quartz/plugins/ziscus-comments/`  | جلب التعليقات من worker            |
| `ziscus-ui`        | `quartz/plugins/ziscus-ui/`        | واجهة التعليقات                    |
| `footer`           | `quartz/plugins/footer/`           | تذييل بروابط تلغرام/غيت‌هَب        |
| `legacy-redirects` | `quartz/plugins/legacy-redirects/` | إعادة توجيه 301 من الروابط القديمة |
| `page-title`       | `quartz/plugins/page-title/`       | الشعار والعنوان في العمود الجانبي  |

> للإضافات المحلية مجلّد `dist/`. إن عدّلت المصدر (`index.ts`/`components.tsx`) فأعد بناءه بـ esbuild ليُحدَّث `dist/`.

### الهوية والألوان

- الألوان: بنفسجي `#5b2f84` (secondary) وأرجواني `#b43eb6` (tertiary).
- خطوط: Vazirmatn للنص، IBM Plex Mono للكود، وRay-ExtraBold للعناوين.
- إضافة `@quartz-themes/core` **معطَّلة عمداً** لأنها تُعيد تعريف الألوان وتُفسد الهوية.

### التعليقات — Ziscus

تُجلب التعليقات من **Cloudflare Worker** منفصل (وليس giscus)، عبر الإضافة `ziscus-comments`. لتستخدمها بنفسك بدّل `endpoint` إلى worker خاصّ بك.

### النشر — Cloudflare Pages

يُنشر الموقع على **Cloudflare Pages** ويُعاد بناؤه مع كل push إلى الفرع **`v5`**. دامنه `blog.mmehdi.ir` مربوط بـ `CNAME`.

للنشر على حسابك: اربط المستودع بـ Cloudflare Pages، ثم اضبط: أمر البناء `npx quartz build`، مجلد الناتج `public`، وإصدار Node `22`.

> ⚠️ ملف `.github/workflows/deploy.yml` خاصّ بـ **GitHub Pages** وهو بلا أثر هنا.

### الترخيص

هذا المشروع مبنيّ على [Quartz](https://github.com/jackyzha0/quartz) (© jackyzha0، رخصة MIT) و [eledah/quartz](https://github.com/eledah/quartz). الترخيص هنا أيضاً **MIT** (انظر `LICENSE.txt`).

- تلغرام: [@Mmehdi_ir](https://t.me/Mmehdi_ir)
- غيت‌هَب: [mmehdishafiee/mmehdi_blog](https://github.com/mmehdishafiee/mmehdi_blog)
