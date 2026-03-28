"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

interface CarItem {
  id: string;
  name: string;
  brand: string;
  type: string;
  image: string;
}

export default function HeaderCarNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch cars on first open
  const handleOpen = async () => {
    setOpen(!open);
    if (!loaded) {
      const { data } = await supabase
        .from("cars")
        .select("id, name, brand, type, image")
        .order("brand", { ascending: true });
      if (data) {
        setCars(data as CarItem[]);
        setLoaded(true);
      }
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const filtered = cars.filter((car) => {
    const q = query.toLowerCase();
    return (
      car.name.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      car.type.toLowerCase().includes(q)
    );
  });

  // Group by brand
  const grouped = filtered.reduce<Record<string, CarItem[]>>((acc, car) => {
    if (!acc[car.brand]) acc[car.brand] = [];
    acc[car.brand].push(car);
    return acc;
  }, {});

  const handleSelect = (car: CarItem) => {
    setOpen(false);
    setQuery("");
    router.push(`/cars/${car.id}`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-[13px] text-[#e5e5e5] hover:text-white transition-colors"
        title="Quick jump to any car"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h.01M12 7h.01M16 7h.01M3 12h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
        <span className="hidden xl:inline">Find Car</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-3 w-[340px] bg-[#141414] border border-white/15 rounded shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any car..."
              className="w-full bg-[#333] text-white text-[14px] px-3 py-2 rounded border border-white/10 outline-none focus:border-white/30 placeholder:text-[#666]"
            />
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {!loaded ? (
              <p className="p-4 text-[13px] text-[#777] text-center">Loading cars...</p>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="p-4 text-[13px] text-[#777] text-center">No cars found</p>
            ) : (
              Object.entries(grouped).map(([brand, brandCars]) => (
                <div key={brand}>
                  <div className="px-4 py-1.5 text-[11px] text-[#777] uppercase tracking-wider font-bold bg-black/50 sticky top-0">
                    {brand}
                  </div>
                  {brandCars.map((car) => (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => handleSelect(car)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white truncate">{car.name}</p>
                        <p className="text-[11px] text-[#666]">{car.type}</p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={() => { setOpen(false); router.push("/cars"); }}
              className="w-full text-center text-[12px] text-[#999] hover:text-white py-1.5 transition-colors"
            >
              Browse all cars →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
