-- ============================================================================
-- AutoFlix Migration 008: Full-text search index for news table
-- ============================================================================
-- Replaces slow ilike %query% text search with PostgreSQL full-text search.
-- Expected speedup: 10-50x on large news datasets.
-- ============================================================================

-- Add full-text search column and index
DO $$
BEGIN
  -- Add tsvector column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE news ADD COLUMN search_vector tsvector;
  END IF;
END $$;

-- Populate search vector from title and content
UPDATE news SET search_vector = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
WHERE search_vector IS NULL;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_news_fts ON news USING GIN(search_vector);

-- Auto-update search vector on insert/update
CREATE OR REPLACE FUNCTION news_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS news_search_vector_trigger ON news;
CREATE TRIGGER news_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, content ON news
  FOR EACH ROW EXECUTE FUNCTION news_search_vector_update();
