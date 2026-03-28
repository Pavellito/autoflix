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
    <div className="bg-[#141414] min-h-screen pt-24 pb-16">
      <div className="px-4 lg:px-14">
        <h1 className="text-white text-3xl font-bold mb-8">My List</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin" />
          </div>
        ) : favoriteVideos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {favoriteVideos.map((video) => (
              <VideoCard key={video?.id} video={video!} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="w-16 h-16 text-[#808080] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-white text-2xl font-bold mb-2">Your list is empty</h2>
            <p className="text-[#808080] max-w-sm mb-8">
              Add car reviews and videos to your list to watch them later.
            </p>
            <Link
              href="/"
              className="bg-white text-black px-8 py-3 rounded-[4px] font-bold hover:bg-white/80 transition"
            >
              Browse Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
