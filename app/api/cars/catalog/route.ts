import { NextRequest, NextResponse } from "next/server";
import { getMakes, getModels } from "@/app/lib/car-api";

// In-memory cache for catalog data (persists across requests within same serverless invocation)
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 3600_000; // 1 hour

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}

/**
 * GET /api/cars/catalog?action=makes&year=2024
 * GET /api/cars/catalog?action=models&year=2024&make=Tesla
 * GET /api/cars/catalog?action=search&q=tesla
 *
 * Returns car catalog data from FuelEconomy.gov with caching
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action") || "makes";

  try {
    if (action === "years") {
      // Return supported years
      const years = [];
      for (let y = 2026; y >= 2015; y--) years.push(y);
      return NextResponse.json({ years });
    }

    if (action === "makes") {
      const year = parseInt(searchParams.get("year") || "2025", 10);
      const cacheKey = `makes-${year}`;
      const cached = getCached<string[]>(cacheKey);
      if (cached) return NextResponse.json({ makes: cached });

      const makes = await getMakes(year);
      setCache(cacheKey, makes);
      return NextResponse.json({ makes });
    }

    if (action === "models") {
      const year = parseInt(searchParams.get("year") || "2025", 10);
      const make = searchParams.get("make");
      if (!make) {
        return NextResponse.json({ error: "make parameter required" }, { status: 400 });
      }

      const cacheKey = `models-${year}-${make}`;
      const cached = getCached<string[]>(cacheKey);
      if (cached) return NextResponse.json({ models: cached });

      const models = await getModels(year, make);
      setCache(cacheKey, models);
      return NextResponse.json({ models });
    }

    if (action === "search") {
      const q = (searchParams.get("q") || "").trim().toLowerCase();
      if (!q || q.length < 2) {
        return NextResponse.json({ results: [] });
      }

      // Search across recent years for matching makes
      const year = parseInt(searchParams.get("year") || "2025", 10);
      const cacheKey = `makes-${year}`;
      let makes = getCached<string[]>(cacheKey);
      if (!makes) {
        makes = await getMakes(year);
        setCache(cacheKey, makes);
      }

      // Filter makes matching query
      const matchingMakes = makes.filter((m) => m.toLowerCase().includes(q));

      // For each matching make, get models
      const results: { make: string; model: string; year: number; id: string }[] = [];

      const modelFetches = await Promise.all(
        matchingMakes.slice(0, 5).map(async (make) => {
          const modelCacheKey = `models-${year}-${make}`;
          let models = getCached<string[]>(modelCacheKey);
          if (!models) {
            models = await getModels(year, make);
            setCache(modelCacheKey, models);
          }
          return { make, models };
        })
      );

      for (const { make, models } of modelFetches) {
        for (const model of models) {
          const slug = `${make}-${model}-${year}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          results.push({ make, model, year, id: slug });
        }
      }

      // Also search model names if query doesn't match a make
      if (matchingMakes.length === 0) {
        // Try to find makes that have models matching the query
        // Get all makes for the year and search through them
        const allModels = await Promise.all(
          makes.slice(0, 10).map(async (make) => {
            const modelCacheKey = `models-${year}-${make}`;
            let models = getCached<string[]>(modelCacheKey);
            if (!models) {
              try {
                models = await getModels(year, make);
                setCache(modelCacheKey, models);
              } catch {
                models = [];
              }
            }
            return { make, models };
          })
        );

        for (const { make, models } of allModels) {
          for (const model of models) {
            if (model.toLowerCase().includes(q)) {
              const slug = `${make}-${model}-${year}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
              results.push({ make, model, year, id: slug });
            }
          }
        }
      }

      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Catalog API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch catalog data" },
      { status: 500 }
    );
  }
}
