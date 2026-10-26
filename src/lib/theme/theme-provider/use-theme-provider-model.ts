"use client";

import type { Theme } from "@/lib/theme/preference";
import type { ThemeProviderProps } from "./theme-provider.types";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { getThemeSnapshot, setBrowserTheme, subscribeToTheme, toggleBrowserTheme } from "../theme-store";
import { applyTheme } from "./theme-provider.shared";

export function useThemeProviderModel({ children, initialTheme }: ThemeProviderProps) {
  const getSnapshot = useCallback(() => getThemeSnapshot(initialTheme), [initialTheme]);
  const getServerSnapshot = useCallback(() => initialTheme, [initialTheme]);
  const theme = useSyncExternalStore(subscribeToTheme, getSnapshot, getServerSnapshot);
  const setTheme = useCallback((nextTheme: Theme) => setBrowserTheme(nextTheme), []);
  const toggleTheme = useCallback(() => toggleBrowserTheme(initialTheme), [initialTheme]);

  // Restore the current selection when the locale root layout is mounted again.
  useEffect(() => { applyTheme(getThemeSnapshot(initialTheme)); }, [theme, initialTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return { children, value };
}
