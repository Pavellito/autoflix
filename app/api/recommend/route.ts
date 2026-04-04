import { NextResponse } from "next/server";
import { generateWithFallback, getPrimaryModelName } from "@/app/lib/ai";
import { fetchAllCars } from "@/app/lib/supabase-cars";

export async function POST(request: Request) {
  try {
    const cars = await fetchAllCars();

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

    console.log(`[Recommend] Using model: ${getPrimaryModelName()}`);
    const textResult = await generateWithFallback(prompt, { jsonMode: true, temperature: 0.3 });

    const responseData = JSON.parse(textResult.trim());
    
    const validRecommendations = (responseData.recommendations || [])
      .filter((rec: any) => cars.some(c => c.id === rec.carId))
      .slice(0, 3)
      .map((rec: any) => ({
        ...rec,
        car: cars.find(c => c.id === rec.carId)
      }));

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
