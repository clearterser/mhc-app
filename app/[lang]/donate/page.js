import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  GraduationCap,
  CalendarDays,
  Building2,
  Mail,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DonateOptions } from "@/components/donate-options";
import { localizedPath } from "@/lib/i18n";
import { getDonationProviders } from "@/lib/donate-providers";
import { getDictionary, hasLocale } from "../dictionaries";

const IMPACT_META = [
  { icon: GraduationCap, gradient: "from-amber-500 to-orange-500" },
  { icon: CalendarDays, gradient: "from-rose-500 to-pink-500" },
  { icon: Building2, gradient: "from-sky-500 to-cyan-500" },
];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.donate.metaTitle,
    description: dict.donate.metaDescription,
  };
}

export default async function DonatePage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.donate;
  const lp = (p) => localizedPath(p, lang);
  const providers = getDonationProviders();

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
              {t.h1Pre}{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                {t.h1Highlight}
              </span>{" "}
              {t.h1Post}
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              <ShieldCheck className="size-3.5" />
              {t.badge}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* 2 багана: зүүн талд нөлөө/итгэл, баруун талд хандив өгөх интерактив хэсэг */}
      <section
        id="give"
        className="scroll-mt-20 border-y border-border/60 bg-muted/30"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
            {/* Зүүн: яагаад хандивлах вэ */}
            <div className="lg:sticky lg:top-24">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t.impactTitle}
              </h2>

              <div className="mt-8 space-y-5">
                {t.impactItems.map((item, i) => {
                  const meta = IMPACT_META[i];
                  const Icon = meta.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                <ShieldCheck className="size-3.5" />
                {t.badge}
              </div>
            </div>

            {/* Баруун: Хандиваа өгөх (интерактив) */}
            <DonateOptions labels={t} providers={providers} />
          </div>
        </div>
      </section>

      {/* Other ways */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.otherTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.otherLead}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="p-2">
              <CardHeader>
                <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-zinc-500 text-white shadow-md">
                  <Mail className="size-6" />
                </span>
                <CardTitle className="mt-4 text-lg">{t.checkTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>{t.checkPayTo}</p>
                <div>
                  <div className="font-medium text-foreground">
                    {t.checkAddressLabel}
                  </div>
                  <div className="mt-1">
                    Mongolian Heritage Center<br />
                    1301 S Wolf Road<br />
                    Prospect Heights, IL 60070<br />
                    USA
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                  <HeartHandshake className="size-6" />
                </span>
                <CardTitle className="mt-4 text-lg">
                  {t.matchingTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {t.matchingText}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tax note + back to contact */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
              <ShieldCheck className="size-5" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.taxNote}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 text-white hover:from-amber-500 hover:to-orange-500"
          >
            <Link href={lp("/donate/register")}>
              <ClipboardList className="size-4" />
              {dict.donateRegister.breadcrumb}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href={lp("/donors")}>
              <Heart className="size-4" />
              {dict.donors.breadcrumb}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href={lp("/contact")}>
              {dict.about.ctaContact}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
