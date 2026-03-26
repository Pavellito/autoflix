import { notFound } from "next/navigation";
import Link from "next/link";
import { cars, getCarById, getRelatedVideosForCar } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";

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
  const match = slug.match(/^(.+)-vs-(.+)$/);

  if (!match) notFound();

  const [, id1, id2] = match;
  const car1 = getCarById(id1);
  const car2 = getCarById(id2);

  if (!car1 || !car2) notFound();

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
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          <span className="text-accent">{car1.brand}</span> {car1.name.replace(car1.brand, "").trim()} vs{" "}
          <span className="text-accent">{car2.brand}</span> {car2.name.replace(car2.brand, "").trim()}
        </h1>
        <p className="text-gray-400 text-lg">Detailed specification breakdown</p>
      </div>

      {/* Hero Images Side by Side */}
      <div className="flex flex-col md:flex-row gap-4 mb-16 relative">
        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10 group">
          <img
            src={car1.image}
            alt={car1.name}
            className="w-full aspect-[16/9] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pb-4">
            <h2 className="text-2xl font-bold text-white">{car1.name}</h2>
            <p className="text-accent font-semibold">{car1.price}</p>
          </div>
        </div>

        {/* VS Badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white font-black italic text-2xl w-16 h-16 items-center justify-center rounded-full shadow-[0_0_30px_rgba(229,9,20,0.6)] z-10 border-4 border-black">
          VS
        </div>

        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10 group">
          <img
            src={car2.image}
            alt={car2.name}
            className="w-full aspect-[16/9] object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pb-4">
            <h2 className="text-2xl font-bold text-white">{car2.name}</h2>
            <p className="text-accent font-semibold">{car2.price}</p>
          </div>
        </div>
      </div>

      {/* Tech Specs Table */}
      <div className="bg-card-bg rounded-xl border border-white/10 overflow-hidden mb-16 shadow-xl">
        <div className="grid grid-cols-3 bg-black/40 border-b border-white/5">
          <div className="p-4 font-bold text-gray-400">Specification</div>
          <div className="p-4 font-bold text-white text-center">{car1.name}</div>
          <div className="p-4 font-bold text-white text-center">{car2.name}</div>
        </div>

        {[
          { label: "Brand", v1: car1.brand, v2: car2.brand },
          { label: "Type", v1: car1.type, v2: car2.type },
          { label: "Starting Price", v1: car1.price || "N/A", v2: car2.price || "N/A" },
          { label: "Estimated Range", v1: car1.range || "N/A", v2: car2.range || "N/A" },
          { label: "Battery Capacity", v1: car1.battery || "N/A", v2: car2.battery || "N/A" },
        ].map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 border-b border-white/5 ${
              i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
            }`}
          >
            <div className="p-4 font-medium text-gray-400">{row.label}</div>
            <div className="p-4 text-white text-center">{row.v1}</div>
            <div className="p-4 text-white text-center">{row.v2}</div>
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
