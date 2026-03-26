import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return Response.json(
        { error: "Missing title or description" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an automotive expert writing for AutoFlix, a Netflix-style platform for car videos.

Given this car video:
Title: ${title}
Description: ${description}

Write a concise, engaging summary (3-4 sentences) that:
1. Highlights the key points a car enthusiast would care about
2. Mentions specific specs or features if relevant
3. Gives a quick verdict or takeaway

Keep it conversational and informative. No markdown formatting.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return Response.json({ summary });
  } catch (error) {
    console.error("AI Summary error:", error);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
