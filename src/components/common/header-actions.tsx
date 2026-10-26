"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { UserIcon } from "@/components/icons/user";

export function HeaderActions() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-primary-300/15 bg-white/40 p-1 dark:bg-white/[.025]">
      <ThemeToggle className="size-10! rounded-lg text-base-600 hover:bg-primary-500/10 dark:text-primary-300" />
      <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-base-300 dark:bg-white/10" />
      <LanguageToggle href={pathname} appearance="bare" className="rounded-lg" />
      <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-base-300 dark:bg-white/10" />
      <span title={t("admin")} className="grid size-10 place-items-center rounded-lg text-primary-500 dark:text-primary-300">
        <UserIcon size={20} />
        <span className="sr-only">{t("admin")}</span>
      </span>
    </div>
  );
}
