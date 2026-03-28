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
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for cars, reviews, tips..."
        className="flex-1 bg-[#333] border border-[#333] text-white px-4 py-2.5 rounded-[4px] text-sm focus:border-white/50 transition placeholder-[#808080]"
      />
      <button
        type="submit"
        className="bg-[#e50914] text-white px-6 py-2.5 rounded-[4px] text-sm font-bold hover:bg-[#f40612] transition"
      >
        Search
      </button>
    </form>
  );
}
