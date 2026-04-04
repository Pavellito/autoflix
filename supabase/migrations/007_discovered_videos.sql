-- ============================================================================
-- AutoFlix Migration 007: Discovered Videos (auto-populated by daily cron)
-- ============================================================================
-- Stores YouTube videos discovered by the automated daily search.
-- Used to keep the homepage fresh with new trending/review content.
-- ============================================================================

CREATE TABLE IF NOT EXISTS discovered_videos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id      TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL DEFAULT '',
  thumbnail       TEXT NOT NULL DEFAULT '',
  channel_title   TEXT NOT NULL DEFAULT '',
  published_at    TIMESTAMPTZ,
  description     TEXT DEFAULT '',
  category        TEXT NOT NULL DEFAULT 'Trending',  -- Trending, Reviews, Comparisons, Electric Cars, New Releases
  discovered_at   TIMESTAMPTZ DEFAULT now(),
  featured_date   DATE DEFAULT CURRENT_DATE,
  is_active       BOOLEAN DEFAULT true,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE discovered_videos IS 'YouTube videos auto-discovered by daily cron job for fresh homepage content';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dv_category ON discovered_videos(category);
CREATE INDEX IF NOT EXISTS idx_dv_active ON discovered_videos(is_active, featured_date DESC);
CREATE INDEX IF NOT EXISTS idx_dv_youtube ON discovered_videos(youtube_id);

-- RLS: public read, service role write
ALTER TABLE discovered_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read discovered_videos" ON discovered_videos
  FOR SELECT USING (true);

CREATE POLICY "Service write discovered_videos" ON discovered_videos
  FOR ALL USING (true) WITH CHECK (true);
