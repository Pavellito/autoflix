"use client";

import { useState } from "react";
import { Car } from "@/app/lib/data";

const REGIONS = [
  { id: "us", label: "Global / US", flag: "🌍" },
  { id: "il", label: "Israel", flag: "🇮🇱" },
  { id: "ru", label: "Russia", flag: "🇷🇺" },
  { id: "ar", label: "Arabic World", flag: "🇸🇦" },
];

export default function RegionalCarInfo({ car }: { car: Car }) {
  const [region, setRegion] = useState<keyof NonNullable<Car["prices"]>>("us");

  const price = car.prices?.[region] || car.price;
  const advice = car.regionalAdvice?.[region];

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Your Region</h3>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                region === r.id
                  ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="mr-2">{r.flag}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Price Card */}
        <div className="bg-black/40 p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all" />
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Local Price</h4>
          <span className="text-3xl font-black text-green-400 tracking-tight">
            {price}
          </span>
          <p className="text-[10px] text-gray-600 mt-2 italic font-medium">
            * Estimated starting price in {REGIONS.find(r => r.id === region)?.label}
          </p>
        </div>

        {/* Regional Advice Card */}
        <div className="bg-accent/5 p-5 rounded-2xl border border-accent/20 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all" />
          <h4 className="text-xs font-bold text-accent/80 uppercase tracking-widest mb-2 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Should you buy in {REGIONS.find(r => r.id === region)?.label}?
          </h4>
          <p className="text-sm text-gray-200 leading-relaxed font-medium italic">
            "{advice || "Local market data pending analysis."}"
          </p>
        </div>
      </div>
    </div>
  );
}
