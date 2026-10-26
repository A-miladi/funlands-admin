"use client";

import { readBrowserTheme, type Theme } from "./preference";
import { applyTheme, setThemeCookie } from "./theme-provider/theme-provider.shared";

let currentTheme: Theme | undefined;
const listeners = new Set<() => void>();

export function getThemeSnapshot(fallback: Theme): Theme {
  // Read persistence once. Cookie access is not part of rendering or toggling.
  currentTheme ??= readBrowserTheme(fallback);
  return currentTheme;
}

export function subscribeToTheme(onChange: () => void) {
  listeners.add(onChange);
  return () => { listeners.delete(onChange); };
}

export function setBrowserTheme(theme: Theme) {
  currentTheme = theme;
  applyTheme(theme);
  listeners.forEach((onChange) => onChange());
  // A blocked cookie must never prevent the visible theme from changing.
  try { setThemeCookie(theme); } catch { /* Keep the selection for this session. */ }
}

export function toggleBrowserTheme(fallback: Theme) {
  setBrowserTheme(getThemeSnapshot(fallback) === "dark" ? "light" : "dark");
}
