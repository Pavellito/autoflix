import Link from "next/link";
import type { Video } from "@/app/lib/data";
import FavoriteButton from "./FavoriteButton";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex-shrink-0 w-[250px] rounded-md overflow-hidden bg-card-bg hover:scale-105 transition-transform duration-200 hover:z-10"
    >
      <div className="relative aspect-video bg-gray-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Favorite button - visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavoriteButton videoId={video.id} size="sm" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{video.year}</p>
      </div>
    </Link>
  );
}
