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
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(root, 'og-image.html')}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(root, 'og-image.png'),
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log('✓ Generated og-image.png');
} finally {
  await browser.close();
}
