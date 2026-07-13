"use client";

import { useMemo, useState } from "react";
import { HandHelping } from "lucide-react";

import { DonorSearch, matchesQuery } from "@/components/donor-search";

export function ServiceDonorsList({ donors, lang, labels }) {
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
        (d) =>
          matchesQuery(d.name, query) || matchesQuery(d.activity, query)
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
        accent="sky"
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
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-sm">
                    <HandHelping className="size-4.5" />
                  </span>
                  <span className="text-sm font-semibold leading-tight">
                    {d.name}
                  </span>
                </div>
                {d.activity ? (
                  <div className="text-sm">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {labels.serviceActivityLabel}
                    </div>
                    <p className="mt-0.5 leading-relaxed">{d.activity}</p>
                  </div>
                ) : null}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    {d.period ? (
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800 dark:bg-sky-950/60 dark:text-sky-200">
                        {labels.servicePeriodLabel}: {d.period}
                      </span>
                    ) : null}
                    {valueLabel ? (
                      <span className="font-semibold tabular-nums text-sky-700 dark:text-sky-300">
                        ≈ {valueLabel}
                      </span>
                    ) : null}
                  </div>
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
          {labels.serviceEmpty}
        </p>
      ) : (
        <p className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          {labels.noMatches}
        </p>
      )}
    </>
  );
}
