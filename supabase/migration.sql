-- ============================================
-- Autoflix Car Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Core car table
CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EV', 'Hybrid', 'ICE')),
  range_km TEXT,
  battery TEXT,
  price TEXT,
  image TEXT NOT NULL,
  real_world_range JSONB,
  charging_curve JSONB,
  depreciation JSONB,
  related_video_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Per-region prices
CREATE TABLE IF NOT EXISTS car_prices (
  id SERIAL PRIMARY KEY,
  car_id TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  price TEXT NOT NULL,
  UNIQUE(car_id, region)
);

-- Per-region advice
CREATE TABLE IF NOT EXISTS car_regional_advice (
  id SERIAL PRIMARY KEY,
  car_id TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  advice TEXT NOT NULL,
  UNIQUE(car_id, region)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_car_prices_car_id ON car_prices(car_id);
CREATE INDEX IF NOT EXISTS idx_car_regional_advice_car_id ON car_regional_advice(car_id);

-- Row Level Security (public read, authenticated write)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_regional_advice ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cars" ON cars FOR SELECT USING (true);
CREATE POLICY "Public read prices" ON car_prices FOR SELECT USING (true);
CREATE POLICY "Public read advice" ON car_regional_advice FOR SELECT USING (true);

-- Auto-update updated_at on cars
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
