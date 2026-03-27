"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Search, MoveRight, Database, Globe, Zap } from "lucide-react";

export default function CopilotHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/copilot?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-black">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 rounded-full cursor-default">
            <Database className="w-3 h-3" />
            51 Live EV Models
          </div>
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 rounded-full cursor-default">
            <Globe className="w-3 h-3" />
            Global Pricing Index
          </div>
          <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 rounded-full cursor-default">
            <Zap className="w-3 h-3" />
            Real-Time Intelligence
          </div>
        </div>

        <h1 className="max-w-4xl mx-auto mb-6 text-5xl font-black leading-tight text-white md:text-7xl tracking-tighter">
          The Intelligence Layer for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">
            The EV Revolution
          </span>
        </h1>

        <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-400 md:text-xl font-medium">
          Don't just browse. Analyze. Compare 50+ electric vehicles using proprietary regional data, 
          real-world range analysis, and AI-driven expert insights.
        </p>

        {/* The KILLER FEATURE: AI Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Ask anything: 'Best family EV in Israel' or 'Tesla Model 3 vs BYD Seal'..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-16 py-6 text-lg text-white bg-gray-900 border border-white/10 rounded-2xl md:rounded-l-2xl md:rounded-r-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-2xl"
                />
              </div>
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 px-10 py-6 text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-2xl md:rounded-l-none md:rounded-r-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/20"
              >
                Get Insights
                <Sparkles className="w-5 h-5 fill-current" />
              </button>
            </div>
          </form>
          
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>Trending:</span>
            <button type="button" onClick={() => router.push('/copilot?q=Tesla+vs+BYD')} className="hover:text-blue-400 transition-colors">Tesla vs BYD</button>
            <span className="text-gray-800">•</span>
            <button type="button" onClick={() => router.push('/copilot?q=Cheapest+EV+in+Russia')} className="hover:text-blue-400 transition-colors">Cheapest in Russia</button>
            <span className="text-gray-800">•</span>
            <button type="button" onClick={() => router.push('/copilot?q=Best+range+SUV')} className="hover:text-blue-400 transition-colors">Best Range SUVs</button>
          </div>
        </div>

        {/* Secondary Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/cars" 
            className="group flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors"
          >
            Explore Raw Data Grid
            <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
          <div className="hidden sm:block w-px h-6 bg-gray-800"></div>
          <p className="text-sm text-gray-600">
            Expert Analysis System <span className="text-gray-400">v3.0 Early Access</span>
          </p>
        </div>
      </div>
    </section>
  );
}
