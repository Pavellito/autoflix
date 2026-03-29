"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useWatchProgress } from "@/app/lib/watch-progress-context";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
  getPlayerState: () => number;
}

interface Props {
  videoId: string;
  youtubeId: string;
  title: string;
}

// Track interval for progress updates while playing
const TRACK_INTERVAL_MS = 3000;

export default function YouTubePlayer({ videoId, youtubeId, title }: Props) {
  const { getProgress, updateProgress, markCompleted } = useWatchProgress();
  const playerRef = useRef<YTPlayer | null>(null);
  const trackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<string>(`yt-player-${videoId}`);
  const [isReady, setIsReady] = useState(false);
  const hasRestoredRef = useRef(false);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (window.YT?.Player) {
      initPlayer();
      return;
    }

    // Only load once globally
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    // Wait for API to be ready
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      initPlayer();
    };

    // If already loaded but callback already fired
    const checkReady = setInterval(() => {
      if (window.YT?.Player) {
        clearInterval(checkReady);
        initPlayer();
      }
    }, 200);

    return () => {
      clearInterval(checkReady);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  const initPlayer = useCallback(() => {
    // Destroy previous player if exists
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }

    if (!window.YT?.Player) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: youtubeId,
      playerVars: {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: handleReady,
        onStateChange: handleStateChange,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  const handleReady = useCallback(
    (event: { target: YTPlayer }) => {
      setIsReady(true);

      // Restore playback position
      if (!hasRestoredRef.current) {
        const progress = getProgress(videoId);
        if (progress && !progress.completed && progress.current_time > 10) {
          event.target.seekTo(progress.current_time, true);
          hasRestoredRef.current = true;
        }
      }
    },
    [videoId, getProgress]
  );

  const handleStateChange = useCallback(
    (event: { data: number; target: YTPlayer }) => {
      const player = event.target;
      const state = event.data;

      // PLAYING
      if (state === 1) {
        // Start tracking interval
        if (trackIntervalRef.current) clearInterval(trackIntervalRef.current);
        trackIntervalRef.current = setInterval(() => {
          if (player.getPlayerState?.() === 1) {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (duration > 0) {
              updateProgress(videoId, currentTime, duration);
            }
          }
        }, TRACK_INTERVAL_MS);
      }

      // PAUSED
      if (state === 2) {
        if (trackIntervalRef.current) {
          clearInterval(trackIntervalRef.current);
          trackIntervalRef.current = null;
        }
        // Save immediately on pause
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
          updateProgress(videoId, currentTime, duration);
        }
      }

      // ENDED
      if (state === 0) {
        if (trackIntervalRef.current) {
          clearInterval(trackIntervalRef.current);
          trackIntervalRef.current = null;
        }
        markCompleted(videoId);
      }
    },
    [videoId, updateProgress, markCompleted]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackIntervalRef.current) clearInterval(trackIntervalRef.current);
      // Save final position
      if (playerRef.current) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0) {
            updateProgress(videoId, currentTime, duration);
          }
          playerRef.current.destroy();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl border border-white/5">
      {/* Loading state */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium">Loading player...</span>
          </div>
        </div>
      )}

      {/* Player container — YouTube API replaces this div */}
      <div
        id={containerRef.current}
        className="absolute inset-0 w-full h-full"
      />

      {/* Resume indicator */}
      {isReady && hasRestoredRef.current && (
        <ResumeIndicator />
      )}
    </div>
  );
}

function ResumeIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg border border-accent/30 animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2">
      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
      Resuming where you left off
    </div>
  );
}
