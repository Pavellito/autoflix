import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedVideosForCar } from "@/app/lib/data";
import { fetchCarById } from "@/app/lib/supabase-cars";
import VideoRow from "@/app/components/VideoRow";
import RegionalCarInfo from "@/app/components/RegionalCarInfo";
import VehicleImage from "@/app/components/VehicleImage";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await fetchCarById(id);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          <div className="relative aspect-video md:aspect-auto bg-gray-900 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
            <VehicleImage 
              src={car.image} 
              alt={car.name} 
              aspectRatio="h-full"
              className="w-full h-full" 
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />
            
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

              <div className="flex flex-col border-b border-white/5 pb-4 mb-4">
                <span className="text-sm text-gray-400 mb-1">Battery Capacity</span>
                <span className="text-xl font-semibold text-white">
                  {car.battery || "N/A"}
                </span>
              </div>

              {/* Startup Pivot: Deep Metrics Intelligence UI */}
              {(car.realWorldRange || car.chargingCurve || car.depreciation) && (
                <div className="bg-black/40 border border-accent/20 rounded-xl p-5 mb-6 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                  <h3 className="text-[10px] font-black tracking-widest text-accent uppercase mb-4 flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Deep Intelligence Metrics
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {car.realWorldRange && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Real Range (Hwy / Winter)</span>
                          <span className="text-sm text-white font-medium">{car.realWorldRange.highway} <span className="text-gray-600">|</span> {car.realWorldRange.winter}</span>
                       </div>
                    )}
                    {car.chargingCurve && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">DC Fast Charge (10-80%)</span>
                          <span className="text-sm text-white font-medium">{car.chargingCurve.tenToEighty} <span className="text-accent text-[10px] bg-accent/10 px-1 rounded ml-1">@{car.chargingCurve.maxSpeed}</span></span>
                       </div>
                    )}
                    {car.depreciation && (
                       <div className="flex flex-col gap-1 col-span-2 border-t border-white/5 pt-3 mt-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Proj. 3-Year Depreciation</span>
                          <div className="flex items-center gap-2">
                             <span className="text-sm text-red-400 font-bold">{car.depreciation.yr3}</span>
                             <span className="text-xs text-gray-400 italic">({car.depreciation.resaleValue} Resale Market)</span>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              )}

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
