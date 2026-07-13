import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

export function proxy(request) {
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

export const config = {
  // admin, receipt нь locale-гүй route тул locale redirect-ээс чөлөөлнө.
  matcher: ["/((?!_next|api|admin|receipt|favicon.ico|.*\\..*).*)"],
};
