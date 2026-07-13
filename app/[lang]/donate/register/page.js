import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ClipboardList,
  Heart,
  FileText,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DonationRegisterForm } from "@/components/donation-register-form";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../../dictionaries";

const STEP_META = [
  { icon: Heart, gradient: "from-amber-500 to-orange-500" },
  { icon: FileText, gradient: "from-rose-500 to-pink-500" },
  { icon: BadgeCheck, gradient: "from-emerald-500 to-teal-500" },
];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.donateRegister.metaTitle,
    description: dict.donateRegister.metaDescription,
  };
}

export default async function DonateRegisterPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.donateRegister;
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
            <Link href={lp("/donate")} className="hover:text-foreground">
              {dict.donate.breadcrumb}
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
              <ClipboardList className="size-3.5" />
              {t.badge}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.stepsTitle}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.steps.map((step, i) => {
              const meta = STEP_META[i];
              const Icon = meta.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10"
                >
                  <span className="absolute top-6 right-6 text-4xl font-bold text-muted-foreground/15">
                    {i + 1}
                  </span>
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">{t.formTitle}</h2>
          <p className="mt-2 text-muted-foreground">{t.formLead}</p>
          <div className="mt-8">
            <DonationRegisterForm dict={t.form} />
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t.helpTitle}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t.helpText}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 shrink-0 rounded-xl px-5"
            >
              <Link href={lp("/contact")}>
                {t.helpCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
