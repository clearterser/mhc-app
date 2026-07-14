import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { locales, defaultLocale } from "@/lib/i18n";

// Clerk түлхүүр тохируулагдсан үед /admin Clerk-ээр хамгаалагдана;
// үгүй бол хуучин шигээ (нууц үгийн горим) ажиллана.
const hasClerk = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginRoute = createRouteMatcher(["/admin/login(.*)"]);

function localeRedirect(request) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) return;

  // Always open in the default locale (Mongolian) regardless of the
  // browser's Accept-Language header. Visitors can switch with the
  // language toggle in the header.
  request.nextUrl.pathname = `/${defaultLocale}${
    pathname === "/" ? "" : pathname
  }`;
  return NextResponse.redirect(request.nextUrl);
}

function plainHandler(request) {
  if (isAdminRoute(request)) return;
  return localeRedirect(request);
}

export default hasClerk
  ? clerkMiddleware(async (auth, request) => {
      if (isAdminRoute(request)) {
        // Нэвтрэх хуудаснаас бусад /admin зам нэвтрэлт шаардана.
        if (!isAdminLoginRoute(request)) {
          await auth.protect({
            unauthenticatedUrl: new URL(
              "/admin/login",
              request.url
            ).toString(),
          });
        }
        return;
      }
      return localeRedirect(request);
    })
  : plainHandler;

export const config = {
  // receipt нь locale-гүй нээлттэй route тул locale redirect-ээс чөлөөлнө.
  // admin одоо matcher-т орсон — Clerk-ийн auth context-д шаардлагатай.
  matcher: ["/((?!_next|api|receipt|favicon.ico|.*\\..*).*)"],
};
