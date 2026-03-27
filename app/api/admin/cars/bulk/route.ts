import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase admin credentials");
  return createClient(url, key);
}

function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

// ─── POST /api/admin/cars/bulk — Bulk import cars ────────
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();
  const body = await req.json();

  if (!Array.isArray(body.cars)) {
    return NextResponse.json(
      { error: "Expected { cars: [...] } with an array of car objects" },
      { status: 400 }
    );
  }

  const results = { success: 0, errors: 0, details: [] as string[] };

  for (const car of body.cars) {
    try {
      if (!car.name || !car.brand || !car.type || !car.image) {
        results.errors++;
        results.details.push(`Skipped: missing required fields for "${car.name || "unknown"}"`);
        continue;
      }

      const id = car.id || `car-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      // Insert car
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

      // Insert prices
      if (car.prices && typeof car.prices === "object") {
        const priceRows = Object.entries(car.prices).map(([region, price]) => ({
          car_id: id,
          region,
          price: price as string,
        }));

        await supabase
          .from("car_prices")
          .upsert(priceRows, { onConflict: "car_id,region" });
      }

      // Insert advice
      if (car.regionalAdvice && typeof car.regionalAdvice === "object") {
        const adviceRows = Object.entries(car.regionalAdvice).map(([region, advice]) => ({
          car_id: id,
          region,
          advice: advice as string,
        }));

        await supabase
          .from("car_regional_advice")
          .upsert(adviceRows, { onConflict: "car_id,region" });
      }

      results.success++;
    } catch (err) {
      results.errors++;
      results.details.push(`Error importing "${car.name}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json({
    message: `Imported ${results.success} cars, ${results.errors} errors`,
    ...results,
  }, { status: results.errors > 0 ? 207 : 201 });
}
