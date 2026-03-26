import { notFound } from "next/navigation";
import Link from "next/link";
import { cars, getCarById, getRelatedVideosForCar } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";
import CompareVerdict from "@/app/components/CompareVerdict";

export function generateStaticParams() {
  const slugs = [];
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      slugs.push({ slug: `${cars[i].id}-vs-${cars[j].id}` });
    }
  }
  return slugs;
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // More robust parsing for complex IDs
  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();

  const [id1, id2] = parts;
  const car1 = getCarById(id1);
  const car2 = getCarById(id2);

  if (!car1 || !car2) {
    // Try one last thing: check if IDs are swapped or slightly different
    console.error(`Comparison failed: ${id1} vs ${id2}`);
    notFound();
  }

  const car1Videos = getRelatedVideosForCar(car1).slice(0, 2);
  const car2Videos = getRelatedVideosForCar(car2).slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/compare"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        ← Back to Comparisons
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 italic tracking-tighter">
          <span className="text-accent underline decoration-accent/30">{car1.brand}</span> {car1.name.replace(car1.brand, "").trim()} 
          <span className="mx-4 text-gray-600 font-light not-italic">VS</span> 
          <span className="text-accent underline decoration-accent/30">{car2.brand}</span> {car2.name.replace(car2.brand, "").trim()}
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase font-bold">The Ultimate Side-by-Side Showdown</p>
      </div>

      {/* Hero Images Side by Side */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 relative group">
        <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
          <img
            src={car1.image}
            alt={car1.name}
            className="w-full aspect-[16/9] object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-4">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{car1.name}</h2>
            <p className="text-accent font-black tracking-widest text-xs uppercase">{car1.brand} Performance</p>
          </div>
        </div>

        {/* VS Badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white font-black italic text-xl w-14 h-14 items-center justify-center rounded-full shadow-[0_0_40px_rgba(229,9,20,0.8)] z-10 border-4 border-black">
          VS
        </div>

        <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
          <img
            src={car2.image}
            alt={car2.name}
            className="w-full aspect-[16/9] object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-4">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{car2.name}</h2>
            <p className="text-accent font-black tracking-widest text-xs uppercase">{car2.brand} Excellence</p>
          </div>
        </div>
      </div>

      {/* 🤖 AI Expert Comparison Verdict (NEW) */}
      <CompareVerdict car1={car1} car2={car2} />

      {/* Tech Specs Table */}
      <div className="bg-card-bg/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-16 shadow-2xl">
        <div className="grid grid-cols-3 bg-black/40 border-b border-white/5">
          <div className="p-5 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Main Technical Specs</div>
          <div className="p-5 font-black text-white text-center uppercase tracking-tight italic">{car1.name}</div>
          <div className="p-5 font-black text-white text-center uppercase tracking-tight italic">{car2.name}</div>
        </div>

        {[
          { label: "Category", v1: car1.type, v2: car2.type },
          { label: "Range (WLTP)", v1: car1.range || "N/A", v2: car2.range || "N/A" },
          { label: "Battery", v1: car1.battery || "N/A", v2: car2.battery || "N/A" },
          { label: "Price (Global)", v1: car1.prices?.us || car1.price, v2: car2.prices?.us || car2.price },
          { label: "Price (Israel 🇮🇱)", v1: car1.prices?.il || "N/A", v2: car2.prices?.il || "N/A" },
          { label: "Price (Russia 🇷🇺)", v1: car1.prices?.ru || "N/A", v2: car2.prices?.ru || "N/A" },
          { label: "Price (Arabic 🇸🇦)", v1: car1.prices?.ar || "N/A", v2: car2.prices?.ar || "N/A" },
        ].map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 border-b border-white/5 items-center ${
              i % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"
            }`}
          >
            <div className="p-5 font-bold text-gray-400 text-xs italic tracking-wider">{row.label}</div>
            <div className="p-5 text-white text-center text-sm font-medium">{row.v1}</div>
            <div className="p-5 text-white text-center text-sm font-medium">{row.v2}</div>
          </div>
        ))}
      </div>

      {/* Related Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">
            Watch <span className="text-accent">{car1.name}</span> Reviews
          </h3>
          <div className="flex flex-col gap-4">
            {car1Videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">
            Watch <span className="text-accent">{car2.name}</span> Reviews
          </h3>
          <div className="flex flex-col gap-4">
            {car2Videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
