import CopilotHero from "@/app/components/CopilotHero";
import VideoRow from "@/app/components/VideoRow";
import CarRow from "@/app/components/CarRow";
import { categories, getVideosByCategory, cars } from "@/app/lib/data";

export default function Home() {
  const topCars = cars.slice(0, 15);
  const evCars = cars.filter((c) => c.type === "EV").slice(0, 15);
  const hybridCars = cars.filter((c) => c.type === "Hybrid" || c.type === "ICE");

  return (
    <div className="bg-[#141414]">
      {/* Billboard hero — overlaps into row section */}
      <CopilotHero />

      {/* Content rows — pulled up to overlap the hero bottom gradient */}
      <div className="relative z-10 -mt-[6vw] pb-[50px]">
        <CarRow title="Popular on AutoFlix" cars={topCars} />
        <CarRow title="Electric Vehicles" cars={evCars} />
        {hybridCars.length > 0 && (
          <CarRow title="Hybrid & ICE" cars={hybridCars} />
        )}
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
