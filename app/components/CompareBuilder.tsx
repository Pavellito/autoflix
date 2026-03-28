"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Car } from "@/app/lib/data";
import CarSelector from "./CarSelector";
import VehicleImage from "./VehicleImage";

export default function CompareBuilder({ cars }: { cars: Car[] }) {
  const [car1, setCar1] = useState<Car | null>(null);
  const [car2, setCar2] = useState<Car | null>(null);
  const router = useRouter();

  const canCompare = car1 && car2 && car1.id !== car2.id;

  const handleCompare = () => {
    if (canCompare) {
      router.push(`/compare/${car1.id}-vs-${car2.id}`);
    }
  };

  return (
    <div>
      {/* Selector Area */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 md:gap-6 items-end mb-10">
        <CarSelector
          cars={cars}
          selected={car1}
          onSelect={setCar1}
          label="Car A"
          placeholder="Choose first car..."
        />

        <div className="hidden md:flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#e50914] flex items-center justify-center text-white font-black text-[14px] mb-0">
            VS
          </div>
        </div>

        <CarSelector
          cars={cars.filter((c) => c.id !== car1?.id)}
          selected={car2}
          onSelect={setCar2}
          label="Car B"
          placeholder="Choose second car..."
        />
      </div>

      {/* Preview Cards */}
      {(car1 || car2) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[car1, car2].map((car, i) =>
            car ? (
              <div key={car.id} className="relative rounded overflow-hidden bg-[#1a1a1a] border border-white/10">
                <div className="aspect-[16/9] relative">
                  <VehicleImage src={car.image} alt={car.name} aspectRatio="h-full" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[12px] text-[#e50914] font-bold uppercase tracking-wider mb-1">
                      Car {i === 0 ? "A" : "B"}
                    </p>
                    <h3 className="text-[20px] font-bold text-white">{car.name}</h3>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[11px] text-[#777] mb-0.5">Type</p>
                    <p className="text-[13px] text-white font-medium">{car.type}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#777] mb-0.5">Range</p>
                    <p className="text-[13px] text-white font-medium">{car.range || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#777] mb-0.5">Price</p>
                    <p className="text-[13px] text-white font-medium">{car.price || "N/A"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={`empty-${i}`} className="aspect-[16/9] rounded border-2 border-dashed border-white/10 flex items-center justify-center">
                <p className="text-[14px] text-[#555]">Select Car {i === 0 ? "A" : "B"}</p>
              </div>
            )
          )}
        </div>
      )}

      {/* Compare Button */}
      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={!canCompare}
          className="px-10 py-3 bg-white text-black font-bold text-[16px] rounded hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Compare Now
        </button>
        {car1 && car2 && car1.id === car2.id && (
          <p className="text-[#e50914] text-[13px] mt-2">Please select two different cars</p>
        )}
      </div>
    </div>
  );
}
