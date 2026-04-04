import { NextResponse } from "next/server";
import { generateWithFallback, getPrimaryModelName } from "@/app/lib/ai";

/**
 * POST /api/ai/analyze
 * AI analysis for a single car — pros, cons, verdict, regional tips, competitors
 */
export async function POST(request: Request) {
  try {
    const { make, model, year, carType, vehicleClass } = await request.json();

    if (!make || !model) {
      return NextResponse.json({ error: "Missing make/model" }, { status: 400 });
    }

    const prompt = `You are an expert automotive analyst at AutoFlix, a premium car intelligence platform.

Analyze this vehicle: ${year || "2026"} ${make} ${model}
Type: ${carType || "Unknown"}
Class: ${vehicleClass || "Unknown"}

Return ONLY a valid JSON object with:
1. "summary": 2-3 sentences overview of this vehicle's market position, key strengths, and who it's for.
2. "pros": Array of 4-5 specific advantages (technical, value, comfort, reliability).
3. "cons": Array of 3-4 honest disadvantages or weaknesses.
4. "verdict": One clear sentence — who should buy this car and why.
5. "regionalTip": Specific advice for buyers in Israel, Russia, or Middle East markets (import taxes, availability, service networks, climate suitability).
6. "competitors": Array of 3-5 direct competitor vehicles (format: "Brand Model").

Structure:
{
  "summary": "...",
  "pros": ["...", "...", "...", "..."],
  "cons": ["...", "...", "..."],
  "verdict": "...",
  "regionalTip": "...",
  "competitors": ["Brand Model", "Brand Model", "Brand Model"]
}
Do not include markdown backticks. Return pure JSON only.`;

    console.log(`[AI Analyze] Using model: ${getPrimaryModelName()}`);
    const textResult = await generateWithFallback(prompt, { jsonMode: true, temperature: 0.3 });
    const parsed = JSON.parse(textResult.trim());
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[AI Analyze Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
