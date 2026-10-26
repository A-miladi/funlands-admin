import type { Metadata } from "next";
import { DocumentBootstrap } from "@/components/document-bootstrap";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ClientIntlProvider } from "@/i18n/client-provider";
import { localeDirection, locales } from "@/i18n/config";
import { localePreferenceBootstrap } from "@/i18n/preference";
import { THEME_BOOTSTRAP } from "@/lib/theme/preference";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Funlands Admin",
  description: "Funlands administration panel",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={localeDirection[locale]} suppressHydrationWarning
      className={`h-full antialiased dark ${locale === "fa" ? "font-iransans" : "font-sans"}`}>
      <head>
        <DocumentBootstrap code={THEME_BOOTSTRAP + ";" + localePreferenceBootstrap(locale)} />
        <link rel="preload" href={locale === "fa" ? "/fonts/IranSans/IRANSansXFaNum-Regular.woff2" : "/fonts/Inter/Inter-VariableFont_opsz,wght.woff2"} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ClientIntlProvider locale={locale} messages={messages} timeZone="Asia/Tehran">
          <ThemeProvider initialTheme="dark">{children}</ThemeProvider>
        </ClientIntlProvider>
      </body>
    </html>
  );
}
