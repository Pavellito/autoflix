"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, LayoutGrid, Sparkles, BookOpen, User, Globe, ChevronDown } from "lucide-react";

export default function Header() {
  const [region, setRegion] = useState("Global");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO (Identity Layer) */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            Auto<span className="text-blue-500">Flix</span>
          </span>
          <div className="hidden sm:block ml-2 px-1.5 py-0.5 text-[8px] font-bold text-gray-500 border border-gray-800 rounded uppercase tracking-[0.2em]">
            Intelligence
          </div>
        </Link>

        {/* NAVIGATION (Clarity Layer) */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
          <Link href="/cars" className="flex items-center gap-2 hover:text-white transition-colors">
            <LayoutGrid className="w-3.5 h-3.5" />
            Catalog
          </Link>
          <Link href="/copilot" className="flex items-center gap-2 hover:text-blue-400 transition-colors text-blue-500/80">
            <Sparkles className="w-3.5 h-3.5" />
            Co-Pilot
          </Link>
          <Link href="/news" className="flex items-center gap-2 hover:text-white transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            News
          </Link>
          <Link href="/garage" className="flex items-center gap-2 hover:text-white transition-colors">
            <User className="w-3.5 h-3.5" />
            My Garage
          </Link>
        </nav>

        {/* ACTIONS (Product Layer) */}
        <div className="flex items-center gap-4">
          {/* Region Selector (Trust/ Differentiation) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{region}</span>
            <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
          </div>

          <div className="w-[1px] h-6 bg-white/10 hidden md:block" />

          <button className="px-5 py-2 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:text-white shadow-lg active:scale-95">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
