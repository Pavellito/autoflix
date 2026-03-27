import { notFound } from "next/navigation";
import { Car } from "@/app/lib/data";
import { fetchAllCars } from "@/app/lib/supabase-cars";
import Link from "next/link";
import RegionalCarInfo from "@/app/components/RegionalCarInfo";

interface BestOfCategory {
  title: string;
  description: string;
  filter: (car: Car) => boolean;
  region?: string;
}

const CATEGORIES: Record<string, BestOfCategory> = {
  "best-ev-israel": {
    title: "Best Electric Cars in Israel 2025",
    description: "Our top picks for the Israeli market, considering local charging infrastructure (Afek, Tesla Superchargers) and resale value.",
    filter: (c) => !!c.prices?.il,
    region: "il"
  },
  "best-ev-russia": {
    title: "Best EVs for the Russian Winter",
    description: "Vehicles with superior battery thermal management and all-wheel drive stability for challenging climates.",
    filter: (c) => !!c.prices?.ru,
    region: "ru"
  },
  "best-luxury-ev": {
    title: "Top Luxury Electric Vehicles",
    description: "The peak of electric performance and interior craftsmanship for discerning buyers.",
    filter: (c) => c.brand === "Tesla" || c.brand === "Porsche" || c.brand === "Mercedes", // Extended logic later
  },
  "best-family-suv": {
    title: "Best Electric Family SUVs",
    description: "Space, safety, and range for the modern family adventure.",
    filter: (c) => c.name.includes("Model Y") || c.name.includes("EV9") || c.name.includes("Atto 3"),
  }
};

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export default async function BestOfPage({ params }: { params: Promise<{ slug: string }> }) {
  const cars = await fetchAllCars();
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) notFound();

  const filteredCars = cars.filter(category.filter);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <Link href="/compare" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            ← Back to Comparisons
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4">
            {category.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed italic">
            "{category.description}"
          </p>
        </header>

        <div className="space-y-16">
          {filteredCars.map((car, i) => (
            <div key={car.id} className="group relative">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Ranking Number */}
                <div className="text-8xl font-black text-white/5 absolute -left-12 -top-8 pointer-events-none group-hover:text-accent/10 transition-colors">
                  0{i + 1}
                </div>

                <div className="w-full lg:w-2/5 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-black tracking-widest text-[10px] uppercase">Editor's Choice</span>
                    <span className="h-[1px] w-8 bg-accent/30" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{car.name}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded-xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Est. Range</p>
                      <p className="text-white font-bold">{car.range || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Battery</p>
                      <p className="text-white font-bold">{car.battery || "N/A"}</p>
                    </div>
                  </div>

                  <RegionalCarInfo car={car} />
                  
                  <div className="mt-8 flex gap-4">
                    <Link 
                      href={`/cars/${car.id}`}
                      className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-accent hover:text-white transition-all shadow-xl"
                    >
                      Full Details
                    </Link>
                    <Link 
                      href={`/compare/car-1-vs-${car.id}`}
                      className="px-8 py-3 bg-white/5 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                    >
                      Compare vs Tesla
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
