import { supabase } from "./supabase";
import type { Car } from "./data";

// ─── Supabase Data Access Layer ──────────────────────────
// Async functions that fetch car data from Supabase DB
// These replace the hardcoded arrays for production use

// ─── Type Definitions ────────────────────────────────────

interface PriceRow {
  car_id: string;
  region: string;
  price: string;
}

interface AdviceRow {
  car_id: string;
  region: string;
  advice: string;
}

interface CarRow {
  id: string;
  name: string;
  brand: string;
  type: "EV" | "Hybrid" | "ICE";
  range_km: string | null;
  battery: string | null;
  price: string | null;
  image: string;
  real_world_range: { city: string; highway: string; winter: string } | null;
  charging_curve: { maxSpeed: string; tenToEighty: string } | null;
  depreciation: { yr3: string; resaleValue: "Excellent" | "Good" | "Average" | "Poor" } | null;
  related_video_ids: string[];
}

// ─── Public Functions ────────────────────────────────────

/**
 * Fetch all cars from Supabase with their prices and regional advice
 */
export async function fetchAllCars(): Promise<Car[]> {
  const { data: rawCars, error } = await supabase
    .from("cars")
    .select("*")
    .order("brand", { ascending: true });

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  const cars = (rawCars ?? []) as CarRow[];
  if (cars.length === 0) return [];

  // Fetch all prices and advice in bulk (2 queries instead of N*2)
  const carIds = cars.map((c: CarRow) => c.id);

  const [pricesResult, adviceResult] = await Promise.all([
    supabase.from("car_prices").select("*").in("car_id", carIds),
    supabase.from("car_regional_advice").select("*").in("car_id", carIds),
  ]);

  const prices = (pricesResult.data ?? []) as PriceRow[];
  const advice = (adviceResult.data ?? []) as AdviceRow[];

  const pricesByCarId = groupBy(prices, "car_id");
  const adviceByCarId = groupBy(advice, "car_id");

  return cars.map((row: CarRow) => mapRowToCar(row, pricesByCarId[row.id], adviceByCarId[row.id]));
}

/**
 * Fetch a single car by ID from Supabase
 */
export async function fetchCarById(id: string): Promise<Car | null> {
  const { data: rawRow, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !rawRow) {
    console.error("Error fetching car:", error);
    return null;
  }

  const row = rawRow as CarRow;

  const [pricesResult, adviceResult] = await Promise.all([
    supabase.from("car_prices").select("*").eq("car_id", id),
    supabase.from("car_regional_advice").select("*").eq("car_id", id),
  ]);

  const prices = (pricesResult.data ?? []) as PriceRow[];
  const advice = (adviceResult.data ?? []) as AdviceRow[];

  return mapRowToCar(row, prices, advice);
}

/**
 * Search cars by name or brand
 */
export async function searchCars(query: string): Promise<Car[]> {
  const { data: rawCars, error } = await supabase
    .from("cars")
    .select("*")
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%`);

  if (error || !rawCars) return [];

  const cars = rawCars as CarRow[];
  const carIds = cars.map((c: CarRow) => c.id);
  if (carIds.length === 0) return [];

  const [pricesResult, adviceResult] = await Promise.all([
    supabase.from("car_prices").select("*").in("car_id", carIds),
    supabase.from("car_regional_advice").select("*").in("car_id", carIds),
  ]);

  const prices = (pricesResult.data ?? []) as PriceRow[];
  const advice = (adviceResult.data ?? []) as AdviceRow[];

  const pricesByCarId = groupBy(prices, "car_id");
  const adviceByCarId = groupBy(advice, "car_id");

  return cars.map((row: CarRow) => mapRowToCar(row, pricesByCarId[row.id], adviceByCarId[row.id]));
}

/**
 * Fetch cars filtered by brand
 */
export async function fetchCarsByBrand(brand: string): Promise<Car[]> {
  const { data: rawCars, error } = await supabase
    .from("cars")
    .select("*")
    .eq("brand", brand)
    .order("name", { ascending: true });

  if (error || !rawCars) return [];

  const cars = rawCars as CarRow[];
  const carIds = cars.map((c: CarRow) => c.id);
  if (carIds.length === 0) return [];

  const [pricesResult, adviceResult] = await Promise.all([
    supabase.from("car_prices").select("*").in("car_id", carIds),
    supabase.from("car_regional_advice").select("*").in("car_id", carIds),
  ]);

  const prices = (pricesResult.data ?? []) as PriceRow[];
  const advice = (adviceResult.data ?? []) as AdviceRow[];

  const pricesByCarId = groupBy(prices, "car_id");
  const adviceByCarId = groupBy(advice, "car_id");

  return cars.map((row: CarRow) => mapRowToCar(row, pricesByCarId[row.id], adviceByCarId[row.id]));
}

// ─── Helper Functions ────────────────────────────────────

function mapRowToCar(
  row: CarRow,
  prices: PriceRow[] = [],
  advice: AdviceRow[] = []
): Car {
  const pricesObj = prices.reduce(
    (acc, p) => {
      acc[p.region] = p.price;
      return acc;
    },
    {} as Record<string, string>
  );

  const adviceObj = advice.reduce(
    (acc, a) => {
      acc[a.region] = a.advice;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    type: row.type,
    range: row.range_km ?? undefined,
    realWorldRange: row.real_world_range ?? undefined,
    battery: row.battery ?? undefined,
    chargingCurve: row.charging_curve ?? undefined,
    price: row.price ?? undefined,
    prices: Object.keys(pricesObj).length > 0
      ? pricesObj as Car["prices"]
      : undefined,
    depreciation: row.depreciation ?? undefined,
    regionalAdvice: Object.keys(adviceObj).length > 0
      ? adviceObj as Car["regionalAdvice"]
      : undefined,
    image: row.image,
    relatedVideoIds: row.related_video_ids ?? [],
  };
}

function groupBy<T, K extends keyof T>(
  arr: T[],
  key: K
): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
