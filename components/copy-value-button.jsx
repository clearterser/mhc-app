"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Client-side "copy to clipboard" button.
 * Shows a temporary "Copied!" state on success, falls back gracefully if the
 * Clipboard API is unavailable (older browsers / insecure contexts).
 */
export function CopyValueButton({
  value,
  label,
  copiedLabel,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch {
      /* fall through to textarea fallback */
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* no-op */
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={className}
    >
      {copied ? (
        <>
          <Check className="size-4" />
          {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="size-4" />
          {label}
        </>
      )}
    </Button>
  );
}
