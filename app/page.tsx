import CopilotHero from "@/app/components/CopilotHero";
import VideoRow from "@/app/components/VideoRow";
import CarRow from "@/app/components/CarRow";
import { categories, getVideosByCategory, cars } from "@/app/lib/data";

export default function Home() {
  const topCars = cars.slice(0, 15);
  const evCars = cars.filter((c) => c.type === "EV").slice(0, 15);
  const hybridCars = cars.filter((c) => c.type === "Hybrid" || c.type === "ICE");

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Netflix-style billboard hero */}
      <CopilotHero />

      {/* Content rows - overlapping the billboard slightly */}
      <div className="relative z-10 -mt-12 space-y-1 pb-20">
        {/* Car rows */}
        <CarRow title="Popular Cars" cars={topCars} />
        <CarRow title="Electric Vehicles" cars={evCars} />
        {hybridCars.length > 0 && (
          <CarRow title="Hybrid & ICE" cars={hybridCars} />
        )}

        {/* Video rows */}
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
