import {
  fetchAllCars,
} from "@/app/lib/supabase-cars";
import ShowroomGrid from "@/app/components/ShowroomGrid";

export default async function CarsPage() {
  const cars = await fetchAllCars();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
          The <span className="text-accent">Showroom</span>
        </h1>
        <p className="max-w-xl text-gray-500 text-sm font-medium uppercase tracking-widest leading-relaxed">
           Our proprietary intelligence database of {cars.length} elite electric vehicles. Explore specifications, regional pricing breakthroughs, and AI-vetted advice.
        </p>
      </div>

      <ShowroomGrid initialCars={cars} />
    </div>
  );
}
