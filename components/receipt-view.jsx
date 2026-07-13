"use client";

import { useSyncExternalStore } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, BadgeCheck, LoaderCircle } from "lucide-react";

import { ReceiptDocument } from "@/components/ReceiptDocument";

const TYPE_LABELS = {
  money: "Мөнгөн хандив",
  goods: "Эд зүйлсийн хандив",
  service: "Үйл ажиллагааны дэмжлэг",
};

const usd = (n) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export function ReceiptView({ donation }) {
  const receiptNo = donation.id.slice(-8).toUpperCase();
  // PDFDownloadLink зөвхөн браузерт ажилладаг тул сервер дээр false,
  // клиент дээр true буцаадаг hydration-д аюулгүй хэлбэрээр шалгана.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 text-center ring-1 ring-foreground/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- receipt хуудас нэг л удаа ачаалагддаг жижиг лого */}
          <img
            src="/logo.svg"
            alt="Монгол Өв Соёлын Төв"
            className="mx-auto size-16"
          />
          <span className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <BadgeCheck className="size-3.5" />
            Баталгаажсан хандив
          </span>

          <h1 className="mt-4 text-xl font-bold tracking-tight">
            Хандивын баримт
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Баримтын дугаар: {receiptNo}
          </p>

          <dl className="mt-6 space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Хандивлагч</dt>
              <dd className="font-medium">{donation.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Төрөл</dt>
              <dd className="font-medium">
                {TYPE_LABELS[donation.type] ?? donation.type}
              </dd>
            </div>
            {donation.type === "money" && donation.amount != null ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Дүн</dt>
                <dd className="font-semibold">{usd(donation.amount)}</dd>
              </div>
            ) : null}
            {donation.type !== "money" && donation.description ? (
              <div className="flex justify-between gap-3">
                <dt className="shrink-0 text-muted-foreground">Тодорхойлолт</dt>
                <dd className="text-right font-medium">
                  {donation.description}
                </dd>
              </div>
            ) : null}
            {donation.donatedAt ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Огноо</dt>
                <dd className="font-medium">{donation.donatedAt}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-6">
            {mounted ? (
              <PDFDownloadLink
                document={<ReceiptDocument data={donation} />}
                fileName={`MHC-receipt-${receiptNo}.pdf`}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-base font-medium text-white shadow-md shadow-orange-500/25 transition-colors hover:from-amber-500 hover:to-orange-500"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      PDF үүсгэж байна...
                    </>
                  ) : (
                    <>
                      <FileDown className="size-4" />
                      Баримт татах (PDF)
                    </>
                  )
                }
              </PDFDownloadLink>
            ) : (
              <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-muted text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Бэлдэж байна...
              </span>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Mongolian Heritage Center нь 501(c)(3) байгууллага (EIN
            93-3162554). Энэ баримтыг татварын бүртгэлдээ хадгална уу.
          </p>
        </div>
      </div>
    </div>
  );
}
