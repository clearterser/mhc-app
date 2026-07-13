import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Gift,
  HandHelping,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { localizedPath } from "@/lib/i18n";
import { getMergedDonors } from "@/lib/donors-live";
import { MoneyDonorsList } from "@/components/money-donors-list";
import { GoodsDonorsList } from "@/components/goods-donors-list";
import { ServiceDonorsList } from "@/components/service-donors-list";
import { getDictionary, hasLocale } from "../dictionaries";

// ISR: админ дээр баталгаажуулсан бүртгэл хамгийн ихдээ 5 минутын дотор
// (админы үйлдэл дээр revalidatePath дуудагддаг тул ихэвчлэн шууд) харагдана.
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.donors.metaTitle,
    description: dict.donors.metaDescription,
  };
}

export default async function DonorsPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.donors;
  const lp = (p) => localizedPath(p, lang);
  const { donors, goodsDonors, serviceDonors, anonymousCount } =
    await getMergedDonors();

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
              <Sparkles className="size-3.5" />
              {t.badge}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Money donations */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
            <Heart className="size-3.5" />
            {t.moneyTitle}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.rollTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.rollLead}</p>
        </div>

        <MoneyDonorsList
          donors={donors}
          lang={lang}
          labels={t}
          donateHref={lp("/donate")}
          contactHref={lp("/contact")}
        />

        {/* Anonymous + note */}
        <div className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {anonymousCount > 0 ? (
            <p className="flex items-start gap-2.5">
              <Heart className="mt-0.5 size-4 shrink-0 text-rose-500" />
              {t.anonymousNote.replace("{count}", String(anonymousCount))}
            </p>
          ) : null}
          <p>{t.updatedNote}</p>
        </div>
      </section>

      {/* In-kind donations */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Gift className="size-3.5" />
              {t.goodsTitle}
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.goodsTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.goodsLead}</p>
          </div>

          <GoodsDonorsList donors={goodsDonors} lang={lang} labels={t} />
        </div>
      </section>

      {/* Service / volunteer donations */}
      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
              <HandHelping className="size-3.5" />
              {t.serviceTitle}
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.serviceTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.serviceLead}</p>
          </div>

          <ServiceDonorsList donors={serviceDonors} lang={lang} labels={t} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
          >
            <div className="absolute -top-20 -right-10 size-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-white/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-orange-50">{t.ctaLead}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-xl bg-white px-8 text-base text-orange-700 shadow-lg hover:bg-orange-50"
              >
                <Link href={lp("/donate")}>
                  <Heart className="size-4" />
                  {t.ctaDonate}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/40 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={lp("/donate/register")}>
                  <ClipboardList className="size-4" />
                  {dict.donateRegister.breadcrumb}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/40 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={lp("/contact")}>
                  {t.ctaContact}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
