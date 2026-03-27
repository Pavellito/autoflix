"use client";

import { useState, useEffect } from "react";

interface SummaryData {
  summary: string;
  key_points: string[];
  pros: string[];
  cons: string[];
  verdict: string;
  tags: string[];
  category: string;
}

const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "he", label: "עברית", dir: "rtl" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export default function AiSummary({
  videoId,
  title,
  description,
}: {
  videoId: string;
  title: string;
  description: string;
}) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  async function generateSummary() {
    if (loading) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, title, description, language }),
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

  // Auto-fetch on mount OR when language changes
  useEffect(() => {
    generateSummary();
  }, [videoId, language]);

  return (
    <div 
      className="mt-6 p-6 rounded-xl bg-card-bg/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden relative"
      dir={currentLang.dir}
    >
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">AI Expert Analysis</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">AutoFlix Intelligent Insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
            className="bg-black/60 border border-white/10 text-white text-xs rounded-full px-4 py-1.5 focus:outline-none focus:border-accent appearance-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
            title="Refresh Analysis"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <span className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400 animate-pulse">Consulting our AI Automotive Experts...</p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 font-bold mb-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            Generation Error
          </div>
          {error}
          <div className="mt-3">
            <button onClick={generateSummary} className="text-xs font-bold text-white bg-red-500/30 hover:bg-red-500/50 px-5 py-2 rounded-full transition-all">
              Try Again
            </button>
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10">
          {/* Main Summary */}
          <div className="relative">
            <p className="text-base md:text-lg text-gray-200 leading-relaxed font-medium">
              {data.summary}
            </p>
          </div>

          {/* Highlights & Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase rounded-md">
              {data.category}
            </span>
            {data.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] uppercase rounded-md">
                #{tag}
              </span>
            ))}
          </div>

          {/* Key Points */}
          {data.key_points && data.key_points.length > 0 && (
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Key Highlights
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {data.key_points.map((point, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-accent font-bold">»</span> {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
              <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {currentLang.code === "en" ? "Pros" : currentLang.code === "he" ? "יתרונות" : currentLang.code === "ar" ? "الإيجابيات" : "Плюсы"}
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                {data.pros.map((pro, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-500 font-bold">+</span> {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
              <h4 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                {currentLang.code === "en" ? "Cons" : currentLang.code === "he" ? "חסרונות" : currentLang.code === "ar" ? "السلبيات" : "Минуס"}
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                {data.cons.map((con, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-rose-500 font-bold">-</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Verdict Card */}
          <div className="relative mt-4">
            <div className="absolute inset-0 bg-accent/20 blur-xl opacity-20" />
            <div className="relative bg-gradient-to-br from-accent/10 to-transparent p-5 rounded-2xl border border-accent/20">
              <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">The Final Verdict</h4>
              <p className="text-lg md:text-xl text-white font-bold leading-tight italic tracking-tight">
                "{data.verdict}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
