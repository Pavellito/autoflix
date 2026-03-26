"use client";

import { useState, useEffect } from "react";
import { Car } from "@/app/lib/data";

interface VerdictData {
  comparison_summary: string;
  winner_verdict: string;
  key_differences: string[];
  regional_buying_tip: string;
}

export default function CompareVerdict({ car1, car2 }: { car1: Car; car2: Car }) {
  const [data, setData] = useState<VerdictData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "he", label: "עברית" },
    { code: "ru", label: "Русский" },
    { code: "ar", label: "العربية" },
  ];

  async function getVerdict() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car1, car2, language }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to compare");
      setData(resData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getVerdict();
  }, [car1.id, car2.id, language]);

  return (
    <div className="bg-card-bg/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden relative mb-12">
      {/* Glow Effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">AI Expert Verdict</h2>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-black/60 border border-white/10 text-white text-xs rounded-full px-4 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium animate-pulse">Analyzing tech specs and regional data...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
          {error}
        </div>
      ) : data ? (
        <div className="space-y-6 animate-in fade-in duration-700 relative z-10" dir={language === "he" || language === "ar" ? "rtl" : "ltr"}>
          <p className="text-lg text-gray-200 leading-relaxed font-medium line-clamp-3">
             {data.comparison_summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 h-full">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Key Structural Differences</h4>
              <ul className="space-y-2">
                {data.key_differences.map((diff, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-accent font-bold">»</span> {diff}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 h-full">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Regional Buying Tip</h4>
              <p className="text-sm text-gray-300 italic">
                "{data.regional_buying_tip}"
              </p>
            </div>
          </div>

          <div className="relative mt-4">
            <div className="absolute inset-0 bg-accent/20 blur-xl opacity-20" />
            <div className="relative bg-gradient-to-br from-accent/15 to-transparent p-6 rounded-2xl border border-accent/30 shadow-2xl">
              <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-3">Overall Recommendation</h4>
              <p className="text-xl md:text-2xl text-white font-black leading-tight tracking-tight italic">
                "{data.winner_verdict}"
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
