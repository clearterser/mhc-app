import { notFound } from "next/navigation";

import { PendingPage } from "@/components/pending-page";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.membership.metaTitle,
    description: dict.membership.metaDescription,
  };
}

export default async function MembershipPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <PendingPage lang={lang} dict={dict} t={dict.membership} />;
}
