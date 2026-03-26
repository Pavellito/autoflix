import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { cars } from "@/app/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
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

Recommend exactly 2 cars from the list that best fit this profile. 
Return ONLY a valid JSON object in ${language} language.

Structure:
{
  "recommendations": [
    {
      "carId": "car-1", // MUST BE EXACT ID from the list
      "why": "Specific 2-sentence reason for this user in their region.",
      "score": 95 
    },
    {
      "carId": "car-5", // MUST BE EXACT ID from the list
      "why": "Specific 2-sentence reason.",
      "score": 88
    }
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

    return NextResponse.json(JSON.parse(textResult.trim()));
  } catch (error: any) {
    console.error("[Recommendation API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
