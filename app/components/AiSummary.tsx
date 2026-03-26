"use client";

import { useState } from "react";

export default function AiSummary({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [summary, setSummary] = useState<string | null>(null);
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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate summary");
        return;
      }

      setSummary(data.summary);
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-4 rounded-lg bg-card-bg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-accent">AI Summary</h3>
        {!summary && !loading && (
          <button
            onClick={generateSummary}
            className="text-xs bg-accent hover:bg-accent/80 text-white px-3 py-1 rounded transition-colors"
          >
            Generate
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Generating AI summary...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400">
          {error}
          <button
            onClick={generateSummary}
            className="ml-2 text-accent underline"
          >
            Retry
          </button>
        </div>
      )}

      {summary && (
        <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}
