"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cars } from "@/app/lib/data";
import FavoriteButton from "./FavoriteButton";

const FEATURED_CARS = ["car-17", "car-1", "car-5", "car-10", "car-21"];

export default function CopilotHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredCar = cars.find((c) => c.id === FEATURED_CARS[currentIndex]) || cars[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_CARS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[56.25vw] max-h-[90vh] min-h-[480px]">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={featuredCar.image}
          alt={featuredCar.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Vignette / gradient overlays — exactly like Netflix */}
      <div className="absolute inset-0 bg-[linear-gradient(77deg,rgba(0,0,0,.6)_0%,rgba(0,0,0,0)_85%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-[14.7vw] bg-[linear-gradient(180deg,transparent_0%,rgba(20,20,20,.6)_40%,#141414_100%)]" />

      {/* Content — left-aligned, bottom-third like Netflix */}
      <div className="absolute bottom-[35%] left-4 md:left-[60px] z-10 max-w-[36%] min-w-[300px]">
        {/* "Series" type label */}
        <div className="flex items-center gap-2.5 mb-3">
          <svg className="w-[22px] h-[22px] text-[#e50914]" fill="currentColor" viewBox="0 0 24 24">
            <text x="1" y="18" style={{ fontSize: "16px", fontWeight: 900, fontFamily: "Arial Black" }}>A</text>
          </svg>
          <span className="text-[#cccccc] text-[13px] font-light tracking-[3px] uppercase">
            AutoFlix Feature
          </span>
        </div>

        {/* Title — large, Netflix-style */}
        <h1 className="text-white text-[2.6vw] leading-[1.1] font-black mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,.7)]"
            style={{ fontSize: "clamp(24px, 2.8vw, 52px)" }}>
          {featuredCar.name}
        </h1>

        {/* Synopsis */}
        <p className="text-[#d2d2d2] text-[1.1vw] leading-[1.5] mb-5 drop-shadow-[0_1px_4px_rgba(0,0,0,.7)] line-clamp-3"
           style={{ fontSize: "clamp(13px, 1.1vw, 18px)" }}>
          {featuredCar.type === "EV" ? "All-Electric" : featuredCar.type} by {featuredCar.brand}.{" "}
          {featuredCar.range && `${featuredCar.range} range. `}
          {featuredCar.battery && `${featuredCar.battery} battery. `}
          {featuredCar.price && `Starting from ${featuredCar.price}. `}
          Explore full specs, compare with rivals, and get AI-powered buying advice.
        </p>

        {/* Buttons — Play + More Info, Netflix exact style */}
        <div className="flex items-center gap-2">
          <Link
            href={`/cars/${featuredCar.id}`}
            className="flex items-center gap-[10px] bg-white text-[#141414] rounded-[4px] py-[6px] px-[22px] lg:px-[28px] text-[15px] lg:text-[16px] font-bold hover:bg-[rgba(255,255,255,.75)] transition-colors"
          >
            <svg className="w-[24px] h-[24px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Explore
          </Link>
          <Link
            href={`/copilot?q=${encodeURIComponent(`Tell me about ${featuredCar.name}`)}`}
            className="flex items-center gap-[10px] bg-[rgba(109,109,110,.7)] text-white rounded-[4px] py-[6px] px-[22px] lg:px-[28px] text-[15px] lg:text-[16px] font-bold hover:bg-[rgba(109,109,110,.4)] transition-colors"
          >
            <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Link>
        </div>
      </div>

      {/* Maturity rating badge — Netflix bottom-right */}
      <div className="absolute bottom-[35%] right-0 flex items-center z-10">
        <span className="text-white text-[12px] py-[3px] pl-[8px] pr-[35px] border-l-[3px] border-[rgba(255,255,255,.6)] bg-[rgba(51,51,51,.6)]">
          {featuredCar.type}
        </span>
      </div>

      {/* Billboard indicator dots */}
      <div className="absolute bottom-[27%] right-[60px] flex items-center gap-[3px] z-10">
        {FEATURED_CARS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-[12px] h-[2px] transition-colors ${
              i === currentIndex ? "bg-[#aaa]" : "bg-[#555]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
