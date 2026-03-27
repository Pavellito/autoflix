"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import AiSummary from "@/app/components/AiSummary";
import { cars } from "@/app/lib/data";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  region: string;
  source_id: string;
  published_at: string;
  summary: any;
  image_url?: string;
  content?: string;
}

// A massively expanded pool of premium automotive/tech abstract photos to prevent any perceived duplication
const NEWS_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop", // sports car blur
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop", // neon car
  "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?q=80&w=2070&auto=format&fit=crop", // driving sunset
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop", // luxury interior
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop", // wheel rim
  "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2128&auto=format&fit=crop", // dark highway
  "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2070&auto=format&fit=crop", // tesla steering
  "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop", // electric charger
  "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop", // abstract speed
  "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=2070&auto=format&fit=crop", // sleek front grille
  "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2070&auto=format&fit=crop", // futuristic tunnel
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop", // classic steering
  "https://images.unsplash.com/photo-1471440671318-55bdbb772f93?q=80&w=2070&auto=format&fit=crop", // aerial road
  "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=2071&auto=format&fit=crop", // city driving
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop", // MG4 wait list
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2128&auto=format&fit=crop"
];

// Deterministically pick an image from our premium pool based on the news ID
function getDeterministicImage(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % NEWS_IMAGE_POOL.length;
  return NEWS_IMAGE_POOL[index];
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [setupSql, setSetupSql] = useState<string | null>(null);
  const autoSyncAttempted = useRef(false);

  async function fetchNews() {
    setLoading(true);
    try {
      // Fetch more items to populate our rows
      const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false }).limit(200);
      if (!error && data) {
        setNews(data);
        return data.length;
      }
      if (error) {
        console.warn("[News] Supabase error:", error.message);
        setSyncError("The 'news' table doesn't exist yet in Supabase.");
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
    setSetupSql(null);
    try {
      const res = await fetch("/api/news/ingest");
      const data = await res.json();
      
      if (data.success) {
        await fetchNews();
      } else {
        if (data.error && (data.error.includes("relation") || data.error.includes("does not exist"))) {
          const setupRes = await fetch("/api/news/setup");
          const setupData = await setupRes.json();
          setSyncError(setupData.message || "The 'news' table does not exist. Please create it.");
          if (setupData.sql) setSetupSql(setupData.sql);
        } else {
          setSyncError(data.error || "Ingestion failed for an unknown reason.");
        }
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
      if (count === 0 && !autoSyncAttempted.current) {
        autoSyncAttempted.current = true;
        await triggerIngestion();
      }
    }
    init();
  }, []);

  if (loading || syncing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">
          {syncing ? "Pulling latest news from global sources..." : "Loading news feed..."}
        </p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-12 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center py-12 lg:py-20 bg-card-bg/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-3xl mx-auto px-6 w-full">
          <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(229,9,20,0.3)]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic mb-4">Content Feed Offline</h3>
          
          {syncError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left inline-block">
              <p className="text-red-400 text-sm font-mono whitespace-pre-wrap">{syncError}</p>
            </div>
          )}

          {setupSql && (
            <div className="bg-black/80 border border-white/20 rounded-xl p-6 mb-8 text-left text-sm max-w-2xl mx-auto overflow-auto relative group shadow-inner">
              <div className="absolute top-4 right-4 text-gray-500 font-mono text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">SQL Editor</div>
              <pre className="text-green-400 font-mono whitespace-pre-wrap pr-16">{setupSql}</pre>
              <div className="mt-4 pt-4 border-t border-white/10 text-gray-400 text-xs text-center">
                Copy this code and run it in your Supabase dashboard → SQL Editor → New Query.
              </div>
            </div>
          )}
          
          <button 
            onClick={triggerIngestion}
            disabled={syncing}
            className="mt-4 px-8 py-4 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 shadow-xl"
          >
            {syncing ? "Syncing..." : "Retry Sync"}
          </button>
        </div>
      </div>
    );
  }

  const featured = news[0];
  const globalNews = news.filter(n => n.region === "global").slice(1);
  const israelNews = news.filter(n => n.region === "il");
  const russiaNews = news.filter(n => n.region === "ru");
  const arabicNews = news.filter(n => n.region === "ar");

  return (
    <div className="min-h-screen bg-black pb-24">
      <HeroNews featured={featured} onSync={triggerIngestion} isSyncing={syncing} />

      {/* Horizontal Scrolling Rows */}
      <div className="space-y-12">
        <NewsRow title="Global Fleet" items={globalNews} />
        <NewsRow title="Israel Market 🇮🇱" items={israelNews} />
        <NewsRow title="Russian Intel 🇷🇺" items={russiaNews} />
        <NewsRow title="Arabic Region 🇸🇦" items={arabicNews} />
      </div>
    </div>
  );
}

function HeroNews({ featured, onSync, isSyncing }: { featured: NewsItem, onSync: () => void, isSyncing: boolean }) {
  const [heroImgSrc, setHeroImgSrc] = useState(featured.image_url || getDeterministicImage(featured.id));

  return (
    <div className="relative h-[70vh] mb-12 bg-black overflow-hidden group">
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
        <img
          src={heroImgSrc}
          alt={featured.title}
          onError={() => setHeroImgSrc("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&auto=format&fit=crop")}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s] ease-out"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

      <div className="relative z-20 h-full flex flex-col justify-end pb-16 px-4 md:px-12 max-w-4xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-accent text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg">
              Breaking
            </span>
            <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">
              {featured.source_id.replace('-', ' ')}
            </span>
          </div>
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-sm text-[10px] font-black leading-none uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                FETCHING...
              </>
            ) : "🔄 LIVE SYNC"}
          </button>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight tracking-tighter italic">
          {featured.title}
        </h1>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/news/${featured.id}`}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-black uppercase text-xs tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
}

function NewsRow({ title, items }: { title: string; items: NewsItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="relative">
      <h2 className="text-xl md:text-2xl font-black text-white mb-4 px-4 md:px-12 uppercase italic tracking-tighter">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-8 pt-2 snap-x snap-mandatory">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const [showSummary, setShowSummary] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image_url || getDeterministicImage(item.id));

  return (
    <div className="snap-start flex-shrink-0 w-[300px] md:w-[400px] group relative flex flex-col">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-card-bg mb-4 shadow-xl border border-white/5 transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.2)]">
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop")}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
          {item.source_id.replace('-', ' ')}
        </div>

        {/* Floating AI Button inside Image */}
        <button 
          onClick={() => setShowSummary(!showSummary)}
          className={`absolute bottom-3 right-3 p-2 rounded-full cursor-pointer backdrop-blur-md transition-all shadow-xl z-20 ${
            showSummary ? "bg-accent text-white" : "bg-white/10 text-white hover:bg-accent/80 border border-white/20"
          }`}
          title="AI Summary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      <div className="px-1 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-4 leading-tight group-hover:text-accent transition-colors">
          <Link href={`/news/${item.id}`}>
            {item.title}
          </Link>
        </h3>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
          {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>

        {showSummary && (
          <div className="mt-2 bg-card-bg/80 border border-accent/20 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300 z-30 absolute top-full left-0 w-full shadow-2xl">
            <h4 className="text-[10px] text-accent font-black uppercase tracking-widest mb-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AutoFlix AI Analysis
            </h4>
            <AiSummary videoId={item.id} title={item.title} description={item.title} />
          </div>
        )}
      </div>
    </div>
  );
}
