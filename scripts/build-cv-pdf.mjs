import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const browser = await puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--font-render-hinting=none',
  ],
});

try {
  const page = await browser.newPage();
  await page.goto(`file://${path.join(root, 'cv.html')}`, {
    waitUntil: 'networkidle0',
  });
  await page.evaluateHandle('document.fonts.ready');
  await page.emulateMediaType('print');
  await page.pdf({
    path: path.join(root, 'Fazle-Elahee-CV.pdf'),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '14mm', bottom: '14mm', left: '16mm', right: '16mm' },
  });
  console.log('✓ Generated Fazle-Elahee-CV.pdf');
} finally {
  await browser.close();
}
