"use client";

import { useRef } from "react";
import type { Car } from "@/app/lib/data";
import CarCard from "./CarCard";

export default function CarRow({ title, cars }: { title: string; cars: Car[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (cars.length === 0) return null;

  return (
    <section className="row-container mb-[3vw] relative group/row">
      <h2 className="text-[1.4vw] min-text-[16px] font-bold text-[#e5e5e5] mb-2 px-[60px] flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
        {title}
        <span className="text-[#54b9c5] text-[0.9vw] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Explore All
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="row-arrow absolute left-0 top-0 bottom-0 w-[60px] z-20 flex items-center justify-center bg-black/50 hover:bg-black/80 transition-colors"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          className="flex gap-[4px] overflow-x-auto scrollbar-hide px-[60px] py-4"
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="row-arrow absolute right-0 top-0 bottom-0 w-[60px] z-20 flex items-center justify-center bg-black/50 hover:bg-black/80 transition-colors"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
