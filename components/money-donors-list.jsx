"use client";

import { useMemo, useState } from "react";
import {
  Gem,
  Crown,
  Award,
  Medal,
  Star,
  BadgeCheck,
  Heart,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TierBenefitsDrawer } from "@/components/tier-benefits-drawer";
import { DonorSearch, matchesQuery } from "@/components/donor-search";

const TIER_META = {
  ochir: {
    icon: Gem,
    gradient: "from-cyan-500 to-sky-500",
    chip:
      "border-cyan-300/70 bg-cyan-50 text-cyan-900 dark:border-cyan-800/70 dark:bg-cyan-950/40 dark:text-cyan-200",
    ring: "ring-cyan-400/40 dark:ring-cyan-700/40",
    iconClass: "bg-gradient-to-br from-cyan-500 to-sky-500",
    triggerClass:
      "bg-gradient-to-r from-cyan-600 to-sky-600 shadow-cyan-500/25 hover:from-cyan-500 hover:to-sky-500",
    limitedBadgeClass:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200",
  },
  altan: {
    icon: Crown,
    gradient: "from-amber-500 to-yellow-500",
    chip:
      "border-amber-300/70 bg-amber-50 text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200",
    ring: "ring-amber-400/40 dark:ring-amber-700/40",
    iconClass: "bg-gradient-to-br from-amber-500 to-yellow-500",
    triggerClass:
      "bg-gradient-to-r from-amber-600 to-yellow-600 shadow-amber-500/25 hover:from-amber-500 hover:to-yellow-500",
    limitedBadgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
  },
  mongon: {
    icon: Award,
    gradient: "from-slate-400 to-zinc-500",
    chip:
      "border-slate-300/70 bg-slate-50 text-slate-800 dark:border-slate-700/70 dark:bg-slate-900/50 dark:text-slate-200",
    ring: "",
    iconClass: "bg-gradient-to-br from-slate-400 to-zinc-500",
    triggerClass:
      "bg-gradient-to-r from-slate-500 to-zinc-600 shadow-slate-500/25 hover:from-slate-400 hover:to-zinc-500",
    limitedBadgeClass:
      "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
  },
  hurel: {
    icon: Medal,
    gradient: "from-orange-600 to-amber-700",
    chip:
      "border-orange-300/70 bg-orange-50 text-orange-900 dark:border-orange-900/70 dark:bg-orange-950/40 dark:text-orange-200",
    ring: "",
    iconClass: "bg-gradient-to-br from-orange-600 to-amber-700",
    triggerClass:
      "bg-gradient-to-r from-orange-600 to-amber-700 shadow-orange-500/25 hover:from-orange-500 hover:to-amber-600",
    limitedBadgeClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-200",
  },
  erhem: {
    icon: Star,
    gradient: "from-violet-500 to-fuchsia-500",
    chip:
      "border-violet-300/70 bg-violet-50 text-violet-900 dark:border-violet-800/70 dark:bg-violet-950/40 dark:text-violet-200",
    ring: "",
    iconClass: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    triggerClass:
      "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500",
    limitedBadgeClass:
      "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-200",
  },
  hundet: {
    icon: BadgeCheck,
    gradient: "from-sky-500 to-cyan-500",
    chip:
      "border-sky-300/70 bg-sky-50 text-sky-900 dark:border-sky-800/70 dark:bg-sky-950/40 dark:text-sky-200",
    ring: "",
    iconClass: "bg-gradient-to-br from-sky-500 to-cyan-500",
    triggerClass:
      "bg-gradient-to-r from-sky-600 to-cyan-600 shadow-sky-500/25 hover:from-sky-500 hover:to-cyan-500",
    limitedBadgeClass:
      "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
  },
  donor: {
    icon: Heart,
    gradient: "from-rose-500 to-pink-500",
    chip:
      "border-rose-300/70 bg-rose-50 text-rose-900 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200",
    ring: "",
    iconClass: "bg-gradient-to-br from-rose-500 to-pink-500",
    triggerClass:
      "bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/25 hover:from-rose-500 hover:to-pink-500",
    limitedBadgeClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200",
  },
};

export function MoneyDonorsList({
  donors,
  lang,
  labels,
  donateHref,
  contactHref,
}) {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length > 0;

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
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "mn" ? "mn-MN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [lang]
  );

  const filteredByTier = useMemo(() => {
    const out = {};
    for (const tier of labels.tiers) {
      out[tier.key] = donors
        .filter((d) => d.tier === tier.key && matchesQuery(d.name, query))
        .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
    }
    return out;
  }, [donors, labels.tiers, query]);

  const totalMatches = useMemo(
    () => Object.values(filteredByTier).reduce((s, list) => s + list.length, 0),
    [filteredByTier]
  );

  return (
    <>
      <DonorSearch
        value={query}
        onChange={setQuery}
        placeholder={labels.searchPlaceholder}
        clearLabel={labels.searchClear}
        accent="amber"
      />

      <div className="mt-12 space-y-6">
        {labels.tiers.map((tier) => {
          const meta = TIER_META[tier.key];
          const Icon = meta.icon;
          const list = filteredByTier[tier.key];

          // When searching, hide tiers with no matches to reduce clutter.
          if (isSearching && list.length === 0) return null;

          return (
            <Card
              key={tier.key}
              className={`p-2 ${meta.ring ? `ring-2 ${meta.ring}` : ""}`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-lg">{tier.label}</CardTitle>
                    <div className="text-sm font-medium text-muted-foreground">
                      {tier.range}
                    </div>
                  </div>
                  {tier.limited ? (
                    <span
                      className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${meta.limitedBadgeClass}`}
                    >
                      {labels.limitedBadgeTemplate.replace(
                        "{n}",
                        String(tier.limited)
                      )}
                    </span>
                  ) : (
                    <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {list.length}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {list.length > 0 ? (
                  <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((donor) => (
                      <li
                        key={donor.name}
                        className={`flex flex-col gap-1 rounded-xl border px-3.5 py-2.5 ${meta.chip}`}
                      >
                        <span className="text-sm font-semibold leading-tight">
                          {donor.name}
                        </span>
                        <span className="flex items-center justify-between gap-2 text-xs opacity-80">
                          <span className="font-semibold tabular-nums">
                            {donor.amount != null
                              ? amountFmt.format(donor.amount)
                              : ""}
                          </span>
                          {donor.date ? (
                            <time
                              dateTime={donor.date}
                              className="tabular-nums"
                            >
                              {dateFmt.format(new Date(donor.date))}
                            </time>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {labels.emptyTier}
                  </p>
                )}

                <div className="mt-4 border-t border-border pt-4">
                  <TierBenefitsDrawer
                    tier={tier}
                    tierStyles={{
                      iconClass: meta.iconClass,
                      triggerClass: meta.triggerClass,
                      limitedBadgeClass: meta.limitedBadgeClass,
                    }}
                    labels={{
                      viewBenefits: labels.viewBenefits,
                      drawerDonateCta: labels.drawerDonateCta,
                      drawerContactCta: labels.drawerContactCta,
                      drawerClose: labels.drawerClose,
                      limitedBadgeTemplate: labels.limitedBadgeTemplate,
                    }}
                    donateHref={donateHref}
                    contactHref={contactHref}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {isSearching && totalMatches === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            {labels.noMatches}
          </p>
        ) : null}
      </div>
    </>
  );
}
