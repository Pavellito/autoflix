"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="text-gray-300 hover:text-white transition"
          aria-label="Open search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => !query && setOpen(false)}
            placeholder="Search cars, EVs, tips..."
            className="bg-black/80 border border-white/20 text-white text-sm px-3 py-1.5 rounded w-48 focus:w-64 transition-all focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="text-sm text-accent hover:text-white transition"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
