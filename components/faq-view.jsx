"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Heart,
  CalendarDays,
  Handshake,
  HelpCircle,
  Search,
} from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const ICON_MAP = {
  building: Building2,
  heart: Heart,
  calendar: CalendarDays,
  handshake: Handshake,
};

const CATEGORY_GRADIENTS = {
  about: "from-amber-500 to-orange-500",
  donate: "from-rose-500 to-pink-500",
  events: "from-emerald-500 to-teal-500",
  rentals: "from-sky-500 to-cyan-500",
  partner: "from-violet-500 to-indigo-500",
};

function normalize(s) {
  return s.toLocaleLowerCase("mn-MN").normalize("NFKD");
}

export function FaqView({ dict }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return dict.categories;
    return dict.categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) =>
            normalize(it.q).includes(q) || normalize(it.a).includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [query, dict.categories]);

  const hasResults = filtered.some((c) => c.items.length > 0);

  return (
    <>
      {/* Search */}
      <div className="mx-auto mb-12 max-w-2xl">
        <label
          htmlFor="faq-search"
          className="mb-2 block text-sm font-medium text-muted-foreground"
        >
          {dict.searchLabel}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full rounded-xl border border-border bg-card px-11 py-3 text-sm ring-1 ring-foreground/10 placeholder:text-muted-foreground focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
          />
        </div>
      </div>

      {/* Categories */}
      {hasResults ? (
        <div className="space-y-10">
          {filtered.map((cat) => {
            const Icon = ICON_MAP[cat.iconKey] ?? HelpCircle;
            const gradient =
              CATEGORY_GRADIENTS[cat.id] ?? "from-slate-500 to-zinc-500";
            return (
              <section
                key={cat.id}
                id={cat.id}
                className="scroll-mt-20 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {cat.title}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {cat.items.map((item, i) => (
                    <AccordionItem
                      key={`${cat.id}-${i}`}
                      value={`${cat.id}-${i}`}
                    >
                      <AccordionTrigger className="py-4 text-base font-semibold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <HelpCircle className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">{dict.noResults}</p>
        </div>
      )}
    </>
  );
}
