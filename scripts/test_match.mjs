import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMatch() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 500, height: 300 } });

  const iconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="80" height="88" fill="none">
    <defs>
      <mask id="boltGap">
        <rect width="100" height="110" fill="white" />
        <path d="M53 6 L68 46 L51 46 L40 104 L31 56 L47 56 Z" fill="black" stroke="black" stroke-width="12" stroke-linejoin="round" />
      </mask>
    </defs>

    <!-- Browser/App Window with gap mask -->
    <rect x="14" y="24" width="72" height="66" rx="14" stroke="#155dfc" stroke-width="8" mask="url(#boltGap)" />

    <!-- 3 Window Dots -->
    <circle cx="26" cy="36" r="3" fill="#155dfc" />
    <circle cx="35" cy="36" r="3" fill="#155dfc" />
    <circle cx="44" cy="36" r="3" fill="#155dfc" />

    <!-- Solid Electric Blue Lightning Bolt -->
    <path d="M53 6 L68 46 L51 46 L40 104 L31 56 L47 56 Z" fill="#155dfc" stroke="#155dfc" stroke-width="2" stroke-linejoin="round" />
  </svg>
  `;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 40px;
      }
      .logo-row {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .brand-text {
        font-size: 48px;
        font-weight: 700;
        letter-spacing: -1.5px;
        color: #1e293b;
        line-height: 1;
      }
      .sub-text {
        font-size: 22px;
        color: #64748b;
        margin-top: 4px;
        font-weight: 400;
      }
    </style>
  </head>
  <body>
    <div class="logo-row">
      ${iconSvg}
      <div>
        <div class="brand-text">calcdial</div>
        <div class="sub-text">calcdial.pages.dev</div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: path.join(__dirname, '..', 'scratch', 'test_match_preview.png') });
  await browser.close();
  console.log('Saved scratch/test_match_preview.png');
}

testMatch().catch(console.error);
