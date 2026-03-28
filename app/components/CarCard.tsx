"use client";

import Link from "next/link";
import { Car } from "@/app/lib/data";
import VehicleImage from "@/app/components/VehicleImage";
import { useFavorites } from "@/app/lib/favorites-context";

export default function CarCard({ car }: { car: Car }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(car.id);

  return (
    <div className="netflix-card flex-shrink-0 w-[calc(100vw/2.3)] sm:w-[calc(100vw/3.3)] md:w-[calc(100vw/4.3)] lg:w-[calc(100vw/6.2)] rounded overflow-hidden relative group cursor-pointer">
      <Link href={`/cars/${car.id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] bg-[#333]">
          <VehicleImage
            src={car.image}
            alt={car.name}
            aspectRatio="aspect-full"
            className="w-full h-full object-cover"
          />
          {/* Car name overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[13px] font-bold text-white truncate">{car.name}</p>
          </div>
        </div>

        {/* Hover Popup */}
        <div className="absolute top-full left-0 right-0 bg-[#181818] p-3 rounded-b shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-40">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80"
            >
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(car.id); }}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                active ? "border-white bg-white/20 text-white" : "border-[#fff]/40 text-white hover:border-white"
              }`}
            >
              {active ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
              )}
            </button>
          </div>

          {/* Match + Info */}
          <div className="flex items-center gap-2 text-[12px] mb-1">
            <span className="text-[#46d369] font-bold">98% Match</span>
            <span className="border border-white/30 text-white/60 px-1 text-[10px]">{car.type}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-2 text-[12px] text-white/70">
            {car.range && <span>{car.range}</span>}
            {car.battery && <><span className="text-white/30">|</span><span>{car.battery}</span></>}
          </div>
          {car.price && (
            <p className="text-[12px] text-white/50 mt-1">{car.price}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
