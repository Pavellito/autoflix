"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface Props {
  page: number;
  totalPages: number;
  total: number;
}

export default function VehiclePagination({ page, totalPages, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Generate page numbers to show
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 relative">
      {isPending && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-5 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
        </div>
      )}

      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded-lg text-sm font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-600">...</span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
              p === page
                ? "bg-accent text-white shadow-lg shadow-accent/30"
                : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded-lg text-sm font-bold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
}
