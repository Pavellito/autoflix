"use client";

import Link from "next/link";
import { useFavorites } from "@/app/lib/favorites-context";
import { getVideoById } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";

export default function MyListPage() {
  const { favorites, loading } = useFavorites();

  const favoriteVideos = favorites
    .map((id) => getVideoById(id))
    .filter((v) => v !== undefined);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">My List</h1>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 py-12">
          <span className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Loading your favorites...
        </div>
      ) : favoriteVideos.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-gray-400 text-lg mb-2">Your list is empty</p>
          <p className="text-gray-500 text-sm mb-6">
            Click the heart icon on any video to add it to your list
          </p>
          <Link
            href="/"
            className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Browse Videos
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            {favoriteVideos.length} video{favoriteVideos.length !== 1 && "s"} saved
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favoriteVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
