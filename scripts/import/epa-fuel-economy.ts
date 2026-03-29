/**
 * EPA Fuel Economy data importer
 *
 * Downloads the full EPA vehicles CSV from fueleconomy.gov and upserts into
 * the `fuel_economy` table. Records are matched to `vehicle_specs` by
 * year/make/model/trim for cross-referencing.
 *
 * Data source: https://www.fueleconomy.gov/feg/epadata/vehicles.csv
 * No API key required.
 *
 * Run:  npx tsx scripts/import/epa-fuel-economy.ts
 */

import {
  loadEnv,
  fetchText,
  parseCsv,
  batchUpsert,
  ProgressLogger,
  toNumber,
  toInt,
} from "./utils.js";

// ---------------------------------------------------------------------------
// Field mapping – EPA CSV column names to our schema
// ---------------------------------------------------------------------------

function mapRow(
  row: Record<string, string>
): Record<string, unknown> | null {
  const year = toInt(row["year"]);
  const make = (row["make"] ?? "").trim();
  const model = (row["model"] ?? "").trim();

  if (!year || !make || !model) return null;

  return {
    epa_id: toInt(row["id"]),
    year,
    make,
    model,
    trim: (row["trany"] ?? "").trim() || null,
    vehicle_class: (row["VClass"] ?? "").trim() || null,
    fuel_type: (row["fuelType"] ?? "").trim() || null,
    fuel_type1: (row["fuelType1"] ?? "").trim() || null,
    fuel_type2: (row["fuelType2"] ?? "").trim() || null,
    city_mpg: toNumber(row["city08"]),
    highway_mpg: toNumber(row["highway08"]),
    combined_mpg: toNumber(row["comb08"]),
    city_mpg_fuel2: toNumber(row["city08U"]),
    highway_mpg_fuel2: toNumber(row["highway08U"]),
    combined_mpg_fuel2: toNumber(row["comb08U"]),
    co2_tailpipe_gpm: toNumber(row["co2TailpipeGpm"]),
    co2_tailpipe_gpm_fuel2: toNumber(row["co2TailpipeAGpm"]),
    cylinders: toInt(row["cylinders"]),
    displacement: toNumber(row["displ"]),
    drive: (row["drive"] ?? "").trim() || null,
    transmission: (row["trany"] ?? "").trim() || null,
    turbocharger: (row["tCharger"] ?? "").trim() || null,
    supercharger: (row["sCharger"] ?? "").trim() || null,
    ghg_score: toInt(row["ghgScore"]),
    ghg_score_fuel2: toInt(row["ghgScoreA"]),
    smartway_score: (row["smartwayScore"] ?? "").trim() || null,
    phev_blended: row["phevBlended"] === "true" ? true : false,
    phev_city: toNumber(row["phevCity"]),
    phev_highway: toNumber(row["phevHwy"]),
    phev_combined: toNumber(row["phevComb"]),
    annual_fuel_cost: toNumber(row["fuelCost08"]),
    annual_fuel_cost_fuel2: toNumber(row["fuelCostA08"]),
    epa_range: toNumber(row["range"]),
    epa_range_fuel2: toNumber(row["rangeA"]),
    barrel_per_year: toNumber(row["barrels08"]),
    start_stop: (row["startStop"] ?? "").trim() || null,
    atv_type: (row["atvType"] ?? "").trim() || null,
    ev_motor: (row["evMotor"] ?? "").trim() || null,
    charge_240v: toNumber(row["charge240"]),
    charge_time_240v: toNumber(row["charge240b"]),
    // Unique key for upsert
    unique_key: `epa-${row["id"] ?? `${year}-${make}-${model}-${(row["trany"] ?? "").trim()}`}`,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function run(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   EPA Fuel Economy Import                   ║");
  console.log("╚══════════════════════════════════════════════╝");

  await loadEnv();

  // 1. Download the CSV
  console.log("\nDownloading EPA vehicles.csv (this may take a moment)…");
  const csvText = await fetchText(
    "https://www.fueleconomy.gov/feg/epadata/vehicles.csv"
  );
  console.log(`  Downloaded ${(csvText.length / 1024 / 1024).toFixed(1)} MB`);

  // 2. Parse
  console.log("Parsing CSV…");
  const rawRows = parseCsv(csvText);
  console.log(`  Parsed ${rawRows.length} rows`);

  // 3. Map to our schema
  const mapped: Record<string, unknown>[] = [];
  let skipped = 0;

  for (const row of rawRows) {
    const m = mapRow(row);
    if (m) {
      mapped.push(m);
    } else {
      skipped++;
    }
  }

  console.log(`  Mapped ${mapped.length} rows, skipped ${skipped}`);

  // 4. Upsert into fuel_economy table
  console.log("Upserting into fuel_economy table…");
  const count = await batchUpsert({
    table: "fuel_economy",
    rows: mapped,
    onConflict: "unique_key",
    batchSize: 1000,
  });

  console.log(`\n--- EPA Fuel Economy import complete ---`);
  console.log(`  Rows upserted: ${count}`);
  console.log(`  Year range: ${mapped.reduce((min, r) => Math.min(min, r.year as number), 9999)}–${mapped.reduce((max, r) => Math.max(max, r.year as number), 0)}`);
}

// Allow direct execution
if (
  process.argv[1]?.endsWith("epa-fuel-economy.ts") ||
  process.argv[1]?.endsWith("epa-fuel-economy.js")
) {
  run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
