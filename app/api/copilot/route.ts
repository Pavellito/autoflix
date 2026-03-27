import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { fetchAllCars } from "@/app/lib/supabase-cars";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    // Convert OpenAI-style message history to Gemini format
    const geminiHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    try {
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: "SYSTEM PROMPT (ADHERE STRICTLY):\n" + systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I am AutoFlix Copilot. I will use the database strictly." }] },
          ...geminiHistory
        ],
        generationConfig: {
          temperature: 0.3, // Low temperature for factual EV analysis
        }
      });

      const result = await chat.sendMessage(lastMessage);
      const text = result.response.text();
      return NextResponse.json({ reply: text });

    } catch (geminiError) {
      console.warn("[Copilot API] Gemini failed, falling back to Groq Llama 3...");
      
      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages.slice(0, -1).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: lastMessage }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: groqMessages as any,
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
      });

      const fallbackText = chatCompletion.choices[0]?.message?.content || "Neural link active, but response was empty.";
      return NextResponse.json({ reply: fallbackText });
    }

  } catch (error: any) {
    console.error("[Copilot API Error]", error);
    return NextResponse.json({ error: `Neural link offline. ${error.message}` }, { status: 500 });
  }
}
