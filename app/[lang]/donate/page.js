import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  GraduationCap,
  CalendarDays,
  Building2,
  CreditCard,
  Sparkles,
  Mail,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Clock,
  Landmark,
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
import { CopyValueButton } from "@/components/copy-value-button";
import { localizedPath } from "@/lib/i18n";
import { getDonationProviders } from "@/lib/donate-providers";
import { getDictionary, hasLocale } from "../dictionaries";

const IMPACT_META = [
  { icon: GraduationCap, gradient: "from-amber-500 to-orange-500" },
  { icon: CalendarDays, gradient: "from-rose-500 to-pink-500" },
  { icon: Building2, gradient: "from-sky-500 to-cyan-500" },
];

const PROVIDER_META = {
  zeffy: {
    icon: Sparkles,
    accent: "from-emerald-500 to-teal-500",
    border:
      "border-emerald-300/60 dark:border-emerald-900/60",
    tagClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    btnClass:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500",
    recommended: true,
  },
  stripe: {
    icon: CreditCard,
    accent: "from-violet-500 to-indigo-500",
    border: "border-border",
    tagClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    btnClass:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500",
  },
  paypal: {
    icon: HeartHandshake,
    accent: "from-sky-500 to-blue-500",
    border: "border-border",
    tagClass:
      "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
    btnClass:
      "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500",
  },
  zelle: {
    icon: Landmark,
    accent: "from-fuchsia-500 to-purple-600",
    border: "border-border",
    tagClass:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
    btnClass:
      "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-500 hover:to-purple-500",
  },
};

const PROVIDER_ORDER = ["zeffy", "stripe", "paypal", "zelle"];

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

      {/* Impact */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.impactTitle}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.impactItems.map((item, i) => {
            const meta = IMPACT_META[i];
            const Icon = meta.icon;
            return (
              <Card key={item.title} className="p-2">
                <CardHeader>
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <CardTitle className="mt-4 text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Suggested amounts */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.amountsTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.amountsLead}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {t.amounts.map((amount) => (
              <div
                key={amount.label}
                className="rounded-2xl border border-border bg-card px-5 py-6 text-center ring-1 ring-foreground/10"
              >
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                  {amount.value}
                </div>
                <div className="mt-1.5 text-xs font-medium text-muted-foreground">
                  {amount.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider selection */}
      <section id="providers" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.providersTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.providersLead}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDER_ORDER.map((key) => {
            const meta = PROVIDER_META[key];
            const tProv = t.providers[key];
            const cfg = providers[key];
            const Icon = meta.icon;
            const isReady = cfg.configured;
            const isZelle = key === "zelle";

            return (
              <Card
                key={key}
                className={`p-2 ${meta.border} ${
                  meta.recommended
                    ? "ring-2 ring-emerald-400/40 dark:ring-emerald-700/40"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accent} text-white shadow-md`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${meta.tagClass}`}
                    >
                      {tProv.tag}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl">{tProv.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="flex-1 leading-relaxed">
                    {tProv.description}
                  </CardDescription>

                  {isZelle ? (
                    isReady ? (
                      <div className="mt-6 space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          {tProv.recipientLabel}
                        </div>
                        {cfg.email ? (
                          <div className="flex flex-col gap-2">
                            <code className="block rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs break-all">
                              {cfg.email}
                            </code>
                            <CopyValueButton
                              value={cfg.email}
                              label={tProv.copyEmailCta}
                              copiedLabel={tProv.copiedLabel}
                              className={`h-10 w-full rounded-xl ${meta.btnClass}`}
                            />
                          </div>
                        ) : null}
                        {cfg.phone ? (
                          <div className="flex flex-col gap-2 pt-1">
                            <code className="block rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
                              {cfg.phone}
                            </code>
                            <CopyValueButton
                              value={cfg.phone}
                              label={tProv.copyPhoneCta}
                              copiedLabel={tProv.copiedLabel}
                              className={`h-10 w-full rounded-xl ${meta.btnClass}`}
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <Button
                        disabled
                        className="mt-6 h-11 w-full rounded-xl"
                        variant="outline"
                      >
                        <Clock className="size-4" />
                        {t.comingSoon}
                      </Button>
                    )
                  ) : isReady ? (
                    <Button
                      asChild
                      className={`mt-6 h-11 w-full rounded-xl ${meta.btnClass}`}
                    >
                      <a
                        href={cfg.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Heart className="size-4" />
                        {tProv.cta}
                        <ExternalLink className="ml-auto size-3.5 opacity-70" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="mt-6 h-11 w-full rounded-xl"
                      variant="outline"
                    >
                      <Clock className="size-4" />
                      {t.comingSoon}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
