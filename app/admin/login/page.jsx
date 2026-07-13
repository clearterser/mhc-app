import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = {
  title: "Нэвтрэх — Админ",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/donations");

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
        <AdminLoginForm />
      </div>
    </div>
  );
}
