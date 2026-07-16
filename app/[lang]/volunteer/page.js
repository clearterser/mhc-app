import { notFound } from "next/navigation";

import { PendingPage } from "@/components/pending-page";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.volunteer.metaTitle,
    description: dict.volunteer.metaDescription,
  };
}

export default async function VolunteerPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <PendingPage lang={lang} dict={dict} t={dict.volunteer} />;
}
