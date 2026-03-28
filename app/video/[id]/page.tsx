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
      {/* Video player - full width Netflix style */}
      <div className="relative w-full aspect-video max-h-[70vh] bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Video details */}
      <div className="max-w-6xl mx-auto px-4 lg:px-14 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Title + actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <h1 className="text-white text-2xl lg:text-3xl font-bold">{video.title}</h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <FavoriteButton videoId={video.id} />
                <button className="w-10 h-10 border border-[#808080]/40 rounded-full flex items-center justify-center hover:border-white transition text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Netflix-style metadata */}
            <div className="flex items-center gap-3 mb-4 text-sm">
              <span className="text-[#46d369] font-bold">98% Match</span>
              <span className="text-[#bcbcbc]">{video.year}</span>
              <span className="maturity-badge text-[#bcbcbc]">{video.category}</span>
            </div>

            <p className="text-[#d2d2d2] text-base leading-relaxed mb-8">
              {video.description}
            </p>

            {/* AI Summary */}
            <AiSummary videoId={video.id} title={video.title} description={video.description} />

            {/* Reviews */}
            <ReviewSection targetId={`video-${video.id}`} targetTitle={video.title} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-[#181818] border border-[#333] rounded-[4px] p-5">
              <h3 className="text-white font-bold mb-3">About this video</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[#808080]">Category: </span>
                  <Link
                    href={`/search?q=${video.category}`}
                    className="text-white hover:underline"
                  >
                    {video.category}
                  </Link>
                </div>
                <div>
                  <span className="text-[#808080]">Year: </span>
                  <span className="text-white">{video.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More to watch */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-[#333] pt-8">
            <h2 className="text-white text-xl font-bold mb-4 px-0">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {related.slice(0, 10).map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
