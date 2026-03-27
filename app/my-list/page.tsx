"use client";

import { useFavorites } from "@/app/lib/favorites-context";
import { videos } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";
import Link from "next/link";

export default function MyListPage() {
  const { favorites, loading } = useFavorites();

  // Map the favorited IDs back into full Video objects
  const favoriteVideos = favorites
    .map((id) => videos.find((v) => v.id === id))
    .filter(Boolean); // removes undefined

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My List</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : favoriteVideos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteVideos.map((video) => (
            <VideoCard key={video?.id} video={video!} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-card-bg border border-white/5 rounded-2xl shadow-xl text-center">
          <svg className="w-24 h-24 text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
          <p className="text-gray-400 max-w-sm mb-8">
            Add car reviews, comparisons, and tuning videos to your list to watch them later seamlessly.
          </p>
          <Link
            href="/"
            className="bg-accent hover:bg-accent/80 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg shadow-accent/20"
          >
            Explore Videos
          </Link>
        </div>
      )}
    </div>
  );
}
