"use client";

import { useFavorites } from "@/app/lib/favorites-context";

export default function FavoriteButton({
  videoId,
  size = "md",
}: {
  videoId: string;
  size?: "sm" | "md";
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(videoId);

  const sizeClasses =
    size === "sm"
      ? "w-7 h-7"
      : "w-10 h-10";

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent Link navigation if inside a card
        e.stopPropagation();
        toggleFavorite(videoId);
      }}
      className={`${sizeClasses} flex items-center justify-center rounded-full border transition-all ${
        active
          ? "bg-accent border-accent text-white scale-110"
          : "bg-black/50 border-white/30 text-white/70 hover:border-white hover:text-white hover:scale-105"
      }`}
      title={active ? "Remove from My List" : "Add to My List"}
    >
      {active ? (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
