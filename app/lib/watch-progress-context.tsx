"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WatchProgressEntry {
  video_id: string;
  current_time: number;
  duration: number;
  completed: boolean;
  last_watched_at: string;
}

interface WatchProgressContextType {
  /** All progress entries for the current user */
  entries: WatchProgressEntry[];
  /** Get progress for a specific video (null if not watched) */
  getProgress: (videoId: string) => WatchProgressEntry | null;
  /** Get progress percentage (0-100) for a video */
  getProgressPct: (videoId: string) => number;
  /** Update progress for a video */
  updateProgress: (videoId: string, currentTime: number, duration: number) => void;
  /** Mark a video as completed */
  markCompleted: (videoId: string) => void;
  /** Videos in "Continue Watching" (partially watched, not completed) */
  continueWatching: WatchProgressEntry[];
  /** Loading state */
  loading: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WatchProgressContext = createContext<WatchProgressContextType>({
  entries: [],
  getProgress: () => null,
  getProgressPct: () => 0,
  updateProgress: () => {},
  markCompleted: () => {},
  continueWatching: [],
  loading: true,
});

const USER_ID = "anonymous";
const SAVE_INTERVAL_MS = 5000; // Debounce: save to DB every 5 seconds max

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function WatchProgressProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WatchProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const pendingSaves = useRef<Map<string, { currentTime: number; duration: number }>>(new Map());
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load all watch progress on mount
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("watch_progress")
          .select("video_id, progress_seconds, duration_seconds, completed, last_watched_at")
          .eq("user_id", USER_ID)
          .order("last_watched_at", { ascending: false });

        if (error) {
          console.error("Error loading watch progress:", error);
          return;
        }

        setEntries(
          (data ?? []).map((row) => ({
            video_id: row.video_id,
            current_time: parseFloat(row.progress_seconds) || 0,
            duration: parseFloat(row.duration_seconds) || 0,
            completed: row.completed ?? false,
            last_watched_at: row.last_watched_at,
          }))
        );
      } catch (err) {
        console.error("Failed to load watch progress:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Periodic flush of pending saves to Supabase
  useEffect(() => {
    saveTimer.current = setInterval(() => {
      flushPendingSaves();
    }, SAVE_INTERVAL_MS);

    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current);
      // Flush on unmount
      flushPendingSaves();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flushPendingSaves = useCallback(async () => {
    const saves = new Map(pendingSaves.current);
    pendingSaves.current.clear();

    for (const [videoId, { currentTime, duration }] of saves) {
      const completed = duration > 0 && currentTime / duration > 0.95;

      try {
        const { error } = await supabase
          .from("watch_progress")
          .upsert(
            {
              user_id: USER_ID,
              video_id: videoId,
              progress_seconds: Math.round(currentTime * 100) / 100,
              duration_seconds: Math.round(duration * 100) / 100,
              completed,
              last_watched_at: new Date().toISOString(),
            },
            { onConflict: "user_id,video_id" }
          );

        if (error) console.error("Failed to save progress:", error);
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }
  }, []);

  const getProgress = useCallback(
    (videoId: string): WatchProgressEntry | null => {
      return entries.find((e) => e.video_id === videoId) ?? null;
    },
    [entries]
  );

  const getProgressPct = useCallback(
    (videoId: string): number => {
      const entry = entries.find((e) => e.video_id === videoId);
      if (!entry || !entry.duration || entry.duration === 0) return 0;
      return Math.min((entry.current_time / entry.duration) * 100, 100);
    },
    [entries]
  );

  const updateProgress = useCallback(
    (videoId: string, currentTime: number, duration: number) => {
      // Queue for batch save
      pendingSaves.current.set(videoId, { currentTime, duration });

      // Optimistic local update
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.video_id === videoId);
        const completed = duration > 0 && currentTime / duration > 0.95;
        const entry: WatchProgressEntry = {
          video_id: videoId,
          current_time: currentTime,
          duration,
          completed,
          last_watched_at: new Date().toISOString(),
        };

        if (idx >= 0) {
          const next = [...prev];
          next[idx] = entry;
          return next;
        }
        return [entry, ...prev];
      });
    },
    []
  );

  const markCompleted = useCallback(
    (videoId: string) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.video_id === videoId ? { ...e, completed: true } : e
        )
      );

      supabase
        .from("watch_progress")
        .upsert(
          {
            user_id: USER_ID,
            video_id: videoId,
            completed: true,
            last_watched_at: new Date().toISOString(),
          },
          { onConflict: "user_id,video_id" }
        )
        .then(({ error }) => {
          if (error) console.error("Failed to mark completed:", error);
        });
    },
    []
  );

  // "Continue Watching" = partially watched, not completed, sorted by recency
  const continueWatching = entries
    .filter((e) => !e.completed && e.current_time > 10 && e.duration > 0)
    .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())
    .slice(0, 20);

  return (
    <WatchProgressContext.Provider
      value={{
        entries,
        getProgress,
        getProgressPct,
        updateProgress,
        markCompleted,
        continueWatching,
        loading,
      }}
    >
      {children}
    </WatchProgressContext.Provider>
  );
}

export function useWatchProgress() {
  return useContext(WatchProgressContext);
}
