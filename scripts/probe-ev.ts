import { chromium } from "playwright";

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to EV Database...");
  await page.goto("https://ev-database.org");
  
  console.log("Extracting DOM structures...");
  const htmlSnippets = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.list-item')).slice(0, 2).map(el => el.innerHTML);
  });
  
  console.log(JSON.stringify(htmlSnippets, null, 2));
  
  await browser.close();
})();
