import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { localizedPath } from "@/lib/i18n";
import { getDictionary, hasLocale } from "../dictionaries";

const FACEBOOK_URL = "https://www.facebook.com/mongolianheritagecenter";
const INFO_ICONS = [MapPin, Phone, Mail, Globe];

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
  };
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.contact;
  const lp = (p) => localizedPath(p, lang);

  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    t.mapAddress
  )}&output=embed`;
  const mapLinkOut = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    t.mapAddress
  )}`;

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
            <span className="text-foreground">{t.breadcrumb}</span>
          </nav>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.h1Pre}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              {t.h1Highlight}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t.lead}
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t.infoTitle}</h2>
            <p className="mt-2 text-muted-foreground">{t.infoLead}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {t.info.map((info, i) => {
                const Icon = INFO_ICONS[i];
                const isExternal = info.href?.startsWith("http");
                const body = (
                  <>
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-semibold">{info.title}</h3>
                    <div className="mt-1 space-y-0.5 text-sm break-words text-muted-foreground">
                      {info.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </>
                );
                const className =
                  "block rounded-2xl border border-border bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:border-amber-300 dark:hover:border-amber-900";
                return info.href ? (
                  <a
                    key={info.title}
                    href={info.href}
                    className={className}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={info.title} className={className}>
                    {body}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-medium">{t.followLabel}</span>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <FacebookIcon className="size-4" />
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t.formTitle}</h2>
            <p className="mt-2 text-muted-foreground">{t.formLead}</p>
            <div className="mt-8">
              <ContactForm dict={t.form} />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t.mapTitle}</h2>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 text-amber-600" />
                {t.mapAddress}
              </p>
            </div>
            <a
              href={mapLinkOut}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-amber-600 hover:underline"
            >
              {t.mapLink}
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border ring-1 ring-foreground/10">
            <iframe
              title={t.mapIframeTitle}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
