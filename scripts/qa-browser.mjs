import { chromium } from "playwright";

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    errors.push(`Page Error: ${err.message}`);
  });

  console.log("Navigating to https://calcdial.pages.dev ...");
  await page.goto("https://calcdial.pages.dev", { waitUntil: "networkidle" });
  await page.screenshot({ path: "home-desktop.png", fullPage: true });

  console.log("Navigating to https://calcdial.pages.dev/tools/etsy-fee-calculator ...");
  await page.goto("https://calcdial.pages.dev/tools/etsy-fee-calculator", { waitUntil: "networkidle" });
  await page.screenshot({ path: "etsy-desktop.png", fullPage: true });

  console.log("Checking mobile viewport ...");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "etsy-mobile.png", fullPage: true });

  console.log("Reported Errors:", errors);
  await browser.close();
}

runQA().catch((err) => {
  console.error(err);
  process.exit(1);
});
