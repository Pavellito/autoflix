"use client";

import Link from "next/link";
import type { Video } from "@/app/lib/data";
import { useWatchProgress } from "@/app/lib/watch-progress-context";
import FavoriteButton from "./FavoriteButton";

export default function VideoCard({ video }: { video: Video }) {
  const { getProgressPct } = useWatchProgress();
  const progressPct = getProgressPct(video.id);

  return (
    <div className="netflix-card flex-shrink-0 w-[calc(100vw/2.3)] sm:w-[calc(100vw/3.3)] md:w-[calc(100vw/4.3)] lg:w-[calc(100vw/6.2)] rounded overflow-hidden relative group cursor-pointer snap-start">
      <Link href={`/video/${video.id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[#333]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Netflix-style red progress bar */}
          {progressPct > 0 && progressPct < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
              <div
                className="h-full bg-[#e50914]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}
        </div>

        {/* Hover Popup */}
        <div className="absolute top-full left-0 right-0 bg-[#181818] p-3 rounded-b shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-40">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80"
            >
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <FavoriteButton videoId={video.id} size="sm" />
            </div>
          </div>

          {/* Match + Category */}
          <div className="flex items-center gap-2 text-[12px] mb-1">
            <span className="text-[#46d369] font-bold">98% Match</span>
            <span className="border border-white/30 text-white/60 px-1 text-[10px]">{video.category}</span>
          </div>

          {/* Title */}
          <p className="text-[13px] text-white font-medium truncate">{video.title}</p>
          <p className="text-[11px] text-white/50 mt-0.5">{video.year}</p>
        </div>
      </Link>
    </div>
  );
}
