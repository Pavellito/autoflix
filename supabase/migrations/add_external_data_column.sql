-- Add external_data JSONB column to cars table
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/hbbksyevcowbjasqyyjz/sql
ALTER TABLE cars ADD COLUMN IF NOT EXISTS external_data jsonb;

-- Add index for faster lookups on external source
CREATE INDEX IF NOT EXISTS idx_cars_external_source ON cars ((external_data->>'source'));

-- Enable RLS policy for insert/update via anon key (for on-demand enrichment)
-- Ensure the anon key can insert new cars from the API
DO $$
BEGIN
  -- Allow inserts from anon role
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cars' AND policyname = 'Allow anon insert'
  ) THEN
    CREATE POLICY "Allow anon insert" ON cars FOR INSERT TO anon WITH CHECK (true);
  END IF;

  -- Allow updates from anon role (for upsert/caching)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cars' AND policyname = 'Allow anon update'
  ) THEN
    CREATE POLICY "Allow anon update" ON cars FOR UPDATE TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;
