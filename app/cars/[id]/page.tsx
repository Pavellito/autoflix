import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarById, getRelatedVideosForCar } from "@/app/lib/data";
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
  const car = getCarById(id);

  if (!car) {
    notFound();
  }

  const relatedVideos = getRelatedVideosForCar(car);

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Netflix-style hero banner */}
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <VehicleImage
            src={car.image}
            alt={car.name}
            aspectRatio="h-full"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#141414] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-[#141414]/50 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-10 left-4 lg:left-14 max-w-2xl z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#e50914] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm uppercase">
              {car.type}
            </span>
            <span className="text-[#bcbcbc] text-sm">{car.brand}</span>
          </div>
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3">{car.name}</h1>
          <p className="text-[#46d369] text-lg font-bold mb-4">{car.price}</p>

          <div className="flex items-center gap-3">
            <Link
              href="/compare"
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-[4px] text-base font-bold hover:bg-white/80 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
            <Link
              href="/quiz"
              className="flex items-center gap-2 bg-[#6d6d6eb3] text-white px-6 py-2.5 rounded-[4px] text-base font-bold hover:bg-[#6d6d6e99] transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Get Advice
            </Link>
          </div>
        </div>
      </div>

      {/* Specs + details section */}
      <div className="max-w-6xl mx-auto px-4 lg:px-14 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - main info */}
          <div className="lg:col-span-2">
            {/* Maturity-style info bar */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="text-[#46d369] font-bold">New</span>
              <span className="maturity-badge text-[#bcbcbc]">{car.type}</span>
              <span className="text-[#bcbcbc]">{car.range || "N/A"} Range</span>
              <span className="text-[#bcbcbc]">{car.battery || "N/A"} Battery</span>
            </div>

            {/* Deep Intelligence Metrics */}
            {(car.realWorldRange || car.chargingCurve || car.depreciation) && (
              <div className="bg-[#181818] border border-[#333] rounded-[4px] p-6 mb-6">
                <h3 className="text-white text-base font-bold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {car.realWorldRange && (
                    <div>
                      <p className="text-[#808080] text-xs uppercase tracking-wider mb-1">Real-World Range</p>
                      <p className="text-white text-sm">
                        City: {car.realWorldRange.city} | Highway: {car.realWorldRange.highway}
                      </p>
                      <p className="text-[#808080] text-xs mt-0.5">Winter: {car.realWorldRange.winter}</p>
                    </div>
                  )}
                  {car.chargingCurve && (
                    <div>
                      <p className="text-[#808080] text-xs uppercase tracking-wider mb-1">DC Fast Charge</p>
                      <p className="text-white text-sm">
                        10-80% in {car.chargingCurve.tenToEighty}
                      </p>
                      <p className="text-[#808080] text-xs mt-0.5">Max: {car.chargingCurve.maxSpeed}</p>
                    </div>
                  )}
                  {car.depreciation && (
                    <div className="sm:col-span-2 border-t border-[#333] pt-4">
                      <p className="text-[#808080] text-xs uppercase tracking-wider mb-1">3-Year Depreciation</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[#e50914] font-bold">{car.depreciation.yr3}</span>
                        <span className="text-[#808080] text-sm">({car.depreciation.resaleValue} resale)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <RegionalCarInfo car={car} />

            {/* Reviews */}
            <ReviewSection targetId={car.id} targetTitle={car.name} />
          </div>

          {/* Right column - sidebar */}
          <div className="space-y-4">
            <div className="bg-[#181818] border border-[#333] rounded-[4px] p-5">
              <h3 className="text-white font-bold mb-3">Specifications</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#808080]">Brand</span>
                  <span className="text-white">{car.brand}</span>
                </div>
                <div className="flex justify-between border-t border-[#282828] pt-3">
                  <span className="text-[#808080]">Type</span>
                  <span className="text-white">{car.type}</span>
                </div>
                <div className="flex justify-between border-t border-[#282828] pt-3">
                  <span className="text-[#808080]">Range</span>
                  <span className="text-white">{car.range || "N/A"}</span>
                </div>
                <div className="flex justify-between border-t border-[#282828] pt-3">
                  <span className="text-[#808080]">Battery</span>
                  <span className="text-white">{car.battery || "N/A"}</span>
                </div>
                <div className="flex justify-between border-t border-[#282828] pt-3">
                  <span className="text-[#808080]">Price</span>
                  <span className="text-[#46d369] font-bold">{car.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related videos */}
        {relatedVideos.length > 0 && (
          <div className="mt-12">
            <VideoRow title={`Videos featuring ${car.name}`} videos={relatedVideos} />
          </div>
        )}
      </div>
    </div>
  );
}
