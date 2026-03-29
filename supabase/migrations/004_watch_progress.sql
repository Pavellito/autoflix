-- ============================================================================
-- AutoFlix Migration 004: Watch Progress (Netflix-style continue watching)
-- ============================================================================
-- Tracks user's playback position for each video, enabling:
--   - "Continue Watching" row on home page
--   - Resume from last position on video page
--   - Progress bars on video cards
-- ============================================================================

CREATE TABLE IF NOT EXISTS watch_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT NOT NULL DEFAULT 'anonymous',
  video_id        TEXT NOT NULL,

  -- Playback state
  current_time    NUMERIC(10,2) NOT NULL DEFAULT 0,  -- seconds
  duration        NUMERIC(10,2) DEFAULT 0,           -- total video duration in seconds
  completed       BOOLEAN DEFAULT false,

  -- Timestamps
  last_watched_at TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, video_id)
);

COMMENT ON TABLE watch_progress IS 'Tracks video playback position for continue-watching feature';

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_wp_user ON watch_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_wp_video ON watch_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_wp_user_recent ON watch_progress(user_id, last_watched_at DESC);

-- RLS: public read/write for anonymous users (no auth yet)
ALTER TABLE watch_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read watch_progress" ON watch_progress
  FOR SELECT USING (true);

CREATE POLICY "Public write watch_progress" ON watch_progress
  FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger (reuses existing function from migration 001)
CREATE TRIGGER watch_progress_updated_at
  BEFORE UPDATE ON watch_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
