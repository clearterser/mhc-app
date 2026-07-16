import Link from "next/link";
import { Construction, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localizedPath } from "@/lib/i18n";

/**
 * Агуулга нь хараахан бэлэн болоогүй хуудсуудын нийтлэг бүрхүүл.
 * `t` нь тухайн хуудасны толь бичгийн хэсэг (breadcrumb, h1, lead,
 * pendingTitle, pendingText, ctaContact түлхүүртэй).
 */
export function PendingPage({ lang, dict, t }) {
  const lp = (p) => localizedPath(p, lang);

  return (
    <>
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

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.h1}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center sm:p-12">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
            <Construction className="size-6" />
          </span>

          <h2 className="mt-5 text-xl font-bold tracking-tight">
            {t.pendingTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
            {t.pendingText}
          </p>

          <Button
            asChild
            className="mt-7 h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 text-white hover:from-amber-500 hover:to-orange-500"
          >
            <Link href={lp("/contact")}>
              {t.ctaContact}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
