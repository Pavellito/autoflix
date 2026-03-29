import Link from "next/link";
import { notFound } from "next/navigation";
import type { Car } from "@/app/lib/data";
import { getRelatedVideosForCar } from "@/app/lib/data";
import { fetchCarById, fetchNewsForCar, type NewsItem } from "@/app/lib/supabase-cars";
import { fetchCarDetails, getCarImageUrl } from "@/app/lib/car-api";
import { findVehicleByMakeModelYear } from "@/app/lib/vehicle-queries";
import type { VehicleDetailData, Engine, Dimensions, FuelEconomy, SafetyRating, EvSpec } from "@/app/lib/vehicle-types";
import VideoRow from "@/app/components/VideoRow";
import RegionalCarInfo from "@/app/components/RegionalCarInfo";
import VehicleImage from "@/app/components/VehicleImage";
import ReviewSection from "@/app/components/ReviewSection";
import YouTubeSection from "@/app/components/YouTubeSection";

// ─── Known makes for slug parsing ────────────────────────
const knownMakes = [
  "acura", "alfa-romeo", "aston-martin", "audi", "bentley", "bmw", "buick",
  "cadillac", "chevrolet", "chrysler", "dodge", "ferrari", "fiat", "ford",
  "genesis", "gmc", "honda", "hyundai", "infiniti", "jaguar", "jeep", "kia",
  "lamborghini", "land-rover", "lexus", "lincoln", "lucid", "maserati",
  "mazda", "mclaren", "mercedes-benz", "mini", "mitsubishi", "nissan",
  "polestar", "porsche", "ram", "rivian", "rolls-royce", "subaru", "suzuki",
  "tesla", "toyota", "volkswagen", "volvo", "byd", "xiaomi", "zeekr",
];

function parseSlug(slug: string): { make: string; model: string; year?: number } | null {
  const yearMatch = slug.match(/-(\d{4})$/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;
  const namePart = yearMatch ? slug.replace(/-\d{4}$/, "") : slug;

  let makeSlug = "";
  let modelSlug = namePart;
  for (const m of knownMakes) {
    if (namePart.startsWith(m + "-") || namePart === m) {
      makeSlug = m;
      modelSlug = namePart.slice(m.length + 1);
      break;
    }
  }
  if (!makeSlug) return null;

  const makeName = makeSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const modelName = modelSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return { make: makeName, model: modelName, year };
}

// ─── External API fallback ───────────────────────────────
async function fetchCarFromExternalApi(id: string): Promise<Car | null> {
  const parsed = parseSlug(id);
  if (!parsed) return null;
  const { make: makeName, model: modelName, year } = parsed;
  if (!year) return null;

  try {
    const details = await fetchCarDetails(year, makeName, modelName);
    if (!details) return null;

    const imageUrl = getCarImageUrl(makeName, details.baseModel || modelName);
    const isEV = details.type === "EV";
    const rangeTxt = isEV && details.rangeCombined
      ? `${details.rangeCombined} mi (${Math.round(details.rangeCombined * 1.609)} km)`
      : details.mpgCombined ? `${details.mpgCombined} MPG` : undefined;

    const estimatedPrice = details.estimatedMsrp ? `From ~$${details.estimatedMsrp.toLocaleString()}` : undefined;

    return {
      id,
      name: `${makeName} ${details.model}`,
      brand: makeName,
      type: details.type,
      range: rangeTxt,
      battery: details.batteryKwh ? `${details.batteryKwh} kWh` : undefined,
      price: estimatedPrice || (details.fuelCostAnnual ? `$${details.fuelCostAnnual}/yr fuel` : undefined),
      image: imageUrl,
      realWorldRange: isEV && details.rangeCity && details.rangeHighway
        ? { city: `${Math.round(details.rangeCity)} mi`, highway: `${Math.round(details.rangeHighway)} mi`, winter: `~${Math.round(details.rangeCity * 0.7)} mi` }
        : undefined,
      chargingCurve: isEV && details.chargeTime240v
        ? { maxSpeed: details.evMotor || "N/A", tenToEighty: `~${Math.round(details.chargeTime240v * 0.7)}h (240V)` }
        : undefined,
      relatedVideoIds: [],
      externalData: {
        source: "fueleconomy.gov + NHTSA",
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
        // Extended engine info
        engineDescription: details.engineDescription,
        hasTurbo: details.hasTurbo,
        hasSupercharger: details.hasSupercharger,
        hasStartStop: details.hasStartStop,
        passengerVolume: details.passengerVolume,
        cargoVolume: details.cargoVolume,
        youSaveSpend: details.youSaveSpend,
        // NHTSA physical dimensions
        nhtsaLengthMm: details.nhtsaLengthMm,
        nhtsaWidthMm: details.nhtsaWidthMm,
        nhtsaHeightMm: details.nhtsaHeightMm,
        nhtsaWheelbaseMm: details.nhtsaWheelbaseMm,
        nhtsaCurbWeightKg: details.nhtsaCurbWeightKg,
        nhtsaTrackFrontMm: details.nhtsaTrackFrontMm,
        nhtsaTrackRearMm: details.nhtsaTrackRearMm,
        nhtsaWeightDistribution: details.nhtsaWeightDistribution,
        nhtsaTrimVariants: details.nhtsaTrimVariants,
        estimatedMsrp: details.estimatedMsrp,
      },
    };
  } catch {
    return null;
  }
}

// ─── Page Component ──────────────────────────────────────

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Resolve identity: try local DB first, then external API
  let car = await fetchCarById(id);
  if (!car) car = await fetchCarFromExternalApi(id);
  if (!car) notFound();

  // 2. Parse make/model/year for cross-table lookups
  const parsed = parseSlug(id);
  const makeName = parsed?.make || car.brand;
  const modelName = parsed?.model || car.name.replace(car.brand, "").trim();
  const yearNum = parsed?.year || (car.externalData?.year as number | undefined);

  // 3. Fetch ALL data in parallel: deep specs, news, hardcoded videos
  const [vehicleData, relatedNews, hardcodedVideos] = await Promise.allSettled([
    findVehicleByMakeModelYear(makeName, modelName, yearNum),
    fetchNewsForCar(car),
    Promise.resolve(getRelatedVideosForCar(car)),
  ]);

  const deepSpecs = vehicleData.status === "fulfilled" ? vehicleData.value : null;
  const news = relatedNews.status === "fulfilled" ? relatedNews.value : [];
  const fallbackVideos = hardcodedVideos.status === "fulfilled" ? hardcodedVideos.value : [];

  const ext = car.externalData;
  const isEV = car.type === "EV";
  const isHybrid = car.type === "Hybrid";

  // Extract deep spec components
  const engine = deepSpecs?.engine ?? null;
  const dimensions = deepSpecs?.dimensions ?? null;
  const fuelEconomy = deepSpecs?.fuelEconomy ?? [];
  const safetyRatings = deepSpecs?.safetyRatings ?? [];
  const evSpecs = deepSpecs?.evSpecs ?? [];
  const spec = deepSpecs?.spec ?? null;

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* ─── Hero Banner ─── */}
      <div className="relative h-[50vh] min-h-[400px]">
        <VehicleImage src={car.image} alt={car.name} aspectRatio="h-full" className="w-full h-full object-cover" />
        <div className="absolute inset-0 billboard-vignette" />
        <div className="absolute inset-0 billboard-bottom" />

        <div className="absolute bottom-12 left-[4%] z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-[#e50914] text-white text-[12px] font-bold px-3 py-1 rounded">{car.type}</span>
            <span className="text-[14px] text-white/70">{car.brand}</span>
            {(yearNum || ext?.year) && <span className="text-[14px] text-white/70">{yearNum || ext?.year}</span>}
            {(ext?.vehicleClass || spec?.body_type) && (
              <span className="text-[13px] text-white/50 border border-white/20 px-2 py-0.5 rounded">
                {ext?.vehicleClass || spec?.body_type}
              </span>
            )}
            {spec?.fuel_type && (
              <span className="bg-emerald-600/60 text-emerald-100 text-[11px] font-bold px-2 py-0.5 rounded">
                {spec.fuel_type}
              </span>
            )}
            {spec?.drive_type && (
              <span className="bg-blue-600/60 text-blue-100 text-[11px] font-bold px-2 py-0.5 rounded">
                {spec.drive_type}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2" style={{ fontFamily: "Arial Black, sans-serif" }}>
            {car.name}
          </h1>
          {spec?.modification_name && (
            <p className="text-lg text-gray-400 font-medium mb-4">{spec.modification_name}</p>
          )}
          <div className="flex items-center gap-3">
            <Link href="/compare" className="flex items-center gap-2 bg-white text-black px-7 py-2.5 rounded text-[16px] font-bold hover:bg-white/80 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
            <Link href="/cars" className="flex items-center gap-2 bg-[#6d6d6e]/70 text-white px-7 py-2.5 rounded text-[16px] font-bold hover:bg-[#6d6d6e]/50 transition-colors">
              Back to Cars
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats Bar ─── */}
      <div className="bg-[#0a0a0a] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-[4%] py-4 flex flex-wrap gap-6 md:gap-10">
          <QuickStat label="Horsepower" value={engine?.horsepower ? `${Math.round(engine.horsepower)} HP` : null} />
          <QuickStat label="Torque" value={engine?.torque_nm ? `${Math.round(engine.torque_nm)} Nm` : null} />
          <QuickStat label="0-100 km/h" value={spec?.acceleration_0_100 ? `${spec.acceleration_0_100}s` : null} />
          <QuickStat label="Top Speed" value={spec?.max_speed_km ? `${Math.round(spec.max_speed_km)} km/h` : null} />
          <QuickStat label="Weight" value={
            dimensions?.curb_weight_kg ? `${Math.round(dimensions.curb_weight_kg)} kg` :
            (ext?.nhtsaCurbWeightKg as number) ? `${ext!.nhtsaCurbWeightKg} kg` : null
          } />
          <QuickStat label="Range" value={
            car.range ? car.range :
            evSpecs[0]?.range_wltp_km ? `${Math.round(evSpecs[0].range_wltp_km)} km WLTP` :
            ext?.rangeCombined ? `${ext.rangeCombined} mi` : null
          } />
          <QuickStat label="MPG Combined" value={ext?.mpgCombined && !isEV ? `${ext.mpgCombined}` : null} />
          <QuickStat label="Est. MSRP" value={
            (ext?.estimatedMsrp as number) ? `~$${(ext!.estimatedMsrp as number).toLocaleString()}` :
            car.price || null
          } />
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-6xl mx-auto px-[4%] py-8">
        {/* Data source tag */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {ext?.source && (
            <span className="text-[10px] text-green-400/60 bg-green-400/10 px-2 py-0.5 rounded">
              FuelEconomy.gov
            </span>
          )}
          {spec?.source && (
            <span className="text-[10px] text-blue-400/60 bg-blue-400/10 px-2 py-0.5 rounded">
              {spec.source}
            </span>
          )}
          {fuelEconomy.length > 0 && (
            <span className="text-[10px] text-green-400/60 bg-green-400/10 px-2 py-0.5 rounded">
              EPA Data
            </span>
          )}
          {safetyRatings.length > 0 && (
            <span className="text-[10px] text-amber-400/60 bg-amber-400/10 px-2 py-0.5 rounded">
              NHTSA Safety
            </span>
          )}
          {evSpecs.length > 0 && (
            <span className="text-[10px] text-emerald-400/60 bg-emerald-400/10 px-2 py-0.5 rounded">
              OpenEV Data
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* ─── Left Column: All Technical Specs ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Engine / Powertrain */}
            {engine && <EnginePanel engine={engine} />}

            {/* Basic specs from FuelEconomy.gov + NHTSA (when no deep engine data) */}
            {!engine && ext && (
              <PanelWrapper title="Engine / Powertrain" icon="&#9881;" color="red">
                <SpecRow label="Drivetrain" value={ext.drive as string} />
                <SpecRow label="Transmission" value={ext.transmission as string} />
                <SpecRow label="Fuel Type" value={ext.fuelType as string} />
                {!isEV && <SpecRow label="Cylinders" value={ext.cylinders as string} />}
                {!isEV && <SpecRow label="Displacement" value={ext.displacement ? `${ext.displacement}L` : null} />}
                {ext.engineDescription && <SpecRow label="Engine Details" value={ext.engineDescription as string} />}
                {ext.hasTurbo && <SpecRow label="Turbocharger" value="Yes" />}
                {ext.hasSupercharger && <SpecRow label="Supercharger" value="Yes" />}
                {ext.hasStartStop && <SpecRow label="Start-Stop System" value="Yes" />}
                {(isEV || isHybrid) && <SpecRow label="Electric Motor" value={ext.evMotor as string} />}
                {(isEV || isHybrid) && <SpecRow label="Battery" value={car.battery} />}
                {car.chargingCurve && (
                  <>
                    <SpecRow label="Max Charging" value={car.chargingCurve.maxSpeed} />
                    <SpecRow label="10-80% Time" value={car.chargingCurve.tenToEighty} />
                  </>
                )}
              </PanelWrapper>
            )}

            {/* Dimensions & Weight — from vehicle_specs DB or NHTSA */}
            {dimensions ? (
              <DimensionsPanel dimensions={dimensions} />
            ) : ext?.nhtsaLengthMm ? (
              <PanelWrapper title="Dimensions & Weight" icon="&#128207;" color="blue">
                <SpecRow label="Length" value={`${ext.nhtsaLengthMm} mm`} />
                <SpecRow label="Width" value={ext.nhtsaWidthMm ? `${ext.nhtsaWidthMm} mm` : null} />
                <SpecRow label="Height" value={ext.nhtsaHeightMm ? `${ext.nhtsaHeightMm} mm` : null} />
                <SpecRow label="Wheelbase" value={ext.nhtsaWheelbaseMm ? `${ext.nhtsaWheelbaseMm} mm` : null} />
                <SpecRow label="Curb Weight" value={ext.nhtsaCurbWeightKg ? `${ext.nhtsaCurbWeightKg} kg` : null} />
                <SpecRow label="Track Front" value={ext.nhtsaTrackFrontMm ? `${ext.nhtsaTrackFrontMm} mm` : null} />
                <SpecRow label="Track Rear" value={ext.nhtsaTrackRearMm ? `${ext.nhtsaTrackRearMm} mm` : null} />
                <SpecRow label="Weight Distribution" value={ext.nhtsaWeightDistribution as string} />
                {ext.passengerVolume && <SpecRow label="Passenger Volume" value={`${ext.passengerVolume} cu ft`} />}
                {ext.cargoVolume && <SpecRow label="Cargo Volume" value={`${ext.cargoVolume} cu ft`} />}
                {(ext.nhtsaTrimVariants as string[])?.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Available Trims</p>
                    <div className="flex flex-wrap gap-1">
                      {(ext.nhtsaTrimVariants as string[]).map((trim, i) => (
                        <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded">{trim}</span>
                      ))}
                    </div>
                  </div>
                )}
              </PanelWrapper>
            ) : null}

            {/* General Specifications */}
            {spec && <GeneralSpecsPanel spec={spec} />}

            {/* Fuel Economy / Range */}
            {(fuelEconomy.length > 0 || ext?.mpgCity) && (
              <PanelWrapper title={isEV ? "Range & Efficiency" : "Fuel Economy"} icon="&#9981;" color="green">
                {/* EPA database data takes priority */}
                {fuelEconomy.length > 0 ? (
                  <>
                    <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">
                      {fuelEconomy[0].year} {fuelEconomy[0].make} {fuelEconomy[0].model} {fuelEconomy[0].trim}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {fuelEconomy[0].city_mpg && (
                        <div className="text-center">
                          <p className="text-[#777] text-[11px]">{isEV ? "MPGe City" : "City"}</p>
                          <p className="text-white text-[28px] font-black">{fuelEconomy[0].city_mpg}</p>
                        </div>
                      )}
                      {fuelEconomy[0].highway_mpg && (
                        <div className="text-center">
                          <p className="text-[#777] text-[11px]">{isEV ? "MPGe Hwy" : "Highway"}</p>
                          <p className="text-white text-[28px] font-black">{fuelEconomy[0].highway_mpg}</p>
                        </div>
                      )}
                      {fuelEconomy[0].combined_mpg && (
                        <div className="text-center">
                          <p className="text-[#777] text-[11px]">{isEV ? "MPGe Comb" : "Combined"}</p>
                          <p className="text-white text-[28px] font-black">{fuelEconomy[0].combined_mpg}</p>
                        </div>
                      )}
                    </div>
                    <SpecRow label="CO2 (g/mi)" value={fuelEconomy[0].co2_tailpipe_gpm ? Math.round(fuelEconomy[0].co2_tailpipe_gpm) : null} />
                    <SpecRow label="GHG Score" value={fuelEconomy[0].ghg_score ? `${fuelEconomy[0].ghg_score}/10` : null} />
                    <SpecRow label="Annual Fuel Cost" value={fuelEconomy[0].annual_fuel_cost ? `$${fuelEconomy[0].annual_fuel_cost.toLocaleString()}` : null} />
                    <SpecRow label="EPA Range" value={fuelEconomy[0].epa_range ? `${fuelEconomy[0].epa_range} mi` : null} />
                  </>
                ) : ext?.mpgCity ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-[#777] text-[11px]">{isEV ? "MPGe City" : "City"}</p>
                        <p className="text-white text-[28px] font-black">{ext.mpgCity as number}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#777] text-[11px]">{isEV ? "MPGe Hwy" : "Highway"}</p>
                        <p className="text-white text-[28px] font-black">{ext.mpgHighway as number}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[#777] text-[11px]">{isEV ? "MPGe Comb" : "Combined"}</p>
                        <p className="text-white text-[28px] font-black">{ext.mpgCombined as number}</p>
                      </div>
                    </div>
                    <SpecRow label="Annual Fuel Cost" value={ext.fuelCostAnnual ? `$${ext.fuelCostAnnual}` : null} />
                    <SpecRow label="CO2 Tailpipe" value={
                      ext.co2TailpipeGpm === 0 ? "Zero Emissions" :
                      ext.co2TailpipeGpm ? `${ext.co2TailpipeGpm} g/mi` : null
                    } />
                  </>
                ) : null}

                {/* Real-world range data */}
                {car.realWorldRange && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">Real-World Range</p>
                    <SpecRow label="City" value={car.realWorldRange.city} />
                    <SpecRow label="Highway" value={car.realWorldRange.highway} />
                    <SpecRow label="Winter" value={car.realWorldRange.winter} />
                  </div>
                )}
              </PanelWrapper>
            )}

            {/* EPA Score Bars */}
            {(ext?.feScore || ext?.ghgScore || fuelEconomy[0]?.ghg_score) && (
              <PanelWrapper title="EPA Ratings" icon="&#127942;" color="green">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(ext?.feScore || fuelEconomy[0]?.ghg_score) && (
                    <ScoreBar score={ext?.feScore as number || fuelEconomy[0]?.ghg_score || 0} label="Fuel Economy Score" />
                  )}
                  {(ext?.ghgScore || fuelEconomy[0]?.ghg_score) && (
                    <ScoreBar score={ext?.ghgScore as number || fuelEconomy[0]?.ghg_score || 0} label="Greenhouse Gas Score" />
                  )}
                </div>
              </PanelWrapper>
            )}

            {/* Safety Ratings (NHTSA) */}
            {safetyRatings.length > 0 && <SafetyPanel data={safetyRatings} />}

            {/* EV Specifications */}
            {evSpecs.length > 0 && <EvPanel data={evSpecs} />}

            {/* Depreciation */}
            {car.depreciation && (
              <PanelWrapper title="Depreciation" icon="&#128200;" color="purple">
                <div className="flex items-center gap-4">
                  <span className="text-[28px] font-black text-white">{car.depreciation.yr3}</span>
                  <div>
                    <p className="text-[13px] text-[#777]">3-Year Depreciation</p>
                    <p className="text-[14px] text-white font-medium">Resale: {car.depreciation.resaleValue}</p>
                  </div>
                </div>
              </PanelWrapper>
            )}
          </div>

          {/* ─── Right Sidebar ─── */}
          <div className="space-y-6">
            <RegionalCarInfo car={car} />

            {/* Estimated Price Card */}
            {ext?.estimatedMsrp && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f1f0f] rounded-lg border border-emerald-500/20 p-4">
                <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Estimated MSRP</h3>
                <p className="text-[32px] font-black text-white leading-tight">
                  ~${(ext.estimatedMsrp as number).toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">*Estimated based on vehicle class & segment</p>
                {ext.youSaveSpend && (
                  <div className={`mt-3 pt-3 border-t border-white/5 text-[13px] font-bold ${(ext.youSaveSpend as number) < 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {(ext.youSaveSpend as number) < 0
                      ? `You spend $${Math.abs(ext.youSaveSpend as number).toLocaleString()} more in fuel vs avg car over 5 years`
                      : `You save $${(ext.youSaveSpend as number).toLocaleString()} in fuel vs avg car over 5 years`}
                  </div>
                )}
              </div>
            )}

            {/* Quick Facts */}
            <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-4">
              <h3 className="text-[14px] font-bold text-white mb-3">Quick Facts</h3>
              <div className="space-y-2 text-[13px]">
                <FactRow label="Year" value={yearNum || spec?.year} />
                <FactRow label="Make" value={makeName} />
                <FactRow label="Model" value={modelName} />
                <FactRow label="Class" value={ext?.vehicleClass as string || spec?.body_type} />
                <FactRow label="Drive" value={ext?.drive as string || spec?.drive_type} />
                <FactRow label="Fuel" value={ext?.fuelType as string || spec?.fuel_type} />
                <FactRow label="Transmission" value={ext?.transmission as string} />
                <FactRow label="Doors" value={spec?.doors_count} />
                <FactRow label="Seats" value={spec?.seats_count} />
                {ext?.nhtsaCurbWeightKg && <FactRow label="Curb Weight" value={`${ext.nhtsaCurbWeightKg} kg`} />}
                {ext?.fuelCostAnnual && (
                  <div className="flex justify-between pt-2 border-t border-white/5">
                    <span className="text-[#777]">Annual Fuel Cost</span>
                    <span className="text-[#46d369] font-bold">${ext.fuelCostAnnual as number}/yr</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── YouTube Videos (Auto-discovered) ─── */}
        <YouTubeSection
          make={makeName}
          model={modelName}
          year={yearNum}
          carSlug={id}
          fallbackVideoIds={car.relatedVideoIds}
        />

        {/* ─── Hardcoded Related Videos (from data.ts) ─── */}
        {fallbackVideos.length > 0 && (
          <div className="border-t border-white/10 pt-8 mb-8">
            <VideoRow title={`${car.name} on AutoFlix`} videos={fallbackVideos} />
          </div>
        )}

        {/* ─── Related News ─── */}
        {news.length > 0 && (
          <div className="border-t border-white/10 pt-8 mb-8">
            <h2 className="text-[20px] font-bold text-white mb-4">{car.brand} in the News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.slice(0, 6).map((article: NewsItem) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="group bg-[#1a1a1a] rounded overflow-hidden border border-white/5 hover:border-white/20 transition-colors"
                >
                  {article.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[13px] text-white font-medium line-clamp-2 group-hover:text-white/80">{article.title}</p>
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

        {/* ─── Reviews ─── */}
        <ReviewSection targetId={car.id} targetTitle={car.name} />
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────

function QuickStat({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{label}</span>
      <span className="text-xl md:text-2xl font-black text-white">{value}</span>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-[#777]">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-white font-semibold text-right max-w-[60%]">{value}</span>
    </div>
  );
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
          style={{ width: `${pct}%`, backgroundColor: pct >= 70 ? "#46d369" : pct >= 40 ? "#f5c518" : "#e50914" }}
        />
      </div>
    </div>
  );
}

function PanelWrapper({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
      <div className={`px-5 py-3 border-b border-white/5 flex items-center gap-2 ${colorMap[color] ?? ""}`}>
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function EnginePanel({ engine }: { engine: Engine }) {
  return (
    <PanelWrapper title="Engine / Powertrain" icon="&#9881;" color="red">
      <SpecRow label="Type" value={engine.engine_type} />
      <SpecRow label="Displacement" value={engine.displacement_cc ? `${Math.round(engine.displacement_cc)} cc` : engine.displacement_l ? `${engine.displacement_l} L` : null} />
      <SpecRow label="Cylinders" value={engine.cylinders} />
      <SpecRow label="Configuration" value={engine.cylinder_config} />
      <SpecRow label="Power" value={engine.horsepower ? `${Math.round(engine.horsepower)} HP${engine.horsepower_rpm ? ` @ ${engine.horsepower_rpm} RPM` : ""}` : null} />
      <SpecRow label="Torque" value={engine.torque_nm ? `${Math.round(engine.torque_nm)} Nm${engine.torque_rpm ? ` @ ${engine.torque_rpm} RPM` : ""}` : null} />
      <SpecRow label="Valve Config" value={engine.valve_config} />
      <SpecRow label="Induction" value={engine.induction} />
      <SpecRow label="Fuel System" value={engine.fuel_system} />
      <SpecRow label="Compression" value={engine.compression_ratio ? `${engine.compression_ratio}:1` : null} />
      <SpecRow label="Transmission" value={engine.transmission_type} />
      <SpecRow label="Gears" value={engine.gears_count} />
      {engine.motor_type && <SpecRow label="Motor Type" value={engine.motor_type} />}
      {engine.motor_kw && <SpecRow label="Motor Power" value={`${engine.motor_kw} kW`} />}
    </PanelWrapper>
  );
}

function DimensionsPanel({ dimensions: d }: { dimensions: Dimensions }) {
  return (
    <PanelWrapper title="Dimensions & Weight" icon="&#128207;" color="blue">
      <SpecRow label="Length" value={d.length_mm ? `${Math.round(d.length_mm)} mm` : null} />
      <SpecRow label="Width" value={d.width_mm ? `${Math.round(d.width_mm)} mm` : null} />
      <SpecRow label="Height" value={d.height_mm ? `${Math.round(d.height_mm)} mm` : null} />
      <SpecRow label="Wheelbase" value={d.wheelbase_mm ? `${Math.round(d.wheelbase_mm)} mm` : null} />
      <SpecRow label="Ground Clearance" value={d.ground_clearance_mm ? `${Math.round(d.ground_clearance_mm)} mm` : null} />
      <SpecRow label="Curb Weight" value={d.curb_weight_kg ? `${Math.round(d.curb_weight_kg)} kg` : null} />
      <SpecRow label="GVWR" value={d.gvwr_kg ? `${Math.round(d.gvwr_kg)} kg` : null} />
      <SpecRow label="Cargo Volume" value={d.cargo_volume_l ? `${Math.round(d.cargo_volume_l)} L` : null} />
      <SpecRow label="Max Cargo" value={d.cargo_volume_max_l ? `${Math.round(d.cargo_volume_max_l)} L` : null} />
      <SpecRow label="Towing Capacity" value={d.towing_capacity_kg ? `${Math.round(d.towing_capacity_kg)} kg` : null} />
      <SpecRow label="Drag Coefficient" value={d.drag_coefficient ? `Cd ${d.drag_coefficient}` : null} />
      <SpecRow label="Front Tire" value={d.front_tire} />
      <SpecRow label="Rear Tire" value={d.rear_tire} />
    </PanelWrapper>
  );
}

function GeneralSpecsPanel({ spec }: { spec: NonNullable<VehicleDetailData["spec"]> }) {
  return (
    <PanelWrapper title="General Specifications" icon="&#128663;" color="purple">
      <SpecRow label="Year" value={spec.year} />
      <SpecRow label="Make" value={spec.make_name} />
      <SpecRow label="Model" value={spec.model_name} />
      <SpecRow label="Modification" value={spec.modification_name} />
      <SpecRow label="Body Type" value={spec.body_type} />
      <SpecRow label="Doors" value={spec.doors_count} />
      <SpecRow label="Seats" value={spec.seats_count} />
      <SpecRow label="Fuel Type" value={spec.fuel_type} />
      <SpecRow label="Drive Type" value={spec.drive_type} />
      <SpecRow label="0-100 km/h" value={spec.acceleration_0_100 ? `${spec.acceleration_0_100}s` : null} />
      <SpecRow label="Top Speed" value={spec.max_speed_km ? `${Math.round(spec.max_speed_km)} km/h` : null} />
      <SpecRow label="Fuel Tank" value={spec.fuel_tank_capacity ? `${spec.fuel_tank_capacity} L` : null} />
      <SpecRow label="City Consumption" value={spec.fuel_consumption_city ? `${spec.fuel_consumption_city} L/100km` : null} />
      <SpecRow label="Highway Consumption" value={spec.fuel_consumption_highway ? `${spec.fuel_consumption_highway} L/100km` : null} />
      <SpecRow label="Combined Consumption" value={spec.fuel_consumption_combined ? `${spec.fuel_consumption_combined} L/100km` : null} />
      {(spec.year_begin || spec.year_end) && (
        <SpecRow label="Production" value={`${spec.year_begin ?? "?"} - ${spec.year_end ?? "present"}`} />
      )}
    </PanelWrapper>
  );
}

function SafetyPanel({ data }: { data: SafetyRating[] }) {
  const best = data[0];
  return (
    <PanelWrapper title="NHTSA Safety Ratings" icon="&#9733;" color="amber">
      <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">
        {best.year} {best.make} {best.model}
      </p>
      <div className="flex items-center gap-3 mb-4 p-3 bg-black/30 rounded-xl">
        <span className="text-4xl font-black text-amber-400">{best.overall_rating || "?"}</span>
        <div>
          <p className="text-sm text-white font-bold">Overall Safety</p>
          <p className="text-[10px] text-gray-500">NHTSA 5-Star Rating</p>
        </div>
      </div>
      <SpecRow label="Front Crash" value={best.front_crash_rating ? `${best.front_crash_rating} / 5` : null} />
      <SpecRow label="Side Crash" value={best.side_crash_rating ? `${best.side_crash_rating} / 5` : null} />
      <SpecRow label="Rollover" value={best.rollover_rating ? `${best.rollover_rating} / 5` : null} />
      <SpecRow label="ESC" value={best.electronic_stability_control} />
      <SpecRow label="Forward Collision Warning" value={best.forward_collision_warning} />
      <SpecRow label="Lane Departure Warning" value={best.lane_departure_warning} />
      <SpecRow label="Complaints" value={best.complaints_count} />
      <SpecRow label="Recalls" value={best.recalls_count} />
      {best.vehicle_description && (
        <p className="text-xs text-gray-500 mt-3 italic">{best.vehicle_description}</p>
      )}
    </PanelWrapper>
  );
}

function EvPanel({ data }: { data: EvSpec[] }) {
  const ev = data[0];
  return (
    <PanelWrapper title="EV Specifications" icon="&#9889;" color="emerald">
      <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">
        {ev.make} {ev.model} {ev.variant}
      </p>
      <SpecRow label="Battery (Gross)" value={ev.battery_capacity_kwh ? `${ev.battery_capacity_kwh} kWh` : null} />
      <SpecRow label="Battery (Usable)" value={ev.usable_battery_kwh ? `${ev.usable_battery_kwh} kWh` : null} />
      <SpecRow label="WLTP Range" value={ev.range_wltp_km ? `${Math.round(ev.range_wltp_km)} km` : null} />
      <SpecRow label="Avg. Consumption" value={ev.avg_consumption_kwh_100km ? `${ev.avg_consumption_kwh_100km} kWh/100km` : null} />
      <SpecRow label="Drivetrain" value={ev.drivetrain} />
      <SpecRow label="AC Charging" value={ev.ac_max_power_kw ? `${ev.ac_max_power_kw} kW` : null} />
      <SpecRow label="AC Ports" value={ev.ac_ports} />
      <SpecRow label="DC Charging" value={ev.dc_max_power_kw ? `${ev.dc_max_power_kw} kW` : null} />
      <SpecRow label="DC Ports" value={ev.dc_ports} />
      <SpecRow label="0-100 km/h" value={ev.acceleration_0_100 ? `${ev.acceleration_0_100}s` : null} />
      <SpecRow label="Top Speed" value={ev.top_speed_km ? `${Math.round(ev.top_speed_km)} km/h` : null} />
      <SpecRow label="Weight" value={ev.weight_kg ? `${Math.round(ev.weight_kg)} kg` : null} />
      <SpecRow label="Cargo" value={ev.cargo_volume_l ? `${Math.round(ev.cargo_volume_l)} L` : null} />

      {/* Charging curve visualization */}
      {ev.dc_charging_curve && ev.dc_charging_curve.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">DC Charging Curve</p>
          <div className="flex items-end gap-[2px] h-20">
            {ev.dc_charging_curve.map((point, i) => {
              const maxPower = Math.max(...ev.dc_charging_curve!.map((p) => p.power));
              const heightPct = (point.power / maxPower) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/60 rounded-t hover:bg-emerald-400 transition-colors relative group"
                  style={{ height: `${heightPct}%` }}
                  title={`${point.percentage}% → ${point.power} kW`}
                >
                  <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[9px] text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    {point.percentage}%: {point.power}kW
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-600">0%</span>
            <span className="text-[9px] text-gray-600">100%</span>
          </div>
        </div>
      )}

      {data.length > 1 && (
        <p className="text-[10px] text-gray-600 mt-3 italic">+ {data.length - 1} more variant(s) available</p>
      )}
    </PanelWrapper>
  );
}
