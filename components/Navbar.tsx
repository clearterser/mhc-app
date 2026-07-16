"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronUp, Languages } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { locales } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Төрлүүд (Types)                                                    */
/* ------------------------------------------------------------------ */

export interface NavChild {
  /** Дэд цэсэнд харагдах нэр */
  label: string;
  /** Хэлний угтваргүй зам, ж: "/about" эсвэл "/#focus" */
  href: string;
}

export interface NavItem {
  label: string;
  /** Энгийн линк бол href, дэд цэстэй бол children */
  href?: string;
  children?: NavChild[];
}

export interface NavbarProps {
  /** Идэвхтэй хэл — линкүүдийг /{lang}/... болгож угтварлана */
  lang?: string;
}

/* ------------------------------------------------------------------ */
/*  Цэсийн өгөгдөл (Menu data)                                         */
/* ------------------------------------------------------------------ */

const MENU: NavItem[] = [
  { label: "Нүүр", href: "/" },
  {
    label: "Бидний тухай",
    children: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Төвийн бүтэц, зохион байгуулалт", href: "/governance" },
      { label: "Төвийн үйл ажиллагааны гол чиглэлүүд", href: "/#focus" },
      { label: "Удирдах зөвлөлийн даргын мэндчилгээ", href: "/chairman" },
      { label: "Удирдах зөвлөл болон менежментийн баг", href: "/team" },
      { label: "Зөвлөхүүдийн зөвлөл", href: "/advisory-bylaws" },
       { label: "Санхүү болон үйл ажиллагааны тайлан", href: "/reports" },
    ],
  },
  {
    label: "Таны оролцоо",
    children: [
      { label: "Хандив өргөх", href: "/donate" },
      { label: "Гишүүнчлэл", href: "/membership" },
      { label: "Сайн дурын ажил", href: "/volunteer" },
      { label: "Хандивын ангилал", href: "/donate/register" },
      { label: "Хандивлагчид", href: "/donors" },
      { label: "Өрөөний түрээс", href: "/rooms" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const CTA: NavChild = { label: "Хандив өргөх", href: "/donate" };

const BRAND = "Монгол Өв Соёлын Төв";
const LOGO_ALT = "Монгол Өв Соёлын Төв лого";

/** Хэл солих товчны шошго */
const LOCALE_LABEL: Record<string, string> = { mn: "МОН", en: "EN" };

/* ------------------------------------------------------------------ */
/*  Туслах функцууд                                                    */
/* ------------------------------------------------------------------ */

/** Нөхцөлт классуудыг нэгтгэнэ */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** "/about" → "/mn/about", "/" → "/mn", "/#focus" → "/mn#focus" */
function localized(path: string, lang: string): string {
  if (!path.startsWith("/")) return `/${lang}/${path}`;
  if (path === "/") return `/${lang}`;
  if (path.startsWith("/#")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}

/** Одоогийн замын хэлний угтварыг сольж, тухайн хуудсан дээрээ үлдэнэ */
function switchPath(pathname: string | null, targetLang: string): string {
  if (!pathname) return `/${targetLang}`;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${targetLang}`;
  if (locales.includes(parts[0])) parts[0] = targetLang;
  else parts.unshift(targetLang);
  return "/" + parts.join("/");
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export default function Navbar({ lang = "mn" }: NavbarProps) {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  /** Desktop дээр нээлттэй байгаа dropdown-ий индекс */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  /** Mobile accordion-ий нээлттэй индекс */
  const [accordionIndex, setAccordionIndex] = useState<number | null>(null);

  const navRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otherLang = lang === "mn" ? "en" : "mn";

  /* --- Гүйлгэхэд header-т сүүдэр + бүдгэрсэн дэвсгэр өгнө --- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- Гадна талд дарахад desktop dropdown хаагдана --- */
  useEffect(() => {
    if (openIndex === null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openIndex]);

  /* --- Escape товч бүх цэсийг хаана --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenIndex(null);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* --- Mobile цэс нээлттэй үед арын гүйлтийг түгжинэ --- */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /* --- Timer цэвэрлэгээ --- */
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  /* --- Зам солигдоход бүх цэсийг хаана.
     React-ийн "render үед state тохируулах" загвар: effect ашиглавал
     нэмэлт дахин render үүсгэдэг тул өмнөх замыг state-д хадгалж
     харьцуулна (back/forward товчоор шилжихэд ч ажиллана). --- */
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpenIndex(null);
    setMobileOpen(false);
    setAccordionIndex(null);
  }

  /* --- Hover: хулгана dropdown руу шилжих хугацаа өгнө --- */
  const openNow = useCallback((i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(i);
  }, []);

  const closeSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIndex(null), 140);
  }, []);

  /** Тухайн зам идэвхтэй эсэх (hash-гүйгээр харьцуулна) */
  const isActive = useCallback(
    (href: string) => {
      const target = localized(href, lang).split("#")[0];
      if (!pathname) return false;
      if (target === `/${lang}`) return pathname === `/${lang}`;
      return pathname === target || pathname.startsWith(`${target}/`);
    },
    [pathname, lang],
  );

  /** Дэд цэсийн аль нэг нь идэвхтэй бол эцэг цэсийг тодруулна */
  const isGroupActive = useCallback(
    (item: NavItem) => item.children?.some((c) => isActive(c.href)) ?? false,
    [isActive],
  );

  return (
    <header
      className={cx(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border/60 bg-background/80 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div
        ref={navRef}
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        {/* ---------------- Лого ---------------- */}
        <Link
          href={localized("/", lang)}
          className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Image
            src="/logo.svg"
            alt={LOGO_ALT}
            width={40}
            height={40}
            className="size-10"
            priority
          />
          <span className="hidden text-base font-semibold tracking-tight sm:block">
            {BRAND}
          </span>
        </Link>

        {/* ---------------- Desktop цэс ---------------- */}
        <nav className="hidden items-center gap-1 lg:flex">
          {MENU.map((item, i) => {
            /* --- Энгийн линк --- */
            if (!item.children) {
              const active = isActive(item.href!);
              return (
                <Link
                  key={item.label}
                  href={localized(item.href!, lang)}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400",
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            /* --- Дэд цэстэй (dropdown) --- */
            const open = openIndex === i;
            const groupActive = isGroupActive(item);

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openNow(i)}
                onMouseLeave={closeSoon}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-haspopup="menu"
                  className={cx(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    open || groupActive
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400",
                  )}
                >
                  {item.label}
                  {open ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 z-50 pt-2"
                    >
                      <ul
                        role="menu"
                        className="w-80 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-xl ring-1 ring-foreground/5"
                      >
                        {item.children.map((child) => {
                          const active = isActive(child.href);
                          return (
                            <li key={child.href} role="none">
                              <Link
                                role="menuitem"
                                href={localized(child.href, lang)}
                                onClick={() => setOpenIndex(null)}
                                className={cx(
                                  "block rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                                  active
                                    ? "bg-amber-50 font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                                    : "text-muted-foreground hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300",
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* ---------------- Баруун тал: Хэл + CTA + Hamburger ---------------- */}
        <div className="flex items-center gap-2">
          <Link
            href={switchPath(pathname, otherLang)}
            aria-label={`Switch language to ${LOCALE_LABEL[otherLang]}`}
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:inline-flex"
          >
            <Languages className="size-3.5" />
            {LOCALE_LABEL[otherLang]}
          </Link>

          <Link
            href={localized(CTA.href, lang)}
            className="hidden rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-500 hover:to-orange-500 hover:shadow-lg hover:shadow-orange-500/30 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none lg:inline-block"
          >
            {CTA.label}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Цэс нээх"
            aria-expanded={mobileOpen}
            className="flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted hover:text-amber-600 lg:hidden dark:hover:text-amber-400"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* ---------------- Mobile цэс (хажуунаас гулсана) ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Бүрхүүл */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Гулсаж орж ирэх самбар */}
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col bg-background shadow-2xl lg:hidden"
            >
              {/* Самбарын толгой */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
                <span className="flex items-center gap-2.5">
                  <Image
                    src="/logo.svg"
                    alt={LOGO_ALT}
                    width={36}
                    height={36}
                    className="size-9"
                  />
                  <span className="text-sm font-semibold">{BRAND}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Цэс хаах"
                  className="flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Цэсийн жагсаалт */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {MENU.map((item, i) => {
                  /* --- Энгийн линк --- */
                  if (!item.children) {
                    const active = isActive(item.href!);
                    return (
                      <Link
                        key={item.label}
                        href={localized(item.href!, lang)}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "block rounded-xl px-3 py-3 text-base font-medium transition-all duration-200",
                          active
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                            : "text-foreground hover:bg-muted hover:text-amber-600 dark:hover:text-amber-400",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  /* --- Accordion --- */
                  const open = accordionIndex === i;
                  const groupActive = isGroupActive(item);

                  return (
                    <div
                      key={item.label}
                      className="border-b border-border/60 last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => setAccordionIndex(open ? null : i)}
                        aria-expanded={open}
                        className={cx(
                          "flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-medium transition-all duration-200",
                          open || groupActive
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-foreground hover:text-amber-600 dark:hover:text-amber-400",
                        )}
                      >
                        {item.label}
                        {open ? (
                          <ChevronUp className="size-4 shrink-0" />
                        ) : (
                          <ChevronDown className="size-4 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-0.5 pb-2 pl-3">
                              {item.children.map((child) => {
                                const active = isActive(child.href);
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={localized(child.href, lang)}
                                      onClick={() => setMobileOpen(false)}
                                      className={cx(
                                        "block rounded-lg border-l-2 py-2.5 pl-4 text-sm transition-all duration-200",
                                        active
                                          ? "border-amber-600 font-medium text-amber-700 dark:text-amber-300"
                                          : "border-border text-muted-foreground hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* Самбарын хөл: Хэл солих + CTA */}
              <div className="shrink-0 space-y-2 border-t border-border p-4">
                <Link
                  href={switchPath(pathname, otherLang)}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Languages className="size-3.5" />
                  {LOCALE_LABEL[otherLang]}
                </Link>
                <Link
                  href={localized(CTA.href, lang)}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all duration-200 hover:from-amber-500 hover:to-orange-500"
                >
                  {CTA.label}
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
