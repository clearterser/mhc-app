"use server";

// Админ хэсгийн server action-ууд: нэвтрэх/гарах, хандивын бүртгэл
// нэмэх, төлөв өөрчлөх, устгах. Бүх мутаци нэвтрэлт шаардана.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { locales } from "@/lib/i18n";
import {
  verifyPassword,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

const TYPES = new Set(["money", "goods", "service"]);
const STATUSES = new Set(["pending", "approved", "rejected"]);

function clean(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

// Бүртгэл өөрчлөгдөхөд админ хуудас болон нүүрэн талын /donors хуудсуудыг
// шинэчилнэ (баталгаажсан бүртгэл тэнд шууд харагдана).
function revalidateDonationPages() {
  revalidatePath("/admin/donations");
  for (const lang of locales) {
    revalidatePath(`/${lang}/donors`);
  }
}

export async function adminLogin(prevState, formData) {
  if (!process.env.ADMIN_PASSWORD) {
    return { status: "unconfigured" };
  }
  if (!verifyPassword(formData.get("password"))) {
    return { status: "invalid" };
  }
  await setAdminSession();
  redirect("/admin/donations");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function adminAddDonation(prevState, formData) {
  await requireAdmin();

  const type = clean(formData.get("type"));
  const name = clean(formData.get("name"), 300);
  if (!TYPES.has(type) || !name) {
    return { status: "error" };
  }

  const amountRaw = clean(formData.get("amount"), 20);
  const amount = amountRaw ? Number(amountRaw) : null;

  try {
    await prisma.donation.create({
      data: {
        type,
        name,
        email: clean(formData.get("email"), 200) || null,
        phone: clean(formData.get("phone"), 50) || null,
        amount: Number.isFinite(amount) ? amount : null,
        method: type === "money" ? clean(formData.get("method"), 50) || null : null,
        description:
          type === "money" ? null : clean(formData.get("description"), 1000) || null,
        donatedAt: clean(formData.get("date"), 20) || null,
        note: clean(formData.get("note"), 2000) || null,
        publicListing: formData.get("publicListing") != null,
        status: "approved",
        source: "admin",
      },
    });
  } catch (err) {
    console.error("adminAddDonation:", err);
    return { status: "error" };
  }

  revalidateDonationPages();
  return { status: "success" };
}

export async function adminSetDonationStatus(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 50);
  const status = clean(formData.get("status"), 20);
  if (!id || !STATUSES.has(status)) return;

  try {
    await prisma.donation.update({ where: { id }, data: { status } });
  } catch (err) {
    console.error("adminSetDonationStatus:", err);
  }
  revalidateDonationPages();
}

export async function adminDeleteDonation(formData) {
  await requireAdmin();

  const id = clean(formData.get("id"), 50);
  if (!id) return;

  try {
    await prisma.donation.delete({ where: { id } });
  } catch (err) {
    console.error("adminDeleteDonation:", err);
  }
  revalidateDonationPages();
}
