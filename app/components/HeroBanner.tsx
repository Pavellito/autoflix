import Link from "next/link";
import type { Video } from "@/app/lib/data";

export default function HeroBanner({ video }: { video: Video }) {
  return (
    <div className="relative h-[70vh] mb-8 bg-black overflow-hidden group">
      {/* Background Video (Muted Autoplay) */}
      <div className="absolute inset-0 w-full h-[140%] -top-[20%] z-0 pointer-events-none">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.youtubeId}&modestbranding=1&playsinline=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full object-cover opacity-70 transition-opacity duration-1000"
        />
      </div>

      {/* Background gradients for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-16 px-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{video.title}</h1>
        <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3 drop-shadow-md">
          {video.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/video/${video.id}`}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
            Play
          </Link>
          <Link
            href={`/video/${video.id}`}
            className="flex items-center gap-2 bg-gray-500/60 text-white px-8 py-3 rounded text-lg font-bold hover:bg-gray-500/80 transition-colors backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            More Info
          </Link>
          
          <Link
            href="/quiz"
            className="flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-8 py-3 rounded text-lg font-bold hover:bg-accent/30 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(229,9,20,0.3)]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.736 14h10.528A5.002 5.002 0 0112 19a5.002 5.002 0 01-5.264-5z" /></svg>
            Help Me Choose
          </Link>
        </div>
      </div>
    </div>
  );
}
