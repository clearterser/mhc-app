"use client";

import { Fragment, useState } from "react";
import {
  Heart,
  Sparkles,
  HeartHandshake,
  Landmark,
  Clock,
  ExternalLink,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyValueButton } from "@/components/copy-value-button";

const PROVIDER_META = {
  zeffy: {
    icon: Sparkles,
    accent: "from-emerald-500 to-teal-500",
    border: "border-emerald-300/60 dark:border-emerald-900/60",
    tagClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    btnClass:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500",
    recommended: true,
  },
  paypal: {
    icon: HeartHandshake,
    accent: "from-sky-500 to-blue-500",
    border: "border-border",
    tagClass: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
    btnClass:
      "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500",
  },
  zelle: {
    icon: Landmark,
    accent: "from-fuchsia-500 to-purple-600",
    border: "border-border",
    tagClass:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
    btnClass:
      "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-500 hover:to-purple-500",
  },
};

const PROVIDER_ORDER = ["zeffy", "paypal", "zelle"];

// "$2,000" гэх мэт мөрөөс тоон утга гаргана.
function parseAmount(value) {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

// Сонгосон дүнг төлбөрийн холбоос дээр нэмнэ. PayPal-ийн donate URL нь
// `amount` параметрийг шууд дэмждэг; Zeffy дэмжихгүй бол үл тоомсорлоно.
function hrefWithAmount(href, amount) {
  if (!href || !amount) return href;
  try {
    const url = new URL(href);
    url.searchParams.set("amount", String(amount));
    return url.toString();
  } catch {
    return href;
  }
}

const usd = (n) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function DonateOptions({ labels, providers }) {
  const t = labels;
  const [amount, setAmount] = useState(null);
  const [custom, setCustom] = useState("");
  // Wizard алхам: 0 = дүн сонгох, 1 = төлбөрийн арга сонгох, 2 = хандив өгөх.
  const [step, setStep] = useState(0);
  // Сонгосон төлбөрийн үйлчилгээ: "zeffy" | "paypal" | "zelle" | null.
  const [provider, setProvider] = useState(null);

  const presets = t.amounts.map((a) => ({
    ...a,
    amount: parseAmount(a.value),
  }));

  function selectPreset(n) {
    setAmount(n);
    setCustom("");
  }

  function onCustomChange(e) {
    const v = e.target.value;
    setCustom(v);
    setAmount(parseAmount(v));
  }

  const customActive = custom.trim().length > 0;
  const hasAmount = amount != null && amount > 0;
  const hasProvider = provider != null;
  // Stepper-ийн идэвхтэй алхам нь wizard-ийн алхмыг дагана.
  const currentStep = step;

  // Сонгосон үйлчилгээний мэдээлэл (3-р алхамд ашиглана).
  const selMeta = provider ? PROVIDER_META[provider] : null;
  const selProv = provider ? t.providers[provider] : null;
  const selCfg = provider ? providers[provider] : null;
  const SelIcon = selMeta ? selMeta.icon : null;

  // Шинээр харагдах хэсгийн эхэнд зөөлөн гүйлгэнэ.
  function scrollToTop() {
    document
      .getElementById("providers")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToAmount() {
    setStep(0);
    scrollToTop();
  }

  function goToMethod() {
    if (!hasAmount) return;
    setStep(1);
    scrollToTop();
  }

  function goToGive() {
    if (!hasAmount || !hasProvider) return;
    setStep(2);
    scrollToTop();
  }

  // Алхам дээр дарахад тухайн алхам руу шилжинэ (linear: дараагийн алхмууд
  // өмнөх алхмуудыг гүйцэтгэсэн үед л нээгдэнэ).
  function goToStep(i) {
    if (i === 0) goToAmount();
    else if (i === 1) goToMethod();
    else goToGive();
  }

  return (
    <div
      id="providers"
      className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8"
    >
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.giveTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{t.giveLead}</p>
        </div>

        {/* Horizontal stepper — хандив өгөх процессын явц.
            Толгойн гарчгуудыг давхардуулсан харааны заагч тул aria-hidden. */}
        <div className="mt-8 flex items-start">
          {t.stepper.map((label, i) => {
            // Linear stepper: эхний алхам үргэлж нээлттэй; 2-р алхам дүн
            // сонгосны дараа, 3-р алхам төлбөрийн арга сонгосны дараа нээгдэнэ.
            const enabled =
              i === 0 ||
              (i === 1 && hasAmount) ||
              (i === 2 && hasAmount && hasProvider);
            const status =
              i < currentStep
                ? "done"
                : i === currentStep
                  ? "active"
                  : enabled
                    ? "upcoming"
                    : "locked";
            return (
              <Fragment key={label}>
                <button
                  type="button"
                  onClick={() => enabled && goToStep(i)}
                  disabled={!enabled}
                  aria-current={status === "active" ? "step" : undefined}
                  className={`group flex w-20 shrink-0 flex-col items-center rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:w-28 ${
                    enabled ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                      status === "done"
                        ? "border-amber-500 bg-amber-500 text-white"
                        : status === "active"
                          ? "border-amber-500 bg-amber-50 text-amber-600 ring-4 ring-amber-400/20 dark:bg-amber-950/50 dark:text-amber-300"
                          : status === "upcoming"
                            ? "border-border bg-card text-muted-foreground group-hover:border-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300"
                            : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {status === "done" ? (
                      <Check className="size-4" />
                    ) : status === "locked" ? (
                      <Lock className="size-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`mt-2 text-xs font-medium transition-colors sm:text-sm ${
                      status === "upcoming"
                        ? "text-muted-foreground group-hover:text-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < t.stepper.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className={`mt-[17px] h-0.5 flex-1 rounded-full transition-colors ${
                      i < currentStep ? "bg-amber-500" : "bg-border"
                    }`}
                  />
                ) : null}
              </Fragment>
            );
          })}
        </div>

        {/* Алхам 1: Дүн сонгох — төлбөрийн алхам руу шилжтэл л харагдана */}
        {step === 0 ? (
        <div id="donate-amount" className="mt-12 scroll-mt-24">
          <h3 className="text-xl font-bold tracking-tight">
            {t.amountsTitle}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.amountsLead}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {presets.map((p) => {
              const active = !customActive && amount === p.amount;
              return (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectPreset(p.amount)}
                  className={`relative flex items-center justify-center rounded-2xl border px-5 py-6 text-center transition-colors ${
                    active
                      ? "border-amber-400 bg-amber-50 ring-2 ring-amber-400/50 dark:border-amber-700 dark:bg-amber-950/50"
                      : "border-border bg-card ring-1 ring-foreground/10 hover:border-amber-300 dark:hover:border-amber-900"
                  }`}
                >
                  {active ? (
                    <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white">
                      <Check className="size-3.5" />
                    </span>
                  ) : null}
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    {p.value}
                  </span>
                </button>
              );
            })}

            {/* Өөр дүн */}
            <div
              className={`flex flex-col justify-center rounded-2xl border px-4 py-4 text-center transition-colors ${
                customActive
                  ? "border-amber-400 bg-amber-50 ring-2 ring-amber-400/50 dark:border-amber-700 dark:bg-amber-950/50"
                  : "border-border bg-card ring-1 ring-foreground/10"
              }`}
            >
              <label
                htmlFor="custom-amount"
                className="text-xs font-medium text-muted-foreground"
              >
                {t.amountCustomLabel}
              </label>
              <div className="mt-1.5 flex items-center justify-center gap-1">
                <span className="text-xl font-bold text-amber-600">$</span>
                <input
                  id="custom-amount"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={custom}
                  onChange={onCustomChange}
                  placeholder={t.amountCustomPlaceholder}
                  className="w-full min-w-0 border-0 bg-transparent p-0 text-center text-xl font-bold text-foreground outline-none placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Үргэлжлүүлэх — дүн сонгосны дараа идэвхжинэ */}
          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={goToMethod}
              disabled={!hasAmount}
              className="h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 text-white hover:from-amber-500 hover:to-orange-500"
            >
              {t.continueCta}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
        ) : null}

        {/* Алхам 2: Төлбөрийн арга — Үргэлжлүүлэх дархад л харагдана */}
        {step === 1 ? (
        <div
          id="donate-method"
          className="mt-12 scroll-mt-24 duration-500 animate-in fade-in slide-in-from-bottom-3"
        >
          <button
            type="button"
            onClick={goToAmount}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t.backCta}
          </button>
          <h3 className="mt-4 text-xl font-bold tracking-tight">
            {t.providersTitle}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.providersLead}
          </p>

          {amount ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
              <Heart className="size-4 text-amber-600" />
              <span className="font-medium text-amber-800 dark:text-amber-200">
                {t.amountSelectedTemplate.replace("{amount}", usd(amount))}
              </span>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4">
            {PROVIDER_ORDER.map((key) => {
              const meta = PROVIDER_META[key];
              const tProv = t.providers[key];
              const cfg = providers[key];
              const Icon = meta.icon;
              const isReady = cfg.configured;
              const selected = provider === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => isReady && setProvider(key)}
                  disabled={!isReady}
                  aria-pressed={selected}
                  className={`relative flex flex-col rounded-2xl border p-5 text-left transition-colors ${
                    selected
                      ? "border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/50 dark:border-amber-700 dark:bg-amber-950/40"
                      : isReady
                        ? "border-border bg-card ring-1 ring-foreground/10 hover:border-amber-300 dark:hover:border-amber-900"
                        : "cursor-not-allowed border-border bg-muted/30 opacity-70"
                  }`}
                >
                  {selected ? (
                    <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white">
                      <Check className="size-3.5" />
                    </span>
                  ) : null}
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accent} text-white shadow-md`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{tProv.title}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isReady
                              ? meta.tagClass
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isReady ? tProv.tag : t.comingSoon}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {tProv.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Үргэлжлүүлэх — төлбөрийн арга сонгосны дараа идэвхжинэ */}
          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={goToGive}
              disabled={!hasProvider}
              className="h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 text-white hover:from-amber-500 hover:to-orange-500"
            >
              {t.continueCta}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
        ) : null}

        {/* Алхам 3: Хандив өгөх — сонгосон үйлчилгээгээр */}
        {step === 2 && provider ? (
        <div
          id="donate-give"
          className="mt-12 scroll-mt-24 duration-500 animate-in fade-in slide-in-from-bottom-3"
        >
          <button
            type="button"
            onClick={goToMethod}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t.backCta}
          </button>
          <h3 className="mt-4 text-xl font-bold tracking-tight">
            {t.stepper[2]}
          </h3>

          <Card className={`mt-6 p-2 ${selMeta.border}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${selMeta.accent} text-white shadow-md`}
                >
                  <SelIcon className="size-6" />
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${selMeta.tagClass}`}
                >
                  {selProv.tag}
                </span>
              </div>
              <CardTitle className="mt-4 text-xl">{selProv.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <CardDescription className="flex-1 leading-relaxed">
                {selProv.description}
              </CardDescription>

              {provider === "zelle" ? (
                selCfg.configured ? (
                  <div className="mt-6 space-y-2">
                    {amount ? (
                      <div className="rounded-lg bg-fuchsia-50 px-3 py-2 text-xs font-medium text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300">
                        {t.amountSelectedTemplate.replace(
                          "{amount}",
                          usd(amount)
                        )}
                      </div>
                    ) : null}
                    <div className="text-xs font-medium text-muted-foreground">
                      {selProv.recipientLabel}
                    </div>
                    {selCfg.email ? (
                      <div className="flex flex-col gap-2">
                        <code className="block rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs break-all">
                          {selCfg.email}
                        </code>
                        <CopyValueButton
                          value={selCfg.email}
                          label={selProv.copyEmailCta}
                          copiedLabel={selProv.copiedLabel}
                          className={`h-10 w-full rounded-xl ${selMeta.btnClass}`}
                        />
                      </div>
                    ) : null}
                    {selCfg.phone ? (
                      <div className="flex flex-col gap-2 pt-1">
                        <code className="block rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
                          {selCfg.phone}
                        </code>
                        <CopyValueButton
                          value={selCfg.phone}
                          label={selProv.copyPhoneCta}
                          copiedLabel={selProv.copiedLabel}
                          className={`h-10 w-full rounded-xl ${selMeta.btnClass}`}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Button
                    disabled
                    className="mt-6 h-11 w-full rounded-xl"
                    variant="outline"
                  >
                    <Clock className="size-4" />
                    {t.comingSoon}
                  </Button>
                )
              ) : selCfg.configured ? (
                <Button
                  asChild
                  className={`mt-6 h-11 w-full rounded-xl ${selMeta.btnClass}`}
                >
                  <a
                    href={hrefWithAmount(selCfg.href, amount)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Heart className="size-4" />
                    {amount
                      ? t.giveAmountTemplate
                          .replace("{amount}", usd(amount))
                          .replace("{provider}", selProv.title)
                      : selProv.cta}
                    <ExternalLink className="ml-auto size-3.5 opacity-70" />
                  </a>
                </Button>
              ) : (
                <Button
                  disabled
                  className="mt-6 h-11 w-full rounded-xl"
                  variant="outline"
                >
                  <Clock className="size-4" />
                  {t.comingSoon}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        ) : null}
    </div>
  );
}
