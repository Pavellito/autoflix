"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <div className="relative flex items-center">
      {/* Netflix search icon + expanding input */}
      <form onSubmit={handleSubmit} className="flex items-center">
        <div
          className={`flex items-center transition-all duration-300 ${
            open
              ? "bg-[#141414] border border-white w-[255px]"
              : "w-auto"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (!open) setOpen(true);
              else if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                setOpen(false);
              }
            }}
            className="flex items-center justify-center p-[6px] text-white"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {open && (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query) setTimeout(() => setOpen(false), 200);
              }}
              placeholder="Titles, cars, brands"
              className="bg-transparent text-white text-[14px] pr-2 py-[4px] w-full placeholder-[#808080] border-none focus:outline-none"
            />
          )}
        </div>
      </form>
    </div>
  );
}
