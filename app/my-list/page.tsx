"use client";

import { useFavorites } from "@/app/lib/favorites-context";
import { videos } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";
import Link from "next/link";

export default function MyListPage() {
  const { favorites, loading } = useFavorites();

  const favoriteVideos = favorites
    .map((id) => videos.find((v) => v.id === id))
    .filter(Boolean);

  return (
    <div className="bg-[#141414] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-[4%]">
        <h1 className="text-[36px] md:text-[48px] font-bold text-white mb-8">My List</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoriteVideos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {favoriteVideos.map((video) => (
              <VideoCard key={video?.id} video={video!} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-16 h-16 text-[#555] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
            </svg>
            <h2 className="text-[24px] font-bold text-white mb-2">Your list is empty</h2>
            <p className="text-[#777] text-[16px] max-w-sm mb-8">
              Add videos and car reviews to your list to watch them later.
            </p>
            <Link
              href="/"
              className="bg-white text-black font-bold py-2.5 px-8 rounded hover:bg-white/80 transition-colors text-[16px]"
            >
              Browse Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
