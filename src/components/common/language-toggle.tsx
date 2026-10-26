"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { isLocale } from "@/i18n/config";
import { LanguageIcon } from "@/components/icons/language";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

const languages = [
  { value: "fa", label: "فارسی" },
  { value: "en", label: "English" },
];

export function LanguageToggle({ href, className, appearance = "surface" }: { href: string; className?: string; appearance?: "surface" | "bare" }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Home");

  return (
    <Select
      appearance={appearance}
      value={locale}
      options={languages}
      aria-label={t("language")}
      leadingIcon={<LanguageIcon size={18} />}
      iconOnlyOnMobile
      showCheck={false}
      menuMinWidth={144}
      className={cn("h-10 w-10 gap-0 px-2.5 [--select-min-width:2.5rem] sm:w-32 sm:gap-4 sm:px-3.5 sm:[--select-min-width:8rem]", className)}
      onValueChange={(nextLocale) => {
        if (isLocale(nextLocale) && nextLocale !== locale) router.replace(href, { locale: nextLocale });
      }}
    />
  );
}
