"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminLogin } from "@/lib/actions/admin";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, {
    status: "idle",
  });

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="text-sm font-medium">
          Нууц үг
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state.status === "invalid" ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Нууц үг буруу байна.
        </div>
      ) : null}
      {state.status === "unconfigured" ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          ADMIN_PASSWORD орчны хувьсагч тохируулаагүй байна. .env.local файлд
          нэмээд серверээ дахин асаана уу.
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
      >
        {pending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}
        Нэвтрэх
      </Button>
    </form>
  );
}
