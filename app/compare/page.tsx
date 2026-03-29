import { fetchAllCars } from "@/app/lib/supabase-cars";
import CompareBuilder from "@/app/components/CompareBuilder";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [cars, params] = await Promise.all([fetchAllCars(), searchParams]);

  // Pre-select car1 if coming from a car detail page
  const preselectedCar1 = params.car1
    ? {
        id: params.car1,
        name: params.car1name || params.car1,
        brand: params.car1brand || "",
        type: (params.car1type || "ICE") as "EV" | "Hybrid" | "ICE",
        image: params.car1image || "",
        relatedVideoIds: [],
      }
    : null;

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-[4%]">
        <div className="text-center mb-12">
          <h1 className="text-[36px] md:text-[48px] font-bold text-white mb-3">
            Compare Cars
          </h1>
          <p className="text-[16px] text-[#777] max-w-xl mx-auto">
            {preselectedCar1
              ? `${preselectedCar1.name} is selected. Now pick a second car to compare.`
              : "Choose any two cars from our database to see a full side-by-side comparison with specs, regional pricing, and AI-powered analysis."}
          </p>
        </div>

        <CompareBuilder cars={cars} preselectedCar1={preselectedCar1} />
      </div>
    </div>
  );
}
