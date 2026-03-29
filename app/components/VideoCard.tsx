"use client";

import Link from "next/link";
import type { Video } from "@/app/lib/data";
import FavoriteButton from "./FavoriteButton";
import { useWatchProgress } from "@/app/lib/watch-progress-context";

export default function VideoCard({ video }: { video: Video }) {
  const { getProgressPct, getProgress } = useWatchProgress();
  const progressPct = getProgressPct(video.id);
  const progress = getProgress(video.id);
  const hasProgress = progressPct > 0 && !progress?.completed;

  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex-shrink-0 w-[250px] rounded-md overflow-hidden bg-card-bg hover:scale-105 transition-transform duration-200 hover:z-10 relative"
    >
      <div className="relative aspect-video bg-gray-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Favorite button - visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavoriteButton videoId={video.id} size="sm" />
        </div>

        {/* Play icon overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Duration/time remaining */}
        {hasProgress && progress && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-white font-bold px-1.5 py-0.5 rounded">
            {formatTimeRemaining(progress.duration - progress.current_time)}
          </div>
        )}

        {/* Netflix-style progress bar */}
        {hasProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-700/80">
            <div
              className="h-full bg-accent rounded-r transition-all duration-300"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{video.year}</p>
      </div>
    </Link>
  );
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hrs}:${remainMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")} left`;
}
