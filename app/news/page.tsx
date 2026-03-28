"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import AiSummary from "@/app/components/AiSummary";
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

const NEWS_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469285994282-454ceb49e63c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2128&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1471440671318-55bdbb772f93?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2128&auto=format&fit=crop"
];

function getDeterministicImage(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return NEWS_IMAGE_POOL[Math.abs(hash) % NEWS_IMAGE_POOL.length];
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
      const { data, error } = await supabase.from("news").select("*").order("published_at", { ascending: false }).limit(60);
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
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin" />
        <p className="text-[#808080] text-sm">
          {syncing ? "Pulling latest news..." : "Loading news..."}
        </p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen bg-[#141414] pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="text-center py-12 bg-[#181818] rounded-[4px] border border-[#333] max-w-xl mx-auto px-8 w-full">
          <h3 className="text-white text-2xl font-bold mb-4">News Feed Offline</h3>

          {syncError && (
            <div className="bg-[#e50914]/10 border border-[#e50914]/20 rounded-[4px] p-4 mb-6 text-left">
              <p className="text-[#e50914] text-sm font-mono">{syncError}</p>
            </div>
          )}

          {setupSql && (
            <div className="bg-black border border-[#333] rounded-[4px] p-4 mb-6 text-left text-sm overflow-auto">
              <pre className="text-[#46d369] font-mono whitespace-pre-wrap">{setupSql}</pre>
              <p className="text-[#808080] text-xs mt-3 border-t border-[#333] pt-3">
                Run this in your Supabase SQL Editor.
              </p>
            </div>
          )}

          <button
            onClick={triggerIngestion}
            disabled={syncing}
            className="bg-[#e50914] text-white px-6 py-2.5 rounded-[4px] text-sm font-bold hover:bg-[#f40612] transition disabled:opacity-50"
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
    <div className="min-h-screen bg-[#141414] pb-24">
      <HeroNews featured={featured} onSync={triggerIngestion} isSyncing={syncing} />

      <div className="relative z-10 -mt-12 space-y-8">
        <NewsRow title="Global" items={globalNews} />
        <NewsRow title="Israel" items={israelNews} />
        <NewsRow title="Russia" items={russiaNews} />
        <NewsRow title="Arabic Region" items={arabicNews} />
      </div>
    </div>
  );
}

function HeroNews({ featured, onSync, isSyncing }: { featured: NewsItem, onSync: () => void, isSyncing: boolean }) {
  const [heroImgSrc, setHeroImgSrc] = useState(featured.image_url || getDeterministicImage(featured.id));

  return (
    <div className="relative w-full h-[56.25vw] max-h-[70vh] min-h-[400px] overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImgSrc}
          alt={featured.title}
          onError={() => setHeroImgSrc("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&auto=format&fit=crop")}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-[#141414]/50 to-transparent" />

      <div className="absolute bottom-10 left-4 lg:left-14 max-w-2xl z-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-[#e50914] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase">
            Breaking
          </span>
          <span className="text-[#bcbcbc] text-sm">{featured.source_id.replace('-', ' ')}</span>
        </div>
        <h1 className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-5">
          {featured.title}
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/news/${featured.id}`}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-[4px] text-base font-bold hover:bg-white/80 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read Article
          </Link>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-[#6d6d6eb3] text-white px-5 py-2.5 rounded-[4px] text-sm font-bold hover:bg-[#6d6d6e99] transition disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Syncing...
              </>
            ) : (
              "Live Sync"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewsRow({ title, items }: { title: string; items: NewsItem[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="row-container relative group/row">
      <h2 className="text-[#e5e5e5] text-base lg:text-xl font-bold mb-1 px-4 lg:px-14">
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="row-arrow absolute left-0 top-0 bottom-0 z-20 w-12 lg:w-14 bg-[#141414]/60 hover:bg-[#141414]/90 flex items-center justify-center transition"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={sliderRef}
          className="netflix-slider flex gap-1.5 overflow-x-auto scrollbar-hide px-4 lg:px-14 pb-6 pt-2"
        >
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="row-arrow absolute right-0 top-0 bottom-0 z-20 w-12 lg:w-14 bg-[#141414]/60 hover:bg-[#141414]/90 flex items-center justify-center transition"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const [showSummary, setShowSummary] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image_url || getDeterministicImage(item.id));

  return (
    <div className="netflix-card flex-shrink-0 w-[280px] lg:w-[320px] rounded-[4px] overflow-hidden bg-[#181818] group cursor-pointer">
      <div className="relative aspect-video bg-[#2f2f2f]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc("https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop")}
          className="w-full h-full object-cover"
        />
        {/* Source badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
          {item.source_id.replace('-', ' ')}
        </div>
      </div>

      {/* Card details */}
      <div className="p-3">
        {/* Action buttons */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/news/${item.id}`}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition"
          >
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className={`w-8 h-8 border rounded-full flex items-center justify-center transition ${
              showSummary
                ? "bg-[#e50914] border-[#e50914] text-white"
                : "border-[#808080]/40 text-white hover:border-white"
            }`}
            title="AI Summary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <div className="ml-auto">
            <Link
              href={`/news/${item.id}`}
              className="w-8 h-8 border border-[#808080]/40 rounded-full flex items-center justify-center hover:border-white transition"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>

        <h3 className="text-white text-sm font-bold line-clamp-2 mb-1">
          <Link href={`/news/${item.id}`} className="hover:text-[#e5e5e5]">
            {item.title}
          </Link>
        </h3>
        <p className="text-[#808080] text-xs">
          {new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>

        {showSummary && (
          <div className="mt-3 bg-[#141414] border border-[#333] rounded-[4px] p-3">
            <p className="text-[#e50914] text-[10px] font-bold uppercase tracking-wider mb-2">AI Analysis</p>
            <AiSummary videoId={item.id} title={item.title} description={item.title} />
          </div>
        )}
      </div>
    </div>
  );
}
