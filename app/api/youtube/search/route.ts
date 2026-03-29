import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeVideos } from "@/app/lib/youtube-api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const year = searchParams.get("year");
  const carSlug = searchParams.get("carSlug");

  if (!make || !model) {
    return NextResponse.json(
      { error: "make and model are required" },
      { status: 400 }
    );
  }

  const slug = carSlug || `${make}-${model}-${year || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const yearNum = year ? parseInt(year, 10) : undefined;

  const videos = await fetchYouTubeVideos(slug, make, model, yearNum);

  return NextResponse.json({ videos }, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
