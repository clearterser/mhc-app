"use client";

import { useActionState, useState } from "react";
import {
  Send,
  CheckCircle2,
  Heart,
  Gift,
  HandHelping,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { registerDonation } from "@/lib/actions/register-donation";

const inputClasses =
  "h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const TYPES = [
  { key: "money", icon: Heart },
  { key: "goods", icon: Gift },
  { key: "service", icon: HandHelping },
];

const TYPE_LABEL_KEY = {
  money: "typeMoney",
  goods: "typeGoods",
  service: "typeService",
};

export function DonationRegisterForm({ dict }) {
  const [type, setType] = useState("money");
  const [state, formAction, pending] = useActionState(registerDonation, {
    status: "idle",
  });
  // Амжилттай илгээсний дараа "Дахин бүртгүүлэх" дарахад аль state-ийг
  // хүлээн зөвшөөрснөө хадгалж, маягтыг шинээр харуулна.
  const [ackedState, setAckedState] = useState(null);

  if (state.status === "success" && state !== ackedState) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
        <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">{dict.successTitle}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {dict.successText}
        </p>
        <Button
          variant="outline"
          className="mt-6 h-10 rounded-xl px-5"
          onClick={() => setAckedState(state)}
        >
          {dict.newSubmission}
        </Button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
    >
      <input type="hidden" name="type" value={type} />
      {/* Honeypot — ботоос хамгаалах далд талбар */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {/* Donation type */}
      <fieldset>
        <legend className="text-sm font-medium">
          {dict.typeLabel}{" "}
          <span className="text-destructive">{dict.required}</span>
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {TYPES.map(({ key, icon: Icon }) => {
            const active = type === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setType(key)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-amber-400 bg-amber-50 text-amber-800 ring-1 ring-amber-400/50 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                    : "border-border bg-background text-muted-foreground hover:border-amber-300 hover:text-foreground dark:hover:border-amber-900"
                }`}
              >
                <Icon className="size-4" />
                {dict[TYPE_LABEL_KEY[key]]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Name */}
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="donor-name" className="text-sm font-medium">
          {dict.nameLabel}{" "}
          <span className="text-destructive">{dict.required}</span>
        </label>
        <input
          id="donor-name"
          name="name"
          type="text"
          required
          placeholder={dict.namePlaceholder}
          className={inputClasses}
        />
      </div>

      {/* Contact */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="donor-email" className="text-sm font-medium">
            {dict.emailLabel}{" "}
            <span className="text-destructive">{dict.required}</span>
          </label>
          <input
            id="donor-email"
            name="email"
            type="email"
            required
            placeholder={dict.emailPlaceholder}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="donor-phone" className="text-sm font-medium">
            {dict.phoneLabel}{" "}
            <span className="text-muted-foreground">{dict.optional}</span>
          </label>
          <input
            id="donor-phone"
            name="phone"
            type="tel"
            placeholder={dict.phonePlaceholder}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Type-specific fields */}
      {type === "money" ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="donation-amount" className="text-sm font-medium">
              {dict.amountLabel}{" "}
              <span className="text-destructive">{dict.required}</span>
            </label>
            <input
              id="donation-amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              placeholder={dict.amountPlaceholder}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="donation-method" className="text-sm font-medium">
              {dict.methodLabel}{" "}
              <span className="text-destructive">{dict.required}</span>
            </label>
            <select
              id="donation-method"
              name="method"
              required
              className={inputClasses}
            >
              {dict.methodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="donation-description"
              className="text-sm font-medium"
            >
              {type === "goods" ? dict.itemLabel : dict.activityLabel}{" "}
              <span className="text-destructive">{dict.required}</span>
            </label>
            <input
              id="donation-description"
              name="description"
              type="text"
              required
              placeholder={
                type === "goods"
                  ? dict.itemPlaceholder
                  : dict.activityPlaceholder
              }
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="donation-value" className="text-sm font-medium">
              {dict.valueLabel}{" "}
              <span className="text-muted-foreground">{dict.optional}</span>
            </label>
            <input
              id="donation-value"
              name="value"
              type="number"
              min="0"
              step="0.01"
              placeholder={dict.valuePlaceholder}
              className={inputClasses}
            />
          </div>
        </div>
      )}

      {/* Date */}
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="donation-date" className="text-sm font-medium">
          {dict.dateLabel}{" "}
          <span className="text-destructive">{dict.required}</span>
        </label>
        <input
          id="donation-date"
          name="date"
          type="date"
          required
          className={inputClasses}
        />
      </div>

      {/* Note */}
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="donation-note" className="text-sm font-medium">
          {dict.noteLabel}{" "}
          <span className="text-muted-foreground">{dict.optional}</span>
        </label>
        <textarea
          id="donation-note"
          name="note"
          rows={4}
          placeholder={dict.notePlaceholder}
          className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* Public listing consent */}
      <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="publicListing"
            defaultChecked
            className="mt-0.5 size-4 shrink-0 accent-amber-600"
          />
          <span>
            <span className="font-medium">{dict.publicLabel}</span>
            <span className="mt-1 block text-muted-foreground">
              {dict.publicHint}
            </span>
          </span>
        </label>
      </div>

      {state.status === "error" ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {dict.errorText}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-base text-white shadow-md shadow-orange-500/25 hover:from-amber-500 hover:to-orange-500"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            {dict.sending}
          </>
        ) : (
          <>
            <Send className="size-4" />
            {dict.submit}
          </>
        )}
      </Button>
    </form>
  );
}
