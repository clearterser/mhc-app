import { notFound } from "next/navigation";
import { Nunito, Geist_Mono } from "next/font/google";

import "../globals.css";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/site-footer";
import { locales } from "@/lib/i18n";
import { getDictionary, hasLocale } from "./dictionaries";

// Font stack: Nunito → Nunito Fallback → Helvetica → Arial → sans-serif.
// next/font/google also auto-applies a metric-matched fallback (size-adjust) to reduce CLS.
const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  fallback: ["Nunito Fallback", "Helvetica", "Arial", "sans-serif"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${nunito.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar lang={lang} />
        <main className="flex-1">{children}</main>
        <SiteFooter lang={lang} dict={dict} />
      </body>
    </html>
  );
}
