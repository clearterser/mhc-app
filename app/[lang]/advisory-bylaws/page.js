import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, ArrowRight, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BylawsDocument } from "@/components/bylaws-document";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.advisoryBylaws.metaTitle,
    description: dict.advisoryBylaws.metaDescription,
  };
}

export default async function AdvisoryBylawsPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.advisoryBylaws;
  const lp = (p) => localizedPath(p, lang);

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 size-80 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-600/15" />
          <div className="absolute -top-10 right-0 size-80 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-600/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={lp("/")} className="hover:text-foreground">
              {dict.common.home}
            </Link>
            <span>/</span>
            <Link href={lp("/governance")} className="hover:text-foreground">
              {dict.governance.breadcrumb}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t.breadcrumb}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t.h1}
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
              <Users className="size-3.5" />
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

        {/* CTA back to main bylaws */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div>
            <h3 className="text-lg font-semibold">{t.viewMainBylaws}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.viewMainBylawsLead}
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href={lp("/bylaws")}>
              <ScrollText className="size-4" />
              {dict.bylaws.h1}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
