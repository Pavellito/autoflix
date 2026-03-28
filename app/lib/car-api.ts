// ─── External Car Data APIs ─────────────────────────────
// Wraps FuelEconomy.gov + NHTSA vPIC for on-demand car data
// Both APIs are free and require no API keys

export interface ExternalCarResult {
  externalId: string; // FuelEconomy.gov vehicle ID
  make: string;
  model: string;
  baseModel: string;
  year: number;
  fuelType: string; // "Electricity", "Gasoline", "Diesel", etc.
  type: "EV" | "Hybrid" | "ICE";
  drive: string;
  transmission: string;
  vehicleClass: string;
  // EV fields
  rangeCity?: number; // miles
  rangeHighway?: number; // miles
  rangeCombined?: number; // miles
  chargeTime240v?: number; // hours
  evMotor?: string;
  batteryKwh?: number;
  // ICE/Hybrid fields
  cylinders?: string;
  displacement?: string;
  mpgCity?: number;
  mpgHighway?: number;
  mpgCombined?: number;
  // Common
  co2TailpipeGpm?: number;
  fuelCostAnnual?: number;
  feScore?: number; // 1-10
  ghgScore?: number; // 1-10
  seats?: number;
  doors?: number;
  bodyClass?: string;
}

// ─── FuelEconomy.gov API ────────────────────────────────

const FUEL_ECO_BASE = "https://www.fueleconomy.gov/ws/rest";

interface FuelEcoMenuItem {
  text: string;
  value: string;
}

interface FuelEcoMenuResponse {
  menuItem: FuelEcoMenuItem | FuelEcoMenuItem[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 }, // Cache for 24h
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${url}`);
  return res.json();
}

function normalizeMenuItems(data: FuelEcoMenuResponse): FuelEcoMenuItem[] {
  if (!data.menuItem) return [];
  return Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem];
}

/**
 * Get all available years from FuelEconomy.gov
 */
export async function getYears(): Promise<number[]> {
  const data = await fetchJson<FuelEcoMenuResponse>(`${FUEL_ECO_BASE}/vehicle/menu/year`);
  return normalizeMenuItems(data)
    .map((item) => parseInt(item.value, 10))
    .filter((y) => !isNaN(y))
    .sort((a, b) => b - a);
}

/**
 * Get all makes for a given year
 */
export async function getMakes(year: number): Promise<string[]> {
  const data = await fetchJson<FuelEcoMenuResponse>(`${FUEL_ECO_BASE}/vehicle/menu/make?year=${year}`);
  return normalizeMenuItems(data).map((item) => item.text);
}

/**
 * Get all models for a given make and year
 */
export async function getModels(year: number, make: string): Promise<string[]> {
  const data = await fetchJson<FuelEcoMenuResponse>(
    `${FUEL_ECO_BASE}/vehicle/menu/model?year=${year}&make=${encodeURIComponent(make)}`
  );
  return normalizeMenuItems(data).map((item) => item.text);
}

/**
 * Get vehicle options (trims) and return their IDs
 */
async function getVehicleOptions(year: number, make: string, model: string): Promise<FuelEcoMenuItem[]> {
  const data = await fetchJson<FuelEcoMenuResponse>(
    `${FUEL_ECO_BASE}/vehicle/menu/options?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
  );
  return normalizeMenuItems(data);
}

/**
 * Get full vehicle details by FuelEconomy.gov vehicle ID
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getVehicleById(id: string): Promise<any> {
  return fetchJson(`${FUEL_ECO_BASE}/vehicle/${id}`);
}

/**
 * Determine car type from fuel info
 */
function classifyFuelType(fuelType1: string, fuelType2: string, atvType: string): "EV" | "Hybrid" | "ICE" {
  if (atvType === "EV" || fuelType1 === "Electricity") return "EV";
  if (atvType === "Hybrid" || fuelType2 === "Electricity" || atvType === "Plug-in Hybrid") return "Hybrid";
  return "ICE";
}

/**
 * Fetch full details for a specific car from FuelEconomy.gov
 */
export async function fetchCarDetails(year: number, make: string, model: string): Promise<ExternalCarResult | null> {
  try {
    const options = await getVehicleOptions(year, make, model);
    if (options.length === 0) return null;

    // Get the first trim/option
    const vehicleId = options[0].value;
    const v = await getVehicleById(vehicleId);

    const carType = classifyFuelType(v.fuelType1 || "", v.fuelType2 || "", v.atvType || "");

    const result: ExternalCarResult = {
      externalId: vehicleId,
      make: v.make,
      model: v.model,
      baseModel: v.baseModel || v.model,
      year: parseInt(v.year, 10),
      fuelType: v.fuelType1 || v.fuelType || "Unknown",
      type: carType,
      drive: v.drive || "Unknown",
      transmission: v.trany || "Unknown",
      vehicleClass: v.VClass || "Unknown",
      feScore: v.feScore ? parseInt(v.feScore, 10) : undefined,
      ghgScore: v.ghgScore ? parseInt(v.ghgScore, 10) : undefined,
      fuelCostAnnual: v.fuelCost08 ? parseInt(v.fuelCost08, 10) : undefined,
      co2TailpipeGpm: v.co2TailpipeGpm ? parseFloat(v.co2TailpipeGpm) : undefined,
    };

    if (carType === "EV") {
      result.rangeCombined = v.range ? parseInt(v.range, 10) : undefined;
      result.rangeCity = v.rangeCity ? parseFloat(v.rangeCity) : undefined;
      result.rangeHighway = v.rangeHwy ? parseFloat(v.rangeHwy) : undefined;
      result.chargeTime240v = v.charge240 ? parseFloat(v.charge240) : undefined;
      result.evMotor = v.evMotor || undefined;
      // MPGe for EVs
      result.mpgCity = v.city08 ? parseInt(v.city08, 10) : undefined;
      result.mpgHighway = v.highway08 ? parseInt(v.highway08, 10) : undefined;
      result.mpgCombined = v.comb08 ? parseInt(v.comb08, 10) : undefined;
    } else {
      result.mpgCity = v.city08 ? parseInt(v.city08, 10) : undefined;
      result.mpgHighway = v.highway08 ? parseInt(v.highway08, 10) : undefined;
      result.mpgCombined = v.comb08 ? parseInt(v.comb08, 10) : undefined;
      result.cylinders = v.cylinders || undefined;
      result.displacement = v.displ || undefined;
    }

    return result;
  } catch (err) {
    console.error("Error fetching car details:", err);
    return null;
  }
}

// ─── NHTSA vPIC API ─────────────────────────────────────

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api";

interface NHTSAResult {
  Variable: string;
  Value: string | null;
}

/**
 * Get all makes from NHTSA for a given vehicle type
 */
export async function getNHTSAMakes(): Promise<{ makeId: number; makeName: string }[]> {
  const data = await fetchJson<{ Results: { Make_ID: number; Make_Name: string }[] }>(
    `${NHTSA_BASE}/vehicles/GetAllMakes?format=json`
  );
  return data.Results.map((r) => ({
    makeId: r.Make_ID,
    makeName: r.Make_Name,
  }));
}

/**
 * Decode a VIN to get additional specs from NHTSA
 */
export async function decodeVIN(vin: string): Promise<Record<string, string>> {
  const data = await fetchJson<{ Results: NHTSAResult[] }>(
    `${NHTSA_BASE}/vehicles/DecodeVin/${vin}?format=json`
  );
  const result: Record<string, string> = {};
  for (const r of data.Results) {
    if (r.Value && r.Value.trim()) {
      result[r.Variable] = r.Value.trim();
    }
  }
  return result;
}

/**
 * Get models for a make from NHTSA (more comprehensive than FuelEconomy.gov)
 */
export async function getNHTSAModels(make: string): Promise<string[]> {
  const data = await fetchJson<{ Results: { Model_Name: string }[] }>(
    `${NHTSA_BASE}/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`
  );
  return [...new Set(data.Results.map((r) => r.Model_Name))].sort();
}

// ─── Combined Catalog Search ────────────────────────────

export interface CatalogEntry {
  make: string;
  model: string;
  year: number;
  id: string; // Generated: "make-model-year" slug
}

/**
 * Search FuelEconomy.gov catalog by make, returning all models for recent years.
 * Used for the car selector dropdown.
 */
export async function searchCatalog(
  make: string,
  yearRange: { from: number; to: number } = { from: 2020, to: 2026 }
): Promise<CatalogEntry[]> {
  const results: CatalogEntry[] = [];
  const years = [];
  for (let y = yearRange.to; y >= yearRange.from; y--) years.push(y);

  // Fetch models for each year in parallel
  const modelsByYear = await Promise.all(
    years.map(async (year) => {
      try {
        const models = await getModels(year, make);
        return { year, models };
      } catch {
        return { year, models: [] };
      }
    })
  );

  for (const { year, models } of modelsByYear) {
    for (const model of models) {
      const slug = `${make}-${model}-${year}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      results.push({ make, model, year, id: slug });
    }
  }

  return results;
}

/**
 * Generate a car image URL using imagin.studio (free for development)
 */
export function getCarImageUrl(make: string, model: string): string {
  const modelFamily = model
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(modelFamily)}&paintId=pspc0001`;
}
