"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CompareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Comparison Boundary Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card-bg/60 border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Showdown Error</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          We couldn't load this car comparison. The data structure might be corrupted or the chosen models exist in different regional databases.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-accent text-white px-6 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-accent/80 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/compare"
            className="w-full bg-white/5 border border-white/10 text-white px-6 py-3 rounded text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Back to Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
