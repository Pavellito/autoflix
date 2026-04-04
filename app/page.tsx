import { fetchAllCars } from "./lib/supabase-cars";
import { getVideosByCategory, type Video } from "./lib/data";
import { getDiscoveredVideos } from "./lib/youtube-api";
import { dateSeededShuffle } from "./lib/rotation";
import HomeContent from "./components/HomeContent";

export const dynamic = "force-dynamic";

function mergeAndShuffle(hardcoded: Video[], discovered: { videoId: string; title: string; thumbnail: string; channelTitle: string; publishedAt: string; description: string }[]): Video[] {
  // Convert discovered videos to Video format
  const fresh: Video[] = discovered.map((d) => ({
    id: `yt-${d.videoId}`,
    title: d.title,
    thumbnail: d.thumbnail,
    category: "Reviews",
    year: new Date().getFullYear(),
    description: d.description || `By ${d.channelTitle}`,
    youtubeId: d.videoId,
  }));
  // Fresh discovered videos first, then hardcoded as fallback
  const merged = [...fresh, ...hardcoded];
  // Deduplicate by youtubeId
  const seen = new Set<string>();
  const unique = merged.filter((v) => {
    const key = v.youtubeId || v.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return dateSeededShuffle(unique).slice(0, 15);
}

export default async function Home() {
  const [cars, discoveredTrending, discoveredReviews, discoveredComparisons, discoveredEV] = await Promise.all([
    fetchAllCars(),
    getDiscoveredVideos("Trending", 10),
    getDiscoveredVideos("Reviews", 10),
    getDiscoveredVideos("Comparisons", 10),
    getDiscoveredVideos("Electric Cars", 10),
  ]);

  const trending = mergeAndShuffle(getVideosByCategory("Trending"), discoveredTrending);
  const reviews = mergeAndShuffle(getVideosByCategory("Reviews"), discoveredReviews);
  const comparisons = mergeAndShuffle(getVideosByCategory("Comparisons"), discoveredComparisons);
  const evVideos = mergeAndShuffle(getVideosByCategory("Electric Cars"), discoveredEV);

  return <HomeContent cars={dateSeededShuffle(cars)} trending={trending} reviews={reviews} comparisons={comparisons} evVideos={evVideos} />;
}
