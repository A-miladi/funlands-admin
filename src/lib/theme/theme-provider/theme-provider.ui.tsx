"use client";

import type { ThemeProviderUiProps } from "@/lib/theme/theme-provider/theme-provider.types";

import { ThemeContext } from "./theme-provider.shared";
export function ThemeProviderUi({ children, value }: ThemeProviderUiProps) {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
