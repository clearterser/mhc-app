import { redirect } from "next/navigation";
import { ShieldCheck, ShieldX } from "lucide-react";
import { SignIn, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import { AdminLoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated, clerkEnabled } from "@/lib/admin-auth";

export const metadata = {
  title: "Нэвтрэх — Админ",
};

function LoginShell({ children }) {
  return (
    <div className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
            <ShieldCheck className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            Админ хэсэг
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Монгол Өв Соёлын Төв — хандивын бүртгэл
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/donations");

  // Clerk тохируулаагүй бол хуучин нууц үгийн маягт руу буцна.
  if (!clerkEnabled()) {
    return (
      <LoginShell>
        <AdminLoginForm />
      </LoginShell>
    );
  }

  // Clerk-ээр нэвтэрсэн ч ADMIN_EMAILS жагсаалтад байхгүй хэрэглэгч.
  const user = await currentUser();
  if (user) {
    const email = user.emailAddresses?.[0]?.emailAddress ?? "";
    return (
      <LoginShell>
        <div className="rounded-2xl border border-border bg-card p-6 text-center ring-1 ring-foreground/10 sm:p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <ShieldX className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Хандах эрхгүй</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {email ? (
              <>
                <span className="font-medium text-foreground">{email}</span>{" "}
                хаяг админ эрхгүй байна. Админ эрх авахын тулд байгууллагатай
                холбогдоно уу.
              </>
            ) : (
              "Таны бүртгэл админ эрхгүй байна."
            )}
          </p>
          <SignOutButton redirectUrl="/admin/login">
            <Button variant="outline" className="mt-6 h-10 rounded-xl px-5">
              Гарах
            </Button>
          </SignOutButton>
        </div>
      </LoginShell>
    );
  }

  // Нэвтрээгүй — Clerk-ийн нэвтрэх маягт.
  return (
    <LoginShell>
      <div className="flex justify-center">
        <SignIn
          routing="hash"
          forceRedirectUrl="/admin/donations"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
            },
          }}
        />
      </div>
    </LoginShell>
  );
}
