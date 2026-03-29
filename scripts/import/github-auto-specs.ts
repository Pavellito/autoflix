/**
 * GitHub automobile-models-and-specs importer
 *
 * Reads the pre-downloaded CSV files from /tmp/autoflix-specs/ and upserts
 * into vehicle_specs, engines, and dimensions tables.
 *
 * Data: 124 brands, 7,207 models, 30,066 engine variants with full specs
 * Source: https://github.com/ilyasozkurt/automobile-models-and-specs
 *
 * Run:  npx tsx scripts/import/github-auto-specs.ts
 */

import {
  loadEnv,
  parseCsv,
  batchUpsert,
  ProgressLogger,
  fetchText,
} from "./utils.js";
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";

// ---------------------------------------------------------------------------
// Spec JSON parser — extracts structured data from the nested "specs" field
// ---------------------------------------------------------------------------

function parseSpecsJson(specsStr: string): Record<string, Record<string, string>> {
  try {
    return JSON.parse(specsStr);
  } catch {
    return {};
  }
}

function extractNum(val: string | undefined, unit?: string): number | null {
  if (!val) return null;
  // Extract first number from strings like "3506 Cm3" or "257.4 Kw @ 6500 Rpm"
  const match = val.match(/([\d,.]+)/);
  if (!match) return null;
  const n = parseFloat(match[1].replace(",", ""));
  return Number.isFinite(n) ? n : null;
}

function extractMm(val: string | undefined): number | null {
  if (!val) return null;
  // Look for mm value in strings like "183.5 In (4661 Mm)"
  const mmMatch = val.match(/\((\d+)\s*mm\)/i);
  if (mmMatch) return parseFloat(mmMatch[1]);
  // Try just the number
  return extractNum(val);
}

function extractKg(val: string | undefined): number | null {
  if (!val) return null;
  const kgMatch = val.match(/\((\d+)\s*kg\)/i);
  if (kgMatch) return parseFloat(kgMatch[1]);
  return null;
}

function extractLiters(val: string | undefined): number | null {
  if (!val) return null;
  const lMatch = val.match(/\(([\d.]+)\s*l\)/i);
  if (lMatch) return parseFloat(lMatch[1]);
  return null;
}

function extractHp(val: string | undefined): number | null {
  if (!val) return null;
  const hpMatch = val.match(/([\d.]+)\s*hp/i);
  if (hpMatch) return parseFloat(hpMatch[1]);
  return extractNum(val);
}

function extractHpRpm(val: string | undefined): number | null {
  if (!val) return null;
  const match = val.match(/hp\s*@\s*([\d,]+)\s*rpm/i);
  if (match) return parseFloat(match[1].replace(",", ""));
  return null;
}

function extractNm(val: string | undefined): number | null {
  if (!val) return null;
  const nmMatch = val.match(/([\d.]+)\s*nm/i);
  if (nmMatch) return parseFloat(nmMatch[1]);
  return null;
}

function extractNmRpm(val: string | undefined): number | null {
  if (!val) return null;
  const match = val.match(/nm\s*@\s*([\d,]+)\s*rpm/i);
  if (match) return parseFloat(match[1].replace(",", ""));
  return null;
}

function extractCc(val: string | undefined): number | null {
  if (!val) return null;
  const ccMatch = val.match(/([\d.]+)\s*cm3/i);
  if (ccMatch) return parseFloat(ccMatch[1]);
  return extractNum(val);
}

function extractAccel(val: string | undefined): number | null {
  if (!val) return null;
  const match = val.match(/([\d.]+)\s*s/i);
  if (match) return parseFloat(match[1]);
  return null;
}

function extractKmh(val: string | undefined): number | null {
  if (!val) return null;
  const match = val.match(/\(([\d.]+)\s*km\/h\)/i);
  if (match) return parseFloat(match[1]);
  // Try direct number for km/h
  const match2 = val.match(/([\d.]+)\s*km\/h/i);
  if (match2) return parseFloat(match2[1]);
  return extractNum(val);
}

function extractCd(val: string | undefined): number | null {
  if (!val) return null;
  const match = val.match(/([\d.]+)/);
  if (match) {
    const n = parseFloat(match[1]);
    return n < 1 ? n : null; // Cd is always < 1
  }
  return null;
}

function extractConsumption(val: string | undefined): number | null {
  if (!val) return null;
  // Look for L/100km
  const match = val.match(/([\d.]+)\s*l\/100km/i);
  if (match) return parseFloat(match[1]);
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function run(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   GitHub Auto Specs Import (Global)         ║");
  console.log("╚══════════════════════════════════════════════╝");

  await loadEnv();

  // Check if files are already downloaded
  // Support both Windows and Unix paths
  const os = await import("os");
  const path = await import("path");
  const csvDir = path.join(os.tmpdir(), "autoflix-specs");
  const brandsPath = `${csvDir}/brands.csv`;
  const autosPath = `${csvDir}/automobiles.csv`;
  const enginesPath = `${csvDir}/engines.csv`;

  if (!existsSync(enginesPath)) {
    console.log("\nCSV files not found. Downloading zip from GitHub...");
    const { mkdirSync } = await import("fs");
    mkdirSync(csvDir, { recursive: true });
    execSync(
      `curl -L -o ${csvDir}/automobiles.csv.zip "https://github.com/ilyasozkurt/automobile-models-and-specs/raw/master/automobiles.csv.zip"`,
      { stdio: "inherit", timeout: 300000 }
    );
    try {
      execSync(`unzip -o "${csvDir}/automobiles.csv.zip" -d "${csvDir}"`, { stdio: "pipe" });
    } catch {
      execSync(
        `powershell -Command "Expand-Archive -Path '${csvDir}/automobiles.csv.zip' -DestinationPath '${csvDir}' -Force"`,
        { stdio: "pipe" }
      );
    }
  }

  // 1. Read brands
  console.log("\nReading brands.csv…");
  const brandsText = readFileSync(brandsPath, "utf-8");
  const brandsRows = parseCsv(brandsText);
  console.log(`  ${brandsRows.length} brands`);

  // Build brand lookup by BOTH id and url_hash (automobiles uses url_hash as brand_id)
  const brandMap = new Map<string, string>();
  for (const b of brandsRows) {
    brandMap.set(b.id, b.name?.trim() ?? "");
    if (b.url_hash) brandMap.set(b.url_hash, b.name?.trim() ?? "");
  }

  // 2. Read automobiles (models)
  console.log("Reading automobiles.csv…");
  const autosText = readFileSync(autosPath, "utf-8");
  const autosRows = parseCsv(autosText);
  console.log(`  ${autosRows.length} models`);

  const autoMap = new Map<string, { brand: string; name: string }>();
  for (const a of autosRows) {
    // brand_id in CSV is actually the url_hash, also try "url" column which has int id
    const brand = brandMap.get(a.brand_id) ?? brandMap.get(a.url) ?? "";
    // "image" column actually has the model name (CSV headers are misaligned)
    const name = a.image?.trim() ?? a.engine_name?.trim() ?? a.name?.trim() ?? "";
    autoMap.set(a.id, { brand, name });
  }

  // Debug: check how many brands were resolved
  let resolvedCount = 0;
  for (const [, v] of autoMap) { if (v.brand) resolvedCount++; }
  console.log(`  Resolved brands for ${resolvedCount}/${autoMap.size} models`);

  // 3. Read engines (the detailed specs)
  console.log("Reading engines.csv…");
  const enginesText = readFileSync(enginesPath, "utf-8");
  const enginesRows = parseCsv(enginesText);
  console.log(`  ${enginesRows.length} engine variants`);

  // 4. Parse and map
  console.log("\nParsing engine specs…");
  const specRows: Record<string, unknown>[] = [];
  const engineDataRows: Record<string, unknown>[] = [];
  const dimRows: Record<string, unknown>[] = [];

  const progress = new ProgressLogger("auto-specs", enginesRows.length);

  for (const eng of enginesRows) {
    const autoId = eng.automobile_id;
    const auto = autoMap.get(autoId);
    if (!auto || !auto.brand) {
      progress.tick();
      continue;
    }

    const specs = parseSpecsJson(eng.specs ?? "{}");
    const engineSpecs = specs["Engine Specs"] ?? {};
    const perfSpecs = specs["Performance Specs"] ?? {};
    const transSpecs = specs["Transmission Specs"] ?? {};
    const dimSpecs = specs["Dimensions"] ?? {};
    const weightSpecs = specs["Weight Specs"] ?? {};
    const tireSpecs = specs["Tires Specs"] ?? {};
    const fuelEcon = specs["Fuel Economy (Nedc)"] ?? specs["Fuel Economy (Wltp)"] ?? {};

    const uniqueKey = `gh-auto-${eng.id}`;
    const engineName = eng.name?.trim() ?? "";

    // Extract year range from model name — e.g., "AC Aceca 1998-2000"
    const yearMatch = auto.name.match(/(\d{4})\s*-\s*(\d{4})/);
    const yearSingle = auto.name.match(/(\d{4})/);
    const yearBegin = yearMatch ? parseInt(yearMatch[1]) : yearSingle ? parseInt(yearSingle[1]) : null;
    const yearEnd = yearMatch ? parseInt(yearMatch[2]) : null;

    specRows.push({
      unique_key: uniqueKey,
      make_name: auto.brand,
      model_name: auto.name.replace(/\s*\d{4}\s*-?\s*\d{0,4}\s*photos.*$/i, "").trim(),
      modification_name: engineName,
      year_begin: yearBegin,
      year_end: yearEnd,
      year: yearBegin,
      drive_type: transSpecs["Drive Type:"]?.trim() ?? null,
      fuel_type: engineSpecs["Fuel:"]?.trim() ?? null,
      fuel_consumption_city: extractConsumption(fuelEcon["City:"]),
      fuel_consumption_highway: extractConsumption(fuelEcon["Highway:"]),
      fuel_consumption_combined: extractConsumption(fuelEcon["Combined:"]),
      fuel_tank_capacity: extractLiters(engineSpecs["Fuel Capacity:"]),
      acceleration_0_100: extractAccel(perfSpecs["Acceleration 0-62 Mph (0-100 Kph):"]),
      max_speed_km: extractKmh(perfSpecs["Top Speed:"]),
      source: "github_auto_specs",
    });

    // Engine data
    engineDataRows.push({
      unique_key: `gh-engine-${eng.id}`,
      vehicle_spec_key: uniqueKey,
      engine_type: engineSpecs["Cylinders:"]?.trim() ?? null,
      displacement_cc: extractCc(engineSpecs["Displacement:"]),
      horsepower: extractHp(engineSpecs["Power:"]),
      horsepower_rpm: extractHpRpm(engineSpecs["Power:"]),
      torque_nm: extractNm(engineSpecs["Torque:"]),
      torque_rpm: extractNmRpm(engineSpecs["Torque:"]),
      fuel_system: engineSpecs["Fuel System:"]?.trim() ?? null,
      transmission_type: transSpecs["Gearbox:"]?.trim() ?? null,
      source: "github_auto_specs",
    });

    // Dimensions
    const length = extractMm(dimSpecs["Length:"]);
    const width = extractMm(dimSpecs["Width:"]);
    const height = extractMm(dimSpecs["Height:"]);
    const weight = extractKg(weightSpecs["Unladen Weight:"] ?? weightSpecs["Curb Weight:"]);

    if (length || width || height || weight) {
      dimRows.push({
        unique_key: `gh-dim-${eng.id}`,
        vehicle_spec_key: uniqueKey,
        length_mm: length,
        width_mm: width,
        height_mm: height,
        wheelbase_mm: extractMm(dimSpecs["Wheelbase:"]),
        curb_weight_kg: weight,
        cargo_volume_l: extractLiters(dimSpecs["Cargo Volume:"]),
        drag_coefficient: extractCd(dimSpecs["Aerodynamics (Cd):"]),
        front_tire: tireSpecs["Tire Size:"]?.trim() ?? tireSpecs["Front:"]?.trim() ?? null,
        rear_tire: tireSpecs["Rear:"]?.trim() ?? null,
        source: "github_auto_specs",
      });
    }

    progress.tick(`${auto.brand} ${engineName}`);
  }

  progress.done();

  // 5. Upsert all tables
  console.log(`\nUpserting ${specRows.length} vehicle_specs…`);
  const specCount = await batchUpsert({
    table: "vehicle_specs",
    rows: specRows,
    onConflict: "unique_key",
    batchSize: 500,
  });
  console.log(`  vehicle_specs: ${specCount}`);

  console.log(`Upserting ${engineDataRows.length} engines…`);
  const engineCount = await batchUpsert({
    table: "engines",
    rows: engineDataRows,
    onConflict: "unique_key",
    batchSize: 500,
  });
  console.log(`  engines: ${engineCount}`);

  console.log(`Upserting ${dimRows.length} dimensions…`);
  const dimCount = await batchUpsert({
    table: "dimensions",
    rows: dimRows,
    onConflict: "unique_key",
    batchSize: 500,
  });
  console.log(`  dimensions: ${dimCount}`);

  console.log(`\n--- GitHub Auto Specs import complete ---`);
  console.log(`  Brands: ${brandMap.size}`);
  console.log(`  Models: ${autoMap.size}`);
  console.log(`  Vehicle specs: ${specCount}`);
  console.log(`  Engines: ${engineCount}`);
  console.log(`  Dimensions: ${dimCount}`);
}

// Allow direct execution
if (
  process.argv[1]?.endsWith("github-auto-specs.ts") ||
  process.argv[1]?.endsWith("github-auto-specs.js")
) {
  run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
