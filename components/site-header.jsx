"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { locales, localizedPath } from "@/lib/i18n";

function buildNavLinks(dict) {
  return [
    { href: "/about", label: dict.nav.about },
    { href: "/governance", label: dict.nav.structure },
    { href: "/donate", label: dict.nav.donate },
    { href: "/contact", label: dict.nav.contact },
  ];
}

function switchPath(pathname, targetLang) {
  if (!pathname) return `/${targetLang}`;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${targetLang}`;
  if (locales.includes(parts[0])) parts[0] = targetLang;
  else parts.unshift(targetLang);
  return "/" + parts.join("/");
}

function LangSwitcher({ lang, dict, className }) {
  const pathname = usePathname();
  const other = lang === "mn" ? "en" : "mn";
  const otherLabel = dict.switchToLabel;
  return (
    <Link
      href={switchPath(pathname, other)}
      aria-label={`Switch language to ${otherLabel}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Languages className="size-3.5" />
      {otherLabel}
    </Link>
  );
}

export function SiteHeader({ lang, dict }) {
  const [open, setOpen] = useState(false);
  const navLinks = buildNavLinks(dict);
  const lp = (p) => localizedPath(p, lang);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href={lp("/")} className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt={dict.nav.logoAlt}
            width={40}
            height={40}
            className="size-10"
            priority
          />
          <span className="text-lg font-semibold tracking-tight">
            {dict.nav.brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={lp(link.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LangSwitcher lang={lang} dict={dict} className="h-9" />
          <Button
            asChild
            className="h-10 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 text-sm text-white shadow-md shadow-orange-500/25 hover:from-amber-500 hover:to-orange-500"
          >
            <Link href={lp("/donate")}>{dict.nav.ctaDonate}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background transition-[max-height] duration-300 ease-in-out md:hidden",
          open ? "max-h-[28rem]" : "max-h-0 border-t-0"
        )}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3 sm:px-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={lp(link.href)}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <LangSwitcher lang={lang} dict={dict} className="mt-2 h-10" />
          <Button
            asChild
            className="mt-2 h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
          >
            <Link href={lp("/donate")} onClick={() => setOpen(false)}>
              {dict.nav.ctaDonate}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
