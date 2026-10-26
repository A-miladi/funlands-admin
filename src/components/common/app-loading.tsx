"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

export function AppLoading() {
  const fa = useLocale() === "fa";
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-background px-6 text-base-900 dark:text-title">
      <div aria-hidden="true" className="pointer-events-none absolute size-72 rounded-full bg-primary-500/10 blur-3xl motion-safe:animate-pulse" />
      <div className="relative flex flex-col items-center text-center">
        <div className="relative mb-8 grid size-28 place-items-center">
          <span aria-hidden="true" className="absolute inset-0 rounded-full border border-primary-500/15" />
          <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 border-e-primary-500/40 motion-safe:animate-spin motion-safe:[animation-duration:1.8s]" />
          <span aria-hidden="true" className="absolute inset-3 rounded-full border border-dashed border-primary-400/25 motion-safe:animate-spin motion-safe:[animation-direction:reverse] motion-safe:[animation-duration:8s]" />
          <Image src="/images/LargeLogo.webp" width={56} height={56} alt="Funlands" priority className="drop-shadow-[0_0_18px_#8d2ceb55] motion-safe:animate-pulse motion-safe:[animation-duration:2s]" />
        </div>
        <p className="font-orbitron text-sm font-semibold tracking-[.2em] text-primary-500 dark:text-primary-300">FUNLANDS</p>
        <p className="mt-3 text-xs text-base-600 dark:text-paragraph">{fa ? "در حال آماده‌سازی فضای شما…" : "Preparing your workspace…"}</p>
        <div aria-hidden="true" className="mt-6 flex gap-2">
          {[0, 150, 300].map(delay => <span key={delay} style={{ animationDelay: `${delay}ms` }} className="size-1.5 rounded-full bg-primary-500 motion-safe:animate-bounce" />)}
        </div>
      </div>
    </div>
  );
}
