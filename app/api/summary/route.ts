import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { supabase } from "@/app/lib/supabase";

// Initialize providers (keys will be validated inside the route function)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// Language map for proper prompt context
const languageMap: Record<string, string> = {
  en: "English",
  he: "Hebrew (עברית)",
  ru: "Russian (Русский)",
  ar: "Arabic (العربية)",
};

export async function POST(request: Request) {
  try {
    const { videoId, title, description, language = "en" } = await request.json();

    if (!videoId || !title || !description) {
      return Response.json({ error: "Missing videoId, title or description" }, { status: 400 });
    }

    const targetLanguage = languageMap[language] || "English";

    // 0. Check Cache First
    try {
      const { data: cachedSummary, error: cacheError } = await supabase
        .from("summaries")
        .select("content")
        .eq("video_id", videoId)
        .eq("language", language)
        .single();
        
      if (!cacheError && cachedSummary) {
        console.log(`[AI Pipeline] Cache HIT for ${videoId} in ${language}. Saving tokens!`);
        return Response.json(cachedSummary.content);
      }
    } catch (e) {
      console.warn("[AI Pipeline] Cache lookup failed, proceeding to generation:", e);
    }

    // 1. Build the specialized Prompt (Vision 2.0 Style)
    const prompt = `You are a world-class automotive journalist and expert at AutoFlix.
Analyze this car-related content:
Title: ${title}
Description: ${description}

Return a high-quality, structured analysis in EXACTLY THIS LANGUAGE: ${targetLanguage}.
If the language is Hebrew, make sure to use professional automotive terminology.

Return ONLY a valid JSON object with the following fields:
1. "summary": A concise 2-3 sentence overview highlighting the key aspects.
2. "key_points": Array of 3-4 most important technical or market facts.
3. "pros": Array of 3 specific strengths.
4. "cons": Array of 3 specific weaknesses.
5. "verdict": A 1-sentence powerful final recommendation.
6. "tags": Array of 3-4 relevant tags (e.g., "EV", "SUV", "Luxury", "Budget").
7. "category": One of [EV, SUV, Sedan, Luxury, Performance, News, Review].

Structure Example:
{
  "summary": "...",
  "key_points": ["...", "...", "..."],
  "pros": ["...", "...", "..."],
  "cons": ["...", "...", "..."],
  "verdict": "...",
  "tags": ["...", "..."],
  "category": "..."
}
Do not include any markdown backticks or extra text.`;

    let textResult = "";

    // 2. Fallback Cascade Logic
    try {
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

      // Attempt 1: Gemini 2.0 Flash (Primary)
      console.log(`[AI Pipeline] Attempting Gemini API for ${targetLanguage}...`);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await model.generateContent(prompt);
      textResult = result.response.text();
      console.log(`[AI Pipeline] Gemini API Success!`);
    } catch (geminiError: any) {
      console.warn(`[AI Pipeline] Gemini failed:`, geminiError.message);
      
      // Attempt 2: Groq Fallback
      if (!process.env.GROQ_API_KEY) {
        throw new Error("Gemini failed and no GROQ_API_KEY available for fallback.");
      }

      console.log(`[AI Pipeline] Attempting Groq API Fallback (llama-3.1-8b-instant)...`);
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });
      
      textResult = chatCompletion.choices[0]?.message?.content || "";
      console.log(`[AI Pipeline] Groq API Success!`);
    }

    // 3. Parse and Validate the Result
    textResult = textResult.trim();
    if (textResult.startsWith("\`\`\`json")) {
      textResult = textResult.substring(7);
      if (textResult.endsWith("\`\`\`")) textResult = textResult.substring(0, textResult.length - 3);
    } else if (textResult.startsWith("\`\`\`")) {
      textResult = textResult.substring(3);
      if (textResult.endsWith("\`\`\`")) textResult = textResult.substring(0, textResult.length - 3);
    }

    let structuredData;
    try {
      structuredData = JSON.parse(textResult);
    } catch (e: any) {
      console.error("Failed to parse AI JSON:", textResult);
      throw new Error("Invalid AI response format: " + e.message);
    }

    // 4. Save to Cache
    try {
      await supabase.from("summaries").upsert(
        {
          video_id: videoId,
          language: language,
          content: structuredData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'video_id,language' }
      );
      console.log(`[AI Pipeline] Successfully cached ${targetLanguage} summary for ${videoId}`);
    } catch (e) {
      console.warn("[AI Pipeline] Failed to cache generated summary:", e);
    }

    return Response.json(structuredData);
  } catch (error: any) {
    console.error("AI Summary error cascade:", error);
    return Response.json(
      { error: error?.message || "Failed to generate summary across all providers" },
      { status: 500 }
    );
  }
}
