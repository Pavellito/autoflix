"use client";

import Link from "next/link";
import { cars } from "@/app/lib/data";

export default function CompareHubPage() {
  // Curated high-value matchups
  const featuredMatchups = [
    { id: "car-1-vs-car-4", title: "Tesla Model 3 vs BYD Seal", subtitle: "The Battle of Electric Sedans" },
    { id: "car-1-vs-car-5", title: "Tesla Model Y vs 3", subtitle: "Best All-Rounder" },
    { id: "car-3-vs-car-5", title: "Hyundai Ioniq 5 vs Model Y", subtitle: "Style vs Software" },
  ];

  // Best of Lists (SEO Drivers)
  const bestOfLists = [
    { title: "Best EV Under ₪200,000", tag: "IL", cars: ["car-2", "car-4"] },
    { title: "Longest Range Family SUVs", tag: "GLOBAL", cars: ["car-5", "car-3"] },
    { title: "Top Performance Electric Sedans", tag: "GLOBAL", cars: ["car-1", "car-4"] },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter italic uppercase">
            THE <span className="text-accent">ULTIMATE</span> SHOWDOWN
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-medium">
            Side-by-side technical analysis, regional price checks, and AI-powered expert verdicts for the world's top EVs.
          </p>
        </header>

        {/* Featured Matchups */}
        <section className="mb-20">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-8 text-center">Featured Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMatchups.map((m) => (
              <Link
                key={m.id}
                href={`/compare/${m.id}`}
                className="group relative bg-card-bg/40 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/40 transition-all duration-500 shadow-2xl"
              >
                <div className="p-8 pb-12 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    {m.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-6 group-hover:text-accent transition-colors">
                    {m.title}
                  </h3>
                  <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-accent transition-all duration-700 ease-out" />
                  </div>
                  <div className="mt-6 px-6 py-2 bg-white/5 text-[10px] font-black text-white uppercase tracking-widest rounded-full border border-white/10 group-hover:bg-accent group-hover:border-accent transition-all">
                    Compare Now
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Of Grid */}
        <section className="mb-20">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">Curated Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {bestOfLists.map((list, i) => (
              <div key={i} className="bg-card-bg/20 rounded-3xl border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/[0.02] transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-accent/20 text-accent text-[8px] font-black uppercase rounded tracking-[0.2em]">
                      {list.tag}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Editor's Choice</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{list.title}</h3>
                </div>
                
                <div className="flex -space-x-4 items-center">
                   {list.cars.map((carId) => {
                     const car = cars.find(c => c.id === carId);
                     return (
                       <div key={carId} className="w-16 h-16 rounded-full border-2 border-black overflow-hidden shadow-xl hover:translate-y-[-4px] transition-transform">
                         <img src={car?.image} alt={car?.name} className="w-full h-full object-cover" />
                       </div>
                     )
                   })}
                   <Link 
                    href="/compare"
                    className="ml-6 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all shadow-xl"
                   >
                     View List →
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Car-to-Car Selector (Coming Soon / Simple Grid) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">All Matchups</h2>
            <div className="h-[1px] flex-1 mx-8 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Small cards for quick access */}
             {cars.slice(0, 4).map((car1, i) => (
               cars.slice(i + 1, i + 2).map((car2) => (
                <Link
                  key={`${car1.id}-${car2.id}`}
                  href={`/compare/${car1.id}-vs-${car2.id}`}
                  className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                    {car1.name} <span className="text-accent italic mx-1">vs</span> {car2.name}
                  </span>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
               ))
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
