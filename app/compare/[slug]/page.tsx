import { notFound } from "next/navigation";
import Link from "next/link";
import { getRelatedVideosForCar } from "@/app/lib/data";
import { fetchCarById } from "@/app/lib/supabase-cars";
import VideoRow from "@/app/components/VideoRow";
import CompareVerdict from "@/app/components/CompareVerdict";
import VehicleImage from "@/app/components/VehicleImage";

export const dynamic = "force-dynamic";

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();

  const [id1, id2] = parts;
  const [car1, car2] = await Promise.all([fetchCarById(id1), fetchCarById(id2)]);

  if (!car1 || !car2) notFound();

  const car1Videos = getRelatedVideosForCar(car1);
  const car2Videos = getRelatedVideosForCar(car2);

  const specRows = [
    { label: "Type", v1: car1.type, v2: car2.type },
    { label: "Range (WLTP)", v1: car1.range || "N/A", v2: car2.range || "N/A" },
    { label: "Battery", v1: car1.battery || "N/A", v2: car2.battery || "N/A" },
    { label: "Price (US)", v1: car1.prices?.us || car1.price || "N/A", v2: car2.prices?.us || car2.price || "N/A" },
    { label: "Price (Israel)", v1: car1.prices?.il || "N/A", v2: car2.prices?.il || "N/A" },
    { label: "Price (Russia)", v1: car1.prices?.ru || "N/A", v2: car2.prices?.ru || "N/A" },
    { label: "Price (Arabic)", v1: car1.prices?.ar || "N/A", v2: car2.prices?.ar || "N/A" },
    ...(car1.realWorldRange || car2.realWorldRange
      ? [
          { label: "Highway Range", v1: car1.realWorldRange?.highway || "N/A", v2: car2.realWorldRange?.highway || "N/A" },
          { label: "Winter Range", v1: car1.realWorldRange?.winter || "N/A", v2: car2.realWorldRange?.winter || "N/A" },
        ]
      : []),
    ...(car1.chargingCurve || car2.chargingCurve
      ? [
          { label: "Max Charging", v1: car1.chargingCurve?.maxSpeed || "N/A", v2: car2.chargingCurve?.maxSpeed || "N/A" },
          { label: "10-80% Time", v1: car1.chargingCurve?.tenToEighty || "N/A", v2: car2.chargingCurve?.tenToEighty || "N/A" },
        ]
      : []),
    ...(car1.depreciation || car2.depreciation
      ? [
          { label: "3yr Depreciation", v1: car1.depreciation?.yr3 || "N/A", v2: car2.depreciation?.yr3 || "N/A" },
          { label: "Resale Value", v1: car1.depreciation?.resaleValue || "N/A", v2: car2.depreciation?.resaleValue || "N/A" },
        ]
      : []),
  ];

  return (
    <div className="bg-[#141414] min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-[4%]">
        {/* Back */}
        <Link href="/compare" className="inline-flex items-center gap-2 text-[#777] hover:text-white mb-6 text-[14px] transition-colors">
          &larr; Back to Compare
        </Link>

        {/* Hero: Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-8 relative">
          {[car1, car2].map((car, i) => (
            <div key={car.id} className="relative aspect-[16/9] overflow-hidden rounded">
              <VehicleImage src={car.image} alt={car.name} aspectRatio="h-full" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[11px] text-[#e50914] font-bold uppercase tracking-wider mb-1">
                  Car {i === 0 ? "A" : "B"}
                </p>
                <h2 className="text-[24px] md:text-[28px] font-bold text-white">{car.name}</h2>
                <p className="text-[13px] text-white/60">{car.brand} &middot; {car.type}</p>
              </div>
            </div>
          ))}

          {/* VS Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e50914] text-white font-black text-[16px] w-12 h-12 items-center justify-center rounded-full z-10 border-4 border-[#141414] shadow-xl">
            VS
          </div>
        </div>

        {/* AI Verdict */}
        <CompareVerdict car1={car1} car2={car2} />

        {/* Specs Table */}
        <div className="bg-[#1a1a1a] rounded border border-white/10 overflow-hidden mb-10">
          <div className="grid grid-cols-3 bg-[#111] border-b border-white/10">
            <div className="p-4 text-[12px] text-[#777] font-bold uppercase tracking-wider">Specification</div>
            <div className="p-4 text-[14px] text-white font-bold text-center">{car1.name}</div>
            <div className="p-4 text-[14px] text-white font-bold text-center">{car2.name}</div>
          </div>
          {specRows.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-3 border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
              <div className="p-4 text-[13px] text-[#999]">{row.label}</div>
              <div className="p-4 text-[13px] text-white text-center font-medium">{row.v1}</div>
              <div className="p-4 text-[13px] text-white text-center font-medium">{row.v2}</div>
            </div>
          ))}
        </div>

        {/* Related Videos */}
        {(car1Videos.length > 0 || car2Videos.length > 0) && (
          <div className="border-t border-white/10 pt-8">
            {car1Videos.length > 0 && (
              <VideoRow title={`${car1.name} Videos`} videos={car1Videos} />
            )}
            {car2Videos.length > 0 && (
              <VideoRow title={`${car2.name} Videos`} videos={car2Videos} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
