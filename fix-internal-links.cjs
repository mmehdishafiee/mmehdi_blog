// این اسکریپت رو روی کامپیوتر خودت اجرا کن (نه توی Claude).
//
// کارش: توی همه‌ی فایل‌های content/، هر لینکی که به mmehdi.ir اشاره می‌کنه
// (چه با /blog/ چه بدون، چه با دامنه‌ی قدیمی new.mmehdi.ir) رو پیدا می‌کنه
// و به مسیر داخلی جدید (مثل /notes/loneliest_whale) تبدیل می‌کنه.
//
// نحوه‌ی استفاده:
//   1. این فایل رو کنار پوشه‌ی content بذار (توی ریشه‌ی ریپو)
//   2. توی ترمینال، همون‌جا بزن:
//        node fix-internal-links.js
//   3. گزارش نهایی رو بخون: چندتا لینک عوض شد، و لیست لینک‌هایی که
//      "پیدا نشد" (یعنی به چیزی اشاره می‌کنن که توی نقشه نبود — این‌ها
//      رو باید دستی چک کنی، معمولاً لینک به صفحات دسته‌بندی یا چیزای
//      دیگه‌ای هستن که منتقل نشدن)

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');

// نقشه‌ی slug قدیمی -> مسیر جدید
const SLUG_MAP = {
  "21-lessons-for-the-21st-century-satrcin-highlights": "/satrcin/21-lessons-for-the-21st-century-satrcin-highlights",
  "agar-be-khodam-bargardam-satrcin-highlights": "/satrcin/agar-be-khodam-bargardam-satrcin-highlights",
  "animal-farm-satrcin-highlights": "/satrcin/animal-farm-satrcin-highlights",
  "cant-hurt-me-satrcin-highlights": "/satrcin/cant-hurt-me-satrcin-highlights",
  "essentialism-satrcin-highlights": "/satrcin/essentialism-satrcin-highlights",
  "in-ham-mesali-digar-satrcin-highlights": "/satrcin/in-ham-mesali-digar-satrcin-highlights",
  "meditations-satrcin-highlights": "/satrcin/meditations-satrcin-highlights",
  "satrcin-highlights": "/satrcin/satrcin-highlights",
  "the-bed-of-procrustes-satrcin-highlights": "/satrcin/the-bed-of-procrustes-satrcin-highlights",
  "the-boy-the-mole-the-fox-and-the-horse-satrcin-highlights": "/satrcin/the-boy-the-mole-the-fox-and-the-horse-satrcin-highlights",
  "the-compound-effect-satrcin-highlights": "/satrcin/the-compound-effect-satrcin-highlights",
  "the-death-of-ivan-ilyich-satrcin-highlights": "/satrcin/the-death-of-ivan-ilyich-satrcin-highlights",
  "the-dictionary-of-obscure-sorrows-satrcin-highlights": "/satrcin/the-dictionary-of-obscure-sorrows-satrcin-highlights",
  "100-blocks-day": "/translations/100-blocks-day",
  "68-bits-of-unsolicited-advice": "/translations/68-bits-of-unsolicited-advice",
  "artificial-intelligence-revolution-1": "/translations/artificial-intelligence-revolution-1",
  "believer-imagine-dragon": "/translations/believer-imagine-dragon",
  "dance-me-to-the-end-of-love-leonard-cohen": "/translations/dance-me-to-the-end-of-love-leonard-cohen",
  "end-of-the-year-reflection": "/translations/end-of-the-year-reflection",
  "how-to-get-rich": "/translations/how-to-get-rich",
  "life-weeks": "/translations/life-weeks",
  "love-in-the-age-of-big-data": "/translations/love-in-the-age-of-big-data",
  "natural-imagine-dragon": "/translations/natural-imagine-dragon",
  "patrick-collison": "/translations/patrick-collison",
  "element": "/offers/element",
  "media-pack": "/offers/media-pack",
  "notionfa": "/offers/notionfa",
  "online-books": "/offers/books/online-books",
  "persian-blogs": "/offers/books/persian-blogs",
  "the-5am-club": "/offers/books/the-5am-club",
  "movie-guide": "/offers/films/movie-guide",
  "my-watch-list": "/offers/films/my-watch-list",
  "25-lessons-from-turning-25": "/notes/25-lessons-from-turning-25",
  "chinese-social-credit-system": "/notes/chinese-social-credit-system",
  "class-based-internet": "/notes/class-based-internet",
  "concours": "/notes/concours",
  "hello-world": "/notes/hello-world",
  "kar-nakon-seo-internship": "/notes/kar-nakon-seo-internship",
  "karnakon-seo-internship": "/notes/karnakon-seo-internship",
  "loneliest_whale": "/notes/loneliest_whale",
  "motorcycle-crash": "/notes/motorcycle-crash",
  "the-death-knell-of-the-internet": "/notes/the-death-knell-of-the-internet",
  "best-telegram-bots": "/lists/best-telegram-bots",
  "jadi-courses-list": "/lists/jadi-courses-list",
  "about": "/pages/about",
  "donate": "/pages/donate",
  "failures": "/pages/failures",
  "flueentflow": "/pages/flueentflow",
  "internet-blackout-toolkit": "/pages/internet-blackout-toolkit",
  "internet": "/pages/internet",
  "l": "/pages/l",
  "newsletter-archive": "/pages/newsletter-archive",
  "newsletter": "/pages/newsletter",
  "random-quotes-from-movies": "/pages/random-quotes-from-movies",
  "random-quotes": "/pages/random-quotes",
  "services": "/pages/services",
  "taughts": "/pages/taughts",
  "ts": "/pages/ts",
  "v2ray": "/pages/v2ray",
  "wblog": "/pages/wblog",
};

// لینک‌هایی که به mmehdi.ir / new.mmehdi.ir / blog.mmehdi.ir اشاره می‌کنن،
// با یا بدون /blog/، با یا بدون اسلش آخر
const LINK_PATTERN = /https?:\/\/(?:new\.|blog\.)?mmehdi\.ir\/(?:blog\/)?([a-zA-Z0-9_-]+)\/?/g;

function getAllMarkdownFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.toLowerCase() === 'templates') continue;
    if (entry.name === '.obsidian') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function main() {
  const files = getAllMarkdownFiles(CONTENT_DIR);
  let totalReplaced = 0;
  let filesChanged = 0;
  const unmatched = new Set();

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let changedInFile = 0;

    const newContent = content.replace(LINK_PATTERN, (match, slug) => {
      if (SLUG_MAP[slug]) {
        changedInFile++;
        totalReplaced++;
        return SLUG_MAP[slug];
      } else {
        unmatched.add(match);
        return match; // دست‌نخورده بمونه
      }
    });

    if (changedInFile > 0) {
      fs.writeFileSync(file, newContent, 'utf-8');
      filesChanged++;
      console.log(`${path.relative(CONTENT_DIR, file)}: ${changedInFile} لینک اصلاح شد`);
    }
  }

  console.log(`\nتمام شد.`);
  console.log(`فایل‌های تغییریافته: ${filesChanged}`);
  console.log(`کل لینک‌های اصلاح‌شده: ${totalReplaced}`);

  if (unmatched.size > 0) {
    console.log(`\n⚠️ این ${unmatched.size} لینک پیدا نشد توی نقشه (دستی چکشون کن):`);
    for (const u of unmatched) console.log('  -', u);
  } else {
    console.log('\nهیچ لینک شناسایی‌نشده‌ای نبود.');
  }
}

main();
