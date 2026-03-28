import { cars } from "@/app/lib/data";
import CarCard from "@/app/components/CarCard";

export default function CarsPage() {
  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-16">
      <div className="px-4 lg:px-14">
        <h1 className="text-white text-3xl font-bold mb-1">Explore Cars</h1>
        <p className="text-[#808080] text-sm mb-8">
          Browse our database of electric vehicles with specs and reviews.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
