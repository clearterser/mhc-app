import "server-only";

const dictionaries = {
  mn: () => import("@/dictionaries/mn.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export const hasLocale = (locale) => locale in dictionaries;

export const getDictionary = async (locale) => dictionaries[locale]();
