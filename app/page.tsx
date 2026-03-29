import Link from "next/link";
import CopilotHero from "./components/CopilotHero";
import CarRow from "./components/CarRow";
import VideoRow from "./components/VideoRow";
import { fetchAllCars } from "./lib/supabase-cars";
import { videos, getVideosByCategory } from "./lib/data";
import ContinueWatchingRow from "./components/ContinueWatchingRow";
import HomeNewsSection from "./components/HomeNewsSection";

export default async function Home() {
  const cars = await fetchAllCars();

  const trending = getVideosByCategory("Trending");
  const reviews = getVideosByCategory("Reviews");
  const comparisons = getVideosByCategory("Comparisons");
  const evVideos = getVideosByCategory("Electric Cars");

  // Split cars into rows by brand groups
  const teslas = cars.filter((c) => c.brand === "Tesla");
  const byd = cars.filter((c) => c.brand === "BYD");
  const premium = cars.filter((c) => ["Porsche", "Mercedes", "BMW", "Audi"].includes(c.brand));
  const allCars = cars.slice(0, 12);

  return (
    <div className="bg-[#141414] min-h-screen">
      <CopilotHero cars={cars} />

      {/* Rows overlap the billboard bottom - Netflix style */}
      <div className="-mt-[6vw] relative z-10">
        <ContinueWatchingRow />
        <CarRow title="Popular on AutoFlix" cars={allCars} />
        <VideoRow title="Trending Now" videos={trending} />

        {/* Browse 2026 Cars CTA */}
        <div className="px-[60px] mb-[3vw]">
          <div className="bg-gradient-to-r from-[#e50914]/20 via-[#1a1a2e] to-[#0a0a1a] rounded-xl border border-[#e50914]/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-1">Browse Every 2026 Car</h2>
              <p className="text-[14px] text-gray-400">Full specs, all trims, regional pricing for US, Israel, Russia & UAE</p>
            </div>
            <Link
              href="/cars"
              className="bg-[#e50914] text-white px-8 py-3 rounded text-[15px] font-bold hover:bg-[#f6121d] transition-colors whitespace-nowrap"
            >
              Find Your Car →
            </Link>
          </div>
        </div>

        {teslas.length > 0 && <CarRow title="Tesla Fleet" cars={teslas} />}
        <VideoRow title="Expert Reviews" videos={reviews} />
        {byd.length > 0 && <CarRow title="BYD Collection" cars={byd} />}
        <VideoRow title="Head-to-Head Comparisons" videos={comparisons} />
        {premium.length > 0 && <CarRow title="Premium & Luxury" cars={premium} />}
        <VideoRow title="Electric Revolution" videos={evVideos} />

        {/* Latest Automotive News */}
        <HomeNewsSection />

        {/* Videos Page CTA */}
        <div className="px-[60px] mb-[3vw]">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#141428] rounded-xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-1">All Car Videos</h2>
              <p className="text-[14px] text-gray-400">Latest reviews, comparisons & news from YouTube and more</p>
            </div>
            <Link
              href="/videos"
              className="bg-white text-black px-8 py-3 rounded text-[15px] font-bold hover:bg-white/80 transition-colors whitespace-nowrap"
            >
              Watch Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-[4%] py-8 mt-12">
        <div className="max-w-[980px] mx-auto">
          <p className="text-[#737373] text-[13px] mb-4">Questions? Contact us.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px] text-[#737373] underline mb-6">
            <a href="#">FAQ</a>
            <a href="#">Help Center</a>
            <a href="#">Account</a>
            <a href="#">Media Center</a>
            <a href="#">Investor Relations</a>
            <a href="#">Jobs</a>
            <a href="#">Ways to Watch</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
            <a href="#">Cookie Preferences</a>
            <a href="#">Corporate Information</a>
            <a href="#">Speed Test</a>
          </div>
          <p className="text-[#737373] text-[11px]">&copy; 2026 AutoFlix</p>
        </div>
      </footer>
    </div>
  );
}
