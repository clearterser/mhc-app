import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Огноог (ISO "YYYY-MM-DD") server ба browser дээр ижилхэн форматлана.
// Intl.DateTimeFormat(mn-MN) нь Node ICU болон browser ICU дээр өөр гардаг тул
// hydration mismatch үүсгэдэг; мөн new Date("YYYY-MM-DD") нь UTC шөнө дунд болж
// цагийн бүсээс шалтгаалан өдөр гуйвдаг. Тиймээс мөрийг шууд задалж форматлав.
export function formatDonorDate(iso, lang) {
  if (typeof iso !== "string") return null;
  const [y, m, d] = iso.split("-").map((n) => Number(n));
  if (!y || !m || !d || m < 1 || m > 12) return null;
  if (lang === "mn") return `${y} оны ${m}-р сарын ${d}`;
  return `${EN_MONTHS[m - 1]} ${d}, ${y}`;
}
