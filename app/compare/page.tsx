import { fetchAllCars } from "@/app/lib/supabase-cars";
import CompareBuilder from "@/app/components/CompareBuilder";

export default async function ComparePage() {
  const cars = await fetchAllCars();

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-[4%]">
        <div className="text-center mb-12">
          <h1 className="text-[36px] md:text-[48px] font-bold text-white mb-3">
            Compare Cars
          </h1>
          <p className="text-[16px] text-[#777] max-w-xl mx-auto">
            Choose any two cars from our database to see a full side-by-side comparison
            with specs, regional pricing, and AI-powered analysis.
          </p>
        </div>

        <CompareBuilder cars={cars} />
      </div>
    </div>
  );
}
