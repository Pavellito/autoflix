"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CopilotHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Redirect to the new Copilot interface with the query
    router.push(`/copilot?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full h-[85vh] md:h-[75vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black pb-12 rounded-b-3xl">
      {/* Background Video/Image Layer with AI Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1593941707882-a5bba14938cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="EV Platform Background"
          className="w-full h-full object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center pt-24">
        
        {/* Startup Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in group hover:bg-accent/20 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] group-hover:text-white transition-colors">
            AutoFlix Intelligence v3.0 Early Access
          </span>
        </div>

        {/* Hero Copy */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 uppercase tracking-tighter italic leading-[0.9]">
          The AI Platform <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
            For Everything <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">EV</span>
          </span>
        </h1>
        
        <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto font-medium mb-12 tracking-wide">
          Stop guessing. Get instant, deeply intelligent technical advice, localized price checks, and data-backed buying recommendations utilizing our global EV neural network.
        </p>

        {/* Copilot Search Bar */}
        <div className="w-full max-w-3xl relative animate-fade-in-up delay-200">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 rounded-2xl blur-lg opacity-50" />
          <form onSubmit={handleSearch} className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex items-center p-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all duration-300 ease-out group">
            <div className="pl-4 h-full flex items-center justify-center opacity-50 group-focus-within:opacity-100 group-focus-within:text-accent transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about EVs (e.g., 'Compare Model 3 vs BYD Seal in Israel'...)"
              autoFocus
              className="w-full bg-transparent border-none text-white text-base md:text-lg px-4 py-4 md:py-5 font-medium placeholder-gray-600 focus:outline-none focus:ring-0"
            />
            
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 md:px-8 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shadow-xl hidden sm:flex items-center justify-center gap-2"
            >
              Ask AI
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={!query.trim()}
              className="sm:hidden absolute right-2 top-2 bottom-2 bg-white text-black w-12 rounded-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Suggested Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-6">
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest mr-2">Try:</span>
            {["Best EV under ₪150k?", "Tesla Model 3 vs BYD Seal", "Most reliable EV battery?"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                   setQuery(suggestion);
                   router.push(`/copilot?q=${encodeURIComponent(suggestion)}`);
                }}
                className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-gray-400 text-xs hover:text-white hover:border-white/20 transition-all cursor-pointer whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
