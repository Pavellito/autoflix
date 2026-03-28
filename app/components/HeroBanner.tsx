import Link from "next/link";
import type { Video } from "@/app/lib/data";

export default function HeroBanner({ video }: { video: Video }) {
  return (
    <div className="relative h-[56.25vw] max-h-[80vh] min-h-[400px] bg-black overflow-hidden">
      {/* Background Video (Muted Autoplay) */}
      <div className="absolute inset-0 w-full h-[140%] -top-[20%] z-0 pointer-events-none">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.youtubeId}&modestbranding=1&playsinline=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Netflix-style gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent z-10" />

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-[8%] px-4 lg:px-14 max-w-2xl">
        <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3">{video.title}</h1>
        <p className="text-[#d2d2d2] text-base lg:text-lg mb-6 line-clamp-3">
          {video.description}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/video/${video.id}`}
            className="flex items-center gap-2 bg-white text-black px-6 lg:px-8 py-2.5 rounded-[4px] text-base lg:text-lg font-bold hover:bg-white/80 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </Link>
          <Link
            href={`/video/${video.id}`}
            className="flex items-center gap-2 bg-[#6d6d6eb3] text-white px-6 lg:px-8 py-2.5 rounded-[4px] text-base lg:text-lg font-bold hover:bg-[#6d6d6e99] transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Link>
        </div>
        {/* Maturity badge */}
        <div className="flex items-center gap-3 mt-4">
          <span className="maturity-badge text-white">HD</span>
          <span className="text-[#bcbcbc] text-sm">{video.category}</span>
        </div>
      </div>
    </div>
  );
}
