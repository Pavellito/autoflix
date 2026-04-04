"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/lib/i18n/context";
import { supabase } from "@/app/lib/supabase";

interface NewsArticle {
  id: string;
  title: string;
  link: string;
  source: string;
  region: string;
  regionLabel: string;
  pubDate?: string;
  imageUrl?: string;
}

function getDeterministicImage(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `https://picsum.photos/seed/${Math.abs(hash)}/800/400`;
}

export default function HomeNewsSection() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(8);

        if (error) throw error;
        
        if (data) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            link: item.link,
            source: item.source_id || "web",
            region: item.region || "global",
            regionLabel: item.region === "il" ? "Israel" : item.region === "ru" ? "Russia" : item.region === "ar" ? "Arabic" : "Global",
            pubDate: item.published_at,
            imageUrl: item.image_url
          }));
          setArticles(mapped);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="px-[60px] mb-[3vw]">
        <h2 className="text-[20px] font-bold text-[#e5e5e5] mb-3">{t("home_latest_news")}</h2>
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
        <h2 className="text-[20px] font-bold text-[#e5e5e5]">{t("home_latest_news")}</h2>
        <Link
          href="/news"
          className="text-[13px] text-[#999] hover:text-white transition-colors"
        >
          {t("home_see_all")}
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {articles.map((article, i) => {
          const defaultImg = getDeterministicImage(article.id || String(i));
          const imgSrc = article.imageUrl ? encodeURI(article.imageUrl) : defaultImg;
          
          return (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all flex flex-col"
          >
            <div className="aspect-[16/9] overflow-hidden bg-[#222]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImg;
                }}
              />
            </div>
            <div className="p-2.5 flex-grow flex flex-col justify-between">
              <p className="text-[12px] text-white font-medium line-clamp-2 group-hover:text-white/80 mb-1.5">
                {article.title}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-[#e50914] font-bold uppercase">{article.source.replace('-',' ')}</span>
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
          );
        })}
      </div>
    </div>
  );
}
