import Link from "next/link";
import VideoCard from "@/app/components/VideoCard";
import type { Video } from "@/app/lib/data";
import SearchInput from "./SearchInput";

async function fetchSearch(query: string): Promise<{
  results: Video[];
  aiAnswer: string | null;
}> {
  // Server-side fetch to our own API
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

      <SearchInput initialQuery={query} />

      {data && (
        <div className="mt-8">
          {/* AI Answer */}
          {data.aiAnswer && (
            <div className="mb-8 p-4 rounded-lg bg-card-bg border border-white/10">
              <h3 className="text-sm font-semibold text-accent mb-2">
                AI Answer
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {data.aiAnswer}
              </p>
            </div>
          )}

          {/* Results */}
          {data.results.length > 0 ? (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                {data.results.length} result{data.results.length !== 1 && "s"}{" "}
                for &quot;{query}&quot;
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data.results.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              No videos found for &quot;{query}&quot;. Try different keywords.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
