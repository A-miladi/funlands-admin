"use client";

import { type Theme } from "@/lib/theme/preference";
import type { ThemeContextValue } from "@/lib/theme/theme-provider/theme-provider.types";
import { createContext, useContext } from "react";
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
export const THEME_COOKIE = "theme";
export function setThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
