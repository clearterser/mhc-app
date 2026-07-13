// Reads donation provider configuration from public env vars.
// Set these in .env.local (see .env.example).
// Any provider with a missing URL/ID is shown as "coming soon" rather than rendered as a working button.

export function getDonationProviders() {
  const zeffyUrl = process.env.NEXT_PUBLIC_ZEFFY_DONATION_URL || "";
  const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_DONATION_URL || "";
  const paypalButtonId = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID || "";
  const zelleEmail = process.env.NEXT_PUBLIC_ZELLE_EMAIL || "";
  const zellePhone = process.env.NEXT_PUBLIC_ZELLE_PHONE || "";

  return {
    zeffy: {
      key: "zeffy",
      href: zeffyUrl,
      configured: Boolean(zeffyUrl),
    },
    stripe: {
      key: "stripe",
      href: stripeUrl,
      configured: Boolean(stripeUrl),
    },
    paypal: {
      key: "paypal",
      // Accept either a raw hosted_button_id, OR a full PayPal donate URL.
      href: paypalButtonId
        ? /^https?:\/\//i.test(paypalButtonId)
          ? paypalButtonId
          : `https://www.paypal.com/donate/?hosted_button_id=${encodeURIComponent(
              paypalButtonId
            )}`
        : "",
      configured: Boolean(paypalButtonId),
    },
    zelle: {
      key: "zelle",
      // Zelle has no shareable donation URL — recipients receive via email or phone
      // registered with a US bank. We surface whichever is configured; user copies
      // it into their bank's Zelle app.
      email: zelleEmail,
      phone: zellePhone,
      configured: Boolean(zelleEmail || zellePhone),
    },
  };
}
