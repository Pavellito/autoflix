"use client";

import Link from "next/link";
import type { Video } from "@/app/lib/data";
import FavoriteButton from "./FavoriteButton";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="netflix-card flex-shrink-0 w-[calc(100vw/2.5)] sm:w-[calc(100vw/3.5)] md:w-[calc(100vw/4.5)] lg:w-[calc(100vw/6.2)] min-w-[150px] rounded-[4px] overflow-hidden bg-[#181818] group relative"
    >
      {/* Thumbnail only — Netflix cards are just images */}
      <div className="relative aspect-video bg-[#2f2f2f]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Hover expansion — appears on hover like Netflix */}
      <div className="absolute left-0 right-0 top-full bg-[#181818] rounded-b-[4px] p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,.8)] z-20 pointer-events-none group-hover:pointer-events-auto">
        {/* Action buttons row */}
        <div className="flex items-center gap-[6px] mb-2">
          <span className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center">
            <svg className="w-[14px] h-[14px] text-black ml-[1px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span onClick={(e) => e.preventDefault()}>
            <FavoriteButton videoId={video.id} size="sm" />
          </span>
          <span className="w-[30px] h-[30px] border border-[rgba(255,255,255,.5)] rounded-full flex items-center justify-center ml-auto hover:border-white">
            <svg className="w-[14px] h-[14px] text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-[6px] text-[12px] mb-1">
          <span className="text-[#46d369] font-bold">98% Match</span>
          <span className="border border-[rgba(255,255,255,.4)] text-[#bcbcbc] text-[10px] px-[4px] leading-[16px]">{video.year}</span>
        </div>

        {/* Genre tags */}
        <div className="flex items-center gap-1 text-[11px] text-white">
          <span>{video.category}</span>
          <span className="w-[3px] h-[3px] bg-[#646464] rounded-full" />
          <span className="truncate">{video.title.split("–")[0]}</span>
        </div>
      </div>
    </Link>
  );
}
