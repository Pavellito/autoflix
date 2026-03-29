-- ============================================================================
-- AutoFlix Migration 003: Post-Import FK Linking
-- ============================================================================
-- Resolves foreign keys between denormalized import tables.
-- Safe to re-run (idempotent — uses WHERE ... IS NULL guards).
--
-- Run this AFTER all import scripts have completed.
-- ============================================================================


-- ============================================================================
-- 1. Link fuel_economy → vehicle_specs
--    Match on: UPPER(make) = UPPER(make_name) AND year matches
--    Model matching is fuzzy since EPA model names differ from GitHub data
-- ============================================================================

UPDATE fuel_economy fe
SET vehicle_spec_id = vs.id
FROM vehicle_specs vs
WHERE fe.vehicle_spec_id IS NULL
  AND vs.year = fe.year
  AND UPPER(TRIM(vs.make_name)) = UPPER(TRIM(fe.make))
  AND (
    -- Exact model match
    UPPER(TRIM(vs.model_name)) = UPPER(TRIM(fe.model))
    OR
    -- Partial: EPA model starts with vehicle_specs model_name
    UPPER(TRIM(fe.model)) LIKE UPPER(TRIM(vs.model_name)) || '%'
  );

-- Show result
DO $$
DECLARE
  linked INT;
  total INT;
BEGIN
  SELECT COUNT(*) INTO linked FROM fuel_economy WHERE vehicle_spec_id IS NOT NULL;
  SELECT COUNT(*) INTO total FROM fuel_economy;
  RAISE NOTICE 'fuel_economy linked: % / %', linked, total;
END $$;


-- ============================================================================
-- 2. Link safety_ratings → vehicle_specs
--    Match on: UPPER(make) = UPPER(make_name) AND year
-- ============================================================================

UPDATE safety_ratings sr
SET vehicle_spec_id = vs.id
FROM vehicle_specs vs
WHERE sr.vehicle_spec_id IS NULL
  AND vs.year = sr.year
  AND UPPER(TRIM(vs.make_name)) = UPPER(TRIM(sr.make))
  AND (
    UPPER(TRIM(vs.model_name)) = UPPER(TRIM(sr.model))
    OR UPPER(TRIM(sr.model)) LIKE UPPER(TRIM(vs.model_name)) || '%'
  );

DO $$
DECLARE
  linked INT;
  total INT;
BEGIN
  SELECT COUNT(*) INTO linked FROM safety_ratings WHERE vehicle_spec_id IS NOT NULL;
  SELECT COUNT(*) INTO total FROM safety_ratings;
  RAISE NOTICE 'safety_ratings linked: % / %', linked, total;
END $$;


-- ============================================================================
-- 3. Link ev_specs → vehicle_specs
--    Match on: UPPER(make) = UPPER(make_name) AND model contains
--    EV data uses "model" field which may include variant info
-- ============================================================================

UPDATE ev_specs ev
SET vehicle_spec_id = vs.id
FROM vehicle_specs vs
WHERE ev.vehicle_spec_id IS NULL
  AND UPPER(TRIM(vs.make_name)) = UPPER(TRIM(ev.make))
  AND (
    UPPER(TRIM(vs.model_name)) = UPPER(TRIM(ev.model))
    OR UPPER(TRIM(vs.model_name)) LIKE '%' || UPPER(TRIM(ev.model)) || '%'
    OR UPPER(TRIM(ev.model)) LIKE '%' || UPPER(TRIM(vs.model_name)) || '%'
  );

DO $$
DECLARE
  linked INT;
  total INT;
BEGIN
  SELECT COUNT(*) INTO linked FROM ev_specs WHERE vehicle_spec_id IS NOT NULL;
  SELECT COUNT(*) INTO total FROM ev_specs;
  RAISE NOTICE 'ev_specs linked: % / %', linked, total;
END $$;


-- ============================================================================
-- 4. Create useful indexes for the vehicle_search view performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_fuel_spec_id ON fuel_economy(vehicle_spec_id) WHERE vehicle_spec_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_safety_spec_id ON safety_ratings(vehicle_spec_id) WHERE vehicle_spec_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ev_spec_id ON ev_specs(vehicle_spec_id) WHERE vehicle_spec_id IS NOT NULL;


-- ============================================================================
-- 5. Full-text search support on vehicle_specs
-- ============================================================================

-- Add a generated tsvector column for full-text search
ALTER TABLE vehicle_specs
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      COALESCE(make_name, '') || ' ' ||
      COALESCE(model_name, '') || ' ' ||
      COALESCE(modification_name, '') || ' ' ||
      COALESCE(trim, '') || ' ' ||
      COALESCE(body_type, '') || ' ' ||
      COALESCE(fuel_type, '') || ' ' ||
      COALESCE(drive_type, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_vspecs_search ON vehicle_specs USING gin(search_vector);


-- ============================================================================
-- 6. Refresh the vehicle_search view (recreate to pick up any schema changes)
-- ============================================================================

CREATE OR REPLACE VIEW vehicle_search AS
SELECT
  vs.id AS vehicle_spec_id,
  vs.unique_key,
  vs.make_name,
  vs.model_name,
  vs.modification_name,
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
  vs.fuel_consumption_combined,
  vs.fuel_tank_capacity,
  -- Engine data
  e.horsepower,
  e.torque_nm,
  e.displacement_cc,
  e.cylinders,
  e.transmission_type,
  e.gears_count,
  e.fuel_system,
  -- Dimensions
  d.length_mm,
  d.width_mm,
  d.height_mm,
  d.wheelbase_mm,
  d.cargo_volume_l,
  d.curb_weight_kg,
  d.drag_coefficient,
  -- Fuel economy (EPA)
  fe.combined_mpg,
  fe.city_mpg,
  fe.highway_mpg,
  fe.ghg_score,
  fe.co2_tailpipe_gpm,
  fe.annual_fuel_cost,
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
  ev.acceleration_0_100 AS ev_0_100,
  ev.avg_consumption_kwh_100km
FROM vehicle_specs vs
LEFT JOIN engines e ON e.vehicle_spec_key = vs.unique_key
LEFT JOIN dimensions d ON d.vehicle_spec_key = vs.unique_key
LEFT JOIN fuel_economy fe ON fe.vehicle_spec_id = vs.id
LEFT JOIN safety_ratings sr ON sr.vehicle_spec_id = vs.id
LEFT JOIN ev_specs ev ON ev.vehicle_spec_id = vs.id;

COMMENT ON VIEW vehicle_search IS 'Denormalized view joining all specs for search, filter, and comparison UI';


-- ============================================================================
-- DONE
-- ============================================================================
-- After running this migration:
-- - fuel_economy, safety_ratings, and ev_specs are linked via vehicle_spec_id
-- - vehicle_search view now returns full data from all sources
-- - Full-text search index enables fast text queries
-- - Run in Supabase SQL Editor or via: supabase db push
