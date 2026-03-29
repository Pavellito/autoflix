-- YouTube search results cache to minimize API quota usage
-- YouTube Data API v3 allows 10,000 units/day, search costs 100 units = 100 searches/day
-- Cache TTL: 7 days

CREATE TABLE IF NOT EXISTS youtube_cache (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  car_slug TEXT NOT NULL,
  search_query TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  UNIQUE(car_slug)
);

CREATE INDEX IF NOT EXISTS idx_youtube_cache_slug ON youtube_cache(car_slug);
CREATE INDEX IF NOT EXISTS idx_youtube_cache_expires ON youtube_cache(expires_at);

-- Public read access, service role write
ALTER TABLE youtube_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read youtube_cache"
  ON youtube_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role write youtube_cache"
  ON youtube_cache FOR ALL
  USING (true)
  WITH CHECK (true);
