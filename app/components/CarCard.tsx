"use client";

import Link from "next/link";
import { Car } from "@/app/lib/data";
import VehicleImage from "@/app/components/VehicleImage";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="netflix-card flex-shrink-0 w-[calc(100vw/2.5)] sm:w-[calc(100vw/3.5)] md:w-[calc(100vw/4.5)] lg:w-[calc(100vw/6.2)] min-w-[150px] rounded-[4px] overflow-hidden bg-[#181818] group relative"
    >
      {/* Thumbnail — clean image, Netflix style */}
      <div className="relative aspect-video overflow-hidden bg-[#2f2f2f]">
        <VehicleImage
          src={car.image}
          alt={car.name}
          aspectRatio="aspect-full"
          className=""
        />
        {/* Subtle name overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-5">
          <p className="text-white text-[12px] font-bold truncate drop-shadow-sm">{car.name}</p>
        </div>
      </div>

      {/* Hover expansion */}
      <div className="absolute left-0 right-0 top-full bg-[#181818] rounded-b-[4px] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,.8)] z-20 pointer-events-none group-hover:pointer-events-auto">
        {/* Action buttons */}
        <div className="flex items-center gap-[6px] mb-2">
          <span className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center">
            <svg className="w-[14px] h-[14px] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="w-[30px] h-[30px] border border-[rgba(255,255,255,.5)] rounded-full flex items-center justify-center ml-auto hover:border-white">
            <svg className="w-[14px] h-[14px] text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-[6px] text-[12px] mb-1">
          <span className="text-[#46d369] font-bold">{car.price}</span>
          <span className="border border-[rgba(255,255,255,.4)] text-[#bcbcbc] text-[10px] px-[4px] leading-[16px]">{car.type}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-1 text-[11px] text-white">
          {car.range && <span>{car.range}</span>}
          {car.range && car.battery && <span className="w-[3px] h-[3px] bg-[#646464] rounded-full" />}
          {car.battery && <span>{car.battery}</span>}
          <span className="w-[3px] h-[3px] bg-[#646464] rounded-full" />
          <span>{car.brand}</span>
        </div>
      </div>
    </Link>
  );
}
