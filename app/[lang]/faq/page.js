import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpCircle, ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FaqView } from "@/components/faq-view";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.faq.metaTitle,
    description: dict.faq.metaDescription,
  };
}

export default async function FaqPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.faq;
  const lp = (p) => localizedPath(p, lang);

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

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t.h1}
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              <HelpCircle className="size-3.5" />
              {t.badge}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <FaqView dict={t} />
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                <Mail className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{t.ctaTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.ctaLead}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 text-white hover:from-amber-500 hover:to-orange-500"
            >
              <Link href={lp("/contact")}>
                {t.ctaButton}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
