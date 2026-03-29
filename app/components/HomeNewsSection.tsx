"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NewsArticle {
  title: string;
  link: string;
  source: string;
  region: string;
  regionLabel: string;
  pubDate?: string;
  imageUrl?: string;
  snippet?: string;
}

export default function HomeNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch general automotive news (no specific car filter)
    fetch("/api/news/car?make=electric+car&model=2026")
      .then((r) => r.json())
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-[60px] mb-[3vw]">
        <h2 className="text-[20px] font-bold text-[#e5e5e5] mb-3">Latest Automotive News</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-white/10" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="px-[60px] mb-[3vw]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[20px] font-bold text-[#e5e5e5]">Latest Automotive News</h2>
        <Link
          href="/videos"
          className="text-[13px] text-[#999] hover:text-white transition-colors"
        >
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {articles.slice(0, 8).map((article, i) => (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all"
          >
            {article.imageUrl ? (
              <div className="aspect-[16/9] overflow-hidden bg-[#222]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            )}
            <div className="p-2.5">
              <p className="text-[12px] text-white font-medium line-clamp-2 group-hover:text-white/80 mb-1.5">
                {article.title}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-[#e50914] font-bold uppercase">{article.source}</span>
                <span className={`text-[8px] px-1 py-0.5 rounded font-bold ${
                  article.region === "il" ? "bg-blue-500/20 text-blue-300" :
                  article.region === "ru" ? "bg-red-500/20 text-red-300" :
                  article.region === "ar" ? "bg-emerald-500/20 text-emerald-300" :
                  "bg-white/10 text-gray-400"
                }`}>
                  {article.regionLabel}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
