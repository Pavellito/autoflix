-- ============================================================================
-- AutoFlix Migration 006: Align watch_progress columns with runtime code
-- ============================================================================
-- The original migration (004) created columns named current_time / duration,
-- but the runtime code reads/writes progress_seconds / duration_seconds.
-- This migration renames the columns to match the runtime.
-- ============================================================================

-- Only rename if the old column names still exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watch_progress' AND column_name = 'current_time'
  ) THEN
    ALTER TABLE watch_progress RENAME COLUMN current_time TO progress_seconds;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watch_progress' AND column_name = 'duration'
  ) THEN
    ALTER TABLE watch_progress RENAME COLUMN duration TO duration_seconds;
  END IF;
END $$;
