/**
 * Open EV Data importer
 *
 * Downloads the open-ev-data JSON from the chargeprice/open-ev-data GitHub
 * repo and upserts EV specs into the `ev_specs` table.
 *
 * Repo: https://github.com/chargeprice/open-ev-data
 * The main data file: data/ev-data.json
 *
 * Run:  npx tsx scripts/import/openev-data.ts
 */

import {
  loadEnv,
  fetchJson,
  batchUpsert,
  ProgressLogger,
} from "./utils.js";

// ---------------------------------------------------------------------------
// Types (matching the open-ev-data JSON schema)
// ---------------------------------------------------------------------------

interface EvDataEntry {
  id: string;
  brand: string;
  type?: string; // model name (old format)
  model?: string; // model name (new format)
  brand_id?: string;
  type_id?: string;
  variant?: string;
  release_year?: number;
  usable_battery_size?: number; // kWh
  battery_capacity?: number; // kWh (gross)
  ac_charger?: {
    usable_phases?: number;
    ports?: string[];
    max_power?: number; // kW
    power_per_charging_point?: {
      [key: string]: number;
    };
  };
  dc_charger?: {
    ports?: string[];
    max_power?: number; // kW
    charging_curve?: Array<{
      percentage: number;
      power: number;
    }>;
    is_default_charging_curve?: boolean;
  };
  energy_consumption?: {
    average_consumption?: number; // kWh/100km
  };
  drivetrain?: string;
  range?: number; // WLTP km
  // Additional fields the repo sometimes includes
  performance?: {
    acceleration_0_100?: number;
    top_speed?: number;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    wheelbase?: number;
    weight?: number;
    cargo_volume?: number;
    tow_weight_braked?: number;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function n(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

function arr(val: unknown): string | null {
  if (!Array.isArray(val) || val.length === 0) return null;
  return val.join(", ");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function run(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   Open EV Data Import                       ║");
  console.log("╚══════════════════════════════════════════════╝");

  await loadEnv();

  // 1. Fetch the JSON data
  console.log("\nDownloading open-ev-data from GitHub…");
  // Use the KilowattApp fork which has 1300+ EVs (the original chargeprice repo only has 6)
  const response = await fetchJson<{ data: EvDataEntry[] } | EvDataEntry[]>(
    "https://raw.githubusercontent.com/KilowattApp/open-ev-data/master/data/ev-data.json"
  );
  // The KilowattApp fork returns { meta, brands, data } — vehicles are in `data`
  const data: EvDataEntry[] = Array.isArray(response) ? response : response.data;
  console.log(`  Fetched ${data.length} EV entries`);

  // 2. Map to our ev_specs schema
  const rows: Record<string, unknown>[] = [];
  const progress = new ProgressLogger("open-ev-data", data.length);

  for (const ev of data) {
    const make = (ev.brand ?? "").trim();
    const model = (ev.model ?? ev.type ?? "").trim();

    if (!make || !model) {
      progress.tick();
      continue;
    }

    rows.push({
      unique_key: `openev-${ev.id}`,
      openev_id: ev.id,
      make: make,
      model: model,
      variant: ev.variant?.trim() || null,
      release_year: n(ev.release_year),
      battery_capacity_kwh: n(ev.battery_capacity ?? (ev as any).battery_size),
      usable_battery_kwh: n(ev.usable_battery_size),
      range_wltp_km: n(ev.range ?? (ev as any).range),
      avg_consumption_kwh_100km: n(ev.energy_consumption?.average_consumption ?? (ev as any).consumption),
      drivetrain: ev.drivetrain?.trim() || null,
      // AC charging
      ac_max_power_kw: n(ev.ac_charger?.max_power),
      ac_ports: arr(ev.ac_charger?.ports),
      ac_usable_phases: n(ev.ac_charger?.usable_phases),
      // DC charging
      dc_max_power_kw: n(ev.dc_charger?.max_power),
      dc_ports: arr(ev.dc_charger?.ports),
      dc_charging_curve: ev.dc_charger?.charging_curve ?? null,
      dc_is_default_curve: ev.dc_charger?.is_default_charging_curve ?? null,
      // Performance (if available)
      acceleration_0_100: n(ev.performance?.acceleration_0_100),
      top_speed_km: n(ev.performance?.top_speed),
      // Dimensions (if available)
      length_mm: n(ev.dimensions?.length),
      width_mm: n(ev.dimensions?.width),
      height_mm: n(ev.dimensions?.height),
      wheelbase_mm: n(ev.dimensions?.wheelbase),
      weight_kg: n(ev.dimensions?.weight),
      cargo_volume_l: n(ev.dimensions?.cargo_volume),
      tow_weight_braked_kg: n(ev.dimensions?.tow_weight_braked),
      source: "open_ev_data",
    });

    progress.tick(`${make} ${model}`);
  }

  progress.done();

  // 3. Upsert
  console.log(`\nUpserting ${rows.length} EV specs…`);
  const count = await batchUpsert({
    table: "ev_specs",
    rows,
    onConflict: "unique_key",
    batchSize: 500,
  });

  console.log(`\n--- Open EV Data import complete ---`);
  console.log(`  EVs upserted: ${count}`);
}

// Allow direct execution
if (
  process.argv[1]?.endsWith("openev-data.ts") ||
  process.argv[1]?.endsWith("openev-data.js")
) {
  run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
