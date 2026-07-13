"use server";

// Хандивын бүртгэлийн маягт: өгөгдлийн санд "pending" төлөвтэй хадгалаад
// (админ хуудсанд харагдана), Resend-ээр имэйл илгээнэ. Аль нэг нь
// амжилттай бол хэрэглэгчид "амжилттай" гэж харуулна.

import { prisma } from "@/lib/db";

const TYPES = new Set(["money", "goods", "service"]);

const TYPE_LABELS = {
  money: "Мөнгөн хандив",
  goods: "Эд зүйлсийн хандив",
  service: "Үйл ажиллагаа / сайн дурын ажил",
};

function clean(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export async function registerDonation(prevState, formData) {
  // Honeypot — ботууд бөглөдөг далд талбар. Бөглөгдсөн бол чимээгүй "амжилттай".
  if (clean(formData.get("website"))) {
    return { status: "success" };
  }

  const type = clean(formData.get("type"));
  const name = clean(formData.get("name"), 200);
  const email = clean(formData.get("email"), 200);
  const phone = clean(formData.get("phone"), 50);
  const date = clean(formData.get("date"), 20);
  const note = clean(formData.get("note"), 2000);
  const publicListing = formData.get("publicListing") != null;

  if (!TYPES.has(type) || !name || !date || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error" };
  }

  const lines = [
    `Хандивын төрөл: ${TYPE_LABELS[type]}`,
    `Нэр: ${name}`,
    `И-мэйл: ${email}`,
    `Утас: ${phone || "—"}`,
  ];

  if (type === "money") {
    const amount = clean(formData.get("amount"), 20);
    const method = clean(formData.get("method"), 50);
    if (!amount) return { status: "error" };
    lines.push(`Дүн (USD): ${amount}`, `Төлбөрийн арга: ${method || "—"}`);
  } else {
    const description = clean(formData.get("description"), 1000);
    const value = clean(formData.get("value"), 20);
    if (!description) return { status: "error" };
    lines.push(
      `Тодорхойлолт: ${description}`,
      `Тооцоолсон үнэлгээ (USD): ${value || "—"}`
    );
  }

  lines.push(
    `Хандив өгсөн огноо: ${date}`,
    `Нэр нийтлэх зөвшөөрөл: ${publicListing ? "Тийм" : "Үгүй (нэргүй)"}`
  );
  if (note) lines.push("", "Нэмэлт тайлбар:", note);

  // Өгөгдлийн санд хадгална — амжилтгүй болвол имэйл рүү үргэлжилнэ
  // (жишээ нь serverless орчинд SQLite файл бичигдэхгүй байж болно).
  let savedToDb = false;
  try {
    const amountRaw =
      type === "money"
        ? clean(formData.get("amount"), 20)
        : clean(formData.get("value"), 20);
    const amount = amountRaw ? Number(amountRaw) : null;
    await prisma.donation.create({
      data: {
        type,
        name,
        email,
        phone: phone || null,
        amount: Number.isFinite(amount) ? amount : null,
        method: type === "money" ? clean(formData.get("method"), 50) || null : null,
        description:
          type === "money" ? null : clean(formData.get("description"), 1000),
        donatedAt: date,
        note: note || null,
        publicListing,
        status: "pending",
        source: "form",
      },
    });
    savedToDb = true;
  } catch (err) {
    console.error("registerDonation: DB хадгалалт амжилтгүй", err);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("registerDonation: RESEND_API_KEY тохируулаагүй байна.");
    return { status: savedToDb ? "success" : "error" };
  }

  const to =
    process.env.DONATION_REGISTER_TO || "info@mongolianheritagecenter.org";
  const from =
    process.env.DONATION_REGISTER_FROM ||
    "Mongolian Heritage Center <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Шинэ хандивын бүртгэл — ${name}`,
        text: lines.join("\n"),
      }),
    });

    if (!res.ok) {
      console.error(
        "registerDonation: Resend алдаа",
        res.status,
        await res.text()
      );
      return { status: savedToDb ? "success" : "error" };
    }
  } catch (err) {
    console.error("registerDonation: илгээлт амжилтгүй", err);
    return { status: savedToDb ? "success" : "error" };
  }

  return { status: "success" };
}
