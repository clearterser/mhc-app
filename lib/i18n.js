export const locales = ["mn", "en"];
export const defaultLocale = "mn";

export function isLocale(value) {
  return locales.includes(value);
}

export function localizedPath(path, lang) {
  // Accepts paths like "/", "/about", "/#donate", "/about#section"
  if (!path) return `/${lang}`;
  if (!path.startsWith("/")) return `/${lang}/${path}`;
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}
