import { NextRequest, NextResponse } from "next/server";
import { fetchCarDetails, getCarImageUrl } from "@/app/lib/car-api";
import { supabase } from "@/app/lib/supabase";

/**
 * GET /api/cars/enrich?make=Tesla&model=Model 3 Long Range AWD&year=2024
 *
 * On-demand car enrichment:
 * 1. Check if car already exists in Supabase (cached)
 * 2. If not, fetch from FuelEconomy.gov
 * 3. Store in Supabase cars table
 * 4. Return enriched car data
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const yearStr = searchParams.get("year");

  if (!make || !model || !yearStr) {
    return NextResponse.json(
      { error: "make, model, and year parameters are required" },
      { status: 400 }
    );
  }

  const year = parseInt(yearStr, 10);
  const carName = `${make} ${model}`;

  // Generate a stable ID for this car
  const carId = `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  try {
    // 1. Check Supabase cache first
    const { data: existing } = await supabase
      .from("cars")
      .select("*")
      .eq("id", carId)
      .single();

    if (existing) {
      // Car already cached — return it
      return NextResponse.json({
        car: existing,
        source: "cache",
      });
    }

    // 2. Fetch from FuelEconomy.gov
    const details = await fetchCarDetails(year, make, model);

    if (!details) {
      return NextResponse.json(
        { error: "Car not found in external database" },
        { status: 404 }
      );
    }

    // 3. Build the car record for Supabase
    const imageUrl = getCarImageUrl(make, details.baseModel || model);

    const rangeText = details.type === "EV" && details.rangeCombined
      ? `${details.rangeCombined} mi (${Math.round(details.rangeCombined * 1.609)} km)`
      : details.mpgCombined
        ? `${details.mpgCombined} MPG`
        : undefined;

    const realWorldRange = details.type === "EV" && details.rangeCity && details.rangeHighway
      ? {
          city: `${Math.round(details.rangeCity)} mi (${Math.round(details.rangeCity * 1.609)} km)`,
          highway: `${Math.round(details.rangeHighway)} mi (${Math.round(details.rangeHighway * 1.609)} km)`,
          winter: details.rangeCity
            ? `~${Math.round(details.rangeCity * 0.7)} mi (${Math.round(details.rangeCity * 0.7 * 1.609)} km)`
            : "N/A",
        }
      : null;

    const chargingCurve = details.type === "EV" && details.chargeTime240v
      ? {
          maxSpeed: details.evMotor || "N/A",
          tenToEighty: `~${Math.round(details.chargeTime240v * 0.7)}h (240V)`,
        }
      : null;

    // Build a price string from annual fuel cost
    const priceInfo = details.fuelCostAnnual
      ? `$${details.fuelCostAnnual}/yr fuel`
      : undefined;

    const externalData = {
      source: "fueleconomy.gov",
      externalId: details.externalId,
      fetchedAt: new Date().toISOString(),
      year: details.year,
      fuelType: details.fuelType,
      drive: details.drive,
      transmission: details.transmission,
      vehicleClass: details.vehicleClass,
      cylinders: details.cylinders,
      displacement: details.displacement,
      mpgCity: details.mpgCity,
      mpgHighway: details.mpgHighway,
      mpgCombined: details.mpgCombined,
      evMotor: details.evMotor,
      batteryKwh: details.batteryKwh,
      rangeCombined: details.rangeCombined,
      rangeCity: details.rangeCity,
      rangeHighway: details.rangeHighway,
      chargeTime240v: details.chargeTime240v,
      co2TailpipeGpm: details.co2TailpipeGpm,
      fuelCostAnnual: details.fuelCostAnnual,
      feScore: details.feScore,
      ghgScore: details.ghgScore,
    };

    const baseRecord = {
      id: carId,
      name: carName,
      brand: make,
      type: details.type,
      range_km: rangeText || null,
      battery: details.batteryKwh ? `${details.batteryKwh} kWh` : null,
      price: priceInfo || null,
      image: imageUrl,
      real_world_range: realWorldRange,
      charging_curve: chargingCurve,
      depreciation: null,
      related_video_ids: [],
    };

    // 4. Upsert into Supabase — try with external_data column, fall back without
    const fullRecord = { ...baseRecord, external_data: externalData };
    const { error: upsertError } = await supabase
      .from("cars")
      .upsert(fullRecord, { onConflict: "id" });

    if (upsertError) {
      // Column might not exist yet — retry without external_data
      console.warn("Upsert with external_data failed, retrying without:", upsertError.message);
      const { error: retryError } = await supabase
        .from("cars")
        .upsert(baseRecord, { onConflict: "id" });
      if (retryError) {
        console.error("Error caching car:", retryError);
      }
    }

    return NextResponse.json({
      car: { ...baseRecord, external_data: externalData },
      source: "api",
    });
  } catch (err) {
    console.error("Enrich API error:", err);
    return NextResponse.json(
      { error: "Failed to enrich car data" },
      { status: 500 }
    );
  }
}
