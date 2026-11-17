import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const outDir = path.resolve('out');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  else if (!path.extname(reqPath)) reqPath += '/index.html';
  
  let filePath = path.join(outDir, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(outDir, '404.html');
  }
  
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(4325, async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1200 },
    colorScheme: 'dark'
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4325/tools/tiktok-shop-fee-calculator/');
  await page.waitForTimeout(1000);

  const meter = await page.locator('[role="meter"]').first();
  await meter.screenshot({ path: 'scripts/gauge-dial.png' });
  console.log('Meter screenshot saved');

  // Also scroll down and screenshot the right column
  await page.evaluate(() => window.scrollBy(0, 350));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scripts/tiktok-scrolled.png' });
  console.log('Scrolled screenshot saved');

  await browser.close();
  server.close();
});
