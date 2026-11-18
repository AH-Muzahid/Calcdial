const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 400, height: 850 } });
  await page.goto('http://localhost:3000/tools/shopify-profit-calculator', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Switch to Target Price
  await page.click('button:has-text("Target Price")');
  await page.waitForTimeout(500);

  // Take screenshot of inputs (Pill & Dropdowns)
  await page.screenshot({ path: 'verified_chrome_pill_and_dropdowns.png' });

  // 2. Click Shopify Plan dropdown to show menu
  await page.click('button:has-text("Basic Shopify")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'verified_chrome_dropdown_open.png' });

  // 3. Scroll to Formula & Methodology
  const formula = page.locator('text=Formula & Methodology').first();
  await formula.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'verified_chrome_formula_clean.png' });

  await browser.close();
  console.log('Real Chrome verification screenshots taken');
})();
