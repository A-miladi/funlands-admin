import type { Locale } from "./config";

/** Remember explicit locale URLs in the browser without Set-Cookie on cached HTML. */
export function localePreferenceBootstrap(locale: Locale) {
  const cookie = JSON.stringify(`NEXT_LOCALE=${locale}`);
  const value = JSON.stringify(`NEXT_LOCALE=${locale}; path=/; samesite=lax`);
  return `(function(){try{if(!document.cookie.split(';').some(function(c){return c.trim()===${cookie}}))document.cookie=${value}}catch{}})()`;
}
