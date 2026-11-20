import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateLogos() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 2, // 2x retina crispness
  });
  const page = await context.newPage();

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Official App Icon Mark (Squircle with 3D Precision Dial) - 1024x1024
  const appIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b1736" />
        <stop offset="40%" stop-color="#020a1a" />
        <stop offset="100%" stop-color="#00040d" />
      </linearGradient>
      
      <radialGradient id="horizonGlow" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#2b5cfd" stop-opacity="0.8" />
        <stop offset="45%" stop-color="#0056ec" stop-opacity="0.3" />
        <stop offset="85%" stop-color="#010918" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.9" />
        <stop offset="30%" stop-color="#2b5cfd" stop-opacity="0.7" />
        <stop offset="70%" stop-color="#1e3a8a" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6" />
      </linearGradient>

      <linearGradient id="specularTop" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563eb" />
        <stop offset="50%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>

      <linearGradient id="needleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="60%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>

      <radialGradient id="knobGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#090d16" />
      </radialGradient>

      <radialGradient id="jewelGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#6ee7b7" />
        <stop offset="40%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#047857" />
      </radialGradient>

      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="needleGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="10" result="blur" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.1   0 0 0 0 0.6   0 0 0 0 1   0 0 0 0.8 0" result="colorBlur" />
        <feMerge>
          <feMergeNode in="colorBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      
      <filter id="squircleShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#010918" flood-opacity="0.6" />
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2b5cfd" flood-opacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#squircleShadow)">
      <rect x="36" y="36" width="440" height="440" rx="104" fill="url(#bgGrad)" />
      <rect x="36" y="36" width="440" height="440" rx="104" fill="url(#horizonGlow)" />
      <rect x="37" y="37" width="438" height="219" rx="103" fill="url(#specularTop)" />
      <rect x="36" y="36" width="440" height="440" rx="104" fill="none" stroke="url(#rimGrad)" stroke-width="2.5" />
    </g>

    <g transform="translate(256, 256)">
      <circle r="162" fill="none" stroke="#0f172a" stroke-width="20" />
      <circle r="162" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
      <circle r="152" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="3" />

      <g stroke="#334155" stroke-width="2.5" stroke-linecap="round">
        ${Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const isMajor = i % 3 === 0;
          const r1 = isMajor ? 128 : 134;
          const r2 = 142;
          const rad = (angle * Math.PI) / 180;
          const x1 = Math.cos(rad) * r1;
          const y1 = Math.sin(rad) * r1;
          const x2 = Math.cos(rad) * r2;
          const y2 = Math.sin(rad) * r2;
          const strokeCol = (angle >= 210 || angle <= 40) ? (isMajor ? '#38bdf8' : '#0284c7') : (isMajor ? '#64748b' : '#334155');
          const strokeW = isMajor ? 3.5 : 2;
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeCol}" stroke-width="${strokeW}" opacity="${isMajor ? 0.9 : 0.6}" />`;
        }).join('')}
      </g>

      <path d="M -95 95 A 134 134 0 1 1 110 -76" fill="none" stroke="url(#arcGrad)" stroke-width="8" stroke-linecap="round" filter="url(#softGlow)" />

      <circle r="88" fill="url(#knobGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
      <circle r="84" fill="none" stroke="rgba(0,0,0,0.8)" stroke-width="3" />
      <circle r="82" fill="none" stroke="#2b5cfd" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 6" />

      <g filter="url(#needleGlow)">
        <polygon points="0,-16 116,-42 0,16 -24,0" fill="#000000" opacity="0.4" transform="translate(2, 6)" />
        <path d="M -12 0 L 0 -10 L 118 -36 L 16 8 Z" fill="url(#needleGrad)" />
        <path d="M -12 0 L 0 10 L 118 -36 L 16 -8 Z" fill="url(#needleGrad)" opacity="0.8" />
        <line x1="0" y1="0" x2="124" y2="-38" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
      </g>

      <circle r="34" fill="#090d16" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" />
      <circle r="22" fill="url(#jewelGrad)" />
      <circle r="20" fill="none" stroke="#a7f3d0" stroke-width="1.5" stroke-opacity="0.8" />
      <ellipse cx="-4" cy="-5" rx="7" ry="4" fill="#ffffff" fill-opacity="0.65" transform="rotate(-30 -4 -5)" />
      <circle r="29" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="2 4" stroke-opacity="0.7" />
    </g>
  </svg>
  `;

  async function renderToPng(htmlContent, width, height, outputPath) {
    await page.setViewportSize({ width, height });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: ${width}px;
            height: ${height}px;
            background: transparent !important;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);
    
    await page.screenshot({
      path: outputPath,
      omitBackground: true,
      type: 'png'
    });
  }

  await renderToPng(appIconSvg, 512, 512, path.join(publicDir, 'calcdial-icon.png'));

  const circularBrandmarkSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <radialGradient id="circDialBg" cx="40%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="45%" stop-color="#0b1736" />
        <stop offset="85%" stop-color="#010918" />
        <stop offset="100%" stop-color="#000208" />
      </radialGradient>
      <linearGradient id="circRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="35%" stop-color="#2b5cfd" />
        <stop offset="70%" stop-color="#1d4ed8" />
        <stop offset="100%" stop-color="#60a5fa" />
      </linearGradient>
      <linearGradient id="circArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563eb" />
        <stop offset="40%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>
      <linearGradient id="circNeedleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="50%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>
      <radialGradient id="circJewelGrad" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#6ee7b7" />
        <stop offset="40%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#047857" />
      </radialGradient>
      <radialGradient id="circKnobGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="55%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#0a0f1d" />
      </radialGradient>
      <filter id="circGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#010918" flood-opacity="0.6" />
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#2b5cfd" flood-opacity="0.4" />
      </filter>
    </defs>
    
    <g filter="url(#circGlow)" transform="translate(256, 256)">
      <circle r="226" fill="url(#circDialBg)" stroke="url(#circRimGrad)" stroke-width="5" />
      <circle r="222" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
      
      <circle r="192" fill="none" stroke="#0f172a" stroke-width="26" />
      <circle r="192" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
      
      <g stroke="#334155" stroke-width="3" stroke-linecap="round">
        ${Array.from({ length: 48 }).map((_, i) => {
          const angle = i * 7.5;
          const isMajor = i % 4 === 0;
          const r1 = isMajor ? 148 : 158;
          const r2 = 172;
          const rad = (angle * Math.PI) / 180;
          const x1 = Math.cos(rad) * r1;
          const y1 = Math.sin(rad) * r1;
          const x2 = Math.cos(rad) * r2;
          const y2 = Math.sin(rad) * r2;
          const strokeCol = (angle >= 210 || angle <= 45) ? (isMajor ? '#38bdf8' : '#0284c7') : (isMajor ? '#64748b' : '#334155');
          const strokeW = isMajor ? 4 : 2.5;
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeCol}" stroke-width="${strokeW}" opacity="${isMajor ? 0.95 : 0.6}" />`;
        }).join('')}
      </g>

      <path d="M -125 105 A 163 163 0 1 1 136 -90" fill="none" stroke="url(#circArcGrad)" stroke-width="10" stroke-linecap="round" />

      <circle r="105" fill="url(#circKnobGrad)" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" />
      <circle r="98" fill="none" stroke="#2b5cfd" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 6" />

      <g>
        <polygon points="0,-18 140,-48 0,18 -30,0" fill="#000000" opacity="0.45" transform="translate(3, 8)" />
        <path d="M -16 0 L 0 -12 L 142 -44 L 18 10 Z" fill="url(#circNeedleGrad)" />
        <path d="M -16 0 L 0 12 L 142 -44 L 18 -10 Z" fill="url(#circNeedleGrad)" opacity="0.85" />
        <line x1="0" y1="0" x2="148" y2="-46" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
      </g>

      <circle r="42" fill="#090d16" stroke="rgba(255,255,255,0.25)" stroke-width="3" />
      <circle r="28" fill="url(#circJewelGrad)" />
      <circle r="25" fill="none" stroke="#a7f3d0" stroke-width="1.8" stroke-opacity="0.8" />
      <ellipse cx="-5" cy="-6" rx="9" ry="5" fill="#ffffff" fill-opacity="0.7" transform="rotate(-30 -5 -6)" />
    </g>
  </svg>
  `;
  await renderToPng(circularBrandmarkSvg, 512, 512, path.join(publicDir, 'calcdial-brandmark.png'));

  const horizontalDarkHtml = `
  <div style="display: flex; align-items: center; gap: 28px; padding: 20px 40px; background: transparent;">
    <div style="width: 100px; height: 100px; flex-shrink: 0;">
      ${appIconSvg.replace('width="512"', 'width="100"').replace('height="512"', 'height="100"')}
    </div>
    <div style="display: flex; flex-direction: column; justify-content: center;">
      <div style="display: flex; align-items: baseline; font-weight: 800; font-size: 72px; letter-spacing: -2px; line-height: 1;">
        <span style="color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">Calc</span>
        <span style="color: #2b5cfd; background: linear-gradient(135deg, #38bdf8 0%, #2b5cfd 60%, #1d4ed8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dial</span>
        <span style="display: inline-block; width: 14px; height: 14px; background: #10b981; border-radius: 50%; margin-left: 6px; box-shadow: 0 0 16px #10b981;"></span>
      </div>
      <div style="font-size: 16px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #badfff; margin-top: 6px; opacity: 0.9;">
        Precision Fee & Profit Engine
      </div>
    </div>
  </div>
  `;
  await renderToPng(horizontalDarkHtml, 800, 200, path.join(publicDir, 'calcdial-logo-dark.png'));

  const horizontalLightHtml = `
  <div style="display: flex; align-items: center; gap: 28px; padding: 20px 40px; background: transparent;">
    <div style="width: 100px; height: 100px; flex-shrink: 0;">
      ${appIconSvg.replace('width="512"', 'width="100"').replace('height="512"', 'height="100"')}
    </div>
    <div style="display: flex; flex-direction: column; justify-content: center;">
      <div style="display: flex; align-items: baseline; font-weight: 800; font-size: 72px; letter-spacing: -2px; line-height: 1;">
        <span style="color: #09090b;">Calc</span>
        <span style="color: #2b5cfd; background: linear-gradient(135deg, #0284c7 0%, #2b5cfd 60%, #1e40af 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dial</span>
        <span style="display: inline-block; width: 14px; height: 14px; background: #059669; border-radius: 50%; margin-left: 6px; box-shadow: 0 0 10px rgba(5,150,105,0.4);"></span>
      </div>
      <div style="font-size: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #475569; margin-top: 6px;">
        Precision Fee & Profit Engine
      </div>
    </div>
  </div>
  `;
  await renderToPng(horizontalLightHtml, 800, 200, path.join(publicDir, 'calcdial-logo-light.png'));

  const headerNavDarkHtml = `
  <div style="display: flex; align-items: center; gap: 18px; padding: 10px 20px; background: transparent;">
    <div style="width: 64px; height: 64px; flex-shrink: 0;">
      ${appIconSvg.replace('width="512"', 'width="64"').replace('height="512"', 'height="64"')}
    </div>
    <div style="display: flex; align-items: baseline; font-weight: 800; font-size: 46px; letter-spacing: -1.5px; line-height: 1;">
      <span style="color: #ffffff;">Calc</span>
      <span style="background: linear-gradient(135deg, #38bdf8 0%, #2b5cfd 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dial</span>
      <span style="display: inline-block; width: 9px; height: 9px; background: #10b981; border-radius: 50%; margin-left: 4px; box-shadow: 0 0 12px #10b981;"></span>
    </div>
  </div>
  `;
  await renderToPng(headerNavDarkHtml, 420, 100, path.join(publicDir, 'calcdial-nav-logo-dark.png'));

  const headerNavLightHtml = `
  <div style="display: flex; align-items: center; gap: 18px; padding: 10px 20px; background: transparent;">
    <div style="width: 64px; height: 64px; flex-shrink: 0;">
      ${appIconSvg.replace('width="512"', 'width="64"').replace('height="512"', 'height="64"')}
    </div>
    <div style="display: flex; align-items: baseline; font-weight: 800; font-size: 46px; letter-spacing: -1.5px; line-height: 1;">
      <span style="color: #09090b;">Calc</span>
      <span style="color: #2b5cfd; background: linear-gradient(135deg, #0284c7 0%, #2b5cfd 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dial</span>
      <span style="display: inline-block; width: 9px; height: 9px; background: #059669; border-radius: 50%; margin-left: 4px; box-shadow: 0 0 8px rgba(5,150,105,0.4);"></span>
    </div>
  </div>
  `;
  await renderToPng(headerNavLightHtml, 420, 100, path.join(publicDir, 'calcdial-nav-logo-light.png'));

  fs.writeFileSync(path.join(publicDir, 'calcdial-icon.svg'), appIconSvg.trim());
  fs.writeFileSync(path.join(publicDir, 'calcdial-brandmark.svg'), circularBrandmarkSvg.trim());

  await browser.close();
}

generateLogos().catch(console.error);
