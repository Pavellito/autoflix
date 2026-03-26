"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchInput({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for cars, EVs, maintenance tips..."
        className="flex-1 bg-black/60 border border-white/20 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-accent transition"
      />
      <button
        type="submit"
        className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
}
