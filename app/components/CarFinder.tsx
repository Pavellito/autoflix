"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Car } from "@/app/lib/data";
import VehicleImage from "./VehicleImage";

interface ExternalCar {
  make: string;
  model: string;
  year: number;
  id: string;
}

interface CarFinderProps {
  localCars: Car[];
}

export default function CarFinder({ localCars }: CarFinderProps) {
  const router = useRouter();

  // Step-based selection
  const [year, setYear] = useState(2026);
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Search mode
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExternalCar[]>([]);
  const [searching, setSearching] = useState(false);

  // Results
  const [enriching, setEnriching] = useState<string | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<"browse" | "search">("browse");

  // Fetch makes when year changes
  useEffect(() => {
    let cancelled = false;
    setLoadingMakes(true);
    setSelectedMake("");
    setSelectedModel("");
    setModels([]);

    fetch(`/api/cars/catalog?action=makes&year=${year}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setMakes(data.makes || []);
          setLoadingMakes(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingMakes(false);
      });

    return () => { cancelled = true; };
  }, [year]);

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      return;
    }

    let cancelled = false;
    setLoadingModels(true);
    setSelectedModel("");

    fetch(`/api/cars/catalog?action=models&year=${year}&make=${encodeURIComponent(selectedMake)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setModels(data.models || []);
          setLoadingModels(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingModels(false);
      });

    return () => { cancelled = true; };
  }, [selectedMake, year]);

  // Search with debounce
  const searchExternal = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/cars/catalog?action=search&q=${encodeURIComponent(q)}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  }, [year]);

  useEffect(() => {
    if (viewMode !== "search") return;
    const timer = setTimeout(() => searchExternal(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, searchExternal, viewMode]);

  // Navigate to car
  const goToCar = (carId: string) => {
    router.push(`/cars/${carId}`);
  };

  // Enrich and navigate
  const enrichAndGo = async (make: string, model: string, yr: number) => {
    const slug = `${make}-${model}-${yr}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    setEnriching(slug);

    // Just navigate — the car detail page handles external fetching on-demand
    router.push(`/cars/${slug}`);
  };

  // Get image URL for external car
  const getImageUrl = (make: string, model: string) => {
    const modelFamily = model.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "");
    return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(modelFamily)}&paintId=pspc0001`;
  };

  // Filter local cars by search
  const filteredLocal = localCars.filter((car) => {
    if (!searchQuery) return false;
    const q = searchQuery.toLowerCase();
    return car.name.toLowerCase().includes(q) || car.brand.toLowerCase().includes(q);
  });

  // Only show 2026 (newest) — user requested no old cars
  const years = [2026];

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("browse")}
          className={`px-6 py-2.5 rounded text-[14px] font-bold transition-colors ${
            viewMode === "browse"
              ? "bg-[#e50914] text-white"
              : "bg-[#333] text-[#999] hover:text-white"
          }`}
        >
          Browse by Make
        </button>
        <button
          onClick={() => setViewMode("search")}
          className={`px-6 py-2.5 rounded text-[14px] font-bold transition-colors ${
            viewMode === "search"
              ? "bg-[#e50914] text-white"
              : "bg-[#333] text-[#999] hover:text-white"
          }`}
        >
          Quick Search
        </button>
      </div>

      {viewMode === "browse" ? (
        <>
          {/* Step 1: Year */}
          <div>
            <h3 className="text-[14px] text-[#777] uppercase tracking-wider font-bold mb-3">
              1. Select Year
            </h3>
            <div className="flex flex-wrap gap-2">
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setYear(yr)}
                  className={`px-4 py-2 rounded text-[14px] font-medium transition-colors ${
                    year === yr
                      ? "bg-[#e50914] text-white"
                      : "bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white border border-white/5"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Make */}
          <div>
            <h3 className="text-[14px] text-[#777] uppercase tracking-wider font-bold mb-3">
              2. Select Make
            </h3>
            {loadingMakes ? (
              <div className="flex items-center gap-2 text-[#777] text-[14px]">
                <span className="inline-block w-4 h-4 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                Loading makes for {year}...
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {makes.map((make) => (
                  <button
                    key={make}
                    onClick={() => setSelectedMake(make)}
                    className={`px-3 py-3 rounded text-[13px] font-medium transition-all text-center ${
                      selectedMake === make
                        ? "bg-white text-black ring-2 ring-[#e50914]"
                        : "bg-[#2a2a2a] text-[#ccc] hover:bg-[#333] hover:text-white border border-white/5"
                    }`}
                  >
                    {make}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Model */}
          {selectedMake && (
            <div>
              <h3 className="text-[14px] text-[#777] uppercase tracking-wider font-bold mb-3">
                3. Select Model — {selectedMake} {year}
              </h3>
              {loadingModels ? (
                <div className="flex items-center gap-2 text-[#777] text-[14px]">
                  <span className="inline-block w-4 h-4 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                  Loading models...
                </div>
              ) : models.length === 0 ? (
                <p className="text-[#777] text-[14px]">No models found for {selectedMake} {year}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {models.map((model) => {
                    const slug = `${selectedMake}-${model}-${year}`
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");
                    const isEnriching = enriching === slug;
                    // Check if this car is already in local DB
                    const localMatch = localCars.find(
                      (c) => c.brand.toLowerCase() === selectedMake.toLowerCase() &&
                        c.name.toLowerCase().includes(model.toLowerCase().split(" ")[0])
                    );

                    return (
                      <button
                        key={model}
                        onClick={() => {
                          if (localMatch) {
                            goToCar(localMatch.id);
                          } else {
                            enrichAndGo(selectedMake, model, year);
                          }
                        }}
                        disabled={isEnriching}
                        className="group relative bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all text-left disabled:opacity-50"
                      >
                        <div className="aspect-[16/10] relative overflow-hidden bg-[#0a0a0a]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={localMatch?.image || getImageUrl(selectedMake, model)}
                            alt={`${selectedMake} ${model}`}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMake + " " + model)}&background=1a1a1a&color=777&size=320&font-size=0.2`;
                            }}
                          />
                          {localMatch && (
                            <span className="absolute top-2 right-2 text-[10px] bg-[#e50914] text-white px-2 py-0.5 rounded font-bold">
                              IN DB
                            </span>
                          )}
                          {isEnriching && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="inline-block w-6 h-6 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-[14px] text-white font-medium truncate group-hover:text-white/90">
                            {selectedMake} {model}
                          </p>
                          <p className="text-[12px] text-[#666] mt-0.5">{year}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Search Mode */
        <div>
          <div className="relative max-w-2xl">
            <svg className="absolute left-4 top-4 w-5 h-5 text-[#777]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type any car brand or model... (e.g. Toyota, BMW, Model 3)"
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-[16px] text-white focus:outline-none focus:border-[#e50914] placeholder:text-[#555]"
              autoFocus
            />
            {searching && (
              <span className="absolute right-4 top-4 inline-block w-5 h-5 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Year filter for search */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[12px] text-[#666]">Year:</span>
            <div className="flex flex-wrap gap-1">
              {[2026].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setYear(yr)}
                  className={`px-2.5 py-1 text-[12px] rounded transition-colors ${
                    year === yr
                      ? "bg-[#e50914] text-white"
                      : "bg-[#2a2a2a] text-[#777] hover:bg-[#333]"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchQuery.length >= 2 && (
            <div className="mt-6 space-y-4">
              {/* Local matches */}
              {filteredLocal.length > 0 && (
                <div>
                  <h3 className="text-[12px] text-[#e50914] uppercase tracking-widest font-bold mb-3">
                    In Your Database ({filteredLocal.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredLocal.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => goToCar(car.id)}
                        className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-[#e50914]/50 transition-all text-left"
                      >
                        <div className="aspect-[16/10] relative overflow-hidden bg-[#0a0a0a]">
                          <VehicleImage
                            src={car.image}
                            alt={car.name}
                            aspectRatio="h-full"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 right-2 text-[10px] bg-[#e50914] text-white px-2 py-0.5 rounded font-bold">
                            {car.type}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-[14px] text-white font-medium truncate">{car.name}</p>
                          <p className="text-[12px] text-[#666] mt-0.5">
                            {car.brand} {car.range ? `· ${car.range}` : ""} {car.price ? `· ${car.price}` : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* External results */}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-[12px] text-green-400 uppercase tracking-widest font-bold mb-3">
                    All Cars — FuelEconomy.gov {year} ({searchResults.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {searchResults.map((car) => {
                      const slug = car.id;
                      const isEnriching = enriching === slug;
                      return (
                        <button
                          key={car.id}
                          onClick={() => enrichAndGo(car.make, car.model, car.year)}
                          disabled={isEnriching}
                          className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-green-400/30 transition-all text-left disabled:opacity-50"
                        >
                          <div className="aspect-[16/10] relative overflow-hidden bg-[#0a0a0a]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getImageUrl(car.make, car.model)}
                              alt={`${car.make} ${car.model}`}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(car.make)}&background=1a1a1a&color=777&size=320&font-size=0.3`;
                              }}
                            />
                            {isEnriching && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="inline-block w-6 h-6 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-[14px] text-white font-medium truncate">
                              {car.make} {car.model}
                            </p>
                            <p className="text-[12px] text-[#666] mt-0.5">{car.year}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!searching && filteredLocal.length === 0 && searchResults.length === 0 && (
                <p className="text-[#777] text-[14px] text-center py-8">
                  No cars found for &quot;{searchQuery}&quot; ({year}). Try a different year or spelling.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Popular 2026 Models */}
      {viewMode === "browse" && !selectedMake && (
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-[16px] text-white font-bold mb-4">
            Popular 2026 Models
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[
              { make: "BMW", model: "X5", label: "BMW X5" },
              { make: "Mercedes-Benz", model: "GLC", label: "Mercedes GLC" },
              { make: "Audi", model: "Q5", label: "Audi Q5" },
              { make: "Tesla", model: "ModelY", label: "Tesla Model Y" },
              { make: "Toyota", model: "Camry", label: "Toyota Camry" },
              { make: "Porsche", model: "911", label: "Porsche 911" },
              { make: "Honda", model: "Civic", label: "Honda Civic" },
              { make: "Hyundai", model: "Tucson", label: "Hyundai Tucson" },
              { make: "Ford", model: "Mustang", label: "Ford Mustang" },
              { make: "Lexus", model: "RX", label: "Lexus RX" },
              { make: "Kia", model: "Sportage", label: "Kia Sportage" },
              { make: "Chevrolet", model: "Corvette", label: "Chevrolet Corvette" },
            ].map((car) => (
              <button
                key={car.label}
                onClick={() => enrichAndGo(car.make, car.model, 2026)}
                className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all text-left"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(car.make, car.model)}
                    alt={car.label}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(car.label)}&background=1a1a1a&color=777&size=320&font-size=0.2`;
                    }}
                  />
                  <span className="absolute top-2 right-2 text-[10px] bg-[#e50914] text-white px-2 py-0.5 rounded font-bold">
                    2026
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[13px] text-white font-medium truncate">{car.label}</p>
                  <p className="text-[11px] text-[#666] mt-0.5">2026 · Full Specs</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
