"use client";

import { useWatchProgress } from "@/app/lib/watch-progress-context";
import { getVideoById, type Video } from "@/app/lib/data";
import VideoCard from "./VideoCard";

function buildYtVideo(videoId: string): Video {
  const youtubeId = videoId.slice(3); // strip "yt-"
  return {
    id: videoId,
    title: "Video",
    thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    category: "Reviews",
    year: new Date().getFullYear(),
    description: "",
    youtubeId,
  };
}

export default function ContinueWatchingRow() {
  const { continueWatching, loading } = useWatchProgress();

  // Show skeleton while loading
  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-3 px-4">
          <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[calc(100vw/4.3)] rounded overflow-hidden bg-white/5 animate-pulse">
              <div className="aspect-video bg-white/10" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (continueWatching.length === 0) return null;

  // Resolve video data from IDs, with fallback for yt-* YouTube videos
  const videos = continueWatching
    .map((entry) => {
      const local = getVideoById(entry.video_id);
      if (local) return local;
      if (entry.video_id.startsWith("yt-")) return buildYtVideo(entry.video_id);
      return undefined;
    })
    .filter(Boolean) as Video[];

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
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
