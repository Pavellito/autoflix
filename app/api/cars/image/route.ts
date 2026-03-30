import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/cars/image?make=BMW&model=X5&year=2026
 * Returns a real car photograph URL by searching Wikipedia
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const make = searchParams.get("make") || "";
  const model = searchParams.get("model") || "";
  const year = searchParams.get("year") || "2026";

  if (!make) {
    return NextResponse.json({ url: null });
  }

  // Try multiple Wikipedia article title patterns
  const queries = [
    `${make} ${model}`,
    `${make}_${model}`,
    `${make}_${model}_(${year})`,
    `${year}_${make}_${model}`,
  ];

  for (const query of queries) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
      const res = await fetch(wikiUrl, {
        headers: { "User-Agent": "AutoFlix/1.0 (car image lookup)" },
        next: { revalidate: 86400 }, // Cache for 24 hours
      });

      if (!res.ok) continue;

      const data = await res.json();
      const pages = data.query?.pages;
      if (!pages) continue;

      for (const pageId of Object.keys(pages)) {
        if (pageId === "-1") continue;
        const thumb = pages[pageId]?.thumbnail?.source;
        if (thumb) {
          return NextResponse.json(
            { url: thumb, source: "wikipedia" },
            { headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } }
          );
        }
      }
    } catch {
      continue;
    }
  }

  // Fallback: try a broader Wikipedia search
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${make} ${model} car`)}&format=json&srlimit=3`;
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "AutoFlix/1.0 (car image lookup)" },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      const results = data.query?.search || [];

      for (const result of results) {
        const title = result.title;
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
        const imgRes = await fetch(imgUrl, {
          headers: { "User-Agent": "AutoFlix/1.0 (car image lookup)" },
          next: { revalidate: 86400 },
        });

        if (!imgRes.ok) continue;

        const imgData = await imgRes.json();
        const pages = imgData.query?.pages;
        if (!pages) continue;

        for (const pageId of Object.keys(pages)) {
          if (pageId === "-1") continue;
          const thumb = pages[pageId]?.thumbnail?.source;
          if (thumb) {
            return NextResponse.json(
              { url: thumb, source: "wikipedia" },
              { headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } }
            );
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ url: null });
}
