import CopilotHero from "./components/CopilotHero";
import CarRow from "./components/CarRow";
import VideoRow from "./components/VideoRow";
import { fetchAllCars } from "./lib/supabase-cars";
import { videos, getVideosByCategory } from "./lib/data";
import ContinueWatchingRow from "./components/ContinueWatchingRow";

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
        {teslas.length > 0 && <CarRow title="Tesla Fleet" cars={teslas} />}
        <VideoRow title="Expert Reviews" videos={reviews} />
        {byd.length > 0 && <CarRow title="BYD Collection" cars={byd} />}
        <VideoRow title="Head-to-Head Comparisons" videos={comparisons} />
        {premium.length > 0 && <CarRow title="Premium & Luxury" cars={premium} />}
        <VideoRow title="Electric Revolution" videos={evVideos} />
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
