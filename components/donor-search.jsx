"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function DonorSearch({
  value,
  onChange,
  placeholder,
  clearLabel,
  accent = "amber",
}) {
  const ringClass = {
    amber: "focus-within:ring-amber-400/40 focus-within:border-amber-400",
    emerald: "focus-within:ring-emerald-400/40 focus-within:border-emerald-400",
    sky: "focus-within:ring-sky-400/40 focus-within:border-sky-400",
  }[accent];

  return (
    <div
      className={cn(
        "mx-auto mt-8 flex max-w-md items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 ring-1 ring-foreground/5 transition-shadow focus-within:ring-3",
        ringClass
      )}
    >
      <Search className="size-4 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel}
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function matchesQuery(value, query) {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (value || "").toLowerCase().includes(q);
}
