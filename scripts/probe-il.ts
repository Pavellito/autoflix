import { chromium } from "playwright";

(async () => {
  console.log("Probing evm.co.il...");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto("https://evm.co.il/ev-database/", { waitUntil: 'domcontentloaded', timeout: 15000 });
    const content = await page.evaluate(() => {
      // Find elements containing '₪'
      return Array.from(document.querySelectorAll('*'))
        .map(e => e.textContent?.trim())
        .filter(t => t && t.includes('₪'))
        .slice(0, 5);
    });
    console.log("Found on EVM:", content);
  } catch (e) {
    console.log("Failed EVM", Boolean(e));
  }
  
  try {
    const page2 = await browser.newPage();
    await page2.goto("https://www.icar.co.il/", { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log("iCar Title:", await page2.title());
  } catch(e) {}
  
  await browser.close();
})();
