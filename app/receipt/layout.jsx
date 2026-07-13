import { Nunito, Geist_Mono } from "next/font/google";

import "../globals.css";

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

export const metadata = {
  title: "Хандивын баримт — Монгол Өв Соёлын Төв",
  robots: { index: false, follow: false },
};

export default function ReceiptLayout({ children }) {
  return (
    <html
      lang="mn"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-muted/20">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
