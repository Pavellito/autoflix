"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  make: string;
  model: string;
  year: number;
  id: string;
}

export default function HeaderCarNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [popularMakes, setPopularMakes] = useState<string[]>([]);
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

  // Load popular makes on first open
  useEffect(() => {
    if (open && popularMakes.length === 0) {
      fetch("/api/cars/catalog?action=makes&year=2026")
        .then((r) => r.json())
        .then((data) => setPopularMakes((data.makes || []).slice(0, 20)))
        .catch(() => {});
    }
  }, [open, popularMakes.length]);

  // Search with debounce
  const searchCars = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/cars/catalog?action=search&q=${encodeURIComponent(q)}&year=2026`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCars(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchCars]);

  const handleOpen = () => {
    setOpen(!open);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/cars/${slug}`);
  };

  const handleMakeClick = (make: string) => {
    setOpen(false);
    router.push(`/cars?make=${encodeURIComponent(make)}`);
  };

  // Group results by make
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, car) => {
    if (!acc[car.make]) acc[car.make] = [];
    acc[car.make].push(car);
    return acc;
  }, {});

  const getImageUrl = (make: string, model: string) => {
    const modelFamily = model.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "");
    return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(modelFamily)}&paintId=pspc0001&width=100`;
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
        <div className="absolute top-full right-0 mt-3 w-[380px] bg-[#141414] border border-white/15 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 2026 cars — type make or model..."
              className="w-full bg-[#333] text-white text-[14px] px-3 py-2.5 rounded border border-white/10 outline-none focus:border-[#e50914]/50 placeholder:text-[#555]"
            />
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {/* Search results */}
            {query.length >= 2 ? (
              <>
                {searching && (
                  <div className="p-4 text-center">
                    <span className="inline-block w-4 h-4 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] text-[#777] mt-2">Searching 2026 models...</p>
                  </div>
                )}
                {!searching && Object.keys(grouped).length === 0 && (
                  <p className="p-4 text-[13px] text-[#777] text-center">No 2026 cars found for &quot;{query}&quot;</p>
                )}
                {Object.entries(grouped).map(([make, cars]) => (
                  <div key={make}>
                    <div className="px-4 py-1.5 text-[10px] text-[#777] uppercase tracking-wider font-bold bg-black/50 sticky top-0">
                      {make}
                    </div>
                    {cars.slice(0, 5).map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleSelect(car.id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImageUrl(car.make, car.model)}
                          alt={`${car.make} ${car.model}`}
                          className="w-10 h-7 rounded object-contain flex-shrink-0 bg-[#222]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-white truncate">{car.make} {car.model}</p>
                          <p className="text-[10px] text-[#666]">2026</p>
                        </div>
                        <svg className="w-3.5 h-3.5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              /* Popular makes when no search */
              <>
                <div className="px-4 py-2 text-[10px] text-[#e50914] uppercase tracking-widest font-bold bg-black/30">
                  Popular Makes — 2026
                </div>
                <div className="grid grid-cols-2 gap-0">
                  {popularMakes.map((make) => (
                    <button
                      key={make}
                      onClick={() => {
                        setQuery(make);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors text-left border-b border-r border-white/5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(make, make)}
                        alt={make}
                        className="w-8 h-6 rounded object-contain flex-shrink-0 bg-[#222]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="text-[13px] text-white/80 truncate">{make}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={() => { setOpen(false); router.push("/cars"); }}
              className="w-full text-center text-[12px] text-[#999] hover:text-white py-1.5 transition-colors"
            >
              Browse all 2026 cars →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
