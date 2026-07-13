import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { ReceiptView } from "@/components/receipt-view";

// Баримт нь зөвхөн баталгаажсан (approved) бүртгэлд олгогдоно.
// id нь таамаглах боломжгүй cuid тул холбоосыг мэддэг хүн л нээнэ.
export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let donation = null;
  try {
    donation = await prisma.donation.findUnique({ where: { id } });
  } catch (err) {
    console.error("ReceiptPage: DB унших боломжгүй", err);
  }
  if (!donation || donation.status !== "approved") notFound();

  return (
    <ReceiptView
      donation={{
        id: donation.id,
        type: donation.type,
        name: donation.name,
        amount: donation.amount,
        method: donation.method,
        description: donation.description,
        donatedAt: donation.donatedAt,
        issuedAt: new Date().toISOString().slice(0, 10),
      }}
    />
  );
}
