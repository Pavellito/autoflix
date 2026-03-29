"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import type { FilterOptions } from "@/app/lib/vehicle-types";

interface Props {
  filters: FilterOptions;
  total: number;
}

export default function VehicleFilters({ filters, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentMake = searchParams.get("make") ?? "";
  const currentYearMin = searchParams.get("year_min") ?? "";
  const currentYearMax = searchParams.get("year_max") ?? "";
  const currentFuel = searchParams.get("fuel") ?? "";
  const currentDrive = searchParams.get("drive") ?? "";
  const currentSort = searchParams.get("sort") ?? "make_name";
  const currentQ = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 on any filter change
      params.delete("page");
      startTransition(() => {
        router.push(`/cars?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push("/cars");
    });
  }, [router]);

  const hasFilters = currentMake || currentYearMin || currentYearMax || currentFuel || currentDrive || currentQ;

  // Popular makes for quick filter buttons
  const popularMakes = [
    "Toyota", "Honda", "BMW", "Mercedes-Benz", "Audi", "Volkswagen",
    "Ford", "Chevrolet", "Tesla", "Hyundai", "Kia", "Porsche",
    "Nissan", "Mazda", "Volvo", "Subaru", "Lexus", "Ferrari",
  ];

  return (
    <div className="space-y-4">
      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search make, model, or variant..."
            defaultValue={currentQ}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ q: (e.target as HTMLInputElement).value });
              }
            }}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          />
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Sort select */}
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-accent/50 cursor-pointer"
        >
          <option value="make_name">Sort: A-Z Make</option>
          <option value="model">Sort: A-Z Model</option>
          <option value="year_desc">Sort: Newest First</option>
          <option value="year_asc">Sort: Oldest First</option>
        </select>

        {/* Toggle filters */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            isExpanded || hasFilters
              ? "bg-accent/20 border border-accent/40 text-accent"
              : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasFilters && (
            <span className="bg-accent text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-white font-bold">{total.toLocaleString()}</span> vehicles found
          {isPending && <span className="text-accent ml-2 animate-pulse">updating...</span>}
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-accent hover:text-red-400 font-bold transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Expanded filters panel */}
      {isExpanded && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Popular makes quick buttons */}
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 block">
              Popular Makes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularMakes.map((make) => (
                <button
                  key={make}
                  onClick={() => updateParams({ make: currentMake === make ? "" : make })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentMake.toLowerCase() === make.toLowerCase()
                      ? "bg-accent text-white shadow-lg shadow-accent/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>

          {/* Make dropdown (full list) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1.5 block">
                Make / Brand
              </label>
              <select
                value={currentMake}
                onChange={(e) => updateParams({ make: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-accent/50 cursor-pointer"
              >
                <option value="">All Makes</option>
                {filters.makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1.5 block">
                Year From
              </label>
              <select
                value={currentYearMin}
                onChange={(e) => updateParams({ year_min: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-accent/50 cursor-pointer"
              >
                <option value="">Any Year</option>
                {filters.years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1.5 block">
                Fuel Type
              </label>
              <select
                value={currentFuel}
                onChange={(e) => updateParams({ fuel: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-accent/50 cursor-pointer"
              >
                <option value="">All Fuel Types</option>
                {filters.fuelTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1.5 block">
                Drive Type
              </label>
              <select
                value={currentDrive}
                onChange={(e) => updateParams({ drive: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-accent/50 cursor-pointer"
              >
                <option value="">All Drivetrains</option>
                {filters.driveTypes.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
