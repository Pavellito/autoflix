"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { YouTubeVideo } from "@/app/lib/youtube-api";

interface Props {
  make: string;
  model: string;
  year?: number;
  carSlug: string;
  /** Fallback hardcoded video IDs from data.ts */
  fallbackVideoIds?: string[];
}

export default function YouTubeSection({ make, model, year, carSlug, fallbackVideoIds = [] }: Props) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ make, model, carSlug });
    if (year) params.set("year", String(year));

    fetch(`/api/youtube/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.videos?.length > 0) {
          setVideos(data.videos);
        } else if (fallbackVideoIds.length > 0) {
          // Create minimal video objects from fallback IDs
          setVideos(
            fallbackVideoIds.map((id) => ({
              videoId: id,
              title: "",
              thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              channelTitle: "",
              publishedAt: "",
              description: "",
            }))
          );
        }
      })
      .catch(() => {
        // Use fallbacks on error
        if (fallbackVideoIds.length > 0) {
          setVideos(
            fallbackVideoIds.map((id) => ({
              videoId: id,
              title: "",
              thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              channelTitle: "",
              publishedAt: "",
              description: "",
            }))
          );
        }
      })
      .finally(() => setLoading(false));
  }, [make, model, year, carSlug, fallbackVideoIds]);

  if (loading) {
    return (
      <div className="border-t border-white/10 pt-8 mb-8">
        <h2 className="text-[20px] font-bold text-white mb-4">
          Videos about {make} {model}
        </h2>
        <div className="flex gap-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] rounded-lg overflow-hidden bg-white/5 animate-pulse">
              <div className="aspect-video bg-white/10" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <div className="border-t border-white/10 pt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-white">
          Videos about {year ? `${year} ` : ""}{make} {model}
        </h2>
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${year || ""} ${make} ${model} review`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#e50914] hover:text-[#f6121d] font-medium transition-colors"
        >
          See all on YouTube →
        </a>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
        {videos.map((video) => (
          <Link
            key={video.videoId}
            href={`/video/yt-${video.videoId}`}
            className="flex-shrink-0 w-[300px] rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/5 hover:border-white/20 group transition-all hover:scale-[1.02]"
          >
            <div className="relative aspect-video bg-[#333]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail}
                alt={video.title || `${make} ${model} video`}
                className="w-full h-full object-cover"
              />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="w-12 h-12 rounded-full bg-[#e50914] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* YouTube badge */}
              <div className="absolute top-2 right-2 bg-[#FF0000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                YouTube
              </div>
            </div>
            <div className="p-3">
              {video.title && (
                <h3 className="text-[13px] text-white font-medium line-clamp-2 group-hover:text-white/80 mb-1">
                  {video.title}
                </h3>
              )}
              {video.channelTitle && (
                <p className="text-[11px] text-[#777]">{video.channelTitle}</p>
              )}
              {video.publishedAt && (
                <p className="text-[10px] text-[#555] mt-0.5">
                  {new Date(video.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
