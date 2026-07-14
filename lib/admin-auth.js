// Админ хэсгийн нэвтрэлт.
//
// Хоёр горим:
//   1. Clerk (үндсэн) — NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY
//      тохируулагдсан үед. Нэвтэрсэн хэрэглэгчийн и-мэйл ADMIN_EMAILS
//      жагсаалтад байвал л админ эрхтэй.
//   2. Legacy (нөөц) — Clerk түлхүүр байхгүй үед ADMIN_PASSWORD дээр
//      суурилсан httpOnly cookie. Түлхүүрээ тохируулмагц автоматаар
//      Clerk горим руу шилжинэ.

import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";
import { currentUser } from "@clerk/nextjs/server";

export const ADMIN_COOKIE = "mhc_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 хоног

export function clerkEnabled() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY
  );
}

// ADMIN_EMAILS — таслалаар тусгаарласан админ и-мэйлүүд.
function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Clerk-ээр нэвтэрсэн хэрэглэгч админ мөн үү.
async function isClerkAdmin() {
  const user = await currentUser();
  if (!user) return false;
  const allow = adminEmails();
  // Аюулгүйн үүднээс жагсаалт хоосон бол хэнийг ч оруулахгүй.
  if (allow.length === 0) return false;
  const emails = (user.emailAddresses ?? []).map((e) =>
    e.emailAddress.toLowerCase()
  );
  return emails.some((e) => allow.includes(e));
}

// --- Legacy (нууц үгийн) горим ---

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

async function isLegacyAdmin() {
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

// --- Нэгдсэн шалгалт ---

export async function isAdminAuthenticated() {
  if (clerkEnabled()) return isClerkAdmin();
  return isLegacyAdmin();
}
