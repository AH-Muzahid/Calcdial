import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recreateBrandLogo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 2 // 2x = 2048x2048 ultra HD output
  });

  const publicDir = path.join(__dirname, '..', 'public');
  const artDir = 'C:\\Users\\Muzahid\\.gemini\\antigravity\\brain\\96a3c346-8c60-45f4-b5a7-82818d22c5a5';

  // Mathematically constructed SVG based on user's exact negative space concept
  // Brand colors from DESIGN.md:
  // - Cosmic Deep Navy: #010918 / #061938
  // - Vibrant Electric Blue: #2b5cfd
  // - Radiant Cyan / Horizon: #0056ec / #38bdf8
  // - Profit Emerald Accent: #10b981
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _masterSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    <defs>
      <!-- Subtle premium depth gradients aligned with DESIGN.md -->
      <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0e234e" />
        <stop offset="60%" stop-color="#04122d" />
        <stop offset="100%" stop-color="#010918" />
      </linearGradient>

      <linearGradient id="electricBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="35%" stop-color="#2b5cfd" />
        <stop offset="100%" stop-color="#0056ec" />
      </linearGradient>

      <linearGradient id="needleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#04122d" />
        <stop offset="100%" stop-color="#0e285a" />
      </linearGradient>
      
      <!-- Inverted needle gradient for dark backgrounds -->
      <linearGradient id="needleLightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2b5cfd" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
    </defs>

    <!-- Master Group centered in 500x500 box -->
    <g id="logo-body">
      <!-- 1. Top/Left Deep Navy Segment with Diagonal Cut -->
      <!-- Points: top edge, top-left bevel, left vertical, diagonal slash cut -->
      <path d="
        M 190 70 
        L 310 70 
        C 324 70 334 78 340 90
        L 242 188 
        C 230 188 178 188 178 240
        L 115 303
        L 115 210
        C 115 190 125 174 138 162
        L 218 82
        C 224 76 232 70 242 70
        Z
      " fill="url(#navyGrad)" />

      <!-- Top-Left Main Body (Refined polygon matching user reference) -->
      <!-- Left side hook with bottom-left diagonal slice -->
      <path d="
        M 220 70 
        L 314 70 
        C 324 70 332 76 338 86 
        L 230 194
        L 176 194 
        C 176 194 176 290 176 290
        L 116 350
        L 116 210 
        C 116 192 124 176 138 162 
        L 204 82 
        C 210 74 218 70 228 70
        Z
      " fill="url(#navyGrad)" />

      <!-- Bottom-left triangle wedge (separated by negative space slash) -->
      <path d="
        M 116 386 
        L 176 326 
        L 254 404 
        C 246 414 236 422 222 426 
        L 142 426 
        C 126 426 116 414 116 398 
        Z
      " fill="url(#navyGrad)" />

      <!-- 2. Right Vibrant Electric Blue Segment -->
      <path d="
        M 284 150 
        L 358 224 
        C 376 242 386 260 386 284 
        L 386 336 
        C 386 354 378 370 366 382 
        L 322 426 
        L 232 426 
        L 324 334 
        L 324 238 
        L 252 166 
        Z
      " fill="url(#electricBlueGrad)" />

      <!-- 3. Center Negative Space Gauge Needle -->
      <!-- Circular Pivot Ring -->
      <circle cx="240" cy="286" r="28" fill="none" stroke="url(#navyGrad)" stroke-width="14" />
      
      <!-- Directional Arrow / Pointer Blade pointing to 42 degrees (Profit / Accuracy) -->
      <path d="
        M 248 266 
        L 298 214 
        C 300 212 302 214 300 216
        L 266 266 
        Z
      " fill="url(#navyGrad)" />

      <!-- Emerald Core Precision Node (CalcDial ROI touch) -->
      <circle cx="294" cy="218" r="4.5" fill="#10b981" />
    </g>
  </svg>
  `;

  // We also create the pixel-perfect geometric version with precise SVG curves:
  const preciseSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%" fill="none">
    <defs>
      <linearGradient id="pNavy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1d44" />
        <stop offset="60%" stop-color="#030e26" />
        <stop offset="100%" stop-color="#010918" />
      </linearGradient>
      <linearGradient id="pBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="40%" stop-color="#2b5cfd" />
        <stop offset="100%" stop-color="#0052e0" />
      </linearGradient>
    </defs>

    <g transform="translate(50, 50)">
      <!-- Top Navy Arm -->
      <path d="M 235 50 L 320 50 C 345 50 365 65 375 88 L 260 200 L 175 200 C 160 200 150 210 150 225 L 150 280 L 78 352 L 78 200 C 78 175 92 152 112 135 L 202 62 C 212 54 223 50 235 50 Z" fill="url(#pNavy)" />
      
      <!-- Bottom-Left Navy Base (cut by diagonal negative space slash) -->
      <path d="M 82 396 L 154 324 L 235 405 C 225 418 210 426 192 426 L 115 426 C 96 426 82 412 82 396 Z" fill="url(#pNavy)" />

      <!-- Right Electric Blue Wing -->
      <path d="M 295 145 L 368 218 C 390 240 402 265 402 295 L 402 342 C 402 365 392 385 376 398 L 342 426 L 250 426 L 332 344 L 332 245 L 260 175 Z" fill="url(#pBlue)" />

      <!-- Center Negative Space Precision Dial Needle -->
      <!-- Ring with central negative space hole -->
      <path d="M 245 285 m -32, 0 a 32,32 0 1,0 64,0 a 32,32 0 1,0 -64,0 M 245 285 m -16, 0 a 16,16 0 1,1 32,0 a 16,16 0 1,1 -32,0" fill="url(#pNavy)" fill-rule="evenodd" />
      
      <!-- Sharp Dynamic Pointer -->
      <path d="M 252 268 L 316 200 C 319 197 322 201 319 204 L 272 276 Z" fill="url(#pNavy)" />
      <circle cx="316" cy="202" r="5" fill="#10b981" />
    </g>
  </svg>
  `;

  // Render to 2048x2048 Ultra-HD Transparent PNG
  async function renderPng(svgContent, outPath) {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body style="margin:0; background:transparent; display:flex; align-items:center; justify-content:center; width:1024px; height:1024px; overflow:hidden;">
        <div style="width:880px; height:880px;">
          ${svgContent}
        </div>
      </body>
      </html>
    `);

    await page.screenshot({ path: outPath, omitBackground: true });
    console.log('Saved:', outPath);
  }

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'calcdial-brandmark-recreated.svg'), preciseSvg.trim());
  fs.writeFileSync(path.join(artDir, 'calcdial-brandmark-recreated.svg'), preciseSvg.trim());

  // Render 2048x2048 PNG
  const outPng = path.join(publicDir, 'calcdial-brandmark-recreated.png');
  await renderPng(preciseSvg, outPng);
  fs.copyFileSync(outPng, path.join(artDir, 'calcdial-brandmark-recreated.png'));

  // Also update public/calcdial-icon.png and public/logo.png
  fs.copyFileSync(outPng, path.join(publicDir, 'calcdial-icon.png'));
  fs.copyFileSync(outPng, path.join(publicDir, 'logo.png'));
  fs.copyFileSync(outPng, path.join(__dirname, '..', 'src', 'app', 'icon.png'));

  await browser.close();
  console.log('Finished recreating high-res brand logo!');
}

recreateBrandLogo().catch(console.error);
