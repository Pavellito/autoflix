/**
 * Daily cron endpoint: discover fresh YouTube videos for the homepage.
 * Searches 5 categories, upserts results into discovered_videos table.
 *
 * Quota budget: 5 searches × 100 units = 500 units/day (out of 10,000 daily limit).
 * Schedule: Vercel cron at 1 AM UTC (see vercel.json).
 */

import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

let _supabaseAdmin: SupabaseClient | null = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`,
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
  }
  return _supabaseAdmin;
}

interface SearchCategory {
  query: string;
  category: string;
}

const CATEGORIES: SearchCategory[] = [
  { query: "2026 2025 new car review", category: "Trending" },
  { query: "electric car EV review 2025 2026", category: "Electric Cars" },
  { query: "car comparison head to head 2025 2026", category: "Comparisons" },
  { query: "expert car review test drive 2025 2026", category: "Reviews" },
  { query: "new car release first look 2025 2026", category: "New Releases" },
];

async function searchYouTube(query: string, maxResults = 8) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("order", "date");
  url.searchParams.set("videoDuration", "medium");
  url.searchParams.set("publishedAfter", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return [];

  const data = await res.json();
  return (data.items ?? []).map((item: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
      channelTitle: string;
      publishedAt: string;
    };
  }) => ({
    youtube_id: item.id.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
    channel_title: item.snippet.channelTitle,
    published_at: item.snippet.publishedAt,
    description: item.snippet.description,
  }));
}

export async function GET() {
  const stats = { searched: 0, upserted: 0, deactivated: 0, errors: 0 };
  const today = new Date().toISOString().split("T")[0];

  for (const { query, category } of CATEGORIES) {
    try {
      const videos = await searchYouTube(query);
      stats.searched++;

      for (const video of videos) {
        const { error } = await getSupabaseAdmin().from("discovered_videos").upsert(
          {
            youtube_id: video.youtube_id,
            title: video.title,
            thumbnail: video.thumbnail,
            channel_title: video.channel_title,
            published_at: video.published_at,
            description: video.description,
            category,
            featured_date: today,
            is_active: true,
          },
          { onConflict: "youtube_id" }
        );
        if (error) {
          stats.errors++;
        } else {
          stats.upserted++;
        }
      }
    } catch {
      stats.errors++;
    }
  }

  // Deactivate videos older than 30 days
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await getSupabaseAdmin()
    .from("discovered_videos")
    .update({ is_active: false })
    .lt("discovered_at", cutoff)
    .eq("is_active", true)
    .select("id");
  stats.deactivated = count ?? 0;

  return NextResponse.json({ ok: true, stats, date: today });
}
