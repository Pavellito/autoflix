/**
 * Centralized AI model configuration for AutoFlix.
 *
 * Supports three models via the same Gemini API key:
 *   1. gemini-2.0-flash   — Fast, cheap, good for simple tasks (default)
 *   2. gemma-4-31b-it     — Google's powerful open model, great for analysis & reasoning
 *   3. llama-3.1-8b-instant — Groq fallback (separate key)
 *
 * Set AI_MODEL env var to switch the primary model:
 *   AI_MODEL=gemma-4       → uses Gemma 4 31B
 *   AI_MODEL=gemini-flash  → uses Gemini 2.0 Flash (default)
 */

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import Groq from "groq-sdk";

// ---------------------------------------------------------------------------
// Model registry
// ---------------------------------------------------------------------------

const MODEL_MAP: Record<string, string> = {
  "gemini-flash": "gemini-2.0-flash",
  "gemma-4": "gemma-4-31b-it",
};

function resolveModelId(): string {
  const env = process.env.AI_MODEL || "gemini-flash";
  return MODEL_MAP[env] || env;
}

// ---------------------------------------------------------------------------
// Singletons (reused across requests within the same serverless invocation)
// ---------------------------------------------------------------------------

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return _genAI;
}

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });
  }
  return _groq;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the primary generative model (Gemini Flash or Gemma 4). */
export function getPrimaryModel(opts?: { jsonMode?: boolean }): GenerativeModel {
  const modelId = resolveModelId();
  return getGenAI().getGenerativeModel({
    model: modelId,
    ...(opts?.jsonMode && {
      generationConfig: { responseMimeType: "application/json" },
    }),
  });
}

/** Get the model name for logging. */
export function getPrimaryModelName(): string {
  return resolveModelId();
}

/** Generate content with automatic fallback to Groq. */
export async function generateWithFallback(
  prompt: string,
  opts?: { jsonMode?: boolean; temperature?: number }
): Promise<string> {
  const temp = opts?.temperature ?? 0.3;

  // Try primary model (Gemini Flash or Gemma 4)
  try {
    const model = getPrimaryModel({ jsonMode: opts?.jsonMode });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temp,
        ...(opts?.jsonMode && { responseMimeType: "application/json" }),
      },
    });
    const text = result.response.text();
    if (text) return text;
  } catch (err) {
    console.warn(`Primary AI (${resolveModelId()}) failed, falling back to Groq:`, err);
  }

  // Fallback to Groq
  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: temp,
    ...(opts?.jsonMode && { response_format: { type: "json_object" } }),
  });

  return completion.choices[0]?.message?.content || "";
}

/** Chat with the primary model (multi-turn conversation). */
export async function chatWithModel(
  messages: Array<{ role: "user" | "model"; content: string }>,
  systemInstruction?: string,
  opts?: { temperature?: number }
): Promise<string> {
  const temp = opts?.temperature ?? 0.3;

  // Try primary model
  try {
    const model = getGenAI().getGenerativeModel({
      model: resolveModelId(),
      ...(systemInstruction && { systemInstruction }),
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: temp },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    if (text) return text;
  } catch (err) {
    console.warn(`Primary AI chat (${resolveModelId()}) failed, falling back to Groq:`, err);
  }

  // Fallback to Groq
  const groq = getGroq();
  const groqMessages = messages.map((m) => ({
    role: m.role === "model" ? ("assistant" as const) : ("user" as const),
    content: m.content,
  }));
  if (systemInstruction) {
    groqMessages.unshift({ role: "user" as const, content: `System: ${systemInstruction}` });
  }

  const completion = await groq.chat.completions.create({
    messages: groqMessages,
    model: "llama-3.1-8b-instant",
    temperature: temp,
  });

  return completion.choices[0]?.message?.content || "";
}
