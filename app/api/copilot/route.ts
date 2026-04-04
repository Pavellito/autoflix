import { NextResponse } from "next/server";
import { chatWithModel, getPrimaryModelName } from "@/app/lib/ai";
import { fetchAllCars } from "@/app/lib/supabase-cars";

export async function POST(req: Request) {
  try {
    const cars = await fetchAllCars();

    const { messages, favorites } = await req.json();
    const favs = Array.isArray(favorites) ? favorites : [];

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    // Identify user's favorites
    const favoriteCars = cars.filter(c => favs.includes(c.id)).map(c => `${c.brand} ${c.name}`).join(", ");
    const userContext = favs.length > 0 
      ? `\n[USER PERSONALIZATION]\nThe user has expressing strong interest in (saved to garage): ${favoriteCars}. \nPrioritize comparisons or help related to these models if relevant.`
      : "";

    // Build the Knowledge Graph Context from the hardcoded EV catalog
    const evDataStr = cars.map(c => 
      `Model: ${c.brand} ${c.name}
Type: ${c.type}
Range: ${c.range}
Battery: ${c.battery}
Global Price: ${c.price}
Israel Price: ${c.prices?.il || 'N/A'}
Russia Price: ${c.prices?.ru || 'N/A'}
Advice (IL): ${c.regionalAdvice?.il || 'N/A'}`
    ).join("\n\n");

    const systemPrompt = `You are AutoFlix Copilot, an elite automotive AI assistant for an advanced EV intelligence platform.
Your goal is to provide deeply technical, hyper-personalized, and completely authoritative advice on Electric Vehicles.
Use the following proprietary AutoFlix Database to answer the user's questions definitively. 

[AUTOFLIX DATABASE]
${evDataStr}

${userContext}

Rules for Responses:
1. Be concise, punchy, and highly analytical. 
2. If the user asks for a comparison, structure it cleanly.
3. If they ask about Israel/Russia/Middle East, heavily rely on the specific 'Advice' context provided.
4. Format using Markdown (bullet points, bold text).
5. Never break character. You are the AutoFlix Intelligence Engine.`;

    // Convert message history to our unified format
    const chatMessages = [
      { role: "user" as const, content: "SYSTEM PROMPT (ADHERE STRICTLY):\n" + systemPrompt },
      { role: "model" as const, content: "Understood. I am AutoFlix Copilot. I will use the database strictly." },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: (msg.role === "user" ? "user" : "model") as "user" | "model",
        content: msg.content,
      })),
    ];

    const modelName = getPrimaryModelName();
    console.log(`[Copilot] Using AI model: ${modelName}`);

    const reply = await chatWithModel(chatMessages, undefined, { temperature: 0.3 });
    return NextResponse.json({ reply: reply || "Neural link active, but response was empty." });

  } catch (error: any) {
    console.error("[Copilot API Error]", error);
    return NextResponse.json({ error: `Neural link offline. ${error.message}` }, { status: 500 });
  }
}
