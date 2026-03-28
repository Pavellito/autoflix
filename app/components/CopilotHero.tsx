"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Car } from "@/app/lib/data";
import VehicleImage from "./VehicleImage";

const FALLBACK_FEATURED = [
  {
    id: "tesla-model-y",
    name: "Tesla Model Y Juniper",
    tagline: "The best-selling EV on the planet, now completely redesigned for 2025.",
    specs: "530 km range | 0-100 in 5.0s | Dual Motor AWD",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&q=80",
  },
  {
    id: "porsche-taycan",
    name: "Porsche Taycan Turbo S",
    tagline: "Electrified precision. 761 horsepower of pure Porsche engineering.",
    specs: "507 km range | 0-100 in 2.8s | Performance Battery Plus",
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1920&q=80",
  },
  {
    id: "byd-seal",
    name: "BYD Seal",
    tagline: "China's answer to the Model 3. Blade Battery tech meets stunning design.",
    specs: "570 km range | 0-100 in 3.8s | 82 kWh Blade Battery",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1920&q=80",
  },
];

function buildTagline(car: Car): string {
  const parts: string[] = [];
  if (car.range) parts.push(car.range + " range");
  if (car.battery) parts.push(car.battery);
  if (car.chargingCurve?.maxSpeed) parts.push(car.chargingCurve.maxSpeed + " charging");
  return parts.join(" | ") || `${car.brand} ${car.type}`;
}

export default function CopilotHero({ cars }: { cars?: Car[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Use real cars from DB if available, otherwise use fallback
  const featured = useMemo(() => {
    if (!cars || cars.length === 0) return FALLBACK_FEATURED;

    // Pick up to 5 featured cars from the database (prefer ones with images)
    const picked = cars.filter(c => c.image).slice(0, 5);
    if (picked.length === 0) return FALLBACK_FEATURED;

    return picked.map(car => ({
      id: car.id,
      name: car.name,
      tagline: `${car.brand} ${car.type}. ${buildTagline(car)}`,
      specs: [car.range, car.battery, car.price].filter(Boolean).join(" | "),
      image: car.image,
    }));
  }, [cars]);

  const current = featured[activeIndex % featured.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % featured.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [featured.length]);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full">
      {/* Background Image */}
      {featured.map((car, i) => (
        <div
          key={car.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === (activeIndex % featured.length) ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Netflix Gradient Overlays */}
      <div className="absolute inset-0 billboard-vignette" />
      <div className="absolute inset-0 billboard-bottom" />

      {/* Content - Left Aligned like Netflix */}
      <div className="absolute bottom-[35%] left-[4%] z-10 max-w-xl animate-fade-in" key={activeIndex}>
        <p className="text-[12px] font-bold text-white/80 tracking-[0.3em] uppercase mb-3">
          AutoFlix Featured
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-none" style={{ fontFamily: "Arial Black, Helvetica Neue, sans-serif" }}>
          {current.name}
        </h1>
        <p className="text-[18px] text-white/90 mb-2 font-medium leading-relaxed max-w-lg">
          {current.tagline}
        </p>
        <p className="text-[14px] text-white/60 mb-6">{current.specs}</p>

        <div className="flex items-center gap-3">
          <Link
            href={`/cars/${current.id}`}
            className="flex items-center gap-2 bg-white text-black px-7 py-2.5 rounded text-[16px] font-bold hover:bg-white/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Explore
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 bg-[#6d6d6e]/70 text-white px-7 py-2.5 rounded text-[16px] font-bold hover:bg-[#6d6d6e]/50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Link>
        </div>
      </div>

      {/* Maturity Rating Badge - Bottom Right */}
      <div className="absolute bottom-[35%] right-0 z-10 flex items-center">
        <span className="bg-[#333]/60 text-white text-[14px] px-3 py-1 border-l-[3px] border-white/40">
          EV
        </span>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-[28%] left-[4%] z-10 flex gap-1.5">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === (activeIndex % featured.length) ? "w-6 bg-white" : "w-3 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
