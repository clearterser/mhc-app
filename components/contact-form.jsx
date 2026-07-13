"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const inputClasses =
  "h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ContactForm({ dict }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: бодит backend/имэйл үйлчилгээтэй холбох
    setSubmitted(true);
  }

  if (submitted) {
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
          onClick={() => setSubmitted(false)}
        >
          {dict.newSubmission}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            {dict.nameLabel} <span className="text-destructive">{dict.required}</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={dict.namePlaceholder}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {dict.phoneLabel}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder={dict.phonePlaceholder}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          {dict.emailLabel} <span className="text-destructive">{dict.required}</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={dict.emailPlaceholder}
          className={inputClasses}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-medium">
          {dict.subjectLabel}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder={dict.subjectPlaceholder}
          className={inputClasses}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          {dict.messageLabel} <span className="text-destructive">{dict.required}</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={dict.messagePlaceholder}
          className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <Button
        type="submit"
        className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-base text-white shadow-md shadow-orange-500/25 hover:from-amber-500 hover:to-orange-500"
      >
        <Send className="size-4" />
        {dict.submit}
      </Button>
    </form>
  );
}
