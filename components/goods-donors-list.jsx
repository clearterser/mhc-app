"use client";

import { useMemo, useState } from "react";
import { Gift } from "lucide-react";

import { DonorSearch, matchesQuery } from "@/components/donor-search";

export function GoodsDonorsList({ donors, lang, labels }) {
  const [query, setQuery] = useState("");

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "mn" ? "mn-MN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [lang]
  );
  // Always format USD with en-US: Node.js ICU adds a space between the "$" and
  // the number for mn-MN ("$ 12,200") while the browser ICU does not ("$12,200"),
  // causing a hydration mismatch. USD formatting doesn't need localization.
  const amountFmt = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    []
  );

  const filtered = useMemo(
    () =>
      donors.filter(
        (d) => matchesQuery(d.name, query) || matchesQuery(d.item, query)
      ),
    [donors, query]
  );

  return (
    <>
      <DonorSearch
        value={query}
        onChange={setQuery}
        placeholder={labels.searchPlaceholder}
        clearLabel={labels.searchClear}
        accent="emerald"
      />

      {filtered.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => {
            const dateLabel = d.date ? dateFmt.format(new Date(d.date)) : null;
            const valueLabel =
              d.value != null ? amountFmt.format(d.value) : null;
            return (
              <li
                key={`${d.name}-${i}`}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 ring-1 ring-foreground/10"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
                    <Gift className="size-4.5" />
                  </span>
                  <span className="text-sm font-semibold leading-tight">
                    {d.name}
                  </span>
                </div>
                {d.item ? (
                  <div className="text-sm">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {labels.goodsItemLabel}
                    </div>
                    <p className="mt-0.5 leading-relaxed">{d.item}</p>
                  </div>
                ) : null}
                <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  {valueLabel ? (
                    <span className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                      ≈ {valueLabel}
                    </span>
                  ) : (
                    <span />
                  )}
                  {dateLabel ? (
                    <time dateTime={d.date} className="tabular-nums">
                      {dateLabel}
                    </time>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : donors.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          {labels.goodsEmpty}
        </p>
      ) : (
        <p className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {labels.noMatches}
        </p>
      )}
    </>
  );
}
