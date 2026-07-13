import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  ScrollText,
  ArrowRight,
  Users,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GovernanceView } from "@/components/governance-view";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.governance.metaTitle,
    description: dict.governance.metaDescription,
  };
}

export default async function GovernancePage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.governance;
  const lp = (p) => localizedPath(p, lang);

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 size-80 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-600/15" />
          <div className="absolute -top-10 right-0 size-80 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={lp("/")} className="hover:text-foreground">
              {dict.common.home}
            </Link>
            <span>/</span>
            <Link href={lp("/about")} className="hover:text-foreground">
              {dict.about.breadcrumb}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t.breadcrumb}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t.h1}
            </h1>
            <Link
              href={lp("/bylaws")}
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:border-amber-800 dark:hover:bg-amber-950"
            >
              <Building2 className="size-3.5" />
              {t.badge}
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl px-4 text-sm"
            >
              <Link href={lp("/bylaws")}>
                <ScrollText className="size-4" />
                {t.viewBylaws}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl px-4 text-sm"
            >
              <Link href={lp("/advisory-bylaws")}>
                <Users className="size-4" />
                {t.viewAdvisoryBylaws}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl px-4 text-sm"
            >
              <Link href={lp("/team")}>
                <UsersRound className="size-4" />
                {t.viewTeam}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <GovernanceView dict={t} aboutHref={lp("/about")} />
    </>
  );
}
