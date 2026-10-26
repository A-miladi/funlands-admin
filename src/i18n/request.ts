import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { locale as getRootLocale } from "next/root-params";

import { routing } from "./routing";

export default getRequestConfig(async ({ locale: override }) => {
  const requestedLocale = override ?? await getRootLocale();

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
