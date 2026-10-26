export type Theme = "light" | "dark";

const preference = /(?:^|;\s*)theme=(light|dark)(?:;|$)/;
export const THEME_BOOTSTRAP = `(function(){try{var t=${preference}.exec(document.cookie);var d=!t||t[1]==='dark';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch{}})()`;

export function readThemePreference(cookie: string, fallback: Theme): Theme {
  const value = preference.exec(cookie)?.[1];
  return value === "light" || value === "dark" ? value : fallback;
}

export function readBrowserTheme(fallback: Theme): Theme {
  if (typeof document === "undefined") return fallback;
  try { return readThemePreference(document.cookie, fallback); }
  catch { return fallback; }
}
