"use client";

import Link from "next/link";
import { Car } from "@/app/lib/data";
import VehicleImage from "@/app/components/VehicleImage";

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="netflix-card flex-shrink-0 w-[230px] lg:w-[260px] rounded-[4px] overflow-hidden bg-[#181818] group cursor-pointer">
      <Link href={`/cars/${car.id}`}>
        <div className="relative aspect-video overflow-hidden bg-[#2f2f2f]">
          <VehicleImage
            src={car.image}
            alt={car.name}
            aspectRatio="aspect-full"
            className="group-hover:scale-105 transition-transform duration-300"
          />
          {/* Type badge */}
          <div className="absolute top-2 right-2 bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
            {car.type}
          </div>
        </div>
      </Link>

      {/* Netflix-style expanded details on hover */}
      <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-0 group-hover:max-h-[200px] overflow-hidden">
        {/* Action buttons */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/cars/${car.id}`}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
          <div className="ml-auto">
            <Link
              href={`/cars/${car.id}`}
              className="w-8 h-8 border border-[#808080]/60 rounded-full flex items-center justify-center hover:border-white transition"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Title and price */}
        <h3 className="text-white text-sm font-bold mb-1">{car.name}</h3>
        <p className="text-[#46d369] text-xs font-bold mb-1.5">{car.price}</p>

        {/* Specs tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {car.range && (
            <span className="text-[#bcbcbc] border border-[#808080]/40 px-1.5 py-0.5 rounded-sm">{car.range}</span>
          )}
          {car.battery && (
            <span className="text-[#bcbcbc] border border-[#808080]/40 px-1.5 py-0.5 rounded-sm">{car.battery}</span>
          )}
          <span className="text-[#bcbcbc] border border-[#808080]/40 px-1.5 py-0.5 rounded-sm">{car.brand}</span>
        </div>
      </div>
    </div>
  );
}
