"use client";

import { useState } from "react";

interface SummaryData {
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export default function AiSummary({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateSummary() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setError(resData.error || "Failed to generate summary");
        return;
      }

      setData(resData);
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-5 rounded-lg bg-card-bg border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-base font-semibold text-white">AI Analysis</h3>
        </div>
        {!data && !loading && (
          <button
            onClick={generateSummary}
            className="text-xs font-medium bg-accent hover:bg-accent/80 text-white px-4 py-1.5 rounded transition-colors"
          >
            Generate
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-sm text-gray-400 py-4">
          <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Analyzing video content...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 py-2">
          {error}
          <button
            onClick={generateSummary}
            className="ml-3 text-accent underline hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-gray-600 pl-3">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-black/30 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Pros
              </h4>
              <ul className="text-xs text-gray-300 space-y-1.5">
                {data.pros.map((pro, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500/50">•</span> {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black/30 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Cons
              </h4>
              <ul className="text-xs text-gray-300 space-y-1.5">
                {data.cons.map((con, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500/50">•</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-semibold text-white mb-1">Verdict</h4>
            <p className="text-sm text-accent font-medium">{data.verdict}</p>
          </div>
        </div>
      )}
    </div>
  );
}
