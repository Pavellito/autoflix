"use client";

import { useState, useEffect } from "react";

interface SummaryData {
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
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
      className="mt-6 p-5 rounded-lg bg-card-bg border border-white/10 shadow-lg"
      dir={currentLang.dir}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-base font-semibold text-white">AI Analysis</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
            className="bg-black/40 border border-white/10 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-accent"
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
            className="text-xs font-medium bg-accent hover:bg-accent/80 disabled:opacity-50 text-white px-4 py-1.5 rounded transition-colors"
          >
            {loading ? "Analyzing..." : "Refresh"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-sm text-gray-400 py-4">
          <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Analyzing & Translating video content...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md py-2 border border-red-500/20">
          <span className="block font-semibold mb-1">Error Generating Summary:</span>
          {error}
          <div className="mt-2">
            <button onClick={generateSummary} className="text-xs text-white bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded transition-colors">
              Retry
            </button>
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 animate-in fade-in duration-500 rtl:space-x-reverse">
          <p className="text-sm md:text-base text-gray-300 leading-relaxed border-l-2 rtl:border-r-2 rtl:border-l-0 rtl:pr-3 border-gray-600 pl-3">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-black/30 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {currentLang.code === "en" ? "Pros" : currentLang.code === "he" ? "יתרונות" : currentLang.code === "ar" ? "الإيجابيات" : "Плюсы"}
              </h4>
              <ul className="text-xs md:text-sm text-gray-300 space-y-1.5">
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
                {currentLang.code === "en" ? "Cons" : currentLang.code === "he" ? "חסרונות" : currentLang.code === "ar" ? "السلبيات" : "Минусы"}
              </h4>
              <ul className="text-xs md:text-sm text-gray-300 space-y-1.5">
                {data.cons.map((con, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500/50">•</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-semibold text-white mb-1">
              {currentLang.code === "en" ? "Verdict" : currentLang.code === "he" ? "שורה תחתונה" : currentLang.code === "ar" ? "الخلاصة" : "Вердикт"}
            </h4>
            <p className="text-sm md:text-base text-accent font-medium">{data.verdict}</p>
          </div>
        </div>
      )}
    </div>
  );
}
