"use client";

import type { NavigationProgressProps } from "./navigation-progress.types";

import { createPortal } from "react-dom";
import { useNavigationProgress } from "./use-navigation-progress";

export function NavigationProgress({
  label = "Loading…",
  active = true,
  className = "fixed top-[calc(env(safe-area-inset-top,0px))] left-0 right-0 z-[1000] h-[2px] overflow-hidden",
}: NavigationProgressProps) {
  const { progress, visible } = useNavigationProgress(active);

  if (!visible) return null;

  return createPortal(
    <span
      role="progressbar"
      aria-label={label}
      aria-busy={active}
      className={className}
    >
      <span
        className="block h-full rounded-full bg-gradient-to-r via-info-500/50 to-fuchsia-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </span>,
    document.body,
  );
}
