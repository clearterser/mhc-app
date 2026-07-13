import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield, ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BylawsDocument } from "@/components/bylaws-document";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
  };
}

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.privacy;
  const lp = (p) => localizedPath(p, lang);

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 size-80 rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-600/15" />
          <div className="absolute -top-10 right-0 size-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />
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
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
              <Shield className="size-3.5" />
              {t.badge}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <BylawsDocument dict={t} />

        {/* CTA to Terms */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{t.viewTerms}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.viewTermsLead}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-xl px-4">
              <Link href={lp("/terms")}>
                {t.viewTerms}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
