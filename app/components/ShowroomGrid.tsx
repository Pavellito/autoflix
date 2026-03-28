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
      return (
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.name.toLowerCase().includes(search.toLowerCase())
      );
    });

    if (sortBy === "range") {
      result = [...result].sort((a, b) => {
        const rangeA = parseFloat(String(a.range || "0").replace(/\D/g, "")) || 0;
        const rangeB = parseFloat(String(b.range || "0").replace(/\D/g, "")) || 0;
        return rangeB - rangeA;
      });
    }

    if (sortBy === "price") {
      result = [...result].sort((a, b) => {
        const priceA = parseFloat(String(a.price || "0").replace(/[^\d.]/g, "")) || 0;
        const priceB = parseFloat(String(b.price || "0").replace(/[^\d.]/g, "")) || 0;
        return priceA - priceB;
      });
    }

    return result;
  }, [initialCars, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="sticky top-[68px] z-40 flex flex-col md:flex-row gap-3 p-4 bg-[#141414]/95 backdrop-blur border-b border-white/10">
        <div className="relative flex-grow">
          <svg className="absolute left-3 top-3 w-5 h-5 text-[#777]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search brand or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#333] border border-white/10 rounded px-10 py-2.5 text-[14px] text-white focus:outline-none focus:border-white/30 placeholder:text-[#777]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#333] rounded overflow-hidden">
            {[
              { id: "auto", label: "Global" },
              { id: "il", label: "Israel" },
              { id: "ru", label: "Russia" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setRegion(m.id as CurrencyMode)}
                className={`px-4 py-2 text-[13px] font-medium transition-colors ${
                  region === m.id
                    ? "bg-white text-black"
                    : "text-[#999] hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#333] border border-white/10 text-white text-[13px] rounded px-3 py-2.5 focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="range">Best Range</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-[13px] text-[#777] px-1">
        {filteredCars.length} of {initialCars.length} vehicles
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredCars.map((car) => {
          const displayPrice =
            region === "auto"
              ? car.price
              : car.prices?.[region] || "Price N/A";

          return <CarCard key={car.id} car={{ ...car, price: displayPrice }} />;
        })}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#777] text-[16px]">No vehicles match your search.</p>
        </div>
      )}
    </div>
  );
}
