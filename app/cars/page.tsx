import { fetchAllCars } from "@/app/lib/supabase-cars";
import ShowroomGrid from "@/app/components/ShowroomGrid";

export default async function CarsPage() {
  const cars = await fetchAllCars();

  return (
    <div className="bg-[#141414] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-[4%]">
        <div className="mb-10">
          <h1 className="text-[36px] md:text-[48px] font-bold text-white mb-2">
            Cars
          </h1>
          <p className="text-[16px] text-[#777] max-w-xl">
            Browse our database of {cars.length} electric vehicles with regional pricing, specs, and AI-powered insights.
          </p>
        </div>

        <ShowroomGrid initialCars={cars} />
      </div>
    </div>
  );
}
