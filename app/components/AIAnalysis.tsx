"use client";

import { useEffect, useState } from "react";

interface AnalysisData {
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
  regionalTip: string;
  competitors: string[];
}

interface Props {
  make: string;
  model: string;
  year?: number;
  carType: string;
  vehicleClass?: string;
}

export default function AIAnalysis({ make, model, year, carType, vehicleClass }: Props) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchAnalysis = () => {
    setLoading(true);
    fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ make, model, year, carType, vehicleClass }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.summary) setAnalysis(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Auto-fetch when component becomes visible
    if (expanded && !analysis && !loading) {
      fetchAnalysis();
    }
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#1a1a1a] rounded-xl border border-purple-500/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 text-sm font-black">AI</span>
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white">AI Expert Analysis</h3>
            <p className="text-[11px] text-gray-500">Powered by AI — pros, cons, verdict & regional tips</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          {loading && (
            <div className="py-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-[12px] text-gray-500">Analyzing {make} {model}...</p>
            </div>
          )}

          {analysis && (
            <div className="mt-4 space-y-4">
              {/* Summary */}
              <p className="text-[14px] text-gray-300 leading-relaxed">{analysis.summary}</p>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-500/5 rounded-lg border border-green-500/10 p-3">
                  <h4 className="text-[11px] text-green-400 font-bold uppercase tracking-widest mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {analysis.pros.map((pro, i) => (
                      <li key={i} className="text-[12px] text-gray-300 flex gap-2">
                        <span className="text-green-400 mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 rounded-lg border border-red-500/10 p-3">
                  <h4 className="text-[11px] text-red-400 font-bold uppercase tracking-widest mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {analysis.cons.map((con, i) => (
                      <li key={i} className="text-[12px] text-gray-300 flex gap-2">
                        <span className="text-red-400 mt-0.5">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verdict */}
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-[11px] text-amber-400 font-bold uppercase tracking-widest mb-1">Verdict</h4>
                <p className="text-[13px] text-white font-medium">{analysis.verdict}</p>
              </div>

              {/* Regional Tip */}
              {analysis.regionalTip && (
                <div className="bg-blue-500/5 rounded-lg border border-blue-500/10 p-3">
                  <h4 className="text-[11px] text-blue-400 font-bold uppercase tracking-widest mb-1">Regional Buying Tip</h4>
                  <p className="text-[12px] text-gray-300">{analysis.regionalTip}</p>
                </div>
              )}

              {/* Competitors */}
              {analysis.competitors?.length > 0 && (
                <div>
                  <h4 className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2">Top Competitors</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.competitors.map((comp, i) => (
                      <span key={i} className="text-[11px] bg-white/5 text-gray-400 px-2.5 py-1 rounded-lg border border-white/5">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !analysis && (
            <button
              onClick={fetchAnalysis}
              className="mt-4 w-full py-2.5 bg-purple-500/20 text-purple-300 rounded-lg text-[13px] font-bold hover:bg-purple-500/30 transition-colors"
            >
              Generate AI Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
}
