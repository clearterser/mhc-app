// Хандивлагчдын нэгдсэн жагсаалт: lib/donors.js-ийн статик өгөгдөл дээр
// админ хуудсанд баталгаажсан (status="approved") бүртгэлүүдийг нэмж нэгтгэнэ.
// DB унших боломжгүй үед (жишээ нь serverless орчинд SQLite байхгүй)
// статик жагсаалт руу аюулгүй буцна.

import {
  donors as staticMoneyDonors,
  goodsDonors as staticGoodsDonors,
  serviceDonors as staticServiceDonors,
  anonymousCount as staticAnonymousCount,
} from "@/lib/donors";
import { prisma } from "@/lib/db";

// scripts/build-donors.mjs-ийн босготой ижил байх ёстой.
export function tierFor(total) {
  if (total >= 30000) return "ochir";
  if (total >= 10000) return "altan";
  if (total >= 5000) return "mongon";
  if (total >= 2000) return "hurel";
  if (total >= 500) return "erhem";
  if (total >= 250) return "hundet";
  return "donor";
}

// Хамгийн сүүлийн огноог сонгоно (ISO YYYY-MM-DD тул string харьцуулалт хангалттай).
function laterDate(a, b) {
  if (!a) return b ?? null;
  if (!b) return a;
  return a > b ? a : b;
}

export async function getMergedDonors() {
  let rows = [];
  try {
    rows = await prisma.donation.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "asc" },
    });
  } catch (err) {
    console.error(
      "getMergedDonors: DB унших боломжгүй тул зөвхөн статик жагсаалтыг харуулна",
      err
    );
  }

  const anonymousExtra = rows.filter((r) => !r.publicListing).length;
  const pub = rows.filter((r) => r.publicListing);

  // Мөнгөн хандив: нэг хандивлагч олон удаа өгсөн байж болох тул нэрээр нь
  // нэгтгэж дүнг нэмээд, түвшинг (tier) нийт дүнгээс дахин тооцно.
  const moneyByName = new Map();
  for (const d of staticMoneyDonors) {
    moneyByName.set(d.name, { amount: d.amount ?? 0, date: d.date ?? null });
  }
  for (const r of pub) {
    if (r.type !== "money") continue;
    const prev = moneyByName.get(r.name);
    moneyByName.set(r.name, {
      amount: (prev?.amount ?? 0) + (r.amount ?? 0),
      date: laterDate(prev?.date, r.donatedAt),
    });
  }
  const donors = [...moneyByName.entries()].map(([name, v]) => ({
    name,
    tier: tierFor(v.amount),
    amount: Math.round(v.amount),
    ...(v.date ? { date: v.date } : {}),
  }));

  const goodsDonors = [
    ...staticGoodsDonors,
    ...pub
      .filter((r) => r.type === "goods")
      .map((r) => ({
        name: r.name,
        item: r.description ?? "",
        ...(r.amount != null ? { value: r.amount } : {}),
        ...(r.donatedAt ? { date: r.donatedAt } : {}),
      })),
  ];

  const serviceDonors = [
    ...staticServiceDonors,
    ...pub
      .filter((r) => r.type === "service")
      .map((r) => ({
        name: r.name,
        activity: r.description ?? "",
        ...(r.amount != null ? { value: r.amount } : {}),
        ...(r.donatedAt ? { date: r.donatedAt } : {}),
      })),
  ];

  return {
    donors,
    goodsDonors,
    serviceDonors,
    anonymousCount: staticAnonymousCount + anonymousExtra,
  };
}
