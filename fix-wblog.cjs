// اصلاح فهرست و لینک‌های صفحه‌ی «ویکی وبلاگ» (content/pages/wblog.md)
// اجرا از ریشه‌ی ریپو:  node fix-wblog.cjs
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'content', 'pages', 'wblog.md');
let text = fs.readFileSync(file, 'utf-8');
const before = text;

// ۱) فهرست خراب (لینک به wblog2..5) -> لینک‌های داخل همین صفحه
const toc = [
  '## فهرست',
  '',
  '- [بخش محتوایی](#بخش-محتوایی)',
  '- [بخش ظاهری](#بخش-ظاهری)',
  '- [بخش فنی](#بخش-فنی)',
  '- [سایر](#سایر)',
  '',
  ''
].join('\n');
text = text.replace(/## فهرست:[\s\S]*?(?=## بخش محتوایی:)/, toc);

// ۲) حذف دونقطه‌ی آخر تیترهای اصلی تا آدرس لینک‌ها قطعی و قابل‌پیش‌بینی باشه
for (const h of ['بخش محتوایی', 'بخش ظاهری', 'بخش فنی', 'سایر']) {
  text = text.replace(new RegExp('^## ' + h + ':\\s*$', 'm'), '## ' + h);
}

// ۳) دکمه‌ی «آمار زنده» -> لینک مستقیم دیتاباکس
text = text.replace(
  /\[آمار زنده وبلاگ\]\([^)]*\)/,
  '[آمار زنده وبلاگ](https://app.databox.com/datawall/471ae1d2b5e03ebfce61b91546928adc06197c8f6?i)'
);

// ۴) حذف جمله‌ی بی‌مصرف آخر صفحه (مال صفحه‌ی ششم قدیمی بود)
text = text.replace(/\n*برای مشاهده آمار زنده، تا بارگیری کامل صفحه صبر کنید :\)\s*$/, '\n');

if (text === before) {
  console.log('هیچ تغییری اعمال نشد (احتمالاً قبلاً اصلاح شده).');
} else {
  fs.writeFileSync(file, text, 'utf-8');
  console.log('wblog.md اصلاح شد.');
}
