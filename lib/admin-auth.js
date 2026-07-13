// Админ хэсгийн энгийн нэвтрэлт — ADMIN_PASSWORD env дээр суурилсан
// httpOnly cookie. Жижиг байгууллагын дотоод хэрэглээнд зориулагдсан.

import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "mhc_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 хоног

// Нууц үгнээс гаргасан токен — нууц үг солигдоход бүх session хүчингүй болно.
function expectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`mhc-admin-v1:${password}`).digest("hex");
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  const a = createHash("sha256").update(String(password)).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated() {
  const expected = expectedToken();
  if (!expected) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function setAdminSession() {
  const token = expectedToken();
  if (!token) throw new Error("ADMIN_PASSWORD тохируулаагүй байна.");
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}
