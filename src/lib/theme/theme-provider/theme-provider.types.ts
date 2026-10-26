import type { Theme } from "@/lib/theme/preference";
import type { ReactNode } from "react";
import type { useThemeProviderModel } from "./use-theme-provider-model";
export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: Theme;
}
export type ThemeProviderUiProps = ReturnType<typeof useThemeProviderModel>;
