"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Crown,
  UserCog,
  Briefcase,
  Users,
  ClipboardList,
  ShieldCheck,
  Wallet,
  FolderKanban,
  UsersRound,
  HandHelping,
  X,
  ChevronRight,
} from "lucide-react";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------- Tier system ----------
const TIER_STYLE = {
  board: {
    cardClass:
      "border-amber-500/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30",
    iconClass: "bg-gradient-to-br from-amber-500 to-orange-500",
    swatch: "bg-amber-200 dark:bg-amber-900",
  },
  chair: {
    cardClass:
      "border-amber-400/30 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30",
    iconClass: "bg-gradient-to-br from-amber-500 to-yellow-500",
    swatch: "bg-amber-100 dark:bg-amber-900/60",
  },
  support: {
    cardClass: "",
    iconClass: "bg-gradient-to-br from-slate-500 to-zinc-500",
    swatch: "bg-muted",
  },
  exec: {
    cardClass:
      "border-teal-400/40 bg-teal-50/60 dark:border-teal-900/60 dark:bg-teal-950/30",
    iconClass: "bg-gradient-to-br from-teal-500 to-cyan-500",
    swatch: "bg-teal-100 dark:bg-teal-900/60",
  },
  ops: {
    cardClass: "",
    iconClass: "bg-gradient-to-br from-rose-500 to-pink-500",
    swatch: "bg-rose-100 dark:bg-rose-900/60",
  },
};

// ---------- Node meta (icons + tier + articles; text comes from dict) ----------
const NODE_META = {
  board: { tier: "board", icon: Crown, articles: "4.1, 4.3, 4.7–4.12" },
  chair: { tier: "chair", icon: UserCog, articles: "4.2, 4.13" },
  secretary: { tier: "support", icon: ClipboardList, articles: "4.5" },
  advisory: { tier: "support", icon: Users, articles: "4.5" },
  control: { tier: "support", icon: ShieldCheck, articles: "4.5" },
  finance: { tier: "support", icon: Wallet, articles: "4.5, 3.9, 3.10" },
  director: { tier: "exec", icon: Briefcase, articles: "4.15" },
  manager: { tier: "exec", icon: FolderKanban, articles: "4.16" },
  team: { tier: "ops", icon: UsersRound, articles: "4.7.4.1, 4.15.5" },
  volunteers: { tier: "ops", icon: HandHelping, articles: "4.16.6" },
};

// ---------- RACI matrix codes by article ----------
const RACI_DATA = [
  { art: "4.7.1", uz: "A", dar: "C", zah: "R", men: "I" },
  { art: "4.7.2", uz: "A", dar: "I", zah: "R", men: "C" },
  { art: "4.7.3", uz: "A", dar: "I", zah: "R", men: "C" },
  { art: "4.7.4", uz: "A", dar: "R", zah: "I", men: "I" },
  { art: "4.7.5", uz: "A", dar: "C", zah: "R", men: "C" },
  { art: "4.7.6", uz: "A", dar: "C", zah: "R", men: "I" },
  { art: "4.7.7", uz: "A", dar: "C", zah: "I", men: "I" },
  { art: "4.13.1", uz: "A", dar: "R", zah: "C", men: "I" },
  { art: "4.13.2", uz: "I", dar: "A", zah: "I", men: "I" },
  { art: "4.13.4", uz: "I", dar: "A", zah: "C", men: "I" },
  { art: "4.13.5", uz: "I", dar: "A", zah: "I", men: "I" },
  { art: "4.15.1", uz: "A", dar: "I", zah: "R", men: "C" },
  { art: "4.15.2", uz: "A", dar: "I", zah: "R", men: "C" },
  { art: "4.15.3", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.15.4", uz: "I", dar: "C", zah: "A", men: "I" },
  { art: "4.15.5", uz: "A", dar: "C", zah: "R", men: "I" },
  { art: "4.15.6", uz: "I", dar: "C", zah: "A", men: "I" },
  { art: "4.15.7", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.16.2", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.16.3", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.16.4", uz: "I", dar: "I", zah: "C", men: "A" },
  { art: "4.16.5", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.16.6", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.16.7", uz: "I", dar: "I", zah: "A", men: "R" },
  { art: "4.16.8", uz: "I", dar: "I", zah: "A", men: "R" },
];

const CODE_CLS = {
  A: "bg-amber-500 text-white font-bold",
  R: "bg-teal-600 text-white font-bold",
  C: "bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200",
  I: "bg-muted text-muted-foreground",
};

const RACI_ROLE_KEYS = ["uz", "dar", "zah", "men"];

// ---------- Node card ----------
function NodeCard({ nodeKey, dict, onClick, delay = 0 }) {
  const meta = NODE_META[nodeKey];
  const data = dict.nodes[nodeKey];
  const Icon = meta.icon;
  const tier = TIER_STYLE[meta.tier];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      className="group block w-full text-left"
    >
      <Card
        size="sm"
        className={cn(
          "flex-row items-center gap-3 px-4 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring",
          tier.cardClass
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm",
            tier.iconClass
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm leading-tight">{data.title}</CardTitle>
          {data.subtitle ? (
            <CardDescription className="mt-0.5 text-xs leading-snug">
              {data.subtitle}
            </CardDescription>
          ) : null}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded bg-background/70 px-1.5 py-px font-mono text-[10px] text-muted-foreground ring-1 ring-border">
              {meta.articles}
            </span>
            <ChevronRight className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </Card>
    </motion.button>
  );
}

function Connector({ h = "h-6" }) {
  return <div className={cn("mx-auto w-px bg-border", h)} aria-hidden />;
}

// ---------- Modal ----------
function DetailModal({ nodeKey, dict, onClose }) {
  useEffect(() => {
    if (!nodeKey) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [nodeKey, onClose]);

  if (!nodeKey) return null;
  const meta = NODE_META[nodeKey];
  const data = dict.nodes[nodeKey];
  const tier = TIER_STYLE[meta.tier];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-title"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-6 shadow-2xl ring-1 ring-foreground/10 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md",
                tier.iconClass
              )}
            >
              <Icon className="size-6" />
            </span>
            <div>
              <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {dict.tiers[meta.tier]}
              </span>
              <h3 id="node-title" className="mt-1 text-lg font-semibold">
                {data.title}
              </h3>
              {data.subtitle ? (
                <p className="text-sm text-muted-foreground">{data.subtitle}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.modalClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-muted px-3 py-2 font-mono text-[11px] text-muted-foreground">
          {dict.modalArticles} {meta.articles}
        </div>

        <h4 className="mt-5 text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-300">
          {dict.modalDuties}
        </h4>
        <ul className="mt-3 space-y-2.5">
          {data.duties.map((d, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

// ---------- Main ----------
export function GovernanceView({ dict, aboutHref }) {
  const [selected, setSelected] = useState(null);
  const [activeRole, setActiveRole] = useState(null);

  const open = (key) => setSelected(key);
  const close = () => setSelected(null);

  const raciCodeKeys = Object.keys(dict.raciCodes);

  return (
    <>
      {/* Org chart */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {dict.orgTitle}
        </h2>
        <p className="mt-2 text-muted-foreground">{dict.orgLead}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
          <div>
            <div className="mx-auto max-w-md">
              <NodeCard nodeKey="board" dict={dict} onClick={() => open("board")} delay={0} />
              <Connector />
              <NodeCard nodeKey="chair" dict={dict} onClick={() => open("chair")} delay={0.05} />
              <Connector />
              <NodeCard nodeKey="director" dict={dict} onClick={() => open("director")} delay={0.1} />
              <Connector />
              <NodeCard nodeKey="manager" dict={dict} onClick={() => open("manager")} delay={0.15} />
            </div>

            <div className="mx-auto mt-0 max-w-md">
              <Connector h="h-4" />
              <div className="relative">
                <div className="absolute top-0 right-1/4 left-1/4 h-px bg-border" />
                <div className="grid grid-cols-2 gap-4 pt-0">
                  <div>
                    <div className="mx-auto h-4 w-px bg-border" />
                    <NodeCard nodeKey="team" dict={dict} onClick={() => open("team")} delay={0.2} />
                  </div>
                  <div>
                    <div className="mx-auto h-4 w-px bg-border" />
                    <NodeCard
                      nodeKey="volunteers"
                      dict={dict}
                      onClick={() => open("volunteers")}
                      delay={0.22}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-dashed border-amber-300/50 bg-amber-50/30 p-4 ring-1 ring-foreground/5 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" aria-hidden />
              <h3 className="text-sm font-semibold">{dict.asideTitle}</h3>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              {dict.asideLead}
            </p>
            <div className="space-y-3">
              <NodeCard nodeKey="secretary" dict={dict} onClick={() => open("secretary")} delay={0.05} />
              <NodeCard nodeKey="advisory" dict={dict} onClick={() => open("advisory")} delay={0.1} />
              <NodeCard nodeKey="control" dict={dict} onClick={() => open("control")} delay={0.15} />
              <NodeCard nodeKey="finance" dict={dict} onClick={() => open("finance")} delay={0.2} />
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {["board", "support", "exec", "ops"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-3 rounded-sm border border-border",
                  TIER_STYLE[t].swatch
                )}
              />
              {dict.tiers[t]}
            </span>
          ))}
        </div>
      </section>

      {/* RACI */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {dict.raciTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {dict.raciLead}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 text-xs">
              {raciCodeKeys.map((code) => (
                <span key={code} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded text-[11px]",
                      CODE_CLS[code]
                    )}
                  >
                    {code}
                  </span>
                  <span className="text-muted-foreground">
                    {dict.raciCodes[code]}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card ring-1 ring-foreground/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  <th className="px-3 py-3 font-semibold">
                    {dict.raciCols.activity}
                  </th>
                  <th className="px-2 py-3 text-center font-semibold">
                    {dict.raciCols.article}
                  </th>
                  {RACI_ROLE_KEYS.map((key) => (
                    <th
                      key={key}
                      onClick={() =>
                        setActiveRole(activeRole === key ? null : key)
                      }
                      className="cursor-pointer px-2 py-3 text-center font-semibold transition-colors select-none hover:bg-black/10"
                      title={dict.raciCodeTitle}
                    >
                      {dict.raciCols[key]}
                      <span className="ml-1 text-[10px] opacity-80">
                        {activeRole === key ? "●" : "○"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RACI_DATA.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-t border-border",
                      i % 2 ? "bg-muted/30" : "bg-card"
                    )}
                  >
                    <td className="px-3 py-2.5">{dict.raciRows[i]}</td>
                    <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">
                      {row.art}
                    </td>
                    {RACI_ROLE_KEYS.map((key) => {
                      const code = row[key];
                      const dim = activeRole !== null && activeRole !== key;
                      return (
                        <td key={key} className="px-1 py-1.5 text-center">
                          <span
                            className={cn(
                              "inline-flex size-7 items-center justify-center rounded text-xs transition-opacity",
                              CODE_CLS[code],
                              dim && "opacity-30"
                            )}
                          >
                            {code}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="mt-4 text-xs leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: dict.raciNote }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div>
            <h3 className="text-lg font-semibold">{dict.ctaTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {dict.ctaLead}
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href={aboutHref}>
              {dict.ctaButton}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <DetailModal nodeKey={selected} dict={dict} onClose={close} />
    </>
  );
}
