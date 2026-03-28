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
    const scrollAmount = sliderRef.current.offsetWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (!cars.length) return null;

  return (
    <section className="row-container relative mb-[3vw] group/row">
      <h2 className="text-[#e5e5e5] text-[1.4vw] font-bold mb-[.5em] px-4 md:px-[60px] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 group/title"
          style={{ fontSize: "clamp(14px, 1.4vw, 24px)" }}>
        {title}
        <svg className="w-[.8em] h-[.8em] text-[#54b9c5] opacity-0 group-hover/title:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="row-arrow absolute left-0 top-0 bottom-0 z-20 w-[60px] bg-[hsla(0,0%,8%,.5)] hover:bg-[hsla(0,0%,8%,.7)] flex items-center justify-center cursor-pointer"
        >
          <svg className="w-[40px] h-[40px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={sliderRef}
          className="flex gap-[4px] overflow-x-auto scrollbar-hide px-4 md:px-[60px]"
          style={{ scrollBehavior: "smooth" }}
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="row-arrow absolute right-0 top-0 bottom-0 z-20 w-[60px] bg-[hsla(0,0%,8%,.5)] hover:bg-[hsla(0,0%,8%,.7)] flex items-center justify-center cursor-pointer"
        >
          <svg className="w-[40px] h-[40px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
