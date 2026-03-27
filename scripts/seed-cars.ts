import { createClient } from "@supabase/supabase-js";

// ─── Configuration ───────────────────────────────────────
// Uses the service role key to bypass RLS for writes
const supabaseUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || !supabaseServiceKey) {
  console.error("❌ Missing env vars. Set NEXT_PUBLIC_SUPABASE_PROJECT_ID and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─── Import existing hardcoded car data ──────────────────
// We inline-import to avoid TypeScript path alias issues in scripts
import { cars } from "../app/lib/data";

async function seed() {
  console.log(`🌱 Seeding ${cars.length} cars into Supabase...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const car of cars) {
    try {
      // 1. Insert core car data
      const { error: carError } = await supabase.from("cars").upsert({
        id: car.id,
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
        related_video_ids: car.relatedVideoIds,
      }, { onConflict: "id" });

      if (carError) throw carError;

      // 2. Insert per-region prices
      if (car.prices) {
        const priceRows = Object.entries(car.prices).map(([region, price]) => ({
          car_id: car.id,
          region,
          price,
        }));

        const { error: priceError } = await supabase
          .from("car_prices")
          .upsert(priceRows, { onConflict: "car_id,region" });

        if (priceError) throw priceError;
      }

      // 3. Insert per-region advice
      if (car.regionalAdvice) {
        const adviceRows = Object.entries(car.regionalAdvice).map(([region, advice]) => ({
          car_id: car.id,
          region,
          advice,
        }));

        const { error: adviceError } = await supabase
          .from("car_regional_advice")
          .upsert(adviceRows, { onConflict: "car_id,region" });

        if (adviceError) throw adviceError;
      }

      successCount++;
      console.log(`  ✅ ${car.brand} ${car.name} (${car.id})`);
    } catch (err) {
      errorCount++;
      console.error(`  ❌ ${car.brand} ${car.name} (${car.id}):`, err);
    }
  }

  console.log(`\n🏁 Seeding complete: ${successCount} success, ${errorCount} errors`);

  // Verify counts
  const { count: carCount } = await supabase.from("cars").select("*", { count: "exact", head: true });
  const { count: priceCount } = await supabase.from("car_prices").select("*", { count: "exact", head: true });
  const { count: adviceCount } = await supabase.from("car_regional_advice").select("*", { count: "exact", head: true });

  console.log(`\n📊 Database stats:`);
  console.log(`   Cars:           ${carCount}`);
  console.log(`   Price entries:  ${priceCount}`);
  console.log(`   Advice entries: ${adviceCount}`);
}

seed().catch(console.error);
