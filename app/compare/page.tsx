import Link from "next/link";
import { cars } from "@/app/lib/data";

export default function CompareHubPage() {
  // Generate a list of unique car matchups
  const matchups = [];
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      matchups.push({ car1: cars[i], car2: cars[j] });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Compare EVs side-by-side</h1>
      <p className="text-gray-400 mb-12 max-w-2xl text-lg">
        The EV market is moving fast. We've matched up the top contenders so you can compare specs, range, and price to find the perfect car for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchups.map(({ car1, car2 }) => {
          const slug = `${car1.id}-vs-${car2.id}`;
          return (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className="group flex flex-col items-center bg-card-bg rounded-lg overflow-hidden border border-white/10 hover:border-accent transition-all duration-300 shadow-lg hover:shadow-accent/20"
            >
              <div className="flex w-full h-32 relative">
                <img
                  src={car1.image}
                  alt={car1.name}
                  className="w-1/2 h-full object-cover"
                />
                <img
                  src={car2.image}
                  alt={car2.name}
                  className="w-1/2 h-full object-cover"
                />
                
                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white font-bold italic w-10 h-10 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)] z-10 border-2 border-black">
                  VS
                </div>
              </div>

              <div className="p-5 w-full text-center">
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  {car1.name} vs {car2.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <span>{car1.brand}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>{car2.brand}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
