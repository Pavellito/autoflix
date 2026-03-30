import { fetchAllCars } from "./lib/supabase-cars";
import { getVideosByCategory } from "./lib/data";
import HomeContent from "./components/HomeContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cars = await fetchAllCars();
  const trending = getVideosByCategory("Trending");
  const reviews = getVideosByCategory("Reviews");
  const comparisons = getVideosByCategory("Comparisons");
  const evVideos = getVideosByCategory("Electric Cars");

  return <HomeContent cars={cars} trending={trending} reviews={reviews} comparisons={comparisons} evVideos={evVideos} />;
}
