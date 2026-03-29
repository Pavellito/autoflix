import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicleById } from "@/app/lib/vehicle-queries";
import type { VehicleDetailData, Engine, Dimensions, FuelEconomy, SafetyRating, EvSpec } from "@/app/lib/vehicle-types";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicleId = parseInt(id, 10);

  if (isNaN(vehicleId)) notFound();

  const data = await getVehicleById(vehicleId);
  if (!data) notFound();

  const { spec, engine, dimensions, fuelEconomy, safetyRatings, evSpecs } = data;
  const title = [spec.year, spec.make_name, spec.model_name].filter(Boolean).join(" ");
  const subtitle = spec.modification_name || spec.trim || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back nav */}
      <Link
        href="/cars"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Database
      </Link>

      {/* Hero card */}
      <div className="bg-card-bg rounded-2xl overflow-hidden border border-white/5 mb-8 shadow-2xl">
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#1a1a3e] via-[#141428] to-[#0a0a1a]">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {spec.fuel_type && (
                <span className="bg-emerald-600/80 text-emerald-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {spec.fuel_type}
                </span>
              )}
              {spec.drive_type && (
                <span className="bg-blue-600/80 text-blue-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {spec.drive_type}
                </span>
              )}
              {spec.body_type && (
                <span className="bg-purple-600/80 text-purple-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {spec.body_type}
                </span>
              )}
              {spec.source && (
                <span className="bg-white/10 text-gray-400 text-[10px] font-bold px-2 py-1 rounded ml-auto">
                  Source: {spec.source}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-1">{title}</h1>
            {subtitle && <p className="text-lg text-gray-400 font-medium">{subtitle}</p>}

            {/* Year range */}
            {(spec.year_begin || spec.year_end) && (
              <p className="text-sm text-gray-500 mt-2">
                Production: {spec.year_begin ?? "?"} - {spec.year_end ?? "present"}
              </p>
            )}

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <QuickStat label="Horsepower" value={engine?.horsepower ? `${Math.round(engine.horsepower)} HP` : null} />
              <QuickStat label="Torque" value={engine?.torque_nm ? `${Math.round(engine.torque_nm)} Nm` : null} />
              <QuickStat label="0-100 km/h" value={spec.acceleration_0_100 ? `${spec.acceleration_0_100}s` : null} />
              <QuickStat label="Top Speed" value={spec.max_speed_km ? `${Math.round(spec.max_speed_km)} km/h` : null} />
              {dimensions?.curb_weight_kg && (
                <QuickStat label="Weight" value={`${Math.round(dimensions.curb_weight_kg)} kg`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Engine section */}
        {engine && <EnginePanel engine={engine} />}

        {/* Dimensions section */}
        {dimensions && <DimensionsPanel dimensions={dimensions} />}

        {/* Vehicle general specs */}
        <GeneralSpecsPanel spec={spec} />

        {/* Fuel Economy (EPA) */}
        {fuelEconomy.length > 0 && <FuelEconomyPanel data={fuelEconomy} />}

        {/* Safety Ratings (NHTSA) */}
        {safetyRatings.length > 0 && <SafetyPanel data={safetyRatings} />}

        {/* EV Specs */}
        {evSpecs.length > 0 && <EvPanel data={evSpecs} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function QuickStat({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{label}</span>
      <span className="text-2xl font-black text-white">{value}</span>
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
    <div className="bg-card-bg rounded-2xl border border-white/5 overflow-hidden">
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
      <SpecRow label="Towing Capacity" value={d.towing_capacity_kg ? `${Math.round(d.towing_capacity_kg)} kg` : null} />
      <SpecRow label="Drag Coefficient" value={d.drag_coefficient ? `Cd ${d.drag_coefficient}` : null} />
      <SpecRow label="Front Tire" value={d.front_tire} />
      <SpecRow label="Rear Tire" value={d.rear_tire} />
    </PanelWrapper>
  );
}

function GeneralSpecsPanel({ spec }: { spec: any }) {
  return (
    <PanelWrapper title="General" icon="&#128663;" color="purple">
      <SpecRow label="Year" value={spec.year} />
      <SpecRow label="Make" value={spec.make_name} />
      <SpecRow label="Model" value={spec.model_name} />
      <SpecRow label="Modification" value={spec.modification_name} />
      <SpecRow label="Body Type" value={spec.body_type} />
      <SpecRow label="Doors" value={spec.doors_count} />
      <SpecRow label="Seats" value={spec.seats_count} />
      <SpecRow label="Fuel Type" value={spec.fuel_type} />
      <SpecRow label="Drive Type" value={spec.drive_type} />
      <SpecRow label="Fuel Tank" value={spec.fuel_tank_capacity ? `${spec.fuel_tank_capacity} L` : null} />
      <SpecRow label="City Consumption" value={spec.fuel_consumption_city ? `${spec.fuel_consumption_city} L/100km` : null} />
      <SpecRow label="Highway Consumption" value={spec.fuel_consumption_highway ? `${spec.fuel_consumption_highway} L/100km` : null} />
      <SpecRow label="Combined Consumption" value={spec.fuel_consumption_combined ? `${spec.fuel_consumption_combined} L/100km` : null} />
    </PanelWrapper>
  );
}

function FuelEconomyPanel({ data }: { data: FuelEconomy[] }) {
  const best = data[0]; // Most recent year
  return (
    <PanelWrapper title="EPA Fuel Economy" icon="&#9981;" color="green">
      <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">
        {best.year} {best.make} {best.model} {best.trim}
      </p>
      <SpecRow label="City MPG" value={best.city_mpg} />
      <SpecRow label="Highway MPG" value={best.highway_mpg} />
      <SpecRow label="Combined MPG" value={best.combined_mpg} />
      <SpecRow label="CO2 (g/mi)" value={best.co2_tailpipe_gpm ? Math.round(best.co2_tailpipe_gpm) : null} />
      <SpecRow label="GHG Score" value={best.ghg_score ? `${best.ghg_score}/10` : null} />
      <SpecRow label="Annual Fuel Cost" value={best.annual_fuel_cost ? `$${best.annual_fuel_cost.toLocaleString()}` : null} />
      <SpecRow label="EPA Range" value={best.epa_range ? `${best.epa_range} mi` : null} />
      <SpecRow label="Cylinders" value={best.cylinders} />
      <SpecRow label="Displacement" value={best.displacement ? `${best.displacement} L` : null} />
      <SpecRow label="Transmission" value={best.transmission} />
      {data.length > 1 && (
        <p className="text-[10px] text-gray-600 mt-3 italic">
          + {data.length - 1} more year(s) available in database
        </p>
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
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">
            DC Charging Curve
          </p>
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
        <p className="text-[10px] text-gray-600 mt-3 italic">
          + {data.length - 1} more variant(s) available
        </p>
      )}
    </PanelWrapper>
  );
}
