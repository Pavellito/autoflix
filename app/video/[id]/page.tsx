import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoById, videos as allVideos } from "@/app/lib/data";
import VideoCard from "@/app/components/VideoCard";
import AiSummary from "@/app/components/AiSummary";
import FavoriteButton from "@/app/components/FavoriteButton";
import ReviewSection from "@/app/components/ReviewSection";

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

  const related = allVideos
    .filter((v) => v.id !== video.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Full-width player */}
      <div className="w-full aspect-video bg-black max-h-[80vh]">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-[4%] py-8">
        {/* Video metadata */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-bold text-white leading-tight mb-3">
              {video.title}
            </h1>
            <div className="flex items-center gap-3 text-[14px]">
              <span className="text-[#46d369] font-bold">98% Match</span>
              <span className="text-white/60">{video.year}</span>
              <Link
                href={`/search?q=${video.category}`}
                className="border border-white/30 text-white/60 px-2 py-0.5 text-[12px] hover:text-white transition-colors"
              >
                {video.category}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FavoriteButton videoId={video.id} />
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-[14px] font-medium transition-colors text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        <p className="text-[#d2d2d2] text-[16px] max-w-3xl leading-relaxed mb-8">
          {video.description}
        </p>

        {/* AI Summary */}
        <AiSummary videoId={video.id} title={video.title} description={video.description} />

        {/* Reviews */}
        <ReviewSection targetId={video.id} targetTitle={video.title} />

        {/* Related videos */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-white/10 mt-12">
            <h2 className="text-[20px] font-bold text-white mb-4">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {related.slice(0, 8).map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
