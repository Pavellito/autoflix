import { Suspense } from "react";
import Link from "next/link";
import { searchVehicles, getFilterOptions, getDbStats } from "@/app/lib/vehicle-queries";
import VehicleCard from "@/app/components/VehicleCard";
import VehicleFilters from "@/app/components/VehicleFilters";
import VehiclePagination from "@/app/components/VehiclePagination";
import type { VehicleSearchParams } from "@/app/lib/vehicle-types";

export default async function DatabaseBrowserPage({
  searchParams,
}: {
  searchParams: Promise<VehicleSearchParams>;
}) {
  const params = await searchParams;
  const hasSearchParams = Object.keys(params).length > 0;

  // Fetch data in parallel
  const [result, filters, stats] = await Promise.all([
    searchVehicles(params),
    getFilterOptions(),
    getDbStats(),
  ]);

  return (
    <div className="bg-[#141414] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-[4%] py-8">
        {/* Back link */}
        <Link href="/cars" className="inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-white mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Car Finder
        </Link>

        {/* Header with database stats */}
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                Vehicle Database
              </h1>
              <p className="text-gray-400 max-w-xl">
                Browse {stats.vehicleSpecs.toLocaleString()} vehicles with full technical specs, engine data,
                dimensions, fuel economy, safety ratings, and EV charging data.
              </p>
            </div>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-2">
              <StatBadge label="Vehicles" value={stats.vehicleSpecs} color="accent" />
              <StatBadge label="Engines" value={stats.engines} color="blue" />
              <StatBadge label="EPA Data" value={stats.fuelEconomy} color="green" />
              <StatBadge label="EVs" value={stats.evSpecs} color="emerald" />
              <StatBadge label="Safety" value={stats.safetyRatings} color="amber" />
            </div>
          </div>

          {/* Data sources legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              NHTSA vPIC
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              GitHub Auto Specs (Global)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              EPA Fuel Economy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              OpenEV Data
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              NHTSA Safety Ratings
            </span>
          </div>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-16 bg-white/5 rounded-xl animate-pulse" />}>
          <VehicleFilters filters={filters} total={result.total} />
        </Suspense>

        {/* Database vehicles grid */}
        <div className="mt-8">
          {hasSearchParams && (
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                Search Results
              </h2>
            </div>
          )}
          {!hasSearchParams && (
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                Full Database
              </h2>
              <span className="bg-white/10 text-gray-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                {result.total.toLocaleString()} vehicles
              </span>
            </div>
          )}

          {result.vehicles.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-400 mb-1">No vehicles found</h3>
              <p className="text-sm text-gray-600">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {result.vehicles.map((v) => (
                <VehicleCard key={v.unique_key} vehicle={v} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Suspense>
            <VehiclePagination page={result.page} totalPages={result.totalPages} total={result.total} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    accent: "bg-[#e50914]/10 text-[#e50914] border-[#e50914]/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${colorMap[color] ?? colorMap.blue}`}>
      <span className="font-black">{value.toLocaleString()}</span>
      <span className="ml-1 opacity-60">{label}</span>
    </div>
  );
}
