"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Car } from "@/app/lib/data";

interface ExternalCar {
  make: string;
  model: string;
  year: number;
  id: string;
}

interface CarSelectorProps {
  cars: Car[]; // Local DB cars
  selected: Car | null;
  onSelect: (car: Car) => void;
  onSelectExternal?: (entry: ExternalCar) => void;
  placeholder?: string;
  label?: string;
}

export default function CarSelector({
  cars,
  selected,
  onSelect,
  onSelectExternal,
  placeholder = "Search any car...",
  label,
}: CarSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(2026);
  const [externalResults, setExternalResults] = useState<ExternalCar[]>([]);
  const [searching, setSearching] = useState(false);
  const [enriching, setEnriching] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter local cars
  const localFiltered = cars.filter((car) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      car.name.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      car.type.toLowerCase().includes(q)
    );
  });

  // Group local cars by brand
  const localGrouped = localFiltered.reduce<Record<string, Car[]>>((acc, car) => {
    if (!acc[car.brand]) acc[car.brand] = [];
    acc[car.brand].push(car);
    return acc;
  }, {});

  // Group external results by make (excluding already-local cars)
  const localIds = new Set(cars.map((c) => c.id));
  const externalFiltered = externalResults.filter((e) => !localIds.has(e.id));
  const externalGrouped = externalFiltered.reduce<Record<string, ExternalCar[]>>((acc, car) => {
    if (!acc[car.make]) acc[car.make] = [];
    acc[car.make].push(car);
    return acc;
  }, {});

  // Search external API with debounce
  const searchExternal = useCallback(
    async (q: string, yr: number) => {
      if (q.length < 2) {
        setExternalResults([]);
        return;
      }
      setSearching(true);
      try {
        const res = await fetch(
          `/api/cars/catalog?action=search&q=${encodeURIComponent(q)}&year=${yr}`
        );
        if (res.ok) {
          const data = await res.json();
          setExternalResults(data.results || []);
        }
      } catch (err) {
        console.error("External search error:", err);
      } finally {
        setSearching(false);
      }
    },
    []
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchExternal(val, year), 400);
  };

  const handleYearChange = (yr: number) => {
    setYear(yr);
    if (query.length >= 2) {
      searchExternal(query, yr);
    }
  };

  const handleSelectLocal = (car: Car) => {
    onSelect(car);
    setQuery("");
    setOpen(false);
    setExternalResults([]);
  };

  const handleSelectExternal = async (entry: ExternalCar) => {
    if (onSelectExternal) {
      onSelectExternal(entry);
      setQuery("");
      setOpen(false);
      setExternalResults([]);
      return;
    }

    // Enrich the car on-demand and convert to local Car
    setEnriching(entry.id);
    try {
      const res = await fetch(
        `/api/cars/enrich?make=${encodeURIComponent(entry.make)}&model=${encodeURIComponent(entry.model)}&year=${entry.year}`
      );
      if (res.ok) {
        const data = await res.json();
        const enrichedCar: Car = {
          id: data.car.id,
          name: data.car.name,
          brand: data.car.brand,
          type: data.car.type,
          range: data.car.range_km || undefined,
          battery: data.car.battery || undefined,
          price: data.car.price || undefined,
          image: data.car.image,
          realWorldRange: data.car.real_world_range || undefined,
          chargingCurve: data.car.charging_curve || undefined,
          depreciation: data.car.depreciation || undefined,
          relatedVideoIds: data.car.related_video_ids || [],
        };
        onSelect(enrichedCar);
        setQuery("");
        setOpen(false);
        setExternalResults([]);
      }
    } catch (err) {
      console.error("Enrich error:", err);
    } finally {
      setEnriching(null);
    }
  };

  const hasLocalResults = Object.keys(localGrouped).length > 0;
  const hasExternalResults = Object.keys(externalGrouped).length > 0;

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="block text-[12px] text-[#777] uppercase tracking-wider font-bold mb-2">
          {label}
        </label>
      )}

      {/* Selected display / Toggle button */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="w-full flex items-center gap-3 bg-[#333] border border-white/10 rounded px-4 py-3 text-left hover:border-white/30 transition-colors"
      >
        {selected ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.image}
              alt={selected.name}
              className="w-10 h-10 rounded object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.brand)}&background=333&color=fff&size=80`;
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-white font-medium truncate">{selected.name}</p>
              <p className="text-[12px] text-[#777]">
                {selected.brand} · {selected.type}
                {selected.range ? ` · ${selected.range}` : ""}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-[#777] transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-[#777]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[14px] text-[#777] flex-1">{placeholder}</span>
            <svg
              className={`w-4 h-4 text-[#777] transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col">
          {/* Search input + year selector */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Type brand or model name..."
              className="w-full bg-[#333] text-white text-[14px] px-3 py-2 rounded border border-white/10 outline-none focus:border-white/30 placeholder:text-[#666]"
            />
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#666]">Year:</span>
              <div className="flex gap-1 flex-wrap">
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => handleYearChange(yr)}
                    className={`px-2 py-0.5 text-[11px] rounded ${
                      year === yr
                        ? "bg-[#e50914] text-white"
                        : "bg-[#333] text-[#999] hover:bg-[#444]"
                    } transition-colors`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {/* Local DB cars */}
            {hasLocalResults && (
              <>
                {query.length >= 2 && (
                  <div className="px-4 py-1.5 text-[10px] text-[#e50914] uppercase tracking-widest font-bold bg-[#0d0d0d]">
                    In Your Database
                  </div>
                )}
                {Object.entries(localGrouped).map(([brand, brandCars]) => (
                  <div key={`local-${brand}`}>
                    <div className="px-4 py-2 text-[11px] text-[#777] uppercase tracking-wider font-bold bg-[#141414] sticky top-0">
                      {brand}
                    </div>
                    {brandCars.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleSelectLocal(car)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left ${
                          selected?.id === car.id ? "bg-white/10" : ""
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(car.brand)}&background=333&color=fff&size=64`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-white truncate">{car.name}</p>
                          <p className="text-[11px] text-[#666]">
                            {car.type}
                            {car.range ? ` · ${car.range}` : ""}
                            {car.price ? ` · ${car.price}` : ""}
                          </p>
                        </div>
                        {selected?.id === car.id && (
                          <svg className="w-4 h-4 text-[#e50914]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </>
            )}

            {/* External API results */}
            {hasExternalResults && (
              <>
                <div className="px-4 py-1.5 text-[10px] text-green-400 uppercase tracking-widest font-bold bg-[#0d0d0d] flex items-center gap-2">
                  <span>Available from FuelEconomy.gov ({year})</span>
                  {searching && (
                    <span className="inline-block w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                {Object.entries(externalGrouped).map(([make, cars]) => (
                  <div key={`ext-${make}`}>
                    <div className="px-4 py-2 text-[11px] text-[#777] uppercase tracking-wider font-bold bg-[#141414] sticky top-0">
                      {make}
                    </div>
                    {cars.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleSelectExternal(car)}
                        disabled={enriching === car.id}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left disabled:opacity-50"
                      >
                        <div className="w-8 h-8 rounded bg-[#333] flex items-center justify-center flex-shrink-0 text-[11px] text-[#777] font-bold">
                          {make.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-white truncate">
                            {make} {car.model}
                          </p>
                          <p className="text-[11px] text-[#666]">{car.year}</p>
                        </div>
                        {enriching === car.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-[10px] text-green-400/80 bg-green-400/10 px-2 py-0.5 rounded">
                            + Add
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </>
            )}

            {/* Loading state */}
            {searching && !hasExternalResults && query.length >= 2 && (
              <div className="p-4 text-center">
                <span className="inline-block w-5 h-5 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                <p className="text-[12px] text-[#777] mt-2">Searching FuelEconomy.gov...</p>
              </div>
            )}

            {/* Empty state */}
            {!hasLocalResults && !hasExternalResults && !searching && query.length >= 2 && (
              <p className="p-4 text-[13px] text-[#777] text-center">
                No cars found for &quot;{query}&quot; ({year})
              </p>
            )}

            {/* Hint when no query */}
            {query.length < 2 && !hasLocalResults && (
              <p className="p-4 text-[13px] text-[#777] text-center">
                Type at least 2 characters to search
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
