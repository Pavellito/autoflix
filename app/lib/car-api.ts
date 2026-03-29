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
  // Extended from FuelEconomy.gov
  engineDescription?: string; // e.g. "SIDI; Turbocharged"
  hasTurbo?: boolean;
  hasSupercharger?: boolean;
  hasStartStop?: boolean;
  passengerVolume?: number; // cubic feet
  cargoVolume?: number; // cubic feet
  youSaveSpend?: number; // $ vs average car (+/-)
  // NHTSA Physical Specs (cm → stored as mm)
  nhtsaLengthMm?: number;
  nhtsaWidthMm?: number;
  nhtsaHeightMm?: number;
  nhtsaWheelbaseMm?: number;
  nhtsaCurbWeightKg?: number;
  nhtsaTrackFrontMm?: number;
  nhtsaTrackRearMm?: number;
  nhtsaWeightDistribution?: string;
  nhtsaTrimVariants?: string[]; // All available trims
  // Estimated MSRP
  estimatedMsrp?: number;
}

// ─── MSRP Estimation by Vehicle Class ─────────────────────
// Based on average 2025 MSRP data by EPA vehicle class
const CLASS_MSRP: Record<string, number> = {
  "Subcompact Cars": 24000,
  "Compact Cars": 28000,
  "Midsize Cars": 34000,
  "Large Cars": 42000,
  "Small Station Wagons": 36000,
  "Midsize Station Wagons": 42000,
  "Two Seaters": 45000,
  "Minicompact Cars": 32000,
  "Small Sport Utility Vehicle 2WD": 32000,
  "Small Sport Utility Vehicle 4WD": 35000,
  "Standard Sport Utility Vehicle 2WD": 48000,
  "Standard Sport Utility Vehicle 4WD": 52000,
  "Sport Utility Vehicle": 45000,
  "Small Pickup Trucks 2WD": 32000,
  "Small Pickup Trucks 4WD": 36000,
  "Standard Pickup Trucks 2WD": 42000,
  "Standard Pickup Trucks 4WD": 48000,
  "Minivan - 2WD": 38000,
  "Minivan - 4WD": 42000,
  "Vans Passenger": 40000,
  "Special Purpose Vehicle": 55000,
};

function estimateMsrp(vehicleClass: string, type: "EV" | "Hybrid" | "ICE", make: string): number {
  let base = CLASS_MSRP[vehicleClass] ?? 38000;

  // Luxury brand markup
  const luxury = ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Cadillac", "Lincoln", "Volvo", "Infiniti", "Genesis", "Acura"];
  const ultraLuxury = ["Porsche", "Maserati", "Bentley", "Rolls-Royce", "Ferrari", "Lamborghini", "McLaren", "Aston Martin", "Lucid"];
  if (ultraLuxury.some(l => make.toLowerCase().includes(l.toLowerCase()))) base *= 3.0;
  else if (luxury.some(l => make.toLowerCase().includes(l.toLowerCase()))) base *= 1.4;

  // EV premium
  if (type === "EV") base *= 1.15;
  else if (type === "Hybrid") base *= 1.08;

  return Math.round(base / 100) * 100; // Round to nearest $100
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
 * Fetch full details for a specific car from FuelEconomy.gov + NHTSA specs.
 * Merges data from both free APIs for comprehensive coverage.
 */
export async function fetchCarDetails(year: number, make: string, model: string): Promise<ExternalCarResult | null> {
  try {
    const options = await getVehicleOptions(year, make, model);
    if (options.length === 0) return null;

    // Get the first trim/option + NHTSA specs in parallel
    const vehicleId = options[0].value;
    const [v, nhtsaSpecs] = await Promise.all([
      getVehicleById(vehicleId),
      fetchNHTSASpecs(year, make, model).catch(() => null),
    ]);

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
      // Extended fields
      engineDescription: v.eng_dscr || undefined,
      hasTurbo: v.tCharger === "T",
      hasSupercharger: v.sCharger === "S",
      hasStartStop: v.startStop === "Y",
      youSaveSpend: v.youSaveSpend ? parseInt(v.youSaveSpend, 10) : undefined,
      // Passenger/Cargo volume (cubic feet)
      passengerVolume: (v.pv4 && parseFloat(v.pv4) > 0) ? parseFloat(v.pv4) :
                       (v.pv2 && parseFloat(v.pv2) > 0) ? parseFloat(v.pv2) :
                       (v.hpv && parseFloat(v.hpv) > 0) ? parseFloat(v.hpv) : undefined,
      cargoVolume: (v.lv4 && parseFloat(v.lv4) > 0) ? parseFloat(v.lv4) :
                   (v.lv2 && parseFloat(v.lv2) > 0) ? parseFloat(v.lv2) :
                   (v.hlv && parseFloat(v.hlv) > 0) ? parseFloat(v.hlv) : undefined,
      // Cylinders & displacement for ALL types
      cylinders: v.cylinders || undefined,
      displacement: v.displ || undefined,
    };

    // MPG for all types
    result.mpgCity = v.city08 ? parseInt(v.city08, 10) : undefined;
    result.mpgHighway = v.highway08 ? parseInt(v.highway08, 10) : undefined;
    result.mpgCombined = v.comb08 ? parseInt(v.comb08, 10) : undefined;

    if (carType === "EV" || carType === "Hybrid") {
      result.rangeCombined = v.range ? parseInt(v.range, 10) : undefined;
      result.rangeCity = v.rangeCity ? parseFloat(v.rangeCity) : undefined;
      result.rangeHighway = v.rangeHwy ? parseFloat(v.rangeHwy) : undefined;
      result.chargeTime240v = v.charge240 ? parseFloat(v.charge240) : undefined;
      result.evMotor = v.evMotor || undefined;
      result.batteryKwh = v.barrelsTailpipe08 || undefined; // Not always available
    }

    // NHTSA physical specs (cm from API → mm for our data model)
    if (nhtsaSpecs) {
      result.nhtsaLengthMm = nhtsaSpecs.lengthCm ? Math.round(nhtsaSpecs.lengthCm * 10) : undefined;
      result.nhtsaWidthMm = nhtsaSpecs.widthCm ? Math.round(nhtsaSpecs.widthCm * 10) : undefined;
      result.nhtsaHeightMm = nhtsaSpecs.heightCm ? Math.round(nhtsaSpecs.heightCm * 10) : undefined;
      result.nhtsaWheelbaseMm = nhtsaSpecs.wheelbaseCm ? Math.round(nhtsaSpecs.wheelbaseCm * 10) : undefined;
      result.nhtsaCurbWeightKg = nhtsaSpecs.curbWeightKg;
      result.nhtsaTrackFrontMm = nhtsaSpecs.trackFrontCm ? Math.round(nhtsaSpecs.trackFrontCm * 10) : undefined;
      result.nhtsaTrackRearMm = nhtsaSpecs.trackRearCm ? Math.round(nhtsaSpecs.trackRearCm * 10) : undefined;
      result.nhtsaWeightDistribution = nhtsaSpecs.weightDistribution;
      result.nhtsaTrimVariants = nhtsaSpecs.trimVariants;
    }

    // Estimated MSRP
    result.estimatedMsrp = estimateMsrp(v.VClass || "", carType, v.make);

    return result;
  } catch (err) {
    console.error("Error fetching car details:", err);
    return null;
  }
}

// ─── NHTSA Canadian Vehicle Specifications ──────────────
// Free API: returns physical dimensions, weight, track width for any make/model/year

interface NHTSAPhysicalSpecs {
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  wheelbaseCm?: number;
  curbWeightKg?: number;
  trackFrontCm?: number;
  trackRearCm?: number;
  weightDistribution?: string;
  trimVariants: string[];
}

interface NHTSACanadianSpec {
  Name: string;
  Value: string;
}

/**
 * Fetch physical specs from NHTSA Canadian Vehicle Specifications API.
 * Returns dimensions (cm), weight (kg), and track widths.
 */
export async function fetchNHTSASpecs(year: number, make: string, model: string): Promise<NHTSAPhysicalSpecs | null> {
  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetCanadianVehicleSpecifications/?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&units=&format=json`;
    const data = await fetchJson<{
      Count: number;
      Results: Array<{ Specs: NHTSACanadianSpec[] }>;
    }>(url);

    if (!data.Results || data.Results.length === 0) return null;

    // Use the first variant for base specs, collect all trim names
    const firstVariant = data.Results[0].Specs;
    const specsMap: Record<string, string> = {};
    for (const s of firstVariant) {
      specsMap[s.Name] = s.Value;
    }

    const trimVariants = data.Results.map(r => {
      const modelSpec = r.Specs.find(s => s.Name === "Model");
      return modelSpec?.Value || "";
    }).filter(Boolean);

    // Collect all curb weights across variants for range display
    const allWeights = data.Results.map(r => {
      const cw = r.Specs.find(s => s.Name === "CW");
      return cw?.Value ? parseFloat(cw.Value) : 0;
    }).filter(w => w > 0);

    return {
      lengthCm: specsMap["OL"] ? parseFloat(specsMap["OL"]) : undefined,
      widthCm: specsMap["OW"] ? parseFloat(specsMap["OW"]) : undefined,
      heightCm: specsMap["OH"] ? parseFloat(specsMap["OH"]) : undefined,
      wheelbaseCm: specsMap["WB"] ? parseFloat(specsMap["WB"]) : undefined,
      curbWeightKg: allWeights.length > 0 ? Math.round(allWeights.reduce((a, b) => a + b, 0) / allWeights.length) : undefined,
      trackFrontCm: specsMap["TWF"] ? parseFloat(specsMap["TWF"]) : undefined,
      trackRearCm: specsMap["TWR"] ? parseFloat(specsMap["TWR"]) : undefined,
      weightDistribution: specsMap["WD"] || undefined,
      trimVariants,
    };
  } catch {
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
