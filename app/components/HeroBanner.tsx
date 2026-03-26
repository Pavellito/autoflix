import Link from "next/link";
import type { Video } from "@/app/lib/data";

export default function HeroBanner({ video }: { video: Video }) {
  return (
    <div className="relative h-[70vh] mb-8 bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

      {/* Hero content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-16 px-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-3">{video.title}</h1>
        <p className="text-gray-300 text-base mb-6 line-clamp-3">
          {video.description}
        </p>
        <div className="flex gap-3">
          <Link
            href={`/video/${video.id}`}
            className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
          >
            ▶ Play
          </Link>
          <Link
            href={`/video/${video.id}`}
            className="bg-gray-600/70 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600 transition"
          >
            ℹ More Info
          </Link>
        </div>
      </div>
    </div>
  );
}
