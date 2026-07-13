import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Handshake,
  Heart,
  Globe,
  Target,
  Eye,
  CalendarDays,
  MapPin,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { OrgChart } from "@/components/org-chart";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

const WEBSITE_URL = "https://mongolianheritagecenter.org";
const FACEBOOK_URL = "https://www.facebook.com/mongolianheritagecenter";

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

const FACT_ICONS = [CalendarDays, MapPin, Building2];

const GOAL_META = [
  { icon: Users, gradient: "from-amber-500 to-orange-500" },
  { icon: GraduationCap, gradient: "from-rose-500 to-pink-500" },
  { icon: Handshake, gradient: "from-sky-500 to-cyan-500" },
];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.about;
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
            <span className="text-foreground">{t.breadcrumb}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.h1Pre}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              {t.h1Highlight}
            </span>{" "}
            {t.h1Post}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Intro + quick facts */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.introTitle}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>{t.introP1}</p>
              <p>{t.introP2}</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                  <Globe className="size-4" />
                  {t.websiteBtn}
                </a>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon className="size-4" />
                  {t.facebookBtn}
                </a>
              </Button>
            </div>
          </div>

          <Card className="p-2">
            <CardHeader>
              <CardTitle className="text-lg">{t.factsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-5">
                {t.facts.map((fact, i) => {
                  const Icon = FACT_ICONS[i];
                  return (
                    <div key={fact.label} className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-amber-600">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          {fact.label}
                        </dt>
                        <dd className="font-medium">{fact.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-2">
          <Card className="p-2">
            <CardHeader>
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                <Target className="size-6" />
              </span>
              <CardTitle className="mt-4 text-xl">{t.missionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {t.missionText}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardHeader>
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
                <Eye className="size-6" />
              </span>
              <CardTitle className="mt-4 text-xl">{t.visionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {t.visionText}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Goals */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.goalsTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.goalsLead}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {dict.home.goals.map((goal, i) => {
            const meta = GOAL_META[i];
            const Icon = meta.icon;
            return (
              <Card key={goal.title} className="p-2">
                <CardHeader>
                  <span
                    className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <CardTitle className="mt-4 text-xl">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {goal.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Chairman's greeting */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.greetingTitle}
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <figure className="lg:sticky lg:top-24">
              <Image
                src="/about/chairman.png"
                alt={t.greetingChairmanAlt}
                width={624}
                height={292}
                className="h-auto w-full rounded-2xl border border-border object-cover ring-1 ring-foreground/10"
              />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                {t.greetingCaption}
              </figcaption>
            </figure>

            <div>
              <p className="text-lg font-medium">{t.greetingSalutation}</p>
              <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                {t.greetingParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-6 font-semibold">{t.greetingSign}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.structureTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.structureLead}</p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <OrgChart dict={dict.governance.nodes} />
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href={lp("/governance")}>
              {t.structureCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Donation */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="overflow-hidden rounded-3xl border border-border bg-card ring-1 ring-foreground/10">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                  <Heart className="size-4" />
                  {t.donateBadge}
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t.donateTitle}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {t.donateText}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.donateEinLabel}{" "}
                  <span className="font-semibold text-foreground">
                    93-3162554
                  </span>
                </p>
              </div>

              <div className="lg:text-right">
                <Button
                  asChild
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-7 text-base text-white shadow-md shadow-orange-500/25 hover:from-amber-500 hover:to-orange-500 sm:w-auto"
                >
                  <Link href={lp("/donate")}>
                    <Heart className="size-4" />
                    {t.donateCta}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-orange-50">{t.ctaLead}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-xl bg-white px-7 text-base text-orange-700 shadow-lg hover:bg-orange-50"
              >
                <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                  <Globe className="size-4" />
                  {t.ctaWebsite}
                </a>
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
