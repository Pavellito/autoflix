import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoById, videos as allVideos } from "@/app/lib/data";
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

  // Get random related videos instead of just the same category
  // This makes the UI look more filled out
  const related = allVideos
    .filter((v) => v.id !== video.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

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
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-6 shadow-2xl border border-white/5">
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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {video.title}
          </h1>
          <button className="flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-6">
          <span className="font-semibold text-white/90">{video.year}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <Link 
            href={`/search?q=${video.category}`}
            className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold hover:bg-accent/30 transition-colors"
          >
            {video.category}
          </Link>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            Youtube integration
          </span>
        </div>
        
        <p className="text-gray-300 text-base max-w-4xl leading-relaxed">
          {video.description}
        </p>

        <AiSummary title={video.title} description={video.description} />
      </div>

      {/* Related videos */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">More to Watch</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.slice(0, 8).map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
