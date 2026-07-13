import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  GraduationCap,
  Handshake,
  Languages,
  ScrollText,
  Library,
  Presentation,
  Music,
  Trophy,
  UtensilsCrossed,
  Flower,
  PartyPopper,
  Store,
  HeartHandshake,
  HandHeart,
  Building2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { localizedPath } from "@/lib/i18n";
import Testimonial01Inner from "@/components/shadcn-space/blocks/testimonial-02/testimonial";
import { getDictionary, hasLocale } from "./dictionaries";

// Fallback portraits for items in dict.testimonials that don't ship a local image.
const TESTIMONIAL_FALLBACK_IMAGES = [
  "https://images.shadcnspace.com/assets/profiles/testimonial-user.png",
  "https://images.shadcnspace.com/assets/profiles/testimonial-user-2.png",
];

const GOAL_META = [
  { icon: Users, gradient: "from-amber-500 to-orange-500" },
  { icon: GraduationCap, gradient: "from-rose-500 to-pink-500" },
  { icon: Handshake, gradient: "from-sky-500 to-cyan-500" },
];

const FOCUS_META = [
  { icon: Languages, gradient: "from-amber-500 to-orange-500" },
  { icon: ScrollText, gradient: "from-rose-500 to-pink-500" },
  { icon: Library, gradient: "from-emerald-500 to-teal-500" },
  { icon: Presentation, gradient: "from-sky-500 to-cyan-500" },
  { icon: Music, gradient: "from-violet-500 to-indigo-500" },
  { icon: Trophy, gradient: "from-orange-500 to-amber-500" },
  { icon: UtensilsCrossed, gradient: "from-fuchsia-500 to-purple-500" },
  { icon: Flower, gradient: "from-teal-500 to-cyan-500" },
  { icon: PartyPopper, gradient: "from-rose-500 to-red-500" },
  { icon: Store, gradient: "from-amber-500 to-yellow-500" },
  { icon: HeartHandshake, gradient: "from-pink-500 to-rose-500" },
  { icon: HandHeart, gradient: "from-red-500 to-orange-500" },
];

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
  };
}

export default async function Home({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.home;
  const lp = (p) => localizedPath(p, lang);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background photo */}
        <Image
          src="/hero-chicago.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center opacity-45 dark:opacity-30"
        />
        {/* Soft top-to-bottom overlay so text stays readable on the image */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-background/30 via-background/75 to-background"
        />
        {/* Decorative blobs (existing) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-24 size-96 rounded-full bg-amber-400/30 blur-3xl dark:bg-amber-600/20" />
          <div className="absolute -top-16 right-0 size-96 rounded-full bg-rose-400/30 blur-3xl dark:bg-rose-600/20" />
          <div className="absolute top-40 left-1/3 size-80 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              <Sparkles className="size-4" />
              {t.badge}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              {t.h1Pre}{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                {t.h1Highlight}
              </span>{" "}
              {t.h1Post}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {t.lead}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-7 text-base text-white shadow-lg shadow-orange-500/30 hover:from-amber-500 hover:to-orange-500"
              >
                <Link href={lp("/donate")}>
                  <Heart className="size-4" />
                  {t.ctaDonate}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl px-7 text-base"
              >
                <Link href={lp("/about")}>
                  {t.ctaAbout}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">{t.footnote}</p>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:px-8 lg:grid-cols-4">
          {t.facts.map((fact) => (
            <div key={fact.label} className="text-center">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {fact.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {fact.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section id="goals" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.goalsTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.goalsLead}</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {t.goals.map((goal, i) => {
              const meta = GOAL_META[i];
              const Icon = meta.icon;
              return (
                <Card
                  key={goal.title}
                  className="p-2 transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <CardTitle className="mt-4 text-lg">{goal.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {goal.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section
        id="focus"
        className="scroll-mt-20 border-y border-border/60 bg-muted/30"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.focusTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.focusLead}</p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.focusAreas.map((area, i) => {
              const meta = FOCUS_META[i];
              const Icon = meta.icon;
              return (
                <Card
                  key={area.title}
                  className="p-2 transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <span
                      className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <CardTitle className="mt-3 text-base">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {area.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="scroll-mt-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.communityTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t.communityLead}
            </p>

            <ul className="mt-8 space-y-4">
              {t.communityPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber-500" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-9 h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 text-white hover:from-amber-500 hover:to-orange-500"
            >
              <Link href={lp("/about")}>
                {t.communityCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <Card className="p-2">
            <CardHeader>
              <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                <Building2 className="size-6" />
              </span>
              <CardTitle className="mt-4 text-xl">{t.buildingTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">{t.buildingP1}</p>
              <p className="leading-relaxed">{t.buildingP2}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      {(() => {
        let fbIndex = 0;
        const items = dict.testimonials.items.map((item) => ({
          quote: item.quote,
          author: item.name,
          role: item.role,
          image:
            item.image ??
            TESTIMONIAL_FALLBACK_IMAGES[
              fbIndex++ % TESTIMONIAL_FALLBACK_IMAGES.length
            ],
        }));
        return (
          <Testimonial01Inner
            badge={dict.testimonials.badge}
            title={dict.testimonials.title}
            testimonials={items}
          />
        );
      })()}

      {/* Donate */}
      <section id="donate" className="scroll-mt-20 px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
          >
            <div className="absolute -top-20 -right-10 size-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-white/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.donateTitle}
            </h2>
            <p className="mt-4 text-lg text-orange-50">{t.donateLead}</p>
            <p className="mt-2 text-sm text-orange-100/90">{t.donateEin}</p>
            <Button
              asChild
              className="mt-8 h-12 rounded-xl bg-white px-8 text-base text-orange-700 shadow-lg hover:bg-orange-50"
            >
              <Link href={lp("/donate")}>
                <Heart className="size-4" />
                {t.ctaDonate}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
