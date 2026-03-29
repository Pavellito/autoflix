/**
 * TypeScript interfaces for the vehicle database tables.
 * Maps directly to the Supabase schema from migration 002.
 */

// --- Vehicle Specs (central record) ---
export interface VehicleSpec {
  id: number;
  unique_key: string;
  year: number | null;
  year_begin: number | null;
  year_end: number | null;
  make_name: string | null;
  model_name: string | null;
  generation_name: string | null;
  modification_name: string | null;
  trim: string | null;
  body_type: string | null;
  doors_count: number | null;
  seats_count: number | null;
  drive_type: string | null;
  fuel_type: string | null;
  fuel_consumption_city: number | null;
  fuel_consumption_highway: number | null;
  fuel_consumption_combined: number | null;
  fuel_tank_capacity: number | null;
  acceleration_0_100: number | null;
  max_speed_km: number | null;
  msrp: number | null;
  source: string | null;
}

// --- Engine ---
export interface Engine {
  id: number;
  unique_key: string;
  vehicle_spec_key: string | null;
  engine_type: string | null;
  displacement_cc: number | null;
  displacement_l: number | null;
  cylinders: number | null;
  cylinder_config: string | null;
  horsepower: number | null;
  horsepower_rpm: number | null;
  torque_nm: number | null;
  torque_rpm: number | null;
  valve_config: string | null;
  valves_per_cyl: number | null;
  induction: string | null;
  fuel_system: string | null;
  compression_ratio: number | null;
  motor_type: string | null;
  motor_kw: number | null;
  transmission_type: string | null;
  gears_count: number | null;
  source: string | null;
}

// --- Dimensions ---
export interface Dimensions {
  id: number;
  unique_key: string;
  vehicle_spec_key: string | null;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  wheelbase_mm: number | null;
  ground_clearance_mm: number | null;
  cargo_volume_l: number | null;
  cargo_volume_max_l: number | null;
  frunk_volume_l: number | null;
  curb_weight_kg: number | null;
  gvwr_kg: number | null;
  payload_kg: number | null;
  towing_capacity_kg: number | null;
  drag_coefficient: number | null;
  front_tire: string | null;
  rear_tire: string | null;
  source: string | null;
}

// --- Fuel Economy (EPA) ---
export interface FuelEconomy {
  id: number;
  unique_key: string;
  epa_id: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  vehicle_class: string | null;
  fuel_type: string | null;
  city_mpg: number | null;
  highway_mpg: number | null;
  combined_mpg: number | null;
  co2_tailpipe_gpm: number | null;
  cylinders: number | null;
  displacement: number | null;
  drive: string | null;
  transmission: string | null;
  ghg_score: number | null;
  annual_fuel_cost: number | null;
  epa_range: number | null;
  charge_240v: number | null;
  charge_time_240v: number | null;
}

// --- Safety Ratings (NHTSA) ---
export interface SafetyRating {
  id: number;
  unique_key: string;
  nhtsa_vehicle_id: number | null;
  year: number | null;
  make: string | null;
  model: string | null;
  vehicle_description: string | null;
  overall_rating: string | null;
  front_crash_rating: string | null;
  front_crash_driver_rating: string | null;
  front_crash_passenger_rating: string | null;
  side_crash_rating: string | null;
  side_crash_driver_rating: string | null;
  side_crash_passenger_rating: string | null;
  side_barrier_rating: string | null;
  rollover_rating: string | null;
  rollover_rating2: string | null;
  rollover_possibility: number | null;
  electronic_stability_control: string | null;
  forward_collision_warning: string | null;
  lane_departure_warning: string | null;
  complaints_count: number | null;
  recalls_count: number | null;
  investigation_count: number | null;
  vehicle_picture: string | null;
}

// --- EV Specs (OpenEV Data) ---
export interface EvSpec {
  id: number;
  unique_key: string;
  openev_id: string | null;
  make: string | null;
  model: string | null;
  variant: string | null;
  release_year: number | null;
  drivetrain: string | null;
  battery_capacity_kwh: number | null;
  usable_battery_kwh: number | null;
  range_wltp_km: number | null;
  avg_consumption_kwh_100km: number | null;
  ac_max_power_kw: number | null;
  ac_ports: string | null;
  ac_usable_phases: number | null;
  dc_max_power_kw: number | null;
  dc_ports: string | null;
  dc_charging_curve: { percentage: number; power: number }[] | null;
  dc_is_default_curve: boolean | null;
  acceleration_0_100: number | null;
  top_speed_km: number | null;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  wheelbase_mm: number | null;
  weight_kg: number | null;
  cargo_volume_l: number | null;
  tow_weight_braked_kg: number | null;
  source: string | null;
}

// --- Composite types for UI ---

export interface VehicleCardData {
  id: number;
  unique_key: string;
  year: number | null;
  make_name: string;
  model_name: string;
  modification_name: string | null;
  fuel_type: string | null;
  drive_type: string | null;
  body_type: string | null;
  horsepower: number | null;
  torque_nm: number | null;
  acceleration_0_100: number | null;
  max_speed_km: number | null;
  combined_mpg: number | null;
  safety_overall: string | null;
  range_wltp_km: number | null;
  source: string | null;
}

export interface VehicleDetailData {
  spec: VehicleSpec;
  engine: Engine | null;
  dimensions: Dimensions | null;
  fuelEconomy: FuelEconomy[];
  safetyRatings: SafetyRating[];
  evSpecs: EvSpec[];
}

// --- Filter options ---
export interface FilterOptions {
  makes: string[];
  years: number[];
  fuelTypes: string[];
  driveTypes: string[];
  sources: string[];
}

// --- Search/filter params ---
export interface VehicleSearchParams {
  q?: string;
  make?: string;
  year_min?: string;
  year_max?: string;
  fuel?: string;
  drive?: string;
  hp_min?: string;
  hp_max?: string;
  sort?: string;
  page?: string;
  per_page?: string;
}
