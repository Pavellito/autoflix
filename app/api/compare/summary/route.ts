import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { supabase } from "@/app/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { car1, car2, language = "en" } = await request.json();

    if (!car1 || !car2) {
      return NextResponse.json({ error: "Missing car data" }, { status: 400 });
    }

    const prompt = `You are a world-class automotive comparison expert at AutoFlix.
Compare these two vehicles side-by-side:
Vehicle 1: ${car1.brand} ${car1.name} (${car1.type}, Range: ${car1.range}, Price: ${car1.price})
Vehicle 2: ${car2.brand} ${car2.name} (${car2.type}, Range: ${car2.range}, Price: ${car2.price})

Return a professional, high-impact comparison analysis in EXACTLY THIS LANGUAGE CODE: ${language}.
If the language is Hebrew, use professional Israeli automotive terminology.

Return ONLY a valid JSON object with:
1. "comparison_summary": 2-3 sentences comparing their market positions.
2. "winner_verdict": A clear statement of who wins for which type of buyer.
3. "key_differences": Array of 3 specific technical or interior differences.
4. "regional_buying_tip": One specific advice for buyers in Israel/Russia/Middle East.

Structure:
{
  "comparison_summary": "...",
  "winner_verdict": "...",
  "key_differences": ["...", "...", "..."],
  "regional_buying_tip": "..."
}
Do not include markdown backticks.`;

    let textResult = "";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await model.generateContent(prompt);
      textResult = result.response.text();
    } catch (e) {
      console.warn("[AI Comparison] Gemini failed, falling back to Groq");
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });
      textResult = chatCompletion.choices[0]?.message?.content || "";
    }

    return NextResponse.json(JSON.parse(textResult.trim()));
  } catch (error: any) {
    console.error("[Comparison API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
