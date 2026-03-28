"use client";

import { useRef } from "react";
import CarCard from "./CarCard";
import type { Car } from "@/app/lib/data";

export default function CarRow({
  title,
  cars,
}: {
  title: string;
  cars: Car[];
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (!cars.length) return null;

  return (
    <section className="row-container relative mb-2 group/row">
      <h2 className="text-[#e5e5e5] text-base lg:text-xl font-bold mb-1 px-4 lg:px-14 hover:text-white transition-colors cursor-pointer flex items-center gap-2 group/title">
        {title}
        <span className="text-[#54b9c5] text-xs font-bold opacity-0 group-hover/title:opacity-100 transition-opacity flex items-center gap-1">
          Explore All
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="row-arrow absolute left-0 top-0 bottom-0 z-20 w-12 lg:w-14 bg-[#141414]/60 hover:bg-[#141414]/90 flex items-center justify-center transition rounded-r-[4px]"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={sliderRef}
          className="netflix-slider flex gap-1.5 overflow-x-auto scrollbar-hide px-4 lg:px-14 pb-4 pt-2"
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="row-arrow absolute right-0 top-0 bottom-0 z-20 w-12 lg:w-14 bg-[#141414]/60 hover:bg-[#141414]/90 flex items-center justify-center transition rounded-l-[4px]"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
