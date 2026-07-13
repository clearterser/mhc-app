import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  Presentation,
  Briefcase,
  Coffee,
  DoorOpen,
  DollarSign,
  Heart,
  ArrowRight,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

// Room-type visual palette. Keyed by `type` in dict.rentals.rooms[].
const TYPE_META = {
  hall: {
    icon: Building2,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    tag: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  },
  office: {
    icon: Briefcase,
    gradient: "from-slate-500 to-zinc-600",
    tag: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
  },
  tearoom: {
    icon: Coffee,
    gradient: "from-rose-400 via-pink-400 to-fuchsia-500",
    tag: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
  },
  room: {
    icon: DoorOpen,
    gradient: "from-violet-500 to-indigo-500",
    tag: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  },
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.rentals.metaTitle,
    description: dict.rentals.metaDescription,
  };
}

export default async function RentalsPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.rentals;
  const lp = (p) => localizedPath(p, lang);

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 size-80 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-600/15" />
          <div className="absolute -top-10 right-0 size-80 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-600/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={lp("/")} className="hover:text-foreground">
              {dict.common.home}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t.breadcrumb}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t.h1}
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              <DollarSign className="size-3.5" />
              {t.badge}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Section intros (A / B) */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {t.sections.map((section, i) => (
            <div
              key={section.id}
              className={`rounded-2xl border p-6 ring-1 ring-foreground/10 sm:p-7 ${
                i === 0
                  ? "border-amber-200 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/30"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-500 to-orange-500"
                      : "bg-gradient-to-br from-slate-500 to-zinc-500"
                  }`}
                >
                  {i === 0 ? (
                    <Heart className="size-4" />
                  ) : (
                    <DollarSign className="size-4" />
                  )}
                </span>
                <div>
                  <h2 className="text-lg font-bold sm:text-xl">
                    {section.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {section.lead}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room cards */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.rooms.map((room) => {
              const meta = TYPE_META[room.type] ?? TYPE_META.room;
              const Icon = meta.icon;
              return (
                <li key={room.id}>
                  <Card className="overflow-hidden p-0">
                    {/* Photo or gradient placeholder */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {room.image ? (
                        <Image
                          src={room.image}
                          alt={`${t.roomNumberLabel} ${room.number} · ${room.name}`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${meta.gradient}`}
                        >
                          <Icon className="size-14 text-white/85" />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${meta.tag}`}
                      >
                        {t.roomNumberLabel} {room.number}
                      </span>
                    </div>

                    <CardHeader className="pt-5">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      {/* Price grid: donor vs base */}
                      <div className="overflow-hidden rounded-xl border border-border ring-1 ring-foreground/5">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-muted/50 text-[10px] font-semibold tracking-wide uppercase">
                              <th className="px-2 py-2 text-left text-muted-foreground">
                                &nbsp;
                              </th>
                              <th className="px-1.5 py-2 text-center text-amber-700 dark:text-amber-300">
                                {t.columnDonor}
                              </th>
                              <th className="px-1.5 py-2 text-center text-muted-foreground">
                                {t.columnBase}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { key: "month", label: t.monthLabel },
                              { key: "day", label: t.dayLabel },
                              { key: "hour", label: t.hourLabel },
                            ].map((row) => (
                              <tr
                                key={row.key}
                                className="border-t border-border"
                              >
                                <td className="px-2 py-1.5 leading-tight text-muted-foreground">
                                  {row.label}
                                </td>
                                <td className="px-1.5 py-1.5 text-center font-semibold text-amber-700 tabular-nums dark:text-amber-300">
                                  {room.prices?.donor?.[row.key] ?? "—"}
                                </td>
                                <td className="px-1.5 py-1.5 text-center font-semibold tabular-nums">
                                  {room.prices?.base?.[row.key] ?? "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Notes */}
      {t.notes?.length ? (
        <section className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                <Info className="size-5" />
              </span>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                {t.notes.map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
              <Presentation className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">{t.cta.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.cta.lead}</p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 text-white hover:from-amber-500 hover:to-orange-500"
          >
            <Link href={lp("/contact")}>
              {t.cta.button}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
