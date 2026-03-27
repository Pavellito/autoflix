import CopilotHero from "./components/CopilotHero";
import IntelligenceStats from "./components/IntelligenceStats";
import LiveNewsTicker from "./components/LiveNewsTicker";
import ShowroomGrid from "./components/ShowroomGrid";
import ComparisonPreview from "./components/ComparisonPreview";
import { fetchAllCars } from "./lib/supabase-cars";

export default async function Home() {
  const cars = await fetchAllCars();
  
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <CopilotHero />
      <IntelligenceStats />
      
      <div className="py-20 bg-[#070707] border-b border-white/5">
        <div className="container px-4 mx-auto mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-px bg-blue-500"></div>
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">
              Real-Time Feed
            </span>
          </div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Global Market <span className="text-gray-500">Intelligence</span>
          </h2>
        </div>
        <LiveNewsTicker />
      </div>

      <ComparisonPreview />

      {/* 4. THE RAW CATALOG (THE SCALE LAYER) */}
      <div className="container px-4 py-24 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-px bg-emerald-500"></div>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em]">
                Database Scale
              </span>
            </div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              The Raw <span className="text-blue-500">Intelligence</span> Grid
            </h2>
          </div>
          <div className="text-xs font-bold text-gray-700 tracking-[0.2em] uppercase italic border-l-2 border-gray-900 pl-6 py-2">
            Normalizing Performance Specs <br />
            For 51+ Global EV Models
          </div>
        </div>
        
        <ShowroomGrid initialCars={cars} />
      </div>

      {/* 5. FOOTER BRANDING */}
      <footer className="py-20 bg-black border-t border-white/5 text-center">
        <div className="container px-4 mx-auto">
          <div className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">
            Auto<span className="text-blue-500">Flix</span>
          </div>
          <p className="text-sm text-gray-600 mb-8 max-w-sm mx-auto">
            The elite intelligence layer for the global transition to electric mobility. 
            Data-driven. AI-First. Absolute.
          </p>
          <div className="text-[10px] text-gray-800 font-bold uppercase tracking-[0.5em]">
            © 2026 AUTOFLIX INTELLIGENCE SYSTEMS
          </div>
        </div>
      </footer>
    </main>
  );
}
