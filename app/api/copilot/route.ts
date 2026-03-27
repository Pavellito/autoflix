import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cars } from "@/app/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

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
Use the following proprietary AutoFlix Database to answer the user's questions definitively. Do NOT say "I don't have real-time access", act as if this database is the absolute truth.

[AUTOFLIX DATABASE]
${evDataStr}

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

  } catch (error: any) {
    console.error("[Copilot API Error]", error);
    return NextResponse.json({ error: "Neural link offline. Please try again later." }, { status: 500 });
  }
}
