"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleBlur = () => {
    if (!query.trim()) setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ${
          open ? "w-[255px] border border-white bg-[#141414] px-2" : "w-auto"
        }`}
      >
        <button type="button" onClick={handleToggle} className="p-1.5 flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {open && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={handleBlur}
            placeholder="Titles, cars, genres"
            className="bg-transparent text-[14px] text-white w-full py-1 outline-none placeholder:text-[#737373]"
          />
        )}
      </div>
    </form>
  );
}
