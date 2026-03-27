import {
  fetchAllCars,
} from "@/app/lib/supabase-cars";
import CarCard from "@/app/components/CarCard";

export default async function CarsPage() {
  const cars = await fetchAllCars();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Explore Cars
        </h1>
        <p className="text-gray-400">
          Browse our database of top electric vehicles with specs and related reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
