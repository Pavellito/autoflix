import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ─── CLI Bulk Import Script ─────────────────────────────
// Usage: npx tsx scripts/import-cars.ts --file ./data/new-cars.json
//
// JSON format expected:
// [
//   {
//     "name": "Tesla Model S",
//     "brand": "Tesla",
//     "type": "EV",
//     "image": "https://...",
//     "range": "652 km",
//     "battery": "100 kWh",
//     "price": "$79,990",
//     "prices": { "us": "$79,990", "il": "₪450,000" },
//     "regionalAdvice": { "us": "...", "il": "..." }
//   }
// ]

const args = process.argv.slice(2);
const fileIdx = args.indexOf("--file");

if (fileIdx === -1 || !args[fileIdx + 1]) {
  console.error("Usage: npx tsx scripts/import-cars.ts --file <path-to-json>");
  process.exit(1);
}

const filePath = resolve(args[fileIdx + 1]);

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_PROJECT_ID or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ImportCar {
  id?: string;
  name: string;
  brand: string;
  type: "EV" | "Hybrid" | "ICE";
  image: string;
  range?: string;
  battery?: string;
  price?: string;
  realWorldRange?: { city: string; highway: string; winter: string };
  chargingCurve?: { maxSpeed: string; tenToEighty: string };
  depreciation?: { yr3: string; resaleValue: string };
  relatedVideoIds?: string[];
  prices?: Record<string, string>;
  regionalAdvice?: Record<string, string>;
}

async function importCars() {
  console.log(`📁 Reading file: ${filePath}`);

  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch {
    console.error(`❌ Could not read file: ${filePath}`);
    process.exit(1);
  }

  let cars: ImportCar[];
  try {
    cars = JSON.parse(raw);
    if (!Array.isArray(cars)) {
      console.error("❌ JSON must be an array of car objects");
      process.exit(1);
    }
  } catch {
    console.error("❌ Invalid JSON format");
    process.exit(1);
  }

  console.log(`🚗 Found ${cars.length} cars to import\n`);

  let success = 0;
  let errors = 0;

  for (const car of cars) {
    if (!car.name || !car.brand || !car.type || !car.image) {
      console.error(`  ⚠️  Skipping "${car.name || "unknown"}": missing required fields`);
      errors++;
      continue;
    }

    const id = car.id || `car-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    try {
      const { error: carError } = await supabase.from("cars").upsert({
        id,
        name: car.name,
        brand: car.brand,
        type: car.type,
        range_km: car.range ?? null,
        battery: car.battery ?? null,
        price: car.price ?? null,
        image: car.image,
        real_world_range: car.realWorldRange ?? null,
        charging_curve: car.chargingCurve ?? null,
        depreciation: car.depreciation ?? null,
        related_video_ids: car.relatedVideoIds ?? [],
      }, { onConflict: "id" });

      if (carError) throw carError;

      if (car.prices) {
        const priceRows = Object.entries(car.prices).map(([region, price]) => ({
          car_id: id,
          region,
          price,
        }));
        await supabase.from("car_prices").upsert(priceRows, { onConflict: "car_id,region" });
      }

      if (car.regionalAdvice) {
        const adviceRows = Object.entries(car.regionalAdvice).map(([region, advice]) => ({
          car_id: id,
          region,
          advice,
        }));
        await supabase.from("car_regional_advice").upsert(adviceRows, { onConflict: "car_id,region" });
      }

      console.log(`  ✅ ${car.brand} ${car.name} → ${id}`);
      success++;
    } catch (err) {
      console.error(`  ❌ ${car.brand} ${car.name}:`, err);
      errors++;
    }
  }

  console.log(`\n🏁 Import complete: ${success} success, ${errors} errors`);
}

importCars().catch(console.error);
