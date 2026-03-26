import HeroBanner from "@/app/components/HeroBanner";
import VideoRow from "@/app/components/VideoRow";
import { categories, getVideosByCategory } from "@/app/lib/data";

export default function Home() {
  // Get all trending videos for the hero banner
  const trendingVideos = getVideosByCategory("Trending");
  // Select a random video, or fallback to the first one if none exist
  const featured =
    trendingVideos[Math.floor(Math.random() * trendingVideos.length)] ||
    trendingVideos[0];

  return (
    <div>
      {featured && <HeroBanner video={featured} />}
      <div className="space-y-4 pb-8">
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
