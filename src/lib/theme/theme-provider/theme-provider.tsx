"use client";

import type { ThemeProviderProps } from "@/lib/theme/theme-provider/theme-provider.types";
import { ThemeProviderUi } from "./theme-provider.ui";
import { useThemeProviderModel } from "./use-theme-provider-model";
export function ThemeProvider(props: ThemeProviderProps) {
  const model = useThemeProviderModel(props);
  return <ThemeProviderUi {...model} />;
}
export type { Theme } from "@/lib/theme/preference";
export { useTheme } from "./theme-provider.shared";
