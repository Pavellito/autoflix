import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoById, getVideosByCategory } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";
import AiSummary from "@/app/components/AiSummary";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  const related = getVideosByCategory(video.category).filter(
    (v) => v.id !== video.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* Video player */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-6">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Video info */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>{video.year}</span>
          <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-xs">
            {video.category}
          </span>
        </div>
        <p className="text-gray-300 max-w-3xl">{video.description}</p>

        <AiSummary title={video.title} description={video.description} />
      </div>

      {/* Related videos */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            More in {video.category}
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {related.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
