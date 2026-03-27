import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { cars } from "@/app/lib/data";

export async function POST(request: Request) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
  const GROQ_KEY = process.env.GROQ_API_KEY || "";

  if (!GEMINI_KEY && !GROQ_KEY) {
    return NextResponse.json({ error: "AI Providers not configured. Please add GEMINI_API_KEY/GROQ_API_KEY to environment." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const groq = new Groq({ apiKey: GROQ_KEY || "dummy_key" }); // Use dummy to prevent constructor crash if missing
  try {
    const { 
      budget, 
      region, 
      useCase, // "family", "commute", "performance", "adventure"
      familySize, 
      mileage, // "low", "medium", "high"
      language = "en" 
    } = await request.json();

    const carContext = cars.map(c => 
      `${c.name} (${c.brand}, Range: ${c.range}, Price in ${region}: ${c.prices?.[region as keyof typeof c.prices] || c.price})`
    ).join(", ");

    const prompt = `You are the AutoFlix AI Advisor. 
IMPORTANT: Your ID selection MUST exactly match one of these IDs: [${cars.map(c => c.id).join(", ")}].

User Profile:
- Region: ${region}
- Budget: ${budget}
- Use Case: ${useCase}
- Family Size: ${familySize}
- Daily Mileage: ${mileage}

Available Cars: [${carContext}]

Recommend exactly 3 primary cars from the list that best fit this profile, ordered by match percentage. 
Return ONLY a valid JSON object in ${language} language.

Structure:
{
  "recommendations": [
    {
      "carId": "car-1", // MUST BE EXACT ID from the list
      "why": "Specific 2-sentence reason for this user in their region. Mention technical specs like range or charging if relevant.",
      "score": 95 
    },
    ... (total 3)
  ],
  "expert_tip": "One expert advice sentence for this specific region/budget."
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
      console.warn("[AI Recommend] Gemini failed, falling back to Groq");
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });
      textResult = chatCompletion.choices[0]?.message?.content || "";
    }

    const responseData = JSON.parse(textResult.trim());
    
    // Strict Validation: Ensure AI only returns IDs that actually exist in our data.ts
    const validRecommendations = (responseData.recommendations || [])
      .filter((rec: any) => cars.some(c => c.id === rec.carId))
      .slice(0, 3);

    // Fallback if AI failed to provide valid IDs
    if (validRecommendations.length === 0) {
      validRecommendations.push({
        carId: "car-1",
        why: "The Tesla Model 3 is a versatile all-rounder that fits most electric lifestyles perfectly.",
        score: 90
      });
    }

    return NextResponse.json({
      ...responseData,
      recommendations: validRecommendations,
      region: region || "us"
    });
  } catch (error: any) {
    console.error("[Recommendation API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
