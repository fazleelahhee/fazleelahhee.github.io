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
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  const url = process.argv[2] ?? 'https://fazleelahhee.github.io/cv.html';
  console.log('Fetching:', url);

  const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  console.log('Status:', response.status());

  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(root, 'tmp-live.png'),
    fullPage: false,
    clip: { x: 0, y: 0, width: 1280, height: 900 },
  });
  console.log('✓ Live screenshot → tmp-live.png');

  const headTitle = await page.title();
  const lastModified = response.headers()['last-modified'];
  console.log('Title:', headTitle);
  console.log('Last-Modified:', lastModified);
} finally {
  await browser.close();
}
