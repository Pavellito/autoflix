import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarById, getRelatedVideosForCar } from "@/app/lib/data";
import VideoRow from "@/app/components/VideoRow";
import RegionalCarInfo from "@/app/components/RegionalCarInfo";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = getCarById(id);

  if (!car) {
    notFound();
  }

  const relatedVideos = getRelatedVideosForCar(car);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/cars"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        ← Back to Cars
      </Link>

      <div className="bg-card-bg rounded-2xl overflow-hidden border border-white/5 mb-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative aspect-video md:aspect-auto bg-gray-900 border-b md:border-b-0 md:border-r border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {car.brand}
                </span>
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {car.type}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight">
                {car.name}
              </h1>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Specifications</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col border-b border-white/5 pb-4">
                <span className="text-sm text-gray-400 mb-1">Estimated Range (WLTP)</span>
                <span className="text-xl font-semibold text-white">
                  {car.range || "N/A"}
                </span>
              </div>

              <div className="flex flex-col border-b border-white/5 pb-4">
                <span className="text-sm text-gray-400 mb-1">Battery Capacity</span>
                <span className="text-xl font-semibold text-white">
                  {car.battery || "N/A"}
                </span>
              </div>

              {/* Advanced Localized Info (Stage 12) */}
              <RegionalCarInfo car={car} />
            </div>
          </div>
        </div>
      </div>

      {relatedVideos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4 px-4">
            Videos featuring the {car.name}
          </h2>
          <VideoRow title="" videos={relatedVideos} />
        </div>
      )}
    </div>
  );
}
