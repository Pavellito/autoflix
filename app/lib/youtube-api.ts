/**
 * YouTube Data API v3 integration for automatic video discovery.
 * Searches YouTube for car review videos and caches results in Supabase.
 *
 * Quota: 10,000 units/day, search costs 100 units = 100 searches/day.
 * Cache TTL: 7 days to minimize API usage.
 */

import { supabase } from "./supabase";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  error?: { code: number; message: string };
}

// ---------------------------------------------------------------------------
// Cache layer (Supabase youtube_cache table)
// ---------------------------------------------------------------------------

async function getCachedVideos(carSlug: string): Promise<YouTubeVideo[] | null> {
  try {
    const { data, error } = await supabase
      .from("youtube_cache")
      .select("results, expires_at")
      .eq("car_slug", carSlug)
      .single();

    if (error || !data) return null;

    // Check if cache is still valid
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) return null;

    return data.results as YouTubeVideo[];
  } catch {
    return null;
  }
}

async function setCachedVideos(carSlug: string, query: string, videos: YouTubeVideo[]): Promise<void> {
  try {
    await supabase.from("youtube_cache").upsert(
      {
        car_slug: carSlug,
        search_query: query,
        results: videos,
        fetched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "car_slug" }
    );
  } catch (err) {
    console.error("Failed to cache YouTube results:", err);
  }
}

// ---------------------------------------------------------------------------
// YouTube Data API v3
// ---------------------------------------------------------------------------

async function searchYouTubeAPI(query: string, maxResults: number = 8): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not set, skipping YouTube search");
    return [];
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("order", "relevance");
  url.searchParams.set("videoDuration", "medium"); // 4-20 min (reviews)
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // ISR: re-check daily
  });

  if (!res.ok) {
    if (res.status === 403) {
      console.warn("YouTube API quota exceeded");
    } else {
      console.error(`YouTube API error: ${res.status}`);
    }
    return [];
  }

  const data: YouTubeSearchResponse = await res.json();
  if (data.error) {
    console.error("YouTube API error:", data.error.message);
    return [];
  }

  return (data.items ?? []).map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
  }));
}

// ---------------------------------------------------------------------------
// Public API: search with caching
// ---------------------------------------------------------------------------

/**
 * Search YouTube for videos about a specific car.
 * Uses Supabase cache (7-day TTL) to minimize API quota usage.
 *
 * @param carSlug - URL slug for the car (used as cache key)
 * @param make - Car manufacturer name
 * @param model - Car model name
 * @param year - Model year (optional)
 */
// ---------------------------------------------------------------------------
// oEmbed: free metadata lookup (no API key / no quota)
// ---------------------------------------------------------------------------

/**
 * Fetch YouTube video metadata using the free oEmbed endpoint.
 * Returns title, author, and thumbnail without consuming API quota.
 */
export async function getYouTubeVideoInfo(
  youtubeId: string
): Promise<{ title: string; author: string; thumbnail: string } | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title || "",
      author: data.author_name || "",
      thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Discovered videos (from daily cron, stored in Supabase)
// ---------------------------------------------------------------------------

/**
 * Fetch auto-discovered videos from Supabase by category.
 * Returns the most recently featured, active videos.
 */
export async function getDiscoveredVideos(
  category?: string,
  limit: number = 15
): Promise<YouTubeVideo[]> {
  try {
    let query = supabase
      .from("discovered_videos")
      .select("youtube_id, title, thumbnail, channel_title, published_at, description")
      .eq("is_active", true)
      .order("featured_date", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      videoId: row.youtube_id,
      title: row.title,
      thumbnail: row.thumbnail || `https://i.ytimg.com/vi/${row.youtube_id}/hqdefault.jpg`,
      channelTitle: row.channel_title,
      publishedAt: row.published_at,
      description: row.description || "",
    }));
  } catch {
    return [];
  }
}

export async function fetchYouTubeVideos(
  carSlug: string,
  make: string,
  model: string,
  year?: number
): Promise<YouTubeVideo[]> {
  // 1. Check cache
  const cached = await getCachedVideos(carSlug);
  if (cached && cached.length > 0) return cached;

  // 2. Build search query
  const yearStr = year ? `${year} ` : "";
  const query = `${yearStr}${make} ${model} review`;

  // 3. Call YouTube API
  const videos = await searchYouTubeAPI(query, 8);

  // 4. Cache results (even if empty, to avoid hammering API)
  if (videos.length > 0) {
    await setCachedVideos(carSlug, query, videos);
  }

  return videos;
}
