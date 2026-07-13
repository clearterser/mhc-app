import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

// Gradient palette cycled across avatars for visual variety.
const AVATAR_GRADIENTS = [
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-indigo-500 to-blue-500",
];

function initials(name) {
  if (!name) return "·";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toLocaleUpperCase("mn-MN"))
    .join("");
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.team.metaTitle,
    description: dict.team.metaDescription,
  };
}

export default async function TeamPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.team;
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

          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.h1}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Team sections */}
      {t.sections.map((section) => {
        let idx = 0;
        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-20 border-b border-border/40 last:border-b-0"
          >
            <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {section.title}
                </h2>
                {section.lead ? (
                  <p className="mt-4 text-lg text-muted-foreground">
                    {section.lead}
                  </p>
                ) : null}
              </div>

              <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {section.members.map((member) => {
                  const gradient =
                    AVATAR_GRADIENTS[idx++ % AVATAR_GRADIENTS.length];
                  return (
                    <li
                      key={member.id}
                      className="flex flex-col items-center text-center"
                    >
                      {member.image ? (
                        <div className="relative size-32 overflow-hidden rounded-full shadow-md ring-1 ring-foreground/10">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="128px"
                            className="object-cover object-center"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex size-32 items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-md ring-1 ring-foreground/10`}
                        >
                          <span className="text-4xl font-bold text-white/95 select-none">
                            {initials(member.name)}
                          </span>
                        </div>
                      )}
                      <div className="mt-4 text-base font-semibold leading-tight">
                        {member.name}
                      </div>
                      <div className="mt-1 text-sm leading-snug text-muted-foreground">
                        {member.role}
                      </div>
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          aria-label={`${t.emailLabel} — ${member.name}`}
                          className="mt-3 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Mail className="size-4" />
                        </a>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}

      {/* CTA to governance */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
              <Building2 className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold">{t.cta.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.cta.lead}</p>
            </div>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-xl px-5">
            <Link href={lp("/governance")}>
              {t.cta.button}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
