import { fetchAllCars } from "@/app/lib/supabase-cars";
import CarFinder from "@/app/components/CarFinder";

export default async function CarsPage() {
  const localCars = await fetchAllCars();

  return (
    <div className="bg-[#141414] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-[4%]">
        <div className="mb-8">
          <h1 className="text-[36px] md:text-[48px] font-bold text-white mb-2">
            Find Your Car
          </h1>
          <p className="text-[16px] text-[#777] max-w-2xl">
            Search every car on the market. Select year, make, and model to see full specs, pricing, fuel economy, and EPA ratings — powered by FuelEconomy.gov.
          </p>
        </div>

        <CarFinder localCars={localCars} />
      </div>
    </div>
  );
}
