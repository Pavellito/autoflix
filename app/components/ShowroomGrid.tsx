"use client";

import { useState, useMemo } from "react";
import { Car } from "@/app/lib/data";
import CarCard from "@/app/components/CarCard";

type CurrencyMode = "auto" | "il" | "ru" | "us";

export default function ShowroomGrid({ initialCars }: { initialCars: Car[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<CurrencyMode>("auto");
  const [sortBy, setSortBy] = useState<"name" | "range" | "price">("name");

  const filteredCars = useMemo(() => {
    let result = initialCars.filter((car) => {
      const matchSearch = 
        car.brand.toLowerCase().includes(search.toLowerCase()) || 
        car.name.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });

    if (sortBy === "range") {
      result = [...result].sort((a, b) => {
        const rangeA = parseFloat(String(a.range || "0").replace(/\D/g, '')) || 0;
        const rangeB = parseFloat(String(b.range || "0").replace(/\D/g, '')) || 0;
        return rangeB - rangeA;
      });
    }

    if (sortBy === "price") {
       // Sorting by price is trickier because of currencies, default to original list or numerical global price
       result = [...result].sort((a, b) => {
          const priceA = parseFloat(String(a.price || "0").replace(/[^\d.]/g, '')) || 0;
          const priceB = parseFloat(String(b.price || "0").replace(/[^\d.]/g, '')) || 0;
          return priceA - priceB;
       });
    }

    return result;
  }, [initialCars, search, sortBy]);

  return (
    <div className="space-y-8">
      {/* Premium Search & Filter Bar */}
      <div className="sticky top-20 z-40 flex flex-col md:flex-row gap-4 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search brand or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm text-white focus:outline-none focus:border-accent/60 transition-all placeholder:text-gray-500"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {[ 
              { id: "auto", label: "Global", icon: "🌐" },
              { id: "il", label: "Israel", icon: "🇮🇱" },
              { id: "ru", label: "Russia", icon: "🇷🇺" }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setRegion(m.id as any)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  region === m.id ? "bg-accent text-white shadow-lg" : "text-gray-500 hover:text-white"
                }`}
              >
                <span className="mr-2">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          <select
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value as any)}
             className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60"
          >
             <option value="name">Sort by Name</option>
             <option value="range">Best Range</option>
             <option value="price">Entry Price</option>
          </select>
        </div>
      </div>

      {/* Dynamic Results Count */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">
          Displaying <span className="text-accent">{filteredCars.length}</span> / {initialCars.length} Vehicles
        </p>
      </div>

      {/* Animated Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {filteredCars.map((car) => {
          // Pass the region-specific price if selected
          const displayPrice = region === "auto" 
            ? car.price 
            : (car.prices?.[region] || "Price Unavailable");
          
          return (
            <CarCard 
                key={car.id} 
                car={{...car, price: displayPrice}} 
            />
          );
        })}
      </div>

      {filteredCars.length === 0 && (
         <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 uppercase tracking-widest font-bold">No vehicles match your refined search.</p>
         </div>
      )}
    </div>
  );
}
