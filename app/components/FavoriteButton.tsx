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

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(videoId);
      }}
      className={`${sizeClasses} flex items-center justify-center rounded-full border-2 transition-all ${
        active
          ? "border-white bg-white/20 text-white"
          : "border-white/40 text-white hover:border-white"
      }`}
      title={active ? "Remove from My List" : "Add to My List"}
    >
      {active ? (
        <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ) : (
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
        </svg>
      )}
    </button>
  );
}
