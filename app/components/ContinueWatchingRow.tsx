"use client";

import { useWatchProgress } from "@/app/lib/watch-progress-context";
import { getVideoById } from "@/app/lib/data";
import VideoCard from "./VideoCard";

export default function ContinueWatchingRow() {
  const { continueWatching, loading } = useWatchProgress();

  // Don't render anything while loading or if there's nothing to continue
  if (loading || continueWatching.length === 0) return null;

  // Resolve video data from IDs
  const videos = continueWatching
    .map((entry) => getVideoById(entry.video_id))
    .filter(Boolean);

  if (videos.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-3 px-4">
        <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
        <span className="bg-accent/20 text-accent text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
          {videos.length}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {videos.map((video) => (
          <VideoCard key={video!.id} video={video!} />
        ))}
      </div>
    </section>
  );
}
