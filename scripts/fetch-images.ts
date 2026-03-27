import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { cars } from "../app/lib/data";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Missing env");
const supabase = createClient(supabaseUrl, supabaseKey);

async function getWikiImage(query: string): Promise<string | null> {
  try {
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`);
    const searchData = await searchRes.json();
    if (!searchData.query?.search?.length) return null;
    
    const title = searchData.query.search[0].title;
    
    const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`);
    const imgData = await imgRes.json();
    
    const pages = imgData.query?.pages;
    if (!pages) return null;
    
    const pageId = Object.keys(pages)[0];
    if (pages[pageId]?.original?.source) {
       return pages[pageId].original.source;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  let fileContent = fs.readFileSync("app/lib/data.ts", "utf8");
  let updatedCount = 0;

  for (const car of cars) {
    if (car.image.includes("unsplash.com")) {
      let query = car.name.includes(car.brand) ? car.name : `${car.brand} ${car.name}`;
      
      if (query.includes("GWM Ora 03")) query = "Ora Good Cat";
      if (query.includes("NIO ES8 (EL8)")) query = "NIO ES8";
      if (query.includes("Zeekr Zeekr")) query = car.name.replace("Zeekr ", "");
      if (query.includes("Porsche Taycan Turbo GT")) query = "Porsche Taycan";
      
      const newImg = await getWikiImage(query);
      if (newImg) {
        console.log(`✅ [${car.id}] ${query} -> ${newImg}`);
        fileContent = fileContent.replace(car.image, newImg);
        await supabase.from("cars").update({ image: newImg }).eq("id", car.id);
        updatedCount++;
      } else {
        console.log(`❌ [${car.id}] No image found for '${query}'`);
      }
      
      // small delay to respect wiki limits
      await new Promise(r => setTimeout(r, 400));
    }
  }

  fs.writeFileSync("app/lib/data.ts", fileContent);
  console.log(`Finished updating ${updatedCount} cars.`);
}

run();
