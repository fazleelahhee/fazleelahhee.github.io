import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.goto(`file://${path.join(root, 'cv.html')}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.emulateMediaType('print');

  // wait a beat for fonts to settle
  await new Promise(r => setTimeout(r, 400));

  // Inspect badge dimensions
  const badgeInfo = await page.evaluate(() => {
    const badges = Array.from(document.querySelectorAll('.badge'));
    return badges.map(b => {
      const r = b.getBoundingClientRect();
      const style = getComputedStyle(b);
      return {
        text: b.textContent,
        width: Math.round(r.width),
        height: Math.round(r.height),
        whiteSpace: style.whiteSpace,
        letterSpacing: style.letterSpacing,
      };
    });
  });
  console.log('Badges:');
  console.table(badgeInfo);

  // Inspect subtitle text
  const subtitleText = await page.$eval('.subtitle', el => el.innerText);
  console.log('\nSubtitle text:', JSON.stringify(subtitleText));

  // Header full screenshot
  const header = await page.$('.cv-header');
  await header.screenshot({ path: path.join(root, 'tmp-header.png') });
  console.log('\n✓ Header screenshot → tmp-header.png');

  // Full first page
  await page.screenshot({
    path: path.join(root, 'tmp-page1.png'),
    clip: { x: 0, y: 0, width: 794, height: 1123 },
  });
  console.log('✓ First page screenshot → tmp-page1.png');

  // Full page (longer)
  await page.screenshot({
    path: path.join(root, 'tmp-full.png'),
    fullPage: true,
  });
  console.log('✓ Full-page screenshot → tmp-full.png');
} finally {
  await browser.close();
}
