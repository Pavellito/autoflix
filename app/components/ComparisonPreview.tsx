"use client";

import { MoveRight, Zap, Target, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function ComparisonPreview() {
  return (
    <section className="py-24 bg-black">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-black text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/10 uppercase tracking-[0.3em]">
            <Target className="w-3 h-3" />
            Comparison Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6">
            The Industry <span className="text-gray-500">Benchmark</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium">
            Our analysis engine normalizes performance metrics across disparate manufacturers to provide 
            an objective, data-backed truth for the global EV market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-3xl">
          {/* Tesla Model 3 */}
          <div className="bg-[#0a0a0a] p-10 hover:bg-white/[0.02] transition-colors relative group">
             <div className="flex items-center justify-between mb-8">
               <div className="text-sm font-bold text-blue-400 tracking-widest uppercase">Benchmark A</div>
               <div className="px-2 py-0.5 text-[8px] font-black bg-blue-500 text-white rounded uppercase italic">Leader</div>
             </div>
             <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">Tesla Model 3</h3>
             <p className="text-gray-500 text-sm mb-10">Highland Refresh (Long Range)</p>
             
             <div className="space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Real-World Range</span>
                 <span className="text-white font-black italic">629 KM</span>
               </div>
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Global Price</span>
                 <span className="text-white font-black italic">$43,900</span>
               </div>
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Charging Speed</span>
                 <span className="text-emerald-400 font-black italic">250 KW (Fast)</span>
               </div>
             </div>
          </div>

          {/* BYD Seal */}
          <div className="bg-[#0a0a0a] p-10 hover:bg-white/[0.02] transition-colors relative group">
             <div className="flex items-center justify-between mb-8">
               <div className="text-sm font-bold text-emerald-400 tracking-widest uppercase">Benchmark B</div>
               <div className="px-2 py-0.5 text-[8px] font-black bg-emerald-500 text-white rounded uppercase italic">Challenger</div>
             </div>
             <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">BYD Seal</h3>
             <p className="text-gray-500 text-sm mb-10">Excellence AWD (82kWh) Edition</p>
             
             <div className="space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Real-World Range</span>
                 <span className="text-white font-black italic">570 KM</span>
               </div>
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Global Price</span>
                 <span className="text-white font-black italic">$39,200</span>
               </div>
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Charging Speed</span>
                 <span className="text-emerald-400 font-black italic">150 KW (Standard)</span>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-xl group">
             Run Full Deep Analysis
             <Zap className="w-4 h-4 fill-current transition-transform group-hover:scale-125" />
          </button>
        </div>
      </div>
    </section>
  );
}
