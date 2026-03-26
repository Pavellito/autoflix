"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import AiSummary from "@/app/components/AiSummary";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  region: string;
  source_id: string;
  published_at: string;
  summary: any;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const autoSyncAttempted = useRef(false);

  async function fetchNews() {
    setLoading(true);
    try {
      let query = supabase.from("news").select("*").order("published_at", { ascending: false }).limit(20);
      if (filter !== "all") {
        query = query.eq("region", filter);
      }
      const { data, error } = await query;
      if (!error && data) {
        setNews(data);
        return data.length;
      }
      // Table likely doesn't exist
      if (error) {
        console.warn("[News] Supabase error:", error.message);
        setSyncError(error.message.includes("relation") ? "The 'news' table doesn't exist yet in Supabase." : error.message);
      }
      return 0;
    } catch (e: any) {
      console.warn("[News] Fetch error:", e);
      return 0;
    } finally {
      setLoading(false);
    }
  }

  async function triggerIngestion() {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/news/ingest");
      const data = await res.json();
      if (data.success) {
        // Re-fetch news after ingestion
        await fetchNews();
      } else {
        setSyncError(data.error || "Ingestion failed. Check if the 'news' table exists in Supabase.");
      }
    } catch (e: any) {
      setSyncError("Network error: " + e.message);
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    async function init() {
      const count = await fetchNews();
      // Auto-sync on first visit if no news found
      if (count === 0 && !autoSyncAttempted.current) {
        autoSyncAttempted.current = true;
        await triggerIngestion();
      }
    }
    init();
  }, [filter]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter italic">
            DAILY <span className="text-accent">AUTO</span> NEWS
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Global insights, local updates, and AI-powered summaries from across the automotive world.
          </p>
        </header>

        {/* Region Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {["all", "global", "il", "ru", "ar"].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                filter === r 
                ? "bg-accent text-white shadow-lg shadow-accent/20" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {r === "all" ? "Everywhere" : r === "il" ? "Israel 🇮🇱" : r === "ru" ? "Russia 🇷🇺" : r === "ar" ? "Arabic World 🇸🇦" : "Global 🌍"}
            </button>
          ))}
        </div>

        {loading || syncing ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">
              {syncing ? "Pulling latest news from global sources..." : "Loading news feed..."}
            </p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 shadow-xl max-w-2xl mx-auto px-6">
            <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic mb-4">Content Feed Offline</h3>
            {syncError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
                <p className="text-red-400 text-sm font-mono">{syncError}</p>
              </div>
            )}
            <p className="text-gray-400 mb-8 leading-relaxed">
              To activate the news engine, ensure the <span className="text-white font-bold">"news"</span> table exists in your Supabase dashboard.
            </p>
            <button 
              onClick={triggerIngestion}
              disabled={syncing}
              className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "Retry Sync"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="group bg-card-bg/60 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-accent/40 transition-all duration-300 shadow-xl overflow-hidden flex flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-black uppercase rounded tracking-widest">
            {item.region}
          </span>
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
            {item.source_id.replace('-', ' ')} • {new Date(item.published_at).toLocaleDateString()}
          </span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-accent transition-colors">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h2>
        
        <div className="flex items-center gap-4 mt-auto">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${
              showSummary ? "text-accent" : "text-gray-400 hover:text-white"
            }`}
          >
            <svg className={`w-4 h-4 transition-transform ${showSummary ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showSummary ? "Hide AI Analysis" : "Show AI Analysis"}
          </button>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest ml-auto"
          >
            Source Website →
          </a>
        </div>
      </div>

      {showSummary && (
        <div className="p-6 pt-0 animate-in slide-in-from-top-4 duration-300">
          <AiSummary 
            videoId={item.id} 
            title={item.title} 
            description={item.title}
          />
        </div>
      )}
    </div>
  );
}
