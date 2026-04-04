/**
 * Date-seeded deterministic shuffle for daily content rotation.
 * Same date always produces the same order (cache-friendly).
 * Different dates produce different orders (fresh content daily).
 */

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

// Simple seeded pseudo-random number generator (mulberry32)
function seededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle with date-based seed.
 * Returns a new array (does not mutate input).
 *
 * @param items - Array to shuffle
 * @param dateSeed - Date string (defaults to today's YYYY-MM-DD)
 */
export function dateSeededShuffle<T>(items: T[], dateSeed?: string): T[] {
  if (items.length <= 1) return [...items];

  const seed = dateSeed ?? new Date().toISOString().split("T")[0];
  const rng = seededRandom(hashString(seed));
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
