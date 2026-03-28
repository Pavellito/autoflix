import Link from "next/link";
import { notFound } from "next/navigation";
import type { Car } from "@/app/lib/data";
import { getRelatedVideosForCar } from "@/app/lib/data";
import { fetchCarById, fetchNewsForCar } from "@/app/lib/supabase-cars";
import { fetchCarDetails, getCarImageUrl } from "@/app/lib/car-api";
import VideoRow from "@/app/components/VideoRow";
import RegionalCarInfo from "@/app/components/RegionalCarInfo";
import VehicleImage from "@/app/components/VehicleImage";
import ReviewSection from "@/app/components/ReviewSection";

/**
 * Try to parse a car ID slug like "bmw-228-xdrive-gran-coupe-2025"
 * and fetch from FuelEconomy.gov if not in local DB
 */
async function fetchCarFromExternalApi(id: string): Promise<Car | null> {
  // Try to extract year from the end of the slug
  const yearMatch = id.match(/-(\d{4})$/);
  if (!yearMatch) return null;

  const year = parseInt(yearMatch[1], 10);
  const namePart = id.replace(/-\d{4}$/, "");

  // Try to figure out make and model from slug
  // Common makes to try matching
  const knownMakes = [
    "acura", "alfa-romeo", "aston-martin", "audi", "bentley", "bmw", "buick",
    "cadillac", "chevrolet", "chrysler", "dodge", "ferrari", "fiat", "ford",
    "genesis", "gmc", "honda", "hyundai", "infiniti", "jaguar", "jeep", "kia",
    "lamborghini", "land-rover", "lexus", "lincoln", "lucid", "maserati",
    "mazda", "mclaren", "mercedes-benz", "mini", "mitsubishi", "nissan",
    "polestar", "porsche", "ram", "rivian", "rolls-royce", "subaru", "suzuki",
    "tesla", "toyota", "volkswagen", "volvo", "byd",
  ];

  let make = "";
  let modelSlug = namePart;
  for (const m of knownMakes) {
    if (namePart.startsWith(m + "-") || namePart === m) {
      make = m;
      modelSlug = namePart.slice(m.length + 1);
      break;
    }
  }

  if (!make) return null;

  // Convert slug to proper case for API
  const makeName = make.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  // For model, replace hyphens with spaces and title-case
  const modelName = modelSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  try {
    const details = await fetchCarDetails(year, makeName, modelName);
    if (!details) return null;

    const imageUrl = getCarImageUrl(makeName, details.baseModel || modelName);
    const isEV = details.type === "EV";

    const rangeTxt = isEV && details.rangeCombined
      ? `${details.rangeCombined} mi (${Math.round(details.rangeCombined * 1.609)} km)`
      : details.mpgCombined
        ? `${details.mpgCombined} MPG`
        : undefined;

    const realWorldRange = isEV && details.rangeCity && details.rangeHighway
      ? {
          city: `${Math.round(details.rangeCity)} mi`,
          highway: `${Math.round(details.rangeHighway)} mi`,
          winter: `~${Math.round(details.rangeCity * 0.7)} mi`,
        }
      : undefined;

    return {
      id,
      name: `${makeName} ${details.model}`,
      brand: makeName,
      type: details.type,
      range: rangeTxt,
      battery: details.batteryKwh ? `${details.batteryKwh} kWh` : undefined,
      price: details.fuelCostAnnual ? `$${details.fuelCostAnnual}/yr fuel` : undefined,
      image: imageUrl,
      realWorldRange,
      chargingCurve: isEV && details.chargeTime240v
        ? { maxSpeed: details.evMotor || "N/A", tenToEighty: `~${Math.round(details.chargeTime240v * 0.7)}h (240V)` }
        : undefined,
      relatedVideoIds: [],
      externalData: {
        source: "fueleconomy.gov",
        externalId: details.externalId,
        fetchedAt: new Date().toISOString(),
        year: details.year,
        fuelType: details.fuelType,
        drive: details.drive,
        transmission: details.transmission,
        vehicleClass: details.vehicleClass,
        cylinders: details.cylinders,
        displacement: details.displacement,
        mpgCity: details.mpgCity,
        mpgHighway: details.mpgHighway,
        mpgCombined: details.mpgCombined,
        evMotor: details.evMotor,
        batteryKwh: details.batteryKwh,
        rangeCombined: details.rangeCombined,
        rangeCity: details.rangeCity,
        rangeHighway: details.rangeHighway,
        chargeTime240v: details.chargeTime240v,
        co2TailpipeGpm: details.co2TailpipeGpm,
        fuelCostAnnual: details.fuelCostAnnual,
        feScore: details.feScore,
        ghgScore: details.ghgScore,
      },
    };
  } catch (err) {
    console.error("External API fetch failed:", err);
    return null;
  }
}

function ScoreBar({ score, max = 10, label }: { score: number; max?: number; label: string }) {
  const pct = (score / max) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[12px] text-[#999]">{label}</span>
        <span className="text-[12px] text-white font-bold">{score}/{max}</span>
      </div>
      <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 70 ? "#46d369" : pct >= 40 ? "#f5c518" : "#e50914",
          }}
        />
      </div>
    </div>
  );
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let car = await fetchCarById(id);

  // If not in local DB, try fetching from FuelEconomy.gov API
  if (!car) {
    car = await fetchCarFromExternalApi(id);
  }

  if (!car) {
    notFound();
  }

  const [relatedVideos, relatedNews] = await Promise.all([
    Promise.resolve(getRelatedVideosForCar(car)),
    fetchNewsForCar(car),
  ]);

  const ext = car.externalData;
  const isEV = car.type === "EV";
  const isHybrid = car.type === "Hybrid";

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
            {ext?.year && <span className="text-[14px] text-white/70">{ext.year}</span>}
            {ext?.vehicleClass && (
              <span className="text-[13px] text-white/50 border border-white/20 px-2 py-0.5 rounded">
                {ext.vehicleClass}
              </span>
            )}
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
      <div className="max-w-6xl mx-auto px-[4%] py-8 -mt-8 relative z-10">
        {/* Top info bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#46d369] font-bold text-[16px]">98% Match</span>
          {ext?.year && <span className="text-[14px] text-white/60">{ext.year}</span>}
          <span className="text-[14px] text-white/60">{car.price || "Price TBD"}</span>
          <span className="border border-white/30 text-white/60 px-1.5 text-[12px]">{car.type}</span>
          {ext?.source && (
            <span className="text-[10px] text-green-400/60 bg-green-400/10 px-2 py-0.5 rounded ml-auto">
              Data: {ext.source}
            </span>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Technical specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Specs Grid */}
            <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6">
              <h2 className="text-[16px] font-bold text-white mb-4">Technical Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Powertrain */}
                {ext?.drive && (
                  <div>
                    <p className="text-[#777] text-[12px] mb-1">Drivetrain</p>
                    <p className="text-white text-[15px] font-medium">{ext.drive}</p>
                  </div>
                )}
                {ext?.transmission && (
                  <div>
                    <p className="text-[#777] text-[12px] mb-1">Transmission</p>
                    <p className="text-white text-[15px] font-medium">{ext.transmission}</p>
                  </div>
                )}
                {ext?.fuelType && (
                  <div>
                    <p className="text-[#777] text-[12px] mb-1">Fuel Type</p>
                    <p className="text-white text-[15px] font-medium">{ext.fuelType}</p>
                  </div>
                )}

                {/* EV-specific */}
                {(isEV || isHybrid) && (
                  <>
                    {car.battery && (
                      <div>
                        <p className="text-[#777] text-[12px] mb-1">Battery</p>
                        <p className="text-white text-[15px] font-medium">{car.battery}</p>
                      </div>
                    )}
                    {ext?.evMotor && (
                      <div>
                        <p className="text-[#777] text-[12px] mb-1">Motor</p>
                        <p className="text-white text-[15px] font-medium">{ext.evMotor}</p>
                      </div>
                    )}
                    {ext?.chargeTime240v && (
                      <div>
                        <p className="text-[#777] text-[12px] mb-1">Charge Time (240V)</p>
                        <p className="text-white text-[15px] font-medium">{ext.chargeTime240v}h</p>
                      </div>
                    )}
                  </>
                )}

                {/* ICE-specific */}
                {!isEV && ext?.cylinders && (
                  <div>
                    <p className="text-[#777] text-[12px] mb-1">Cylinders</p>
                    <p className="text-white text-[15px] font-medium">{ext.cylinders}</p>
                  </div>
                )}
                {!isEV && ext?.displacement && (
                  <div>
                    <p className="text-[#777] text-[12px] mb-1">Displacement (L)</p>
                    <p className="text-white text-[15px] font-medium">{ext.displacement}L</p>
                  </div>
                )}

                {/* Range */}
                {car.range && (
                  <div>
                    <p className="text-[#777] text-[12px] mb-1">{isEV ? "Range" : "Range / MPG"}</p>
                    <p className="text-white text-[15px] font-medium">{car.range}</p>
                  </div>
                )}

                {/* Charging */}
                {car.chargingCurve && (
                  <>
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">Max Charging</p>
                      <p className="text-white text-[15px] font-medium">{car.chargingCurve.maxSpeed}</p>
                    </div>
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">10-80% Time</p>
                      <p className="text-white text-[15px] font-medium">{car.chargingCurve.tenToEighty}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Range & Efficiency */}
            {(ext?.mpgCity || car.realWorldRange) && (
              <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6">
                <h2 className="text-[16px] font-bold text-white mb-4">
                  {isEV ? "Range & Efficiency" : "Fuel Economy"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ext?.mpgCity && (
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">{isEV ? "MPGe City" : "MPG City"}</p>
                      <p className="text-white text-[24px] font-bold">{ext.mpgCity}</p>
                    </div>
                  )}
                  {ext?.mpgHighway && (
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">{isEV ? "MPGe Highway" : "MPG Highway"}</p>
                      <p className="text-white text-[24px] font-bold">{ext.mpgHighway}</p>
                    </div>
                  )}
                  {ext?.mpgCombined && (
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">{isEV ? "MPGe Combined" : "MPG Combined"}</p>
                      <p className="text-white text-[24px] font-bold">{ext.mpgCombined}</p>
                    </div>
                  )}
                  {car.realWorldRange && (
                    <>
                      <div>
                        <p className="text-[#777] text-[12px] mb-1">City Range</p>
                        <p className="text-white text-[15px] font-medium">{car.realWorldRange.city}</p>
                      </div>
                      <div>
                        <p className="text-[#777] text-[12px] mb-1">Highway Range</p>
                        <p className="text-white text-[15px] font-medium">{car.realWorldRange.highway}</p>
                      </div>
                      <div>
                        <p className="text-[#777] text-[12px] mb-1">Winter Range</p>
                        <p className="text-white text-[15px] font-medium">{car.realWorldRange.winter}</p>
                      </div>
                    </>
                  )}
                  {ext?.fuelCostAnnual && (
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">Annual Fuel Cost</p>
                      <p className="text-white text-[15px] font-medium">${ext.fuelCostAnnual}</p>
                    </div>
                  )}
                  {ext?.co2TailpipeGpm !== undefined && ext.co2TailpipeGpm !== null && (
                    <div>
                      <p className="text-[#777] text-[12px] mb-1">CO2 Tailpipe</p>
                      <p className="text-white text-[15px] font-medium">
                        {ext.co2TailpipeGpm === 0 ? "Zero Emissions" : `${ext.co2TailpipeGpm} g/mi`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scores */}
            {(ext?.feScore || ext?.ghgScore) && (
              <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6">
                <h2 className="text-[16px] font-bold text-white mb-4">EPA Ratings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ext.feScore && <ScoreBar score={ext.feScore} label="Fuel Economy Score" />}
                  {ext.ghgScore && <ScoreBar score={ext.ghgScore} label="Greenhouse Gas Score" />}
                </div>
              </div>
            )}

            {/* Depreciation */}
            {car.depreciation && (
              <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6">
                <h2 className="text-[16px] font-bold text-white mb-4">Depreciation</h2>
                <p className="text-white font-bold text-[20px]">
                  {car.depreciation.yr3}{" "}
                  <span className="text-[14px] text-[#777] font-normal">
                    ({car.depreciation.resaleValue} resale value)
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <RegionalCarInfo car={car} />

            {/* Quick facts card */}
            {ext && (
              <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-4">
                <h3 className="text-[14px] font-bold text-white mb-3">Quick Facts</h3>
                <div className="space-y-2 text-[13px]">
                  {ext.vehicleClass && (
                    <div className="flex justify-between">
                      <span className="text-[#777]">Class</span>
                      <span className="text-white">{ext.vehicleClass}</span>
                    </div>
                  )}
                  {ext.drive && (
                    <div className="flex justify-between">
                      <span className="text-[#777]">Drive</span>
                      <span className="text-white">{ext.drive}</span>
                    </div>
                  )}
                  {ext.fuelType && (
                    <div className="flex justify-between">
                      <span className="text-[#777]">Fuel</span>
                      <span className="text-white">{ext.fuelType}</span>
                    </div>
                  )}
                  {ext.fuelCostAnnual && (
                    <div className="flex justify-between">
                      <span className="text-[#777]">Annual Cost</span>
                      <span className="text-[#46d369] font-bold">${ext.fuelCostAnnual}/yr</span>
                    </div>
                  )}
                </div>
              </div>
            )}
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
