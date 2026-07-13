import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Mail,
  PartyPopper,
  GraduationCap,
  Users,
  HeartHandshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

// Category visual palette. Keyed by `category` in dict.events.items[].
const CATEGORY_META = {
  cultural: {
    icon: PartyPopper,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    tag: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  },
  class: {
    icon: GraduationCap,
    gradient: "from-sky-500 to-cyan-500",
    tag: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300",
  },
  community: {
    icon: Users,
    gradient: "from-emerald-500 to-teal-500",
    tag: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  fundraiser: {
    icon: HeartHandshake,
    gradient: "from-violet-500 to-indigo-500",
    tag: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  },
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.events.metaTitle,
    description: dict.events.metaDescription,
  };
}

export default async function EventsPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.events;
  const lp = (p) => localizedPath(p, lang);
  const locale = lang === "mn" ? "mn-MN" : "en-US";

  const today = new Date().toISOString().slice(0, 10);
  const items = [...t.items].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = items.filter((e) => e.date >= today);
  const past = items.filter((e) => e.date < today).reverse();

  const dateBadgeFmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  });
  const dateFullFmt = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 size-80 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-600/15" />
          <div className="absolute -top-10 right-0 size-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={lp("/")} className="hover:text-foreground">
              {dict.common.home}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t.breadcrumb}</span>
          </nav>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.h1}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="border-b border-border/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.upcomingTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.upcomingLead}
            </p>
          </div>

          {upcoming.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-border bg-muted/30 p-8 text-sm text-muted-foreground">
              {t.emptyUpcoming}
            </p>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => {
                const meta = CATEGORY_META[event.category] ?? CATEGORY_META.community;
                const Icon = meta.icon;
                const eventDate = new Date(`${event.date}T00:00:00`);
                return (
                  <li key={event.id}>
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-foreground/10">
                      <div
                        className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${meta.gradient}`}
                      >
                        <Icon className="size-10 text-white/85" />
                        <span className="absolute top-3 left-3 inline-flex flex-col items-center rounded-lg bg-white/95 px-2.5 py-1 leading-none text-slate-900 shadow-sm dark:bg-slate-950/90 dark:text-white">
                          <span className="text-[10px] font-semibold tracking-wide uppercase">
                            {dateBadgeFmt.format(eventDate).split(" ")[0]}
                          </span>
                          <span className="text-base font-bold">
                            {eventDate.getDate()}
                          </span>
                        </span>
                        {event.rsvp ? (
                          <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-rose-700 shadow-sm dark:bg-slate-950/90 dark:text-rose-300">
                            {t.rsvpBadge}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.tag}`}
                        >
                          {t.categories[event.category] ?? event.category}
                        </span>

                        <h3 className="mt-3 text-lg font-semibold leading-snug">
                          {event.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>

                        <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Calendar className="size-3.5 shrink-0 text-amber-500" />
                            {dateFullFmt.format(eventDate)}
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="size-3.5 shrink-0 text-amber-500" />
                            {event.time}
                          </li>
                          <li className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                            <span>{event.location}</span>
                          </li>
                        </ul>

                        <div className="mt-auto pt-5">
                          <Button
                            asChild
                            variant="outline"
                            className="h-9 w-full rounded-xl text-sm"
                          >
                            <Link href={lp("/contact")}>
                              {t.detailsButton}
                              <ArrowRight className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Past events */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.pastTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.pastLead}</p>
          </div>

          {past.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
              {t.emptyPast}
            </p>
          ) : (
            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {past.map((event) => {
                const meta = CATEGORY_META[event.category] ?? CATEGORY_META.community;
                const Icon = meta.icon;
                const eventDate = new Date(`${event.date}T00:00:00`);
                return (
                  <li key={event.id}>
                    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 ring-1 ring-foreground/10">
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${meta.gradient}`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">
                          {dateFullFmt.format(eventDate)}
                        </div>
                        <h3 className="mt-1 text-base font-semibold leading-snug">
                          {event.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
              <Mail className="size-5" />
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
