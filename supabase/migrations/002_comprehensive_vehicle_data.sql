-- ============================================================================
-- AutoFlix Migration 002: Comprehensive Vehicle Data Schema
-- ============================================================================
-- ADDITIVE migration — does NOT drop or alter existing tables (cars, car_prices,
-- car_regional_advice, favorites, summaries, news).
--
-- This schema is designed for PRACTICAL BULK IMPORT from 5 free sources:
--   1. NHTSA vPIC          — vehicle identification (makes, models, year combos)
--   2. FuelEconomy.gov EPA — fuel economy, emissions, EV data
--   3. NHTSA Safety Ratings— 5-star crash test ratings
--   4. automobile-models-and-specs (GitHub) — global specs
--   5. OpenEV Data         — EV battery, charging, range
--
-- Design: Each table has a `unique_key` TEXT column for idempotent upserts from
-- import scripts. Tables store denormalized make/model names alongside optional
-- FK references, so imports can work in any order without resolving UUIDs first.
-- A post-import linking step connects records across tables.
-- ============================================================================

-- 0. Ensure pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- DATA MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_sources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name   TEXT NOT NULL UNIQUE,
  description   TEXT,
  base_url      TEXT,
  last_import   TIMESTAMPTZ,
  record_count  INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE data_sources IS 'Registry of external data sources feeding the vehicle database';

CREATE TABLE IF NOT EXISTS import_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id       UUID REFERENCES data_sources(id) ON DELETE CASCADE,
  source_name     TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'partial', 'failed')),
  records_added   INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  error_message   TEXT,
  metadata        JSONB DEFAULT '{}'::jsonb
);
COMMENT ON TABLE import_logs IS 'Audit trail for every data-import run';

CREATE INDEX IF NOT EXISTS idx_import_logs_source ON import_logs(source_name);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(status);


-- ============================================================================
-- MAKES — Manufacturer/brand master list
-- ============================================================================

CREATE TABLE IF NOT EXISTS makes (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nhtsa_make_id   INTEGER UNIQUE,
  name            TEXT NOT NULL,
  name_normalized TEXT GENERATED ALWAYS AS (lower(trim(name))) STORED,
  slug            TEXT,
  country         TEXT,
  logo_url        TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE makes IS 'Canonical manufacturer/brand list from NHTSA + other sources';

CREATE INDEX IF NOT EXISTS idx_makes_name ON makes(name);
CREATE INDEX IF NOT EXISTS idx_makes_name_norm ON makes(name_normalized);
CREATE INDEX IF NOT EXISTS idx_makes_slug ON makes(slug);


-- ============================================================================
-- MODELS — Model master list (FK to makes via nhtsa_make_id)
-- ============================================================================

CREATE TABLE IF NOT EXISTS models (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nhtsa_model_id  INTEGER UNIQUE,
  nhtsa_make_id   INTEGER,
  name            TEXT NOT NULL,
  name_normalized TEXT GENERATED ALWAYS AS (lower(trim(name))) STORED,
  slug            TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE models IS 'Canonical model list per make from NHTSA + other sources';

CREATE INDEX IF NOT EXISTS idx_models_name ON models(name);
CREATE INDEX IF NOT EXISTS idx_models_make_id ON models(nhtsa_make_id);
CREATE INDEX IF NOT EXISTS idx_models_slug ON models(slug);


-- ============================================================================
-- VEHICLE_SPECS — Central record: one row per unique vehicle variant
-- ============================================================================
-- Denormalized: stores make_name/model_name as TEXT for easy import.
-- Optional nhtsa_make_id/nhtsa_model_id for linking to makes/models tables.

CREATE TABLE IF NOT EXISTS vehicle_specs (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unique_key        TEXT NOT NULL UNIQUE,

  -- Identity (denormalized for import flexibility)
  year              INTEGER,
  year_begin        INTEGER,
  year_end          INTEGER,
  make_name         TEXT,
  model_name        TEXT,
  generation_name   TEXT,
  modification_name TEXT,
  trim              TEXT,
  body_type         TEXT,
  doors_count       SMALLINT,
  seats_count       SMALLINT,
  drive_type        TEXT,
  fuel_type         TEXT,

  -- Fuel consumption (from GitHub global data, L/100km)
  fuel_consumption_city     NUMERIC(6,2),
  fuel_consumption_highway  NUMERIC(6,2),
  fuel_consumption_combined NUMERIC(6,2),
  fuel_tank_capacity        NUMERIC(6,1),

  -- Performance
  acceleration_0_100  NUMERIC(5,2),
  max_speed_km        NUMERIC(6,1),

  -- Price
  msrp              NUMERIC(12,2),

  -- Linking to makes/models tables (optional, populated post-import)
  nhtsa_make_id     INTEGER,
  nhtsa_model_id    INTEGER,

  -- Source tracking
  source            TEXT,
  github_modification_id INTEGER,
  github_generation_id   INTEGER,
  github_model_id        INTEGER,
  github_brand_id        INTEGER,

  -- Escape hatch
  extra             JSONB DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE vehicle_specs IS 'Central vehicle record — one row per unique variant. Denormalized for multi-source import.';

CREATE INDEX IF NOT EXISTS idx_vspecs_year ON vehicle_specs(year);
CREATE INDEX IF NOT EXISTS idx_vspecs_make ON vehicle_specs(make_name);
CREATE INDEX IF NOT EXISTS idx_vspecs_model ON vehicle_specs(model_name);
CREATE INDEX IF NOT EXISTS idx_vspecs_body ON vehicle_specs(body_type);
CREATE INDEX IF NOT EXISTS idx_vspecs_fuel ON vehicle_specs(fuel_type);
CREATE INDEX IF NOT EXISTS idx_vspecs_drive ON vehicle_specs(drive_type);
CREATE INDEX IF NOT EXISTS idx_vspecs_source ON vehicle_specs(source);
CREATE INDEX IF NOT EXISTS idx_vspecs_nhtsa_make ON vehicle_specs(nhtsa_make_id);
CREATE INDEX IF NOT EXISTS idx_vspecs_nhtsa_model ON vehicle_specs(nhtsa_model_id);


-- ============================================================================
-- ENGINES — Engine/motor configurations per vehicle variant
-- ============================================================================

CREATE TABLE IF NOT EXISTS engines (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unique_key        TEXT NOT NULL UNIQUE,
  vehicle_spec_key  TEXT REFERENCES vehicle_specs(unique_key) ON DELETE CASCADE,

  -- Engine identity
  engine_type       TEXT,
  displacement_cc   NUMERIC(8,1),
  displacement_l    NUMERIC(4,2),
  cylinders         SMALLINT,
  cylinder_config   TEXT,

  -- Output
  horsepower        NUMERIC(7,1),
  horsepower_rpm    INTEGER,
  torque_nm         NUMERIC(7,1),
  torque_rpm        INTEGER,

  -- Valve train
  valve_config      TEXT,
  valves_per_cyl    SMALLINT,

  -- Induction
  induction         TEXT,
  fuel_system       TEXT,
  compression_ratio NUMERIC(5,2),

  -- Electric motor
  motor_type        TEXT,
  motor_kw          NUMERIC(7,1),

  -- Transmission (co-located for simplicity — from GitHub data)
  transmission_type TEXT,
  gears_count       SMALLINT,

  -- Source
  source            TEXT,
  extra             JSONB DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE engines IS 'Engine/motor + transmission data per vehicle variant';

CREATE INDEX IF NOT EXISTS idx_engines_vehicle ON engines(vehicle_spec_key);
CREATE INDEX IF NOT EXISTS idx_engines_hp ON engines(horsepower);
CREATE INDEX IF NOT EXISTS idx_engines_fuel ON engines(engine_type);


-- ============================================================================
-- DIMENSIONS — Physical dimensions, weight, cargo
-- ============================================================================

CREATE TABLE IF NOT EXISTS dimensions (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unique_key        TEXT NOT NULL UNIQUE,
  vehicle_spec_key  TEXT REFERENCES vehicle_specs(unique_key) ON DELETE CASCADE,

  -- Exterior (mm)
  length_mm         NUMERIC(7,1),
  width_mm          NUMERIC(7,1),
  height_mm         NUMERIC(7,1),
  wheelbase_mm      NUMERIC(7,1),
  ground_clearance_mm NUMERIC(6,1),

  -- Volume (liters)
  cargo_volume_l    NUMERIC(8,1),
  cargo_volume_max_l NUMERIC(8,1),
  frunk_volume_l    NUMERIC(6,1),

  -- Weight
  curb_weight_kg    NUMERIC(8,1),
  gvwr_kg           NUMERIC(8,1),
  payload_kg        NUMERIC(8,1),
  towing_capacity_kg NUMERIC(8,1),

  -- Aero
  drag_coefficient  NUMERIC(4,3),

  -- Wheels & tires
  front_tire        TEXT,
  rear_tire         TEXT,

  -- Source
  source            TEXT,
  extra             JSONB DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE dimensions IS 'Physical dimensions, weight, cargo, tires per vehicle variant';

CREATE INDEX IF NOT EXISTS idx_dimensions_vehicle ON dimensions(vehicle_spec_key);


-- ============================================================================
-- FUEL_ECONOMY — EPA data (from fueleconomy.gov bulk CSV)
-- ============================================================================
-- Fully denormalized: stores year/make/model/trim as text.
-- Linked to vehicle_specs post-import via year+make+model matching.

CREATE TABLE IF NOT EXISTS fuel_economy (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unique_key            TEXT NOT NULL UNIQUE,

  -- EPA identity
  epa_id                INTEGER,
  year                  INTEGER,
  make                  TEXT,
  model                 TEXT,
  trim                  TEXT,
  vehicle_class         TEXT,

  -- Fuel type
  fuel_type             TEXT,
  fuel_type1            TEXT,
  fuel_type2            TEXT,

  -- MPG ratings
  city_mpg              NUMERIC(6,1),
  highway_mpg           NUMERIC(6,1),
  combined_mpg          NUMERIC(6,1),
  city_mpg_fuel2        NUMERIC(6,1),
  highway_mpg_fuel2     NUMERIC(6,1),
  combined_mpg_fuel2    NUMERIC(6,1),

  -- Emissions
  co2_tailpipe_gpm      NUMERIC(7,1),
  co2_tailpipe_gpm_fuel2 NUMERIC(7,1),

  -- Engine basics (from EPA)
  cylinders             SMALLINT,
  displacement          NUMERIC(4,2),
  drive                 TEXT,
  transmission          TEXT,
  turbocharger          TEXT,
  supercharger          TEXT,

  -- EPA scores
  ghg_score             SMALLINT,
  ghg_score_fuel2       SMALLINT,
  smartway_score        TEXT,

  -- PHEV specific
  phev_blended          BOOLEAN DEFAULT false,
  phev_city             NUMERIC(6,1),
  phev_highway          NUMERIC(6,1),
  phev_combined         NUMERIC(6,1),

  -- Cost & range
  annual_fuel_cost      NUMERIC(8,2),
  annual_fuel_cost_fuel2 NUMERIC(8,2),
  epa_range             NUMERIC(6,1),
  epa_range_fuel2       NUMERIC(6,1),
  barrel_per_year       NUMERIC(6,2),

  -- Features
  start_stop            TEXT,
  atv_type              TEXT,
  ev_motor              TEXT,

  -- EV charging
  charge_240v           NUMERIC(6,1),
  charge_time_240v      NUMERIC(6,1),

  -- Optional FK to vehicle_specs (resolved post-import)
  vehicle_spec_id       BIGINT,

  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE fuel_economy IS 'EPA fuel economy data from fueleconomy.gov bulk CSV (47K+ vehicles)';

CREATE INDEX IF NOT EXISTS idx_fuel_epa_id ON fuel_economy(epa_id);
CREATE INDEX IF NOT EXISTS idx_fuel_year ON fuel_economy(year);
CREATE INDEX IF NOT EXISTS idx_fuel_make ON fuel_economy(make);
CREATE INDEX IF NOT EXISTS idx_fuel_model ON fuel_economy(model);
CREATE INDEX IF NOT EXISTS idx_fuel_combined ON fuel_economy(combined_mpg);
CREATE INDEX IF NOT EXISTS idx_fuel_ghg ON fuel_economy(ghg_score);
CREATE INDEX IF NOT EXISTS idx_fuel_spec ON fuel_economy(vehicle_spec_id);


-- ============================================================================
-- SAFETY_RATINGS — NHTSA 5-Star crash test data
-- ============================================================================

CREATE TABLE IF NOT EXISTS safety_ratings (
  id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unique_key                TEXT NOT NULL UNIQUE,

  -- NHTSA identity
  nhtsa_vehicle_id          INTEGER,
  year                      INTEGER,
  make                      TEXT,
  model                     TEXT,
  vehicle_description       TEXT,

  -- Overall
  overall_rating            TEXT,

  -- Frontal crash
  front_crash_rating        TEXT,
  front_crash_driver_rating TEXT,
  front_crash_passenger_rating TEXT,

  -- Side crash
  side_crash_rating         TEXT,
  side_crash_driver_rating  TEXT,
  side_crash_passenger_rating TEXT,
  side_barrier_rating       TEXT,

  -- Rollover
  rollover_rating           TEXT,
  rollover_rating2          TEXT,
  rollover_possibility      NUMERIC(5,2),
  rollover_possibility2     NUMERIC(5,2),

  -- ADAS features
  electronic_stability_control TEXT,
  forward_collision_warning TEXT,
  lane_departure_warning    TEXT,

  -- Complaints / recalls
  complaints_count          INTEGER,
  recalls_count             INTEGER,
  investigation_count       INTEGER,

  -- Image
  vehicle_picture           TEXT,

  -- Optional FK to vehicle_specs (resolved post-import)
  vehicle_spec_id           BIGINT,

  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE safety_ratings IS 'NHTSA 5-Star crash test ratings and ADAS features (2010-2026)';

CREATE INDEX IF NOT EXISTS idx_safety_nhtsa_id ON safety_ratings(nhtsa_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_safety_year ON safety_ratings(year);
CREATE INDEX IF NOT EXISTS idx_safety_make ON safety_ratings(make);
CREATE INDEX IF NOT EXISTS idx_safety_overall ON safety_ratings(overall_rating);
CREATE INDEX IF NOT EXISTS idx_safety_spec ON safety_ratings(vehicle_spec_id);


-- ============================================================================
-- EV_SPECS — EV-specific data (from OpenEV Data + EPA)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ev_specs (
  id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  unique_key              TEXT NOT NULL UNIQUE,

  -- Identity
  openev_id               TEXT,
  make                    TEXT,
  model                   TEXT,
  variant                 TEXT,
  release_year            INTEGER,
  drivetrain              TEXT,

  -- Battery
  battery_capacity_kwh    NUMERIC(7,2),
  usable_battery_kwh      NUMERIC(7,2),

  -- Range & consumption
  range_wltp_km           NUMERIC(7,1),
  avg_consumption_kwh_100km NUMERIC(6,2),

  -- AC charging
  ac_max_power_kw         NUMERIC(6,2),
  ac_ports                TEXT,
  ac_usable_phases        SMALLINT,

  -- DC charging
  dc_max_power_kw         NUMERIC(7,2),
  dc_ports                TEXT,
  dc_charging_curve       JSONB,
  dc_is_default_curve     BOOLEAN,

  -- Performance
  acceleration_0_100      NUMERIC(5,2),
  top_speed_km            NUMERIC(6,1),

  -- Dimensions (some EVs include this)
  length_mm               NUMERIC(7,1),
  width_mm                NUMERIC(7,1),
  height_mm               NUMERIC(7,1),
  wheelbase_mm            NUMERIC(7,1),
  weight_kg               NUMERIC(8,1),
  cargo_volume_l          NUMERIC(8,1),
  tow_weight_braked_kg    NUMERIC(8,1),

  -- Source
  source                  TEXT,

  -- Optional FK to vehicle_specs (resolved post-import)
  vehicle_spec_id         BIGINT,

  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE ev_specs IS 'EV-specific data — battery, charging, range from OpenEV Data';

CREATE INDEX IF NOT EXISTS idx_ev_make ON ev_specs(make);
CREATE INDEX IF NOT EXISTS idx_ev_model ON ev_specs(model);
CREATE INDEX IF NOT EXISTS idx_ev_battery ON ev_specs(battery_capacity_kwh);
CREATE INDEX IF NOT EXISTS idx_ev_range ON ev_specs(range_wltp_km);
CREATE INDEX IF NOT EXISTS idx_ev_dc ON ev_specs(dc_max_power_kw);
CREATE INDEX IF NOT EXISTS idx_ev_spec ON ev_specs(vehicle_spec_id);


-- ============================================================================
-- BRIDGE: link existing `cars` table to new vehicle data
-- ============================================================================

CREATE TABLE IF NOT EXISTS car_vehicle_link (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id          TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  vehicle_spec_id BIGINT REFERENCES vehicle_specs(id) ON DELETE CASCADE,
  confidence      NUMERIC(3,2) DEFAULT 1.00,
  match_method    TEXT DEFAULT 'manual',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(car_id, vehicle_spec_id)
);
COMMENT ON TABLE car_vehicle_link IS 'Bridge: links original cars table to new vehicle_specs for enrichment';

CREATE INDEX IF NOT EXISTS idx_cvl_car ON car_vehicle_link(car_id);
CREATE INDEX IF NOT EXISTS idx_cvl_spec ON car_vehicle_link(vehicle_spec_id);


-- ============================================================================
-- VIEW: Unified vehicle search (joins key tables for fast queries)
-- ============================================================================

CREATE OR REPLACE VIEW vehicle_search AS
SELECT
  vs.id AS vehicle_spec_id,
  vs.unique_key,
  vs.make_name,
  vs.model_name,
  vs.year,
  vs.year_begin,
  vs.year_end,
  vs.trim,
  vs.body_type,
  vs.fuel_type,
  vs.drive_type,
  vs.acceleration_0_100,
  vs.max_speed_km,
  vs.msrp,
  -- Engine data
  e.horsepower,
  e.torque_nm,
  e.displacement_cc,
  e.transmission_type,
  e.gears_count,
  -- Dimensions
  d.length_mm,
  d.width_mm,
  d.height_mm,
  d.wheelbase_mm,
  d.cargo_volume_l,
  d.curb_weight_kg,
  -- Fuel economy (EPA)
  fe.combined_mpg,
  fe.city_mpg,
  fe.highway_mpg,
  fe.ghg_score,
  fe.co2_tailpipe_gpm,
  -- Safety
  sr.overall_rating AS safety_overall,
  sr.front_crash_rating,
  sr.side_crash_rating,
  sr.rollover_rating,
  -- EV
  ev.battery_capacity_kwh,
  ev.usable_battery_kwh,
  ev.range_wltp_km,
  ev.dc_max_power_kw,
  ev.ac_max_power_kw,
  ev.acceleration_0_100 AS ev_0_100
FROM vehicle_specs vs
LEFT JOIN engines e ON e.vehicle_spec_key = vs.unique_key
LEFT JOIN dimensions d ON d.vehicle_spec_key = vs.unique_key
LEFT JOIN fuel_economy fe ON fe.vehicle_spec_id = vs.id
LEFT JOIN safety_ratings sr ON sr.vehicle_spec_id = vs.id
LEFT JOIN ev_specs ev ON ev.vehicle_spec_id = vs.id;

COMMENT ON VIEW vehicle_search IS 'Denormalized view joining all specs for search, filter, and comparison UI';


-- ============================================================================
-- ROW LEVEL SECURITY — public read on all new tables
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'data_sources', 'import_logs', 'makes', 'models', 'vehicle_specs',
    'engines', 'dimensions', 'fuel_economy', 'ev_specs',
    'safety_ratings', 'car_vehicle_link'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    -- Public read
    EXECUTE format(
      'CREATE POLICY "Public read %s" ON %I FOR SELECT USING (true)',
      tbl, tbl
    );
    -- Service role full access (for import scripts)
    EXECUTE format(
      'CREATE POLICY "Service role %s" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      tbl, tbl
    );
    -- Anon insert/update (for scripts using anon key with RLS bypass)
    EXECUTE format(
      'CREATE POLICY "Anon write %s" ON %I FOR ALL TO anon USING (true) WITH CHECK (true)',
      tbl, tbl
    );
  END LOOP;
END $$;


-- ============================================================================
-- UPDATED_AT TRIGGERS (reuse function from migration 001)
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'data_sources', 'makes', 'models', 'vehicle_specs',
    'engines', 'dimensions', 'fuel_economy', 'ev_specs', 'safety_ratings'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      tbl || '_updated_at',
      tbl
    );
  END LOOP;
END $$;


-- ============================================================================
-- SEED: Register the five free data sources
-- ============================================================================

INSERT INTO data_sources (source_name, description, base_url) VALUES
  ('nhtsa_vpic',
   'NHTSA Vehicle Product Information Catalog — makes, models, VIN decode',
   'https://vpic.nhtsa.dot.gov/api/'),
  ('fueleconomy_gov',
   'EPA FuelEconomy.gov — fuel economy, emissions, annual cost, EV range (47K+ vehicles)',
   'https://fueleconomy.gov/feg/epadata/vehicles.csv'),
  ('nhtsa_safety',
   'NHTSA 5-Star Safety Ratings — crash tests, rollover, ADAS features',
   'https://api.nhtsa.gov/SafetyRatings/'),
  ('automobile_specs_github',
   'ilyasozkurt/automobile-models-and-specs — global: engine, performance, dimensions (124 brands, 30K+ engines)',
   'https://github.com/ilyasozkurt/automobile-models-and-specs'),
  ('openev_data',
   'OpenEV Data — EV battery capacity, charging speeds, connectors, WLTP range',
   'https://github.com/chargeprice/open-ev-data')
ON CONFLICT (source_name) DO NOTHING;


-- ============================================================================
-- DONE
-- ============================================================================
-- New tables: data_sources, import_logs, makes, models, vehicle_specs,
--             engines, dimensions, fuel_economy, ev_specs,
--             safety_ratings, car_vehicle_link
-- New view:   vehicle_search
-- Total: 11 tables + 1 view (additive, zero changes to existing tables)
--
-- Import flow:
--   1. Run import scripts → data lands in flat tables with unique_key
--   2. Post-import: resolve FKs (vehicle_spec_id in fuel_economy, safety, ev)
--   3. car_vehicle_link bridges old `cars` table to new data
