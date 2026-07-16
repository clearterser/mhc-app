import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

import { localizedPath } from "@/lib/i18n";

export function SiteFooter({ lang, dict }) {
  const lp = (p) => localizedPath(p, lang);
  const t = dict.footer;
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      title: t.linksTitle,
      links: [
        { href: lp("/"), label: t.linkHome },
        { href: lp("/about"), label: t.linkAbout },
        { href: lp("/chairman"), label: t.linkChairman },
        { href: lp("/governance"), label: t.linkStructure },
        { href: lp("/team"), label: t.linkTeam },
        { href: lp("/events"), label: t.linkEvents },
        { href: lp("/bylaws"), label: t.linkBylaws },
        { href: lp("/advisory-bylaws"), label: t.linkAdvisoryBylaws },
        { href: lp("/contact"), label: t.linkContact },
      ],
    },
    {
      title: t.supportTitle,
      links: [
        { href: lp("/donate"), label: t.linkDonate },
        { href: lp("/membership"), label: t.linkMembership },
        { href: lp("/donors"), label: t.linkDonors },
        { href: lp("/rooms"), label: t.linkRooms },
        { href: lp("/volunteer"), label: t.linkVolunteer },
        { href: lp("/reports"), label: t.linkReports },
        { href: lp("/faq"), label: t.linkFaq },
        { href: lp("/contact"), label: t.linkPartner },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href={lp("/")} className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt={dict.nav.logoAlt}
                width={40}
                height={40}
                className="size-10"
              />
              <span className="text-lg font-semibold tracking-tight">
                {dict.nav.brand}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.tagline}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span>{t.addressLine}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-amber-500" />
                <a href="tel:+18722310808" className="hover:text-foreground">
                  +1 (872) 231-0808
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-amber-500" />
                <a
                  href="mailto:info@mongolianheritagecenter.org"
                  className="break-all hover:text-foreground"
                >
                  info@mongolianheritagecenter.org
                </a>
              </li>
            </ul>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t.copyright.replace("{year}", String(year))}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href={lp("/terms")} className="hover:text-foreground">
              {t.terms}
            </Link>
            <Link href={lp("/privacy")} className="hover:text-foreground">
              {t.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
