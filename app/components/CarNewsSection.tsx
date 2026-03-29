"use client";

import { useEffect, useState } from "react";

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

interface Props {
  make: string;
  model: string;
  year?: number;
}

export default function CarNewsSection({ make, model, year }: Props) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams({ make, model });
    if (year) params.set("year", String(year));

    fetch(`/api/news/car?${params}`)
      .then((r) => r.json())
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [make, model, year]);

  if (loading) {
    return (
      <div className="border-t border-white/10 pt-8 mb-8">
        <h2 className="text-[20px] font-bold text-white mb-4">
          Latest News: {make} {model}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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

  const regions = [
    { id: "all", label: "All Regions" },
    { id: "global", label: "Global" },
    { id: "il", label: "Israel" },
    { id: "ru", label: "Russia" },
    { id: "ar", label: "Arabic" },
  ];

  const filtered = activeRegion === "all"
    ? articles
    : articles.filter((a) => a.region === activeRegion);

  return (
    <div className="border-t border-white/10 pt-8 mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-[20px] font-bold text-white">
          Latest News: {year ? `${year} ` : ""}{make} {model}
        </h2>
        <div className="flex gap-1">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRegion(r.id)}
              className={`text-[11px] px-2.5 py-1 rounded font-bold transition-colors ${
                activeRegion === r.id
                  ? "bg-[#e50914] text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, 9).map((article, i) => (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all"
          >
            {article.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden bg-[#333]">
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
            )}
            <div className="p-3">
              <p className="text-[13px] text-white font-medium line-clamp-2 group-hover:text-white/80 mb-2">
                {article.title}
              </p>
              {article.snippet && (
                <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{article.snippet}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#e50914] font-bold uppercase">{article.source}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  article.region === "il" ? "bg-blue-500/20 text-blue-300" :
                  article.region === "ru" ? "bg-red-500/20 text-red-300" :
                  article.region === "ar" ? "bg-emerald-500/20 text-emerald-300" :
                  "bg-white/10 text-gray-400"
                }`}>
                  {article.regionLabel}
                </span>
                {article.pubDate && (
                  <span className="text-[10px] text-[#555]">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
