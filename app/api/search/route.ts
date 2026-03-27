import { GoogleGenerativeAI } from "@google/generative-ai";
import { videos } from "@/app/lib/data";
import type { Video } from "@/app/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

function searchVideos(query: string): Video[] {
  const q = query.toLowerCase();
  return videos.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  // Find matching videos
  const results = searchVideos(query);

  // Generate AI answer if key is configured
  let aiAnswer: string | null = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const videoContext = results
        .slice(0, 5)
        .map((v) => `- ${v.title}: ${v.description}`)
        .join("\n");

      const prompt = `You are an automotive expert on AutoFlix, a car video platform.

User searched: "${query}"

${results.length > 0 ? `Matching videos:\n${videoContext}` : "No matching videos found."}

Give a helpful, concise answer (2-3 sentences) about their query from a car enthusiast perspective. If there are matching videos, mention the most relevant ones. If no matches, suggest what they might search for instead. No markdown.`;

      const result = await model.generateContent(prompt);
      aiAnswer = result.response.text();
    } catch (error) {
      console.error("AI search error:", error);
    }
  }

  return Response.json({ results, aiAnswer });
}
