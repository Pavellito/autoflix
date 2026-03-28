import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedVideosForCar } from "@/app/lib/data";
import { fetchCarById, fetchNewsForCar } from "@/app/lib/supabase-cars";
import VideoRow from "@/app/components/VideoRow";
import RegionalCarInfo from "@/app/components/RegionalCarInfo";
import VehicleImage from "@/app/components/VehicleImage";
import ReviewSection from "@/app/components/ReviewSection";

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

  const [relatedVideos, relatedNews] = await Promise.all([
    Promise.resolve(getRelatedVideosForCar(car)),
    fetchNewsForCar(car),
  ]);

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px]">
        <VehicleImage
          src={car.image}
          alt={car.name}
          aspectRatio="h-full"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 billboard-vignette" />
        <div className="absolute inset-0 billboard-bottom" />

        <div className="absolute bottom-12 left-[4%] z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#e50914] text-white text-[12px] font-bold px-3 py-1 rounded">{car.type}</span>
            <span className="text-[14px] text-white/70">{car.brand}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "Arial Black, sans-serif" }}>
            {car.name}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/compare"
              className="flex items-center gap-2 bg-white text-black px-7 py-2.5 rounded text-[16px] font-bold hover:bg-white/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
            <Link
              href="/cars"
              className="flex items-center gap-2 bg-[#6d6d6e]/70 text-white px-7 py-2.5 rounded text-[16px] font-bold hover:bg-[#6d6d6e]/50 transition-colors"
            >
              Back to Cars
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-[4%] py-8 -mt-8 relative z-10">
        {/* 3-column info layout like Netflix detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left: Main info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#46d369] font-bold text-[16px]">98% Match</span>
              <span className="text-[14px] text-white/60">{car.price || "Price TBD"}</span>
              <span className="border border-white/30 text-white/60 px-1.5 text-[12px]">{car.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[#777] text-[13px] mb-1">Range (WLTP)</p>
                <p className="text-white text-[16px] font-medium">{car.range || "N/A"}</p>
              </div>
              <div>
                <p className="text-[#777] text-[13px] mb-1">Battery</p>
                <p className="text-white text-[16px] font-medium">{car.battery || "N/A"}</p>
              </div>
              {car.realWorldRange && (
                <>
                  <div>
                    <p className="text-[#777] text-[13px] mb-1">Highway Range</p>
                    <p className="text-white text-[16px] font-medium">{car.realWorldRange.highway}</p>
                  </div>
                  <div>
                    <p className="text-[#777] text-[13px] mb-1">Winter Range</p>
                    <p className="text-white text-[16px] font-medium">{car.realWorldRange.winter}</p>
                  </div>
                </>
              )}
              {car.chargingCurve && (
                <>
                  <div>
                    <p className="text-[#777] text-[13px] mb-1">Max Charging</p>
                    <p className="text-white text-[16px] font-medium">{car.chargingCurve.maxSpeed}</p>
                  </div>
                  <div>
                    <p className="text-[#777] text-[13px] mb-1">10-80% Time</p>
                    <p className="text-white text-[16px] font-medium">{car.chargingCurve.tenToEighty}</p>
                  </div>
                </>
              )}
            </div>

            {car.depreciation && (
              <div className="p-4 bg-[#1a1a1a] rounded border border-white/10 mb-6">
                <p className="text-[13px] text-[#777] mb-1">3-Year Depreciation</p>
                <p className="text-white font-bold">{car.depreciation.yr3} <span className="text-[14px] text-[#777] font-normal">({car.depreciation.resaleValue} resale)</span></p>
              </div>
            )}
          </div>

          {/* Right: Regional info */}
          <div>
            <RegionalCarInfo car={car} />
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="border-t border-white/10 pt-8 mb-8">
            <h2 className="text-[20px] font-bold text-white mb-4">{car.brand} in the News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedNews.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="group bg-[#1a1a1a] rounded overflow-hidden border border-white/5 hover:border-white/20 transition-colors"
                >
                  {article.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[13px] text-white font-medium line-clamp-2 group-hover:text-white/80">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-[#e50914] font-bold uppercase">{article.source_id}</span>
                      <span className="text-[11px] text-[#777]">
                        {article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <div className="border-t border-white/10 pt-8 mb-8">
            <VideoRow title={`Videos featuring ${car.name}`} videos={relatedVideos} />
          </div>
        )}

        {/* Reviews */}
        <ReviewSection targetId={car.id} targetTitle={car.name} />
      </div>
    </div>
  );
}
