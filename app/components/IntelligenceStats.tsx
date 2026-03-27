"use client";

import { useEffect, useState } from "react";
import { Database, Globe, Zap, Cpu } from "lucide-react";

export default function IntelligenceStats() {
  const [counts, setCounts] = useState({ cars: 51, news: 182 });

  return (
    <section className="py-12 bg-[#050505] border-y border-white/5">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white italic tracking-tighter mb-1">{counts.cars}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Vehicles Integrated</div>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white italic tracking-tighter mb-1">{counts.news}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Geo-Regional Signals</div>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white italic tracking-tighter mb-1">0.4s</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Query Latency</div>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-white italic tracking-tighter mb-1">RAG</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Intelligence Engine</div>
          </div>
        </div>
      </div>
    </section>
  );
}
