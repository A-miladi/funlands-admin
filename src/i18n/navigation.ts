"use client";

import { createNavigation } from "next-intl/navigation";
import { createElement, useMemo, type ComponentProps } from "react";
import { LinkPending, useNavigation } from "@/components/common/navigation-progress/navigation-provider";

import { routing } from "./routing";

const navigation = createNavigation(routing);
export const { redirect, usePathname, getPathname } = navigation;

export function Link({ children, onNavigate, ...props }: ComponentProps<typeof navigation.Link>) {
  const { pulseNavigation } = useNavigation();
  return createElement(navigation.Link, {
    ...props,
    onNavigate: event => {
      let cancelled = false;
      onNavigate?.({ preventDefault: () => { cancelled = true; event.preventDefault(); } });
      if (!cancelled) pulseNavigation();
    },
  }, children, createElement(LinkPending));
}

export function useRouter() {
  const router = navigation.useRouter();
  const { startNavigation } = useNavigation();
  return useMemo(() => ({
    ...router,
    push: (...args: Parameters<typeof router.push>) => startNavigation(() => router.push(...args)),
    replace: (...args: Parameters<typeof router.replace>) => startNavigation(() => router.replace(...args)),
    refresh: () => startNavigation(() => router.refresh()),
    back: () => startNavigation(() => router.back()),
    forward: () => startNavigation(() => router.forward()),
  }), [router, startNavigation]);
}
