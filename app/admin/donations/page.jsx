import { redirect } from "next/navigation";
import {
  Heart,
  Gift,
  HandHelping,
  LogOut,
  Check,
  X,
  Trash2,
  Inbox,
  CircleDollarSign,
  Clock,
  BadgeCheck,
  Receipt,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  adminLogout,
  adminSetDonationStatus,
  adminDeleteDonation,
} from "@/lib/actions/admin";
import { DonationAddForm } from "@/components/admin/donation-add-form";

export const metadata = {
  title: "Хандивын бүртгэл — Админ",
};

const TYPE_META = {
  money: { label: "Мөнгөн", icon: Heart, className: "text-amber-600" },
  goods: { label: "Эд зүйлс", icon: Gift, className: "text-emerald-600" },
  service: {
    label: "Үйл ажиллагаа",
    icon: HandHelping,
    className: "text-sky-600",
  },
};

const STATUS_META = {
  pending: {
    label: "Хүлээгдэж буй",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  approved: {
    label: "Баталгаажсан",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  rejected: {
    label: "Татгалзсан",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  },
};

// Серверт л рендерлэгдэх тул locale тогтмол байхад хангалттай
// (/donors дээр гарсан Intl hydration алдааг давтахгүй).
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function AdminDonationsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    {
      label: "Нийт бүртгэл",
      value: donations.length,
      icon: Inbox,
    },
    {
      label: "Хүлээгдэж буй",
      value: donations.filter((d) => d.status === "pending").length,
      icon: Clock,
    },
    {
      label: "Баталгаажсан",
      value: donations.filter((d) => d.status === "approved").length,
      icon: BadgeCheck,
    },
    {
      label: "Мөнгөн дүн (баталгаажсан)",
      value: usd.format(
        donations
          .filter((d) => d.status === "approved" && d.type === "money")
          .reduce((sum, d) => sum + (d.amount ?? 0), 0)
      ),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Хандивын бүртгэл
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Монгол Өв Соёлын Төв — админ хэсэг
          </p>
        </div>
        <form action={adminLogout}>
          <Button variant="outline" className="h-10 rounded-xl px-4">
            <LogOut className="size-4" />
            Гарах
          </Button>
        </form>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-4 ring-1 ring-foreground/10"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Icon className="size-3.5" />
              {label}
            </div>
            <div className="mt-2 text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      <h2 className="mt-10 text-lg font-semibold">Шинэ бүртгэл нэмэх</h2>
      <div className="mt-3">
        <DonationAddForm />
      </div>

      {/* List */}
      <h2 className="mt-10 text-lg font-semibold">Бүх бүртгэл</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Төрөл</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Хандив</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead>Холбоо барих</TableHead>
              <TableHead>Нийтлэх</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  Одоогоор бүртгэл алга. Дээрх маягтаар нэмэх, эсвэл вэбийн
                  “Хандив бүртгүүлэх” хуудсаар ирсэн бүртгэлүүд энд харагдана.
                </TableCell>
              </TableRow>
            ) : (
              donations.map((d) => {
                const type = TYPE_META[d.type] ?? TYPE_META.money;
                const status = STATUS_META[d.status] ?? STATUS_META.pending;
                const TypeIcon = type.icon;
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <TypeIcon className={`size-4 ${type.className}`} />
                        {type.label}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <div className="truncate font-medium" title={d.name}>
                        {d.name}
                      </div>
                      {d.note ? (
                        <div
                          className="truncate text-xs text-muted-foreground"
                          title={d.note}
                        >
                          {d.note}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="max-w-56">
                      {d.type === "money" ? (
                        <span className="font-medium">
                          {d.amount != null ? usd.format(d.amount) : "—"}
                          {d.method ? (
                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                              · {d.method}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <div className="truncate" title={d.description ?? ""}>
                          {d.description ?? "—"}
                          {d.amount != null ? (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              · {usd.format(d.amount)}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {d.donatedAt || "—"}
                    </TableCell>
                    <TableCell className="max-w-44">
                      <div className="truncate text-sm" title={d.email ?? ""}>
                        {d.email || "—"}
                      </div>
                      {d.phone ? (
                        <div className="text-xs text-muted-foreground">
                          {d.phone}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {d.publicListing ? "Тийм" : "Нэргүй"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        {d.status === "approved" ? (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-amber-600 hover:text-amber-700"
                            title="Баримт нээх"
                          >
                            <a
                              href={`/receipt/${d.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Receipt className="size-4" />
                            </a>
                          </Button>
                        ) : null}
                        {d.status !== "approved" ? (
                          <form action={adminSetDonationStatus}>
                            <input type="hidden" name="id" value={d.id} />
                            <input
                              type="hidden"
                              name="status"
                              value="approved"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg px-2.5 text-emerald-600 hover:text-emerald-700"
                              title="Батлах"
                            >
                              <Check className="size-4" />
                            </Button>
                          </form>
                        ) : null}
                        {d.status !== "rejected" ? (
                          <form action={adminSetDonationStatus}>
                            <input type="hidden" name="id" value={d.id} />
                            <input
                              type="hidden"
                              name="status"
                              value="rejected"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg px-2.5 text-muted-foreground"
                              title="Татгалзах"
                            >
                              <X className="size-4" />
                            </Button>
                          </form>
                        ) : null}
                        <form action={adminDeleteDonation}>
                          <input type="hidden" name="id" value={d.id} />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-destructive hover:text-destructive"
                            title="Устгах"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
