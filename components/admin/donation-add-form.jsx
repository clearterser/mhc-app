"use client";

import { useActionState, useState } from "react";
import {
  Plus,
  LoaderCircle,
  CheckCircle2,
  TriangleAlert,
  Heart,
  Gift,
  HandHelping,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminAddDonation } from "@/lib/actions/admin";

const inputClasses =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const TYPES = [
  { key: "money", label: "Мөнгөн", icon: Heart },
  { key: "goods", label: "Эд зүйлс", icon: Gift },
  { key: "service", label: "Үйл ажиллагаа", icon: HandHelping },
];

const METHODS = ["Zeffy", "Stripe", "PayPal", "Zelle", "Чек", "Бэлэн мөнгө", "Бусад"];

export function DonationAddForm() {
  const [type, setType] = useState("money");
  const [state, formAction, pending] = useActionState(adminAddDonation, {
    status: "idle",
  });

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-card p-5 ring-1 ring-foreground/10"
    >
      <input type="hidden" name="type" value={type} />

      <div className="flex flex-wrap gap-2">
        {TYPES.map(({ key, label, icon: Icon }) => {
          const active = type === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setType(key)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label htmlFor="add-name" className="text-xs font-medium">
            Нэр / байгууллага <span className="text-destructive">*</span>
          </label>
          <input
            id="add-name"
            name="name"
            type="text"
            required
            placeholder="Б. Батболд"
            className={inputClasses}
          />
        </div>

        {type === "money" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="add-amount" className="text-xs font-medium">
                Дүн (USD) <span className="text-destructive">*</span>
              </label>
              <input
                id="add-amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="100"
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="add-method" className="text-xs font-medium">
                Төлбөрийн арга
              </label>
              <select id="add-method" name="method" className={inputClasses}>
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="add-description" className="text-xs font-medium">
                Тодорхойлолт <span className="text-destructive">*</span>
              </label>
              <input
                id="add-description"
                name="description"
                type="text"
                required
                placeholder={
                  type === "goods" ? "Монгол ном 20 ширхэг" : "Урлагийн тоглолт"
                }
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="add-value" className="text-xs font-medium">
                Тооцоолсон үнэлгээ (USD)
              </label>
              <input
                id="add-value"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="500"
                className={inputClasses}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="add-date" className="text-xs font-medium">
            Огноо
          </label>
          <input id="add-date" name="date" type="date" className={inputClasses} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="add-email" className="text-xs font-medium">
            И-мэйл
          </label>
          <input
            id="add-email"
            name="email"
            type="email"
            placeholder="handivlagch@email.com"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="add-phone" className="text-xs font-medium">
            Утас
          </label>
          <input
            id="add-phone"
            name="phone"
            type="tel"
            placeholder="(872) 231-0808"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
          <label htmlFor="add-note" className="text-xs font-medium">
            Тайлбар
          </label>
          <input
            id="add-note"
            name="note"
            type="text"
            placeholder="Нэмэлт мэдээлэл..."
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publicListing"
            defaultChecked
            className="size-4 accent-amber-600"
          />
          Нэрийг нийтэд зарлана
        </label>

        <div className="flex items-center gap-3">
          {state.status === "success" ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              Нэмэгдлээ
            </span>
          ) : null}
          {state.status === "error" ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
              <TriangleAlert className="size-4" />
              Алдаа гарлаа
            </span>
          ) : null}
          <Button
            type="submit"
            disabled={pending}
            className="h-10 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 text-white hover:from-amber-500 hover:to-orange-500"
          >
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Бүртгэл нэмэх
          </Button>
        </div>
      </div>
    </form>
  );
}
