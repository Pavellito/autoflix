/**
 * NHTSA Safety Ratings importer
 *
 * Fetches vehicle safety ratings from the NHTSA 5-Star Safety Ratings API
 * and upserts them into the `safety_ratings` table.
 *
 * API: https://api.nhtsa.gov/SafetyRatings/
 * No API key required.
 *
 * Run:  npx tsx scripts/import/nhtsa-safety.ts
 */

import {
  loadEnv,
  fetchJson,
  batchUpsert,
  RateLimiter,
  ProgressLogger,
  retry,
  toInt,
} from "./utils.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SafetyYear {
  ModelYear: number;
}

interface SafetyMake {
  Make: string;
}

interface SafetyModel {
  Model: string;
}

interface SafetyVehicle {
  VehicleId: number;
  VehicleDescription: string;
}

interface SafetyRating {
  VehicleId: number;
  OverallRating: string;
  OverallFrontCrashRating: string;
  FrontCrashDriversideRating: string;
  FrontCrashPassengersideRating: string;
  OverallSideCrashRating: string;
  SideCrashDriversideRating: string;
  SideCrashPassengersideRating: string;
  RolloverRating: string;
  RolloverRating2: string;
  RolloverPossibility: number;
  RolloverPossibility2: number;
  SideBarrierRating: string;
  NHTSAElectronicStabilityControl: string;
  NHTSAForwardCollisionWarning: string;
  NHTSALaneDepartureWarning: string;
  ComplaintsCount: number;
  RecallsCount: number;
  InvestigationCount: number;
  ModelYear: number;
  Make: string;
  Model: string;
  VehicleDescription: string;
  VehiclePicture: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE = "https://api.nhtsa.gov/SafetyRatings";
const limiter = new RateLimiter(200); // 5 req/s

// Focus on recent model years
const MIN_YEAR = 2010;
const MAX_YEAR = 2026;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function safetyGet<T>(path: string): Promise<T[]> {
  await limiter.wait();
  const url = `${BASE}/${path}`;
  const data = await retry(() => fetchJson<{ Results: T[] }>(url), {
    label: path,
  });
  return data.Results ?? [];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function run(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   NHTSA Safety Ratings Import               ║");
  console.log("╚══════════════════════════════════════════════╝");

  await loadEnv();

  // 1. Get model years
  console.log("\nFetching available model years…");
  const years = await safetyGet<SafetyYear>("");
  const filteredYears = years
    .map((y) => y.ModelYear)
    .filter((y) => y >= MIN_YEAR && y <= MAX_YEAR)
    .sort((a, b) => b - a);
  console.log(`  Years: ${filteredYears.join(", ")}`);

  const allRatings: Record<string, unknown>[] = [];

  for (const year of filteredYears) {
    // 2. Get makes for this year
    const makes = await safetyGet<SafetyMake>(`modelyear/${year}`);
    console.log(`\n  ${year}: ${makes.length} makes`);

    for (const makeObj of makes) {
      const make = makeObj.Make;

      // 3. Get models for this year/make
      let models: SafetyModel[];
      try {
        models = await safetyGet<SafetyModel>(
          `modelyear/${year}/make/${encodeURIComponent(make)}`
        );
      } catch {
        continue;
      }

      for (const modelObj of models) {
        const model = modelObj.Model;

        // 4. Get vehicle IDs for this year/make/model
        let vehicles: SafetyVehicle[];
        try {
          vehicles = await safetyGet<SafetyVehicle>(
            `modelyear/${year}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}`
          );
        } catch {
          continue;
        }

        // 5. Get ratings for each vehicle variant
        for (const vehicle of vehicles) {
          let ratings: SafetyRating[];
          try {
            ratings = await safetyGet<SafetyRating>(
              `VehicleId/${vehicle.VehicleId}`
            );
          } catch {
            continue;
          }

          for (const r of ratings) {
            allRatings.push({
              nhtsa_vehicle_id: vehicle.VehicleId,
              year,
              make,
              model,
              vehicle_description: r.VehicleDescription || vehicle.VehicleDescription || null,
              overall_rating: r.OverallRating || null,
              front_crash_rating: r.OverallFrontCrashRating || null,
              front_crash_driver_rating: r.FrontCrashDriversideRating || null,
              front_crash_passenger_rating: r.FrontCrashPassengersideRating || null,
              side_crash_rating: r.OverallSideCrashRating || null,
              side_crash_driver_rating: r.SideCrashDriversideRating || null,
              side_crash_passenger_rating: r.SideCrashPassengersideRating || null,
              rollover_rating: r.RolloverRating || null,
              rollover_rating2: r.RolloverRating2 || null,
              rollover_possibility: r.RolloverPossibility ?? null,
              rollover_possibility2: r.RolloverPossibility2 ?? null,
              side_barrier_rating: r.SideBarrierRating || null,
              electronic_stability_control: r.NHTSAElectronicStabilityControl || null,
              forward_collision_warning: r.NHTSAForwardCollisionWarning || null,
              lane_departure_warning: r.NHTSALaneDepartureWarning || null,
              complaints_count: r.ComplaintsCount ?? null,
              recalls_count: r.RecallsCount ?? null,
              investigation_count: r.InvestigationCount ?? null,
              vehicle_picture: r.VehiclePicture || null,
              unique_key: `nhtsa-safety-${vehicle.VehicleId}`,
            });
          }
        }
      }

      // Periodic progress
      if (allRatings.length > 0 && allRatings.length % 500 === 0) {
        console.log(`    … ${allRatings.length} ratings collected so far`);
      }
    }

    console.log(`  ${year} done – ${allRatings.length} total ratings so far`);
  }

  // 6. Upsert all ratings
  console.log(`\nUpserting ${allRatings.length} safety ratings…`);
  const count = await batchUpsert({
    table: "safety_ratings",
    rows: allRatings,
    onConflict: "unique_key",
    batchSize: 500,
  });

  console.log(`\n--- NHTSA Safety Ratings import complete ---`);
  console.log(`  Ratings upserted: ${count}`);
}

// Allow direct execution
if (
  process.argv[1]?.endsWith("nhtsa-safety.ts") ||
  process.argv[1]?.endsWith("nhtsa-safety.js")
) {
  run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
