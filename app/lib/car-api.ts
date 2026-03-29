// ─── External Car Data APIs ─────────────────────────────
// Wraps FuelEconomy.gov + NHTSA vPIC for on-demand car data
// Both APIs are free and require no API keys

// ─── Trim Variant (one per engine/trim option) ──────────
export interface TrimVariant {
  trimName: string; // e.g. "2.0L 4cyl Turbo AWD" or "3.0L V6 RWD"
  externalId: string;
  fuelType: string;
  type: "EV" | "Hybrid" | "ICE";
  drive: string;
  transmission: string;
  cylinders?: string;
  displacement?: string;
  engineDescription?: string;
  hasTurbo?: boolean;
  hasSupercharger?: boolean;
  hasStartStop?: boolean;
  horsepower?: number; // parsed from FuelEconomy barrels data or NHTSA
  mpgCity?: number;
  mpgHighway?: number;
  mpgCombined?: number;
  co2TailpipeGpm?: number;
  fuelCostAnnual?: number;
  feScore?: number;
  ghgScore?: number;
  youSaveSpend?: number;
  // EV-specific
  evMotor?: string;
  batteryKwh?: number;
  rangeCombined?: number;
  rangeCity?: number;
  rangeHighway?: number;
  chargeTime240v?: number;
  // Estimated MSRP for this specific trim
  estimatedMsrp?: number;
}

// ─── Regional Pricing ───────────────────────────────────
export interface RegionalPricing {
  usd: number; // Base MSRP in USD
  ils: number; // Israel (ILS) — ~83% purchase tax
  rub: number; // Russia (RUB) — ~30% import duty + VAT
  aed: number; // UAE/Arabic (AED) — ~5% VAT
  // Exchange rates used (for display)
  rates: { usdToIls: number; usdToRub: number; usdToAed: number };
}

export interface ExternalCarResult {
  externalId: string; // FuelEconomy.gov vehicle ID (primary trim)
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
  // ─── NEW: All trim/engine variants ───
  trimVariants: TrimVariant[];
  // ─── NEW: Regional pricing ───
  regionalPricing?: RegionalPricing;
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

function estimateMsrp(vehicleClass: string, type: "EV" | "Hybrid" | "ICE", make: string, displacement?: string): number {
  let base = CLASS_MSRP[vehicleClass] ?? 38000;

  // Luxury brand markup
  const luxury = ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Cadillac", "Lincoln", "Volvo", "Infiniti", "Genesis", "Acura"];
  const ultraLuxury = ["Porsche", "Maserati", "Bentley", "Rolls-Royce", "Ferrari", "Lamborghini", "McLaren", "Aston Martin", "Lucid"];
  if (ultraLuxury.some(l => make.toLowerCase().includes(l.toLowerCase()))) base *= 3.0;
  else if (luxury.some(l => make.toLowerCase().includes(l.toLowerCase()))) base *= 1.4;

  // EV premium
  if (type === "EV") base *= 1.15;
  else if (type === "Hybrid") base *= 1.08;

  // Engine size premium: larger displacement = higher trim = higher price
  if (displacement) {
    const displ = parseFloat(displacement);
    if (displ >= 4.0) base *= 1.35;
    else if (displ >= 3.0) base *= 1.2;
    else if (displ >= 2.5) base *= 1.1;
    // 2.0L and below = base price
  }

  return Math.round(base / 100) * 100; // Round to nearest $100
}

// ─── Regional Pricing Calculator ────────────────────────
// Approximate exchange rates (updated periodically, not real-time)
const EXCHANGE_RATES = {
  usdToIls: 3.65, // 1 USD ≈ 3.65 ILS
  usdToRub: 92.0, // 1 USD ≈ 92 RUB
  usdToAed: 3.67, // 1 USD ≈ 3.67 AED (pegged)
};

function calculateRegionalPricing(baseMsrpUsd: number, isEV: boolean): RegionalPricing {
  // Israel: ~83% purchase tax for ICE, ~20% for EVs (green incentive), + 17% VAT on top
  const israelTaxMultiplier = isEV ? 1.20 : 1.83;
  const israelVAT = 1.17;
  const israelUsd = baseMsrpUsd * israelTaxMultiplier * israelVAT;

  // Russia: ~25-30% customs duty + 20% VAT, EVs get slight reduction
  const russiaDuty = isEV ? 1.15 : 1.30;
  const russiaVAT = 1.20;
  const russiaUsd = baseMsrpUsd * russiaDuty * russiaVAT;

  // UAE/Arabic: 5% VAT, very low import duty (~5%)
  const uaeDuty = 1.05;
  const uaeVAT = 1.05;
  const uaeUsd = baseMsrpUsd * uaeDuty * uaeVAT;

  return {
    usd: Math.round(baseMsrpUsd / 100) * 100,
    ils: Math.round(israelUsd * EXCHANGE_RATES.usdToIls / 100) * 100,
    rub: Math.round(russiaUsd * EXCHANGE_RATES.usdToRub / 1000) * 1000,
    aed: Math.round(uaeUsd * EXCHANGE_RATES.usdToAed / 100) * 100,
    rates: EXCHANGE_RATES,
  };
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
  const text = await res.text();
  if (!text || text === "null") return null as T;
  return JSON.parse(text);
}

function normalizeMenuItems(data: FuelEcoMenuResponse | null): FuelEcoMenuItem[] {
  if (!data || !data.menuItem) return [];
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
 * Parse a single FuelEconomy.gov vehicle record into a TrimVariant.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseVehicleToTrim(v: any, trimName: string): TrimVariant {
  const carType = classifyFuelType(v.fuelType1 || "", v.fuelType2 || "", v.atvType || "");
  const trim: TrimVariant = {
    trimName,
    externalId: String(v.id),
    fuelType: v.fuelType1 || v.fuelType || "Unknown",
    type: carType,
    drive: v.drive || "Unknown",
    transmission: v.trany || "Unknown",
    cylinders: v.cylinders || undefined,
    displacement: v.displ || undefined,
    engineDescription: v.eng_dscr || undefined,
    hasTurbo: v.tCharger === "T",
    hasSupercharger: v.sCharger === "S",
    hasStartStop: v.startStop === "Y",
    mpgCity: v.city08 ? parseInt(v.city08, 10) : undefined,
    mpgHighway: v.highway08 ? parseInt(v.highway08, 10) : undefined,
    mpgCombined: v.comb08 ? parseInt(v.comb08, 10) : undefined,
    co2TailpipeGpm: v.co2TailpipeGpm ? parseFloat(v.co2TailpipeGpm) : undefined,
    fuelCostAnnual: v.fuelCost08 ? parseInt(v.fuelCost08, 10) : undefined,
    feScore: v.feScore ? parseInt(v.feScore, 10) : undefined,
    ghgScore: v.ghgScore ? parseInt(v.ghgScore, 10) : undefined,
    youSaveSpend: v.youSaveSpend ? parseInt(v.youSaveSpend, 10) : undefined,
  };

  // Estimate HP from displacement + turbo (FuelEconomy.gov doesn't provide HP directly)
  if (v.displ) {
    const displ = parseFloat(v.displ);
    // Rough estimation: naturally aspirated ~70 HP/L, turbo ~100 HP/L, supercharged ~90 HP/L
    const hpPerLiter = v.tCharger === "T" ? 100 : v.sCharger === "S" ? 90 : 70;
    trim.horsepower = Math.round(displ * hpPerLiter);
  }

  if (carType === "EV" || carType === "Hybrid") {
    trim.evMotor = v.evMotor || undefined;
    trim.batteryKwh = v.barrelsTailpipe08 || undefined;
    trim.rangeCombined = v.range ? parseInt(v.range, 10) : undefined;
    trim.rangeCity = v.rangeCity ? parseFloat(v.rangeCity) : undefined;
    trim.rangeHighway = v.rangeHwy ? parseFloat(v.rangeHwy) : undefined;
    trim.chargeTime240v = v.charge240 ? parseFloat(v.charge240) : undefined;
  }

  // Per-trim MSRP estimation based on engine size
  trim.estimatedMsrp = estimateMsrp(v.VClass || "", carType, v.make, v.displ);

  return trim;
}

/**
 * Fetch full details for a specific car from FuelEconomy.gov + NHTSA specs.
 * Now fetches ALL available trims/engine variants (not just the first).
 */
export async function fetchCarDetails(year: number, make: string, model: string): Promise<ExternalCarResult | null> {
  try {
    let options = await getVehicleOptions(year, make, model);

    // Fuzzy matching: if exact model returns nothing, search all models for the make
    // and find ones that start with or contain the queried model name
    if (options.length === 0) {
      try {
        const allModels = await getModels(year, make);
        const modelLower = model.toLowerCase();
        const matching = allModels.filter(
          (m) => m.toLowerCase().startsWith(modelLower) || m.toLowerCase().includes(modelLower)
        );

        // Fetch options for ALL matching model variants in parallel
        if (matching.length > 0) {
          const allOptions = await Promise.all(
            matching.slice(0, 10).map(async (m) => {
              try {
                const opts = await getVehicleOptions(year, make, m);
                return opts;
              } catch {
                return [];
              }
            })
          );
          options = allOptions.flat();
        }
      } catch {
        // If fuzzy search fails, fall back gracefully
      }
    }

    if (options.length === 0) return null;

    // Fetch ALL trims in parallel (cap at 15 to avoid rate limits)
    const trimOptions = options.slice(0, 15);
    const [allVehicles, nhtsaSpecs] = await Promise.all([
      Promise.all(
        trimOptions.map(async (opt) => {
          try {
            const v = await getVehicleById(opt.value);
            return { option: opt, vehicle: v };
          } catch {
            return null;
          }
        })
      ),
      fetchNHTSASpecs(year, make, model).catch(() => null),
    ]);

    // Filter out failed fetches
    const validVehicles = allVehicles.filter(
      (item): item is { option: FuelEcoMenuItem; vehicle: Record<string, string> } => item !== null
    );
    if (validVehicles.length === 0) return null;

    // Parse all trims
    const trimVariants: TrimVariant[] = validVehicles.map(({ option, vehicle }) =>
      parseVehicleToTrim(vehicle, option.text)
    );

    // Use the first vehicle as primary for backward compatibility
    const v = validVehicles[0].vehicle;
    const carType = classifyFuelType(v.fuelType1 || "", v.fuelType2 || "", v.atvType || "");

    const result: ExternalCarResult = {
      externalId: trimOptions[0].value,
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
      engineDescription: v.eng_dscr || undefined,
      hasTurbo: v.tCharger === "T",
      hasSupercharger: v.sCharger === "S",
      hasStartStop: v.startStop === "Y",
      youSaveSpend: v.youSaveSpend ? parseInt(v.youSaveSpend, 10) : undefined,
      passengerVolume: (v.pv4 && parseFloat(v.pv4) > 0) ? parseFloat(v.pv4) :
                       (v.pv2 && parseFloat(v.pv2) > 0) ? parseFloat(v.pv2) :
                       (v.hpv && parseFloat(v.hpv) > 0) ? parseFloat(v.hpv) : undefined,
      cargoVolume: (v.lv4 && parseFloat(v.lv4) > 0) ? parseFloat(v.lv4) :
                   (v.lv2 && parseFloat(v.lv2) > 0) ? parseFloat(v.lv2) :
                   (v.hlv && parseFloat(v.hlv) > 0) ? parseFloat(v.hlv) : undefined,
      cylinders: v.cylinders || undefined,
      displacement: v.displ || undefined,
      trimVariants,
    };

    // MPG from primary trim
    result.mpgCity = v.city08 ? parseInt(v.city08, 10) : undefined;
    result.mpgHighway = v.highway08 ? parseInt(v.highway08, 10) : undefined;
    result.mpgCombined = v.comb08 ? parseInt(v.comb08, 10) : undefined;

    if (carType === "EV" || carType === "Hybrid") {
      result.rangeCombined = v.range ? parseInt(v.range, 10) : undefined;
      result.rangeCity = v.rangeCity ? parseFloat(v.rangeCity) : undefined;
      result.rangeHighway = v.rangeHwy ? parseFloat(v.rangeHwy) : undefined;
      result.chargeTime240v = v.charge240 ? parseFloat(v.charge240) : undefined;
      result.evMotor = v.evMotor || undefined;
      result.batteryKwh = v.barrelsTailpipe08 ? parseFloat(v.barrelsTailpipe08) : undefined;
    }

    // NHTSA physical specs
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

    // Estimated MSRP (base trim)
    result.estimatedMsrp = estimateMsrp(v.VClass || "", carType, v.make, v.displ);

    // Regional pricing based on the range of MSRPs across trims
    const msrpValues = trimVariants.map(t => t.estimatedMsrp).filter((m): m is number => !!m);
    const baseMsrp = msrpValues.length > 0 ? Math.min(...msrpValues) : result.estimatedMsrp;
    if (baseMsrp) {
      result.regionalPricing = calculateRegionalPricing(baseMsrp, carType === "EV");
    }

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
