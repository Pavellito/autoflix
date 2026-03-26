"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

interface FavoritesContextType {
  favorites: string[]; // array of video IDs
  isFavorite: (videoId: string) => boolean;
  toggleFavorite: (videoId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  loading: true,
});

const USER_ID = "anonymous"; // Will be replaced with auth in a later step

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from Supabase on mount
  useEffect(() => {
    async function loadFavorites() {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("video_id")
          .eq("user_id", USER_ID);

        if (error) {
          console.error("Error loading favorites:", error);
          return;
        }

        setFavorites(data?.map((row) => row.video_id) ?? []);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  const isFavorite = useCallback(
    (videoId: string) => favorites.includes(videoId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (videoId: string) => {
      const isCurrentlyFavorite = favorites.includes(videoId);

      // Optimistic update
      if (isCurrentlyFavorite) {
        setFavorites((prev) => prev.filter((id) => id !== videoId));
      } else {
        setFavorites((prev) => [...prev, videoId]);
      }

      try {
        if (isCurrentlyFavorite) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", USER_ID)
            .eq("video_id", videoId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("favorites")
            .insert({ user_id: USER_ID, video_id: videoId });

          if (error) throw error;
        }
      } catch (err) {
        // Revert optimistic update on error
        console.error("Failed to toggle favorite:", err);
        if (isCurrentlyFavorite) {
          setFavorites((prev) => [...prev, videoId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== videoId));
        }
      }
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
