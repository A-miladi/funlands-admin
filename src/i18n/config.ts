export const locales = ["en", "fa"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  en: "ltr",
  fa: "rtl",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
