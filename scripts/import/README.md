# AutoFlix Data Import Scripts

Import free, public vehicle data into Supabase.

## Data Sources

| Script | Source | Data | Scope |
|--------|--------|------|-------|
| `nhtsa-vpic.ts` | [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/) | Makes, models, year/make/model combos | US (all vehicles) |
| `github-auto-specs.ts` | [automobile-models-and-specs](https://github.com/ilyasozkurt/automobile-models-and-specs) | Engine HP/torque, dimensions, weight, 0-100, top speed, fuel economy | Global |
| `epa-fuel-economy.ts` | [EPA fueleconomy.gov](https://www.fueleconomy.gov/feg/epadata/vehicles.csv) | MPG, CO2, fuel type, GHG scores | US |
| `nhtsa-safety.ts` | [NHTSA Safety Ratings](https://api.nhtsa.gov/SafetyRatings/) | 5-star crash-test ratings | US |
| `openev-data.ts` | [open-ev-data](https://github.com/chargeprice/open-ev-data) | Battery, range, charge speeds, connectors | Global (EVs) |

## Prerequisites

1. **Supabase project** with the required tables (see `supabase/migrations/` or create them based on the schemas below).

2. **Environment variables** — set in `.env.local` at the project root:

   ```env
   NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-project-id
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   The service role key is required because the import scripts need write access. Find it in the Supabase dashboard under Settings > API.

3. **Node.js 18+** (for built-in `fetch`).

## Running

### All imports (recommended)

```bash
npx tsx scripts/import/run-all.ts
```

This runs all five scripts in order. Each step is isolated — a failure in one step will not prevent the others from running.

### Individual scripts

```bash
npx tsx scripts/import/nhtsa-vpic.ts
npx tsx scripts/import/github-auto-specs.ts
npx tsx scripts/import/epa-fuel-economy.ts
npx tsx scripts/import/nhtsa-safety.ts
npx tsx scripts/import/openev-data.ts
```

### Recommended import order

1. **NHTSA vPIC** — establishes makes and models
2. **GitHub Auto Specs** — global technical specs
3. **EPA Fuel Economy** — US fuel economy data
4. **NHTSA Safety** — US safety ratings
5. **Open EV Data** — EV-specific specs

## Idempotency

All scripts use **upsert** (INSERT ... ON CONFLICT DO UPDATE). They are safe to re-run at any time — no duplicate rows will be created.

## Expected Supabase Tables

The scripts expect these tables to exist. Create them before running the imports.

### `makes`
- `id` (bigint, primary key, auto)
- `nhtsa_make_id` (int, unique)
- `name` (text)
- `slug` (text)
- `created_at` (timestamptz)

### `models`
- `id` (bigint, primary key, auto)
- `nhtsa_model_id` (int, unique)
- `nhtsa_make_id` (int, FK to makes.nhtsa_make_id)
- `name` (text)
- `slug` (text)
- `created_at` (timestamptz)

### `vehicle_specs`
- `id` (bigint, primary key, auto)
- `unique_key` (text, unique)
- `year` / `year_begin` / `year_end` (int)
- `nhtsa_make_id` / `nhtsa_model_id` (int)
- `make_name` / `model_name` (text)
- `generation_name` / `modification_name` (text)
- Various spec fields (body_type, drive_type, fuel_type, etc.)
- `source` (text)
- `github_*` ID fields
- `created_at` (timestamptz)

### `engines`
- `id` (bigint, primary key, auto)
- `unique_key` (text, unique)
- `vehicle_spec_key` (text, FK to vehicle_specs.unique_key)
- `engine_type`, `displacement_cc`, `horsepower`, `torque_nm`, etc.
- `transmission_type`, `gears_count`
- `source` (text)

### `dimensions`
- `id` (bigint, primary key, auto)
- `unique_key` (text, unique)
- `vehicle_spec_key` (text, FK to vehicle_specs.unique_key)
- `length_mm`, `width_mm`, `height_mm`, `wheelbase_mm`, `curb_weight_kg`, etc.
- `source` (text)

### `fuel_economy`
- `id` (bigint, primary key, auto)
- `unique_key` (text, unique)
- `epa_id` (int)
- `year`, `make`, `model`, `trim`, `vehicle_class`
- MPG fields (city, highway, combined), CO2, GHG scores, etc.
- `created_at` (timestamptz)

### `safety_ratings`
- `id` (bigint, primary key, auto)
- `unique_key` (text, unique)
- `nhtsa_vehicle_id` (int)
- `year`, `make`, `model`
- Rating fields (overall, front crash, side crash, rollover, etc.)
- `complaints_count`, `recalls_count`, `investigation_count`

### `ev_specs`
- `id` (bigint, primary key, auto)
- `unique_key` (text, unique)
- `openev_id` (text)
- `make`, `model`, `variant`, `release_year`
- Battery & range fields
- Charging fields (AC/DC power, ports, curves)
- `source` (text)

## Rate Limits

- **NHTSA vPIC**: ~4 req/s (no documented limit, we are conservative)
- **NHTSA Safety**: ~5 req/s
- **EPA**: Single bulk CSV download
- **GitHub raw**: Standard CDN, no limit for single files

## Timing Estimates

- NHTSA vPIC (all makes + models + top-make year combos): 20-60 min
- GitHub Auto Specs: 1-2 min (single JSON downloads)
- EPA Fuel Economy: 2-5 min (45 MB CSV)
- NHTSA Safety (2010-2026): 30-90 min (many nested API calls)
- Open EV Data: < 1 min
