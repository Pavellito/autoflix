"use client";

import Link from "next/link";
import type { Video } from "@/app/lib/data";
import FavoriteButton from "./FavoriteButton";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <div className="netflix-card flex-shrink-0 w-[230px] lg:w-[260px] rounded-[4px] overflow-hidden bg-[#181818] group cursor-pointer">
      <Link href={`/video/${video.id}`}>
        <div className="relative aspect-video bg-[#2f2f2f]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Play icon overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded-sm font-medium">
            {video.year}
          </div>
        </div>
      </Link>

      {/* Netflix-style card details on hover */}
      <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-0 group-hover:max-h-[200px] overflow-hidden">
        {/* Action buttons row */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/video/${video.id}`}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition"
          >
            <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </Link>
          <FavoriteButton videoId={video.id} size="sm" />
          <div className="ml-auto">
            <Link
              href={`/video/${video.id}`}
              className="w-8 h-8 border border-[#808080]/60 rounded-full flex items-center justify-center hover:border-white transition"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white text-sm font-bold truncate mb-1">{video.title}</h3>

        {/* Tags */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#46d369] font-bold">98% Match</span>
          <span className="maturity-badge text-[#bcbcbc]">{video.category}</span>
        </div>
      </div>
    </div>
  );
}
