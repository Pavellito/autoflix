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
      className={`${sizeClasses} flex items-center justify-center rounded-full border transition-all ${
        active
          ? "bg-white border-white text-black"
          : "bg-transparent border-[#808080]/60 text-white hover:border-white"
      }`}
      title={active ? "Remove from My List" : "Add to My List"}
    >
      {active ? (
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
    </button>
  );
}
