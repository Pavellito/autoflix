import Link from "next/link";
import VideoCard from "@/app/components/VideoCard";
import type { Video } from "@/app/lib/data";
import SearchInput from "./SearchInput";

async function fetchSearch(query: string): Promise<{
  results: Video[];
  aiAnswer: string | null;
}> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { results: [], aiAnswer: null };
  }

  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const data = query ? await fetchSearch(query) : null;

  return (
    <div className="bg-[#141414] min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-14">
        <h1 className="text-white text-2xl font-bold mb-6">Search</h1>

        <SearchInput initialQuery={query} />

        {data && (
          <div className="mt-8">
            {/* AI Answer */}
            {data.aiAnswer && (
              <div className="mb-8 p-5 rounded-[4px] bg-[#181818] border border-[#333]">
                <h3 className="text-[#e50914] text-xs font-bold uppercase tracking-wider mb-2">
                  AI Answer
                </h3>
                <p className="text-[#d2d2d2] text-sm leading-relaxed">
                  {data.aiAnswer}
                </p>
              </div>
            )}

            {/* Results */}
            {data.results.length > 0 ? (
              <div>
                <p className="text-[#808080] text-sm mb-4">
                  {data.results.length} result{data.results.length !== 1 && "s"}{" "}
                  for &quot;{query}&quot;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {data.results.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[#808080]">
                No videos found for &quot;{query}&quot;. Try different keywords.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
