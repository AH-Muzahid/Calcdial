import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOutlineArtLogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
  const publicDir = path.join(__dirname, '..', 'public');

  // Concept 1: Modern Minimalist Outline Precision Dial (Line Art, Negative Space)
  // Clean circular gauge with broken perimeter, speed ticks, and floating dynamic pointer
  const concept1Svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round">
    <!-- Outer Precision Calibrated Arc with Gap -->
    <path d="M 22 74 A 36 36 0 1 1 78 74" stroke-width="5" />
    
    <!-- Fine-line Measurement Ticks (Line Art) -->
    <line x1="28" y1="65" x2="33" y2="61" stroke-width="3" stroke="#38bdf8" />
    <line x1="23" y1="50" x2="29" y2="50" stroke-width="3" stroke="#38bdf8" />
    <line x1="28" y1="35" x2="33" y2="39" stroke-width="3" stroke="#38bdf8" />
    <line x1="50" y1="23" x2="50" y2="29" stroke-width="3.5" stroke="#2563eb" />
    <line x1="72" y1="35" x2="67" y2="39" stroke-width="3" stroke="#38bdf8" />
    <line x1="77" y1="50" x2="71" y2="50" stroke-width="3" stroke="#38bdf8" />
    <line x1="72" y1="65" x2="67" y2="61" stroke-width="3" stroke="#38bdf8" />

    <!-- Center Pivot Ring (Negative Space) -->
    <circle cx="50" cy="56" r="6" stroke-width="4" stroke="#2563eb" fill="none" />
    
    <!-- Dynamic Line-Art Needle pointing to high profit/growth -->
    <path d="M 50 50 L 72 26" stroke-width="5" stroke="#2563eb" />
    <polygon points="72,26 64,28 70,34" fill="#2563eb" stroke-width="1" />

    <!-- Subtle Accent Sparkle / Accuracy Node -->
    <circle cx="78" cy="20" r="3" fill="#10b981" stroke="none" />
  </svg>
  `;

  // Concept 2: Geometric 'C' + 'D' Interlocking Line-Art (Calculated Dial Monogram)
  const concept2Svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round">
    <!-- 'C' Outer Open Loop -->
    <path d="M 46 22 A 28 28 0 1 0 46 78" stroke-width="5.5" />
    
    <!-- 'D' Inner Closed Geometric Loop -->
    <path d="M 46 32 L 56 32 C 68 32 76 40 76 50 C 76 60 68 68 56 68 L 46 68 Z" stroke-width="5.5" stroke="#0ea5e9" />
    
    <!-- Dial Center Ray / Accuracy Tick -->
    <line x1="46" y1="50" x2="62" y2="50" stroke-width="4" stroke="#2563eb" />
    <circle cx="62" cy="50" r="3.5" fill="#2563eb" stroke="none" />
  </svg>
  `;

  // Concept 3: Outline App Window with Precision Growth Arc (Artistic Hybrid like Cloudflare reference)
  const concept3Svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#2563eb" stroke-linecap="round" stroke-linejoin="round">
    <!-- Clean Minimalist App Window Outline with corner radius -->
    <rect x="16" y="20" width="68" height="60" rx="14" stroke-width="5" />
    
    <!-- 3 Elegant Header Dots -->
    <circle cx="28" cy="32" r="2.5" fill="#2563eb" stroke="none" />
    <circle cx="36" cy="32" r="2.5" fill="#2563eb" stroke="none" />
    <circle cx="44" cy="32" r="2.5" fill="#2563eb" stroke="none" />
    
    <!-- Dynamic Line-Art Surge / Dial Curve breaking across frame -->
    <path d="M 28 66 C 42 66, 46 48, 62 34" stroke-width="5" stroke="#0ea5e9" />
    <!-- Arrowhead / Sparkle -->
    <path d="M 54 33 L 64 33 L 63 43" stroke-width="5" stroke="#0ea5e9" />
    
    <!-- Subtle Coordinate Grid Ticks -->
    <line x1="28" y1="54" x2="34" y2="54" stroke-width="2.5" stroke="#94a3b8" />
    <line x1="28" y1="60" x2="32" y2="60" stroke-width="2" stroke="#94a3b8" />
  </svg>
  `;

  // Function to save transparent PNG
  async function renderSingleLogo(svg, outputPath, width = 512, height = 512) {
    await page.setViewportSize({ width, height });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body style="margin:0; background:transparent; display:flex; align-items:center; justify-content:center; width:${width}px; height:${height}px;">
        <div style="width:${width * 0.75}px; height:${height * 0.75}px;">
          ${svg}
        </div>
      </body>
      </html>
    `);
    await page.screenshot({ path: outputPath, omitBackground: true });
  }

  await renderSingleLogo(concept1Svg, path.join(publicDir, 'calcdial-art-dial.png'));
  await renderSingleLogo(concept2Svg, path.join(publicDir, 'calcdial-art-cd.png'));
  await renderSingleLogo(concept3Svg, path.join(publicDir, 'calcdial-art-window.png'));

  // Also save SVG sources
  fs.writeFileSync(path.join(publicDir, 'calcdial-art-dial.svg'), concept1Svg.trim());
  fs.writeFileSync(path.join(publicDir, 'calcdial-art-cd.svg'), concept2Svg.trim());
  fs.writeFileSync(path.join(publicDir, 'calcdial-art-window.svg'), concept3Svg.trim());

  await browser.close();
  console.log('All line-art concepts rendered successfully!');
}

generateOutlineArtLogos().catch(console.error);
