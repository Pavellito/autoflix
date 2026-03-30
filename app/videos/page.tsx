"use client";

import Link from "next/link";
import { videos, categories } from "@/app/lib/data";
import { useLanguage } from "@/app/lib/i18n/context";

export default function VideosPage() {
  const { t } = useLanguage();
  return (
    <div className="bg-[#141414] min-h-screen pt-[68px]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#141414] px-[60px] py-12">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t("videos_title")}</h1>
        <p className="text-[15px] text-gray-400 max-w-xl">
          {t("videos_description")}
        </p>
      </div>

      <div className="px-[60px] pb-16">
        {categories.map((category) => {
          const categoryVideos = videos.filter((v) => v.category === category);
          if (categoryVideos.length === 0) return null;

          return (
            <div key={category} className="mb-10">
              <h2 className="text-[20px] font-bold text-[#e5e5e5] mb-4">{category}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {categoryVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/watch/${video.id}`}
                    className="group rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className="relative aspect-[16/9] bg-[#0a0a0a]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[12px] text-white font-medium line-clamp-2 mb-1">
                        {video.title}
                      </p>
                      <p className="text-[10px] text-gray-500 line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Browse Cars CTA */}
      <div className="px-[60px] pb-12">
        <div className="bg-gradient-to-r from-[#e50914]/20 via-[#1a1a2e] to-[#0a0a1a] rounded-xl border border-[#e50914]/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-1">{t("home_browse_2026")}</h2>
            <p className="text-[14px] text-gray-400">{t("home_browse_2026_desc")}</p>
          </div>
          <Link
            href="/cars"
            className="bg-[#e50914] text-white px-8 py-3 rounded text-[15px] font-bold hover:bg-[#f6121d] transition-colors whitespace-nowrap"
          >
            {t("home_find_your_car")}
          </Link>
        </div>
      </div>
    </div>
  );
}
