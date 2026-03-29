import { NextRequest, NextResponse } from "next/server";
import { RSS_SOURCES, fetchRSSFeed } from "@/app/lib/rss";

const REGION_LABELS: Record<string, string> = {
  global: "Global",
  il: "Israel",
  ru: "Russia",
  ar: "Arabic",
};

/**
 * GET /api/news/car?make=BMW&model=X5&year=2026
 * Fetches region-specific automotive news matching the car
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const make = searchParams.get("make") || "";
  const model = searchParams.get("model") || "";

  if (!make) {
    return NextResponse.json({ articles: [] });
  }

  // Build search terms for matching
  const searchTerms = [
    make.toLowerCase(),
    model.toLowerCase(),
    `${make} ${model}`.toLowerCase(),
  ].filter(Boolean);

  try {
    // Fetch all RSS sources in parallel
    const feedResults = await Promise.all(
      RSS_SOURCES.map(async (source) => {
        try {
          const items = await fetchRSSFeed(source.url);
          return items.map((item: {
            title?: string;
            link?: string;
            pubDate?: string;
            imageUrl?: string;
            contentSnippet?: string;
          }) => ({
            ...item,
            source: source.name,
            sourceId: source.id,
            region: source.region,
            regionLabel: REGION_LABELS[source.region] || source.region,
          }));
        } catch {
          return [];
        }
      })
    );

    const allArticles = feedResults.flat();

    // Filter articles matching the car (search in title and content)
    const matched = allArticles.filter((article) => {
      const text = `${article.title || ""} ${article.contentSnippet || ""}`.toLowerCase();
      // Match if any search term appears in the article
      return searchTerms.some((term) => text.includes(term));
    });

    // Sort by date (newest first) and deduplicate
    const seen = new Set<string>();
    const unique = matched
      .sort((a, b) => {
        const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return db - da;
      })
      .filter((a) => {
        const key = (a.title?.toLowerCase().trim() || a.link || String(Math.random()));
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    // If no car-specific articles, return general automotive news by region
    const articles = unique.length > 0
      ? unique.slice(0, 15)
      : allArticles
          .sort((a, b) => {
            const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return db - da;
          })
          .slice(0, 12);

    return NextResponse.json({
      articles: articles.map((a) => ({
        title: a.title,
        link: a.link,
        source: a.source,
        region: a.region,
        regionLabel: a.regionLabel,
        pubDate: a.pubDate,
        imageUrl: a.imageUrl,
        snippet: a.contentSnippet?.slice(0, 200),
      })),
      matchedCount: unique.length,
      totalScanned: allArticles.length,
    });
  } catch (err) {
    console.error("[News API Error]", err);
    return NextResponse.json({ articles: [], error: "Failed to fetch news" });
  }
}
