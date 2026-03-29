import Link from "next/link";
import type { VehicleCardData } from "@/app/lib/vehicle-types";

function fuelBadgeColor(fuel: string | null): string {
  if (!fuel) return "bg-gray-700 text-gray-300";
  const f = fuel.toLowerCase();
  if (f.includes("electric") || f.includes("ev")) return "bg-emerald-600/80 text-emerald-100";
  if (f.includes("hybrid")) return "bg-blue-600/80 text-blue-100";
  if (f.includes("diesel")) return "bg-amber-700/80 text-amber-100";
  if (f.includes("gasoline") || f.includes("petrol")) return "bg-orange-600/80 text-orange-100";
  return "bg-gray-600/80 text-gray-200";
}

function sourceBadge(source: string | null): string {
  switch (source) {
    case "github_auto_specs": return "Global";
    case "nhtsa_vpic": return "NHTSA";
    case "open_ev_data": return "EV";
    default: return "";
  }
}

export default function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const v = vehicle;
  const displayYear = v.year ? `${v.year}` : "";
  const title = [displayYear, v.make_name, v.model_name].filter(Boolean).join(" ");
  const subtitle = v.modification_name || v.body_type || "";

  return (
    <Link
      href={`/cars/db/${v.id}`}
      className="group flex flex-col bg-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Top section: gradient background with car info */}
      <div className="relative h-36 bg-gradient-to-br from-[#1a1a3e] via-[#141428] to-[#0a0a1a] p-5 flex flex-col justify-between overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />

        {/* Tags */}
        <div className="flex items-center gap-1.5 relative z-10">
          {v.fuel_type && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${fuelBadgeColor(v.fuel_type)}`}>
              {v.fuel_type}
            </span>
          )}
          {v.drive_type && (
            <span className="bg-white/10 text-white/60 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
              {v.drive_type}
            </span>
          )}
          {v.source && (
            <span className="bg-white/5 text-white/40 text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto">
              {sourceBadge(v.source)}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="relative z-10">
          <h3 className="text-lg font-black text-white tracking-tight leading-tight line-clamp-2 group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 font-medium">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="p-4 flex items-center justify-between bg-white/[0.02] border-t border-white/5">
        <StatCell label="Power" value={v.horsepower ? `${Math.round(v.horsepower)} HP` : null} />
        <div className="w-[1px] h-8 bg-white/10" />
        <StatCell label="Torque" value={v.torque_nm ? `${Math.round(v.torque_nm)} Nm` : null} />
        <div className="w-[1px] h-8 bg-white/10" />
        <StatCell label="0-100" value={v.acceleration_0_100 ? `${v.acceleration_0_100}s` : null} />
      </div>
    </Link>
  );
}

function StatCell({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <span className="text-[8px] text-gray-500 uppercase tracking-[0.2em] font-black mb-0.5">{label}</span>
      <span className="text-sm font-bold text-gray-200">{value ?? "—"}</span>
    </div>
  );
}
