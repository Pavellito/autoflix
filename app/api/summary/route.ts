import { generateWithFallback, getPrimaryModelName } from "@/app/lib/ai";
import { supabase } from "@/app/lib/supabase";

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
        return Response.json(cachedSummary.content);
      }
    } catch (e) {
      console.warn("[AI Pipeline] Cache lookup failed:", e);
    }

    // 1. Build the specialized Prompt (Vision 2.0 Style)
    const prompt = `You are a world-class automotive journalist and expert at AutoFlix.
Analyze this car-related content:
Title: ${title}
Description: ${description}

Return a high-quality, structured analysis in EXACTLY THIS LANGUAGE: ${targetLanguage}.
Return ONLY a valid JSON object with the following fields: 
"summary", "key_points", "pros", "cons", "verdict", "tags", "category".
Do not include markdown backticks.`;

    console.log(`[Summary] Using model: ${getPrimaryModelName()}`);
    const textResult = await generateWithFallback(prompt, { jsonMode: true, temperature: 0.3 });

    // 3. Parse and Validate
    const structuredData = JSON.parse(textResult.trim());

    // 4. Save to Cache
    try {
      await supabase.from("summaries").upsert({
        video_id: videoId,
        language: language,
        content: structuredData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'video_id,language' });
    } catch (e) {
      console.warn("[AI Pipeline] Failed to cache:", e);
    }

    return Response.json(structuredData);
  } catch (error: any) {
    console.error("AI Summary error cascade:", error);
    return Response.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}
