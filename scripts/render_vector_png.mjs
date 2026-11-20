import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderVector() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 2 // 2048x2048 output
  });

  const svg = fs.readFileSync(path.join(__dirname, '..', 'public', 'calcdial-vector.svg'), 'utf8');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:transparent; display:flex; align-items:center; justify-content:center; width:1024px; height:1024px; overflow:hidden;">
      <div style="width:1024px; height:1024px;">
        ${svg}
      </div>
    </body>
    </html>
  `);

  const outPng = path.join(__dirname, '..', 'public', 'calcdial-logo-vector.png');
  await page.screenshot({ path: outPng, omitBackground: true });

  const artPng = 'C:\\Users\\Muzahid\\.gemini\\antigravity\\brain\\96a3c346-8c60-45f4-b5a7-82818d22c5a5\\calcdial-logo-vector.png';
  fs.copyFileSync(outPng, artPng);

  // Update public/calcdial-icon.png, public/logo.png and src/app/icon.png
  fs.copyFileSync(outPng, path.join(__dirname, '..', 'public', 'calcdial-icon.png'));
  fs.copyFileSync(outPng, path.join(__dirname, '..', 'public', 'logo.png'));
  fs.copyFileSync(outPng, path.join(__dirname, '..', 'src', 'app', 'icon.png'));

  await browser.close();
  console.log('Saved 2048x2048 vector PNG:', outPng);
}

renderVector().catch(console.error);
