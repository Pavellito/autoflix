"use client";

import { useState, useRef, useEffect } from "react";
import type { Car } from "@/app/lib/data";

interface CarSelectorProps {
  cars: Car[];
  selected: Car | null;
  onSelect: (car: Car) => void;
  placeholder?: string;
  label?: string;
}

export default function CarSelector({ cars, selected, onSelect, placeholder = "Search car...", label }: CarSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = cars.filter((car) => {
    const q = query.toLowerCase();
    return (
      car.name.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      car.type.toLowerCase().includes(q)
    );
  });

  // Group by brand
  const grouped = filtered.reduce<Record<string, Car[]>>((acc, car) => {
    if (!acc[car.brand]) acc[car.brand] = [];
    acc[car.brand].push(car);
    return acc;
  }, {});

  const handleSelect = (car: Car) => {
    onSelect(car);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="block text-[12px] text-[#777] uppercase tracking-wider font-bold mb-2">
          {label}
        </label>
      )}

      {/* Selected display / Input */}
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
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-white font-medium truncate">{selected.name}</p>
              <p className="text-[12px] text-[#777]">{selected.brand} · {selected.type} {selected.range ? `· ${selected.range}` : ""}</p>
            </div>
            <svg className={`w-4 h-4 text-[#777] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-[#777]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[14px] text-[#777] flex-1">{placeholder}</span>
            <svg className={`w-4 h-4 text-[#777] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded shadow-2xl z-50 max-h-[400px] overflow-hidden flex flex-col">
          {/* Search input */}
          <div className="p-3 border-b border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search brand or model..."
              className="w-full bg-[#333] text-white text-[14px] px-3 py-2 rounded border border-white/10 outline-none focus:border-white/30 placeholder:text-[#666]"
            />
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {Object.keys(grouped).length === 0 ? (
              <p className="p-4 text-[13px] text-[#777] text-center">No cars found</p>
            ) : (
              Object.entries(grouped).map(([brand, brandCars]) => (
                <div key={brand}>
                  <div className="px-4 py-2 text-[11px] text-[#777] uppercase tracking-wider font-bold bg-[#141414] sticky top-0">
                    {brand}
                  </div>
                  {brandCars.map((car) => (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => handleSelect(car)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left ${
                        selected?.id === car.id ? "bg-white/10" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white truncate">{car.name}</p>
                        <p className="text-[11px] text-[#666]">
                          {car.type} {car.range ? `· ${car.range}` : ""} {car.price ? `· ${car.price}` : ""}
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
