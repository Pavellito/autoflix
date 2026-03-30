"use client";

import Link from "next/link";
import CopilotHero from "./CopilotHero";
import CarRow from "./CarRow";
import VideoRow from "./VideoRow";
import ContinueWatchingRow from "./ContinueWatchingRow";
import HomeNewsSection from "./HomeNewsSection";
import { useLanguage } from "@/app/lib/i18n/context";
import type { Car, Video } from "@/app/lib/data";

interface HomeContentProps {
  cars: Car[];
  trending: Video[];
  reviews: Video[];
  comparisons: Video[];
  evVideos: Video[];
}

export default function HomeContent({ cars, trending, reviews, comparisons, evVideos }: HomeContentProps) {
  const { t, isRTL } = useLanguage();

  // Split cars into rows by brand groups
  const teslas = cars.filter((c) => c.brand === "Tesla");
  const byd = cars.filter((c) => c.brand === "BYD");
  const premium = cars.filter((c) => ["Porsche", "Mercedes", "BMW", "Audi"].includes(c.brand));
  const allCars = cars.slice(0, 12);

  return (
    <div className="bg-[#141414] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <CopilotHero cars={cars} />

      {/* Rows overlap the billboard bottom - Netflix style */}
      <div className="-mt-[6vw] relative z-10">
        <ContinueWatchingRow />
        <CarRow title={t("home_popular")} cars={allCars} />
        <VideoRow title={t("home_trending")} videos={trending} />

        {/* Browse 2026 Cars CTA */}
        <div className="px-[60px] mb-[3vw]">
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

        {teslas.length > 0 && <CarRow title={t("home_tesla_fleet")} cars={teslas} />}
        <VideoRow title={t("home_expert_reviews")} videos={reviews} />
        {byd.length > 0 && <CarRow title={t("home_byd_collection")} cars={byd} />}
        <VideoRow title={t("home_comparisons")} videos={comparisons} />
        {premium.length > 0 && <CarRow title={t("home_premium")} cars={premium} />}
        <VideoRow title={t("home_electric_revolution")} videos={evVideos} />

        {/* Latest Automotive News */}
        <HomeNewsSection />

        {/* Videos Page CTA */}
        <div className="px-[60px] mb-[3vw]">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#141428] rounded-xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-1">{t("home_all_videos")}</h2>
              <p className="text-[14px] text-gray-400">{t("home_all_videos_desc")}</p>
            </div>
            <Link
              href="/videos"
              className="bg-white text-black px-8 py-3 rounded text-[15px] font-bold hover:bg-white/80 transition-colors whitespace-nowrap"
            >
              {t("home_watch_now")}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-[4%] py-8 mt-12">
        <div className="max-w-[980px] mx-auto">
          <p className="text-[#737373] text-[13px] mb-4">{t("footer_questions")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px] text-[#737373] underline mb-6">
            <a href="#">{t("footer_faq")}</a>
            <a href="#">{t("footer_help")}</a>
            <a href="#">{t("footer_account")}</a>
            <a href="#">{t("footer_media")}</a>
            <a href="#">{t("footer_investors")}</a>
            <a href="#">{t("footer_jobs")}</a>
            <a href="#">{t("footer_ways_to_watch")}</a>
            <a href="#">{t("footer_terms")}</a>
            <a href="#">{t("footer_privacy")}</a>
            <a href="#">{t("footer_cookies")}</a>
            <a href="#">{t("footer_corporate")}</a>
          </div>
          <p className="text-[#737373] text-[11px]">&copy; 2026 AutoFlix</p>
        </div>
      </footer>
    </div>
  );
}
