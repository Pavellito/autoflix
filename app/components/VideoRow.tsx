import VideoCard from "./VideoCard";
import type { Video } from "@/app/lib/data";

export default function VideoRow({
  title,
  videos,
}: {
  title: string;
  videos: Video[];
}) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-3 px-4">{title}</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
