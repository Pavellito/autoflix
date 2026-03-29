import Link from "next/link";
import { fetchAllCars } from "@/app/lib/supabase-cars";
import CarFinder from "@/app/components/CarFinder";
import { getDbStats } from "@/app/lib/vehicle-queries";

export default async function CarsPage() {
  const [localCars, stats] = await Promise.all([
    fetchAllCars(),
    getDbStats().catch(() => null),
  ]);

  return (
    <div className="bg-[#141414] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-[4%]">
        <div className="mb-8">
          <h1 className="text-[36px] md:text-[48px] font-bold text-white mb-2">
            Find Your Car
          </h1>
          <p className="text-[16px] text-[#777] max-w-2xl">
            Browse every 2026 car on the market. Select make and model to see full technical specs, all trim variants, regional pricing, fuel economy, and EPA ratings.
          </p>
        </div>

        {/* Vehicle Database Stats Banner */}
        {stats && (stats.vehicleSpecs > 0 || stats.engines > 0) && (
          <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-[13px]">
                {stats.vehicleSpecs > 0 && (
                  <span className="text-white/70"><span className="text-[#e50914] font-bold">{stats.vehicleSpecs.toLocaleString()}</span> Vehicle Specs</span>
                )}
                {stats.engines > 0 && (
                  <span className="text-white/70"><span className="text-[#e50914] font-bold">{stats.engines.toLocaleString()}</span> Engines</span>
                )}
                {stats.fuelEconomy > 0 && (
                  <span className="text-white/70"><span className="text-[#e50914] font-bold">{stats.fuelEconomy.toLocaleString()}</span> EPA Ratings</span>
                )}
                {stats.safetyRatings > 0 && (
                  <span className="text-white/70"><span className="text-[#e50914] font-bold">{stats.safetyRatings.toLocaleString()}</span> Safety Ratings</span>
                )}
              </div>
              <Link
                href="/cars/db"
                className="bg-[#e50914] text-white text-[13px] font-medium px-4 py-2 rounded hover:bg-[#f6121d] transition-colors"
              >
                Browse Full Database →
              </Link>
            </div>
          </div>
        )}

        <CarFinder localCars={localCars} />
      </div>
    </div>
  );
}
