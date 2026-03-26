import HeroBanner from "@/app/components/HeroBanner";
import VideoRow from "@/app/components/VideoRow";
import { categories, getVideosByCategory, videos } from "@/app/lib/data";

export default function Home() {
  const featured = videos[0];

  return (
    <div>
      <HeroBanner video={featured} />
      <div className="space-y-2">
        {categories.map((category) => (
          <VideoRow
            key={category}
            title={category}
            videos={getVideosByCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}
