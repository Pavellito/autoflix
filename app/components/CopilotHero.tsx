"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CopilotHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/copilot?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full h-[56.25vw] max-h-[80vh] min-h-[500px] flex items-end overflow-hidden">
      {/* Billboard background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
          alt="Featured car"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Netflix-style gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-[#141414]/40 to-transparent z-[1]" />

      {/* Billboard content - Netflix style left-aligned */}
      <div className="relative z-10 w-full px-4 lg:px-14 pb-[8%] max-w-3xl">
        {/* Netflix-style title area */}
        <div className="mb-5 animate-fade-in-up">
          <p className="text-white text-lg lg:text-xl font-medium mb-2 tracking-wide opacity-90">
            AutoFlix Original
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Your AI Car
            <br />
            Intelligence Hub
          </h1>
          <p className="text-[#d2d2d2] text-base lg:text-lg max-w-xl leading-relaxed">
            Get instant expert advice on any car. Reviews, comparisons, specs, and personalized recommendations powered by AI.
          </p>
        </div>

        {/* Netflix-style action buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up">
          <Link
            href="/cars"
            className="flex items-center gap-2 bg-white text-black px-6 lg:px-8 py-2.5 rounded-[4px] text-base lg:text-lg font-bold hover:bg-white/80 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Explore Cars
          </Link>
          <Link
            href="/copilot"
            className="flex items-center gap-2 bg-[#6d6d6eb3] text-white px-6 lg:px-8 py-2.5 rounded-[4px] text-base lg:text-lg font-bold hover:bg-[#6d6d6e99] transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AI Copilot
          </Link>
        </div>

        {/* Compact search bar */}
        <form onSubmit={handleSearch} className="flex items-center max-w-lg animate-fade-in-up">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI anything about cars..."
              className="w-full bg-[#000]/50 border border-[#808080]/40 text-white text-sm px-4 py-3 pr-24 rounded-[4px] placeholder-[#808080] focus:border-white/60 transition backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-1 top-1 bottom-1 bg-[#e50914] text-white px-4 rounded-[3px] text-sm font-bold hover:bg-[#f40612] transition disabled:opacity-40 disabled:hover:bg-[#e50914]"
            >
              Ask
            </button>
          </div>
        </form>

        {/* Maturity badge */}
        <div className="flex items-center gap-3 mt-4 animate-fade-in">
          <span className="maturity-badge text-white bg-transparent">AI</span>
          <span className="text-[#bcbcbc] text-sm">Car Reviews, News, Comparisons, Expert Advice</span>
        </div>
      </div>
    </div>
  );
}
