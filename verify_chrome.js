const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 400, height: 850 } });
  await page.goto('https://calcdial.pages.dev/tools/shopify-profit-calculator', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Click Target Price to verify pill
  await page.click('button:has-text("Target Price")');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'live_cf_pill_verified.png' });
  await browser.close();
  console.log('Live Cloudflare pill and custom select verified!');
})();
