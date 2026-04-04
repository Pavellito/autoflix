/**
 * Server-side Supabase queries for vehicle data.
 * Used by server components to fetch from the database.
 */

import { supabase } from "./supabase";
import type {
  VehicleSpec,
  Engine,
  Dimensions,
  FuelEconomy,
  SafetyRating,
  EvSpec,
  VehicleCardData,
  VehicleDetailData,
  FilterOptions,
  VehicleSearchParams,
} from "./vehicle-types";

const PAGE_SIZE = 24;

// ---------------------------------------------------------------------------
// Browse: paginated list with filters
// ---------------------------------------------------------------------------

export async function searchVehicles(params: VehicleSearchParams): Promise<{
  vehicles: VehicleCardData[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(params.per_page ?? String(PAGE_SIZE), 10)));
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Base query on vehicle_specs joined with engines
  let query = supabase
    .from("vehicle_specs")
    .select(
      `
      id,
      unique_key,
      year,
      make_name,
      model_name,
      modification_name,
      fuel_type,
      drive_type,
      body_type,
      acceleration_0_100,
      max_speed_km,
      source,
      engines(horsepower, torque_nm)
    `,
      { count: "exact" }
    );

  // Text search: match against make_name or model_name
  if (params.q) {
    const q = params.q.trim();
    query = query.or(
      `make_name.ilike.%${q}%,model_name.ilike.%${q}%,modification_name.ilike.%${q}%`
    );
  }

  // Filter: make
  if (params.make) {
    query = query.ilike("make_name", params.make);
  }

  // Filter: year range
  if (params.year_min) {
    query = query.gte("year", parseInt(params.year_min, 10));
  }
  if (params.year_max) {
    query = query.lte("year", parseInt(params.year_max, 10));
  }

  // Filter: fuel type
  if (params.fuel) {
    query = query.ilike("fuel_type", `%${params.fuel}%`);
  }

  // Filter: drive type
  if (params.drive) {
    query = query.ilike("drive_type", `%${params.drive}%`);
  }

  // Only show records with a make_name (skip empty ones)
  query = query.not("make_name", "is", null).neq("make_name", "");

  // Sorting
  const sort = params.sort ?? "make_name";
  switch (sort) {
    case "year_desc":
      query = query.order("year", { ascending: false, nullsFirst: false });
      break;
    case "year_asc":
      query = query.order("year", { ascending: true, nullsFirst: false });
      break;
    case "hp_desc":
      // We'll sort client-side for joined fields
      query = query.order("make_name", { ascending: true });
      break;
    case "model":
      query = query.order("model_name", { ascending: true });
      break;
    default:
      query = query.order("make_name", { ascending: true }).order("model_name", { ascending: true });
  }

  // Pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("searchVehicles error:", error);
    return { vehicles: [], total: 0, page, totalPages: 0 };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / perPage);

  // Map to VehicleCardData
  const vehicles: VehicleCardData[] = (data ?? []).map((row: any) => {
    const engineArr = row.engines;
    const engine = Array.isArray(engineArr) && engineArr.length > 0 ? engineArr[0] : null;

    return {
      id: row.id,
      unique_key: row.unique_key,
      year: row.year,
      make_name: row.make_name ?? "",
      model_name: row.model_name ?? "",
      modification_name: row.modification_name,
      fuel_type: row.fuel_type,
      drive_type: row.drive_type,
      body_type: row.body_type,
      horsepower: engine?.horsepower ?? null,
      torque_nm: engine?.torque_nm ?? null,
      acceleration_0_100: row.acceleration_0_100,
      max_speed_km: row.max_speed_km,
      combined_mpg: null, // Requires FK linking
      safety_overall: null, // Requires FK linking
      range_wltp_km: null, // Requires FK linking
      source: row.source,
    };
  });

  return { vehicles, total, page, totalPages };
}

// ---------------------------------------------------------------------------
// Detail: single vehicle with all related data
// ---------------------------------------------------------------------------

export async function getVehicleById(id: number): Promise<VehicleDetailData | null> {
  // 1. Get the vehicle spec
  const { data: spec, error: specErr } = await supabase
    .from("vehicle_specs")
    .select("*")
    .eq("id", id)
    .single();

  if (specErr || !spec) return null;

  // 2. Get engine via unique_key
  const { data: engineData } = await supabase
    .from("engines")
    .select("*")
    .eq("vehicle_spec_key", spec.unique_key)
    .limit(1);

  // 3. Get dimensions via unique_key
  const { data: dimData } = await supabase
    .from("dimensions")
    .select("*")
    .eq("vehicle_spec_key", spec.unique_key)
    .limit(1);

  // 4. Match fuel economy by year + make + model (fuzzy since tables are denormalized)
  let fuelData: FuelEconomy[] = [];
  if (spec.make_name && spec.model_name) {
    const { data: feRows } = await supabase
      .from("fuel_economy")
      .select("*")
      .ilike("make", `%${spec.make_name}%`)
      .ilike("model", `%${spec.model_name.split(" ")[0]}%`)
      .order("year", { ascending: false })
      .limit(5);
    fuelData = (feRows ?? []) as FuelEconomy[];
  }

  // 5. Match safety ratings by make + model (fuzzy)
  let safetyData: SafetyRating[] = [];
  if (spec.make_name && spec.model_name) {
    const { data: srRows } = await supabase
      .from("safety_ratings")
      .select("*")
      .ilike("make", `%${spec.make_name}%`)
      .ilike("model", `%${spec.model_name.split(" ")[0]}%`)
      .order("year", { ascending: false })
      .limit(5);
    safetyData = (srRows ?? []) as SafetyRating[];
  }

  // 6. Match EV specs by make + model (fuzzy)
  let evData: EvSpec[] = [];
  if (spec.make_name) {
    const { data: evRows } = await supabase
      .from("ev_specs")
      .select("*")
      .ilike("make", `%${spec.make_name}%`)
      .ilike("model", `%${(spec.model_name ?? "").split(" ")[0]}%`)
      .limit(5);
    evData = (evRows ?? []) as EvSpec[];
  }

  return {
    spec: spec as VehicleSpec,
    engine: (engineData?.[0] as Engine) ?? null,
    dimensions: (dimData?.[0] as Dimensions) ?? null,
    fuelEconomy: fuelData,
    safetyRatings: safetyData,
    evSpecs: evData,
  };
}

// ---------------------------------------------------------------------------
// Filter options: distinct values for dropdowns
// ---------------------------------------------------------------------------

export async function getFilterOptions(): Promise<FilterOptions> {
  // Run queries in parallel
  const [makesRes, yearsRes, fuelRes, driveRes] = await Promise.all([
    supabase
      .from("vehicle_specs")
      .select("make_name")
      .not("make_name", "is", null)
      .neq("make_name", "")
      .order("make_name")
      .limit(5000),
    supabase
      .from("vehicle_specs")
      .select("year")
      .not("year", "is", null)
      .gte("year", 1980)
      .order("year", { ascending: false })
      .limit(1000),
    supabase
      .from("vehicle_specs")
      .select("fuel_type")
      .not("fuel_type", "is", null)
      .neq("fuel_type", "")
      .limit(1000),
    supabase
      .from("vehicle_specs")
      .select("drive_type")
      .not("drive_type", "is", null)
      .neq("drive_type", "")
      .limit(1000),
  ]);

  // Deduplicate
  const makes = [...new Set((makesRes.data ?? []).map((r: any) => r.make_name as string))].sort();
  const years = [...new Set((yearsRes.data ?? []).map((r: any) => r.year as number))].sort((a, b) => b - a);
  const fuelTypes = [...new Set((fuelRes.data ?? []).map((r: any) => r.fuel_type as string))].sort();
  const driveTypes = [...new Set((driveRes.data ?? []).map((r: any) => r.drive_type as string))].sort();

  return {
    makes,
    years,
    fuelTypes,
    driveTypes,
    sources: ["github_auto_specs", "nhtsa_vpic", "open_ev_data"],
  };
}

// ---------------------------------------------------------------------------
// Stats: quick counts for the database badge
// ---------------------------------------------------------------------------

export async function getDbStats(): Promise<{
  vehicleSpecs: number;
  engines: number;
  fuelEconomy: number;
  evSpecs: number;
  safetyRatings: number;
  makes: number;
}> {
  const [vs, eng, fe, ev, sr, mk] = await Promise.all([
    supabase.from("vehicle_specs").select("id", { count: "exact", head: true }),
    supabase.from("engines").select("id", { count: "exact", head: true }),
    supabase.from("fuel_economy").select("id", { count: "exact", head: true }),
    supabase.from("ev_specs").select("id", { count: "exact", head: true }),
    supabase.from("safety_ratings").select("id", { count: "exact", head: true }),
    supabase.from("makes").select("id", { count: "exact", head: true }),
  ]);

  return {
    vehicleSpecs: vs.count ?? 0,
    engines: eng.count ?? 0,
    fuelEconomy: fe.count ?? 0,
    evSpecs: ev.count ?? 0,
    safetyRatings: sr.count ?? 0,
    makes: mk.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Bridge: find vehicle_specs record by make/model/year (for slug-based lookup)
// ---------------------------------------------------------------------------

export async function findVehicleByMakeModelYear(
  make: string,
  model: string,
  year?: number
): Promise<VehicleDetailData | null> {
  // Try exact model name first, then progressively looser matching
  const attempts: string[] = [
    model,                           // exact: "X5"
    `${model}%`,                     // prefix: "X5*"
  ];

  // Add first-word prefix only if model has multiple words (e.g., "Model Y" -> "Model%")
  const modelFirstWord = model.split(/\s+/)[0];
  if (modelFirstWord && modelFirstWord !== model) {
    attempts.push(`${modelFirstWord}%`);
  }

  for (const pattern of attempts) {
    let query = supabase
      .from("vehicle_specs")
      .select("id")
      .ilike("make_name", make);

    // Use exact match for the first attempt, ilike prefix for the rest
    if (pattern === model) {
      query = query.ilike("model_name", model);
    } else {
      query = query.ilike("model_name", pattern);
    }

    if (year) {
      query = query.eq("year", year);
    }

    const { data, error } = await query.order("year", { ascending: false }).limit(1);

    if (!error && data && data.length > 0) {
      return getVehicleById(data[0].id);
    }
  }

  return null;
}
