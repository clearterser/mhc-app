import { ClerkProvider } from "@clerk/nextjs";
import { Nunito, Geist_Mono } from "next/font/google";

import "../globals.css";
import { clerkEnabled } from "@/lib/admin-auth";

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
  title: "Админ — Монгол Өв Соёлын Төв",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  const content = (
    <html
      lang="mn"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-muted/20">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );

  // ClerkProvider нь түлхүүргүй үед алдаа шиддэг тул зөвхөн
  // Clerk тохируулагдсан үед ороож өгнө.
  return clerkEnabled() ? (
    <ClerkProvider dynamic>{content}</ClerkProvider>
  ) : (
    content
  );
}
