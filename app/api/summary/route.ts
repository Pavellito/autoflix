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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are an automotive expert writing for AutoFlix, a Netflix-style platform for car videos.

Given this car video:
Title: ${title}
Description: ${description}

Write a concise, engaging summary that includes:
1. "summary": A 2-3 sentence overview highlighting the key points.
2. "pros": An array of 3 brief positive points or strengths.
3. "cons": An array of 3 brief negative points or weaknesses.
4. "verdict": A 1 sentence final takeaway.

Return ONLY a valid JSON object matching this structure:
{
  "summary": "...",
  "pros": ["...", "...", "..."],
  "cons": ["...", "...", "..."],
  "verdict": "..."
}
No markdown blocks, no other text, just the raw JSON.`;

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    
    let structuredData;
    try {
      structuredData = JSON.parse(textResult);
    } catch (e: any) {
      console.error("Failed to parse Gemini JSON:", textResult);
      throw new Error("Invalid AI response format: " + e.message);
    }

    return Response.json(structuredData);
  } catch (error: any) {
    console.error("AI Summary error:", error);
    return Response.json(
      { error: error?.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
