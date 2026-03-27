import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client using Service Role for admin updates
const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase Environment Variables");
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    console.log("📥 Fetching current fleet from Supabase...");
    const { data: dbCars, error } = await supabase.from('cars').select('id, name, brand');
    if (error || !dbCars) throw new Error("Failed to fetch DB cars");
    
    console.log("🚙 Launching Playwright Headless Browser...");
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log("🌐 Navigating to EV Database API...");
    await page.goto("https://ev-database.org", { waitUntil: 'domcontentloaded' });
    
    console.log("🔍 Scraping and Parsing DOM nodes...");
    const scrapedCars = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.list-item'));
        return items.map(el => {
          // The title usually contains both make and model duplicated, clean it up slightly or just return raw
          const title = el.querySelector('h2 a')?.textContent?.trim() || "";
          const battery = el.querySelector('.battery')?.textContent?.trim() || "";
          
          // Use real-world range to override standard WLTP fluff
          const rangeStr = el.querySelector('.erange_real')?.textContent?.trim() || "";
          const rangeVal = rangeStr.replace(/\D/g, ""); // Extract just the numbers
          
          return { 
              title, 
              battery: battery ? `${battery} kWh` : null, 
              range: rangeVal ? `${rangeVal} km` : null 
          };
        });
    });
    
    await browser.close();
    console.log(`✅ Scraped ${scrapedCars.length} global EV models from the database.\n`);
    
    // 3. Intelligent Match and Database Update
    console.log("⚡ Synchronizing Real-World Specs with Supabase...");
    let updatedCount = 0;
    
    for (const dbCar of dbCars) {
        // Strip out brand name if it's already included (e.g. "BMW BMW i4")
        const cleanDbName = dbCar.name.replace(dbCar.brand, "").trim().toLowerCase();
        const brand = dbCar.brand.toLowerCase();

        // Find the best match from the scraped array
        const match = scrapedCars.find(sc => {
            const scrapeTitle = sc.title.toLowerCase();
            return scrapeTitle.includes(cleanDbName) && scrapeTitle.includes(brand);
        });
        
        if (match && match.battery && match.range) {
            console.log(`   [MATCH] ${dbCar.name} => ${match.battery} | ${match.range}`);
            await supabase.from('cars').update({
                battery: match.battery,
                range_km: match.range
            }).eq('id', dbCar.id);
            updatedCount++;
        }
    }
    
    console.log(`\n🎉 Successfully synced ${updatedCount} cars in Supabase with verified real-world stats!`);
})();
