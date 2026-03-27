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
  favorites: string[]; // array of item IDs (video or car)
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => Promise<void>;
  loading: boolean;
  user: any | null; // Placeholder for auth session
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  loading: true,
  user: null,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  // Load favorites from Supabase
  useEffect(() => {
    async function initAuth() {
       const { data: { session } } = await supabase.auth.getSession();
       setUser(session?.user ?? null);
       
       const userId = session?.user?.id || "anonymous";
       const { data } = await supabase
         .from("favorites")
         .select("video_id")
         .eq("user_id", userId);
       
       setFavorites(data?.map(r => r.video_id)??[]);
       setLoading(false);
    }
    initAuth();
  }, []);

  const isFavorite = useCallback(
    (itemId: string) => favorites.includes(itemId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (itemId: string) => {
      const userId = user?.id || "anonymous";
      const isCurrentlyFavorite = favorites.includes(itemId);

      // Optimistic
      setFavorites(prev => isCurrentlyFavorite ? prev.filter(i => i !== itemId) : [...prev, itemId]);

      try {
        if (isCurrentlyFavorite) {
          await supabase.from("favorites").delete().eq("user_id", userId).eq("video_id", itemId);
        } else {
          await supabase.from("favorites").insert({ user_id: userId, video_id: itemId });
        }
      } catch (err) {
        console.error("Toggle failed:", err);
      }
    },
    [favorites, user]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading, user }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
