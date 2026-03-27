import CopilotHero from "@/app/components/CopilotHero";
import LiveNewsTicker from "@/app/components/LiveNewsTicker";
import VideoRow from "@/app/components/VideoRow";
import CarCard from "@/app/components/CarCard";
import { categories, getVideosByCategory } from "@/app/lib/data";
import { fetchAllCars } from "@/app/lib/supabase-cars";

export default async function Home() {
  const cars = await fetchAllCars();
  // Get a few featured global models for the "Intelligence Platform" feel
  const featuredCars = cars.filter(c => ["car-17", "car-16", "car-21"].includes(c.id));

  return (
    <div className="bg-black min-h-screen">
      <CopilotHero />
      <LiveNewsTicker />
      
      {/* Intelligence Dashboard Highlights */}
      <section className="max-w-7xl mx-auto px-6 mt-12 relative z-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h2 className="text-sm font-black text-accent uppercase tracking-[0.3em] mb-2">Global Fleet Highlights</h2>
            <p className="text-3xl font-black text-white italic tracking-tighter uppercase">Intelligence <span className="text-gray-500">Dashboard</span></p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Live Database</span>
              <span className="text-sm text-white font-black leading-none">{cars.length} Models Tracked</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
             <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">AI Accuracy</span>
              <span className="text-sm text-green-400 font-black leading-none">98.4%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <div className="space-y-4 pb-20 mt-24">
        <div className="max-w-7xl mx-auto px-6 mb-8 mt-12">
            <h2 className="text-sm font-black text-gray-600 uppercase tracking-[0.4em] mb-4">Educational Modules</h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-12" />
        </div>
        {categories.map((category) => (
          <VideoRow
            key={category}
            title={category}
            videos={getVideosByCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}
