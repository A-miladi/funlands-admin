"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/theme/theme-provider";
import { SunIcon } from "@/components/icons/sun";
import { MoonIcon } from "@/components/icons/moon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
export function ThemeToggle({ className }: {
    className?: string;
}) {
    const { theme, toggleTheme } = useTheme();
    const t = useTranslations("Auth");
    const label = t(theme === "dark" ? "lightMode" : "darkMode");
    return <Button variant="unstyled" onClick={toggleTheme} aria-label={label} title={label} className={cn("grid size-8 place-items-center", className)}>{theme === "dark" ? <SunIcon size={19}/> : <MoonIcon size={19}/>}</Button>;
}
