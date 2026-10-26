"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState, useTransition, type ReactNode } from "react";
import { useLinkStatus } from "next/link";
import { useLocale } from "next-intl";
import { NavigationProgress } from "./navigation-progress";

const NavigationContext = createContext<{
  startNavigation: (action: () => void) => void;
  setLinkPending: (id: string, pending: boolean) => void;
  pulseNavigation: () => void;
}>({
  startNavigation: (action: () => void) => action(),
  setLinkPending: () => {},
  pulseNavigation: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [links, setLinks] = useState<Set<string>>(() => new Set());
  const [pulse, setPulse] = useState(true);
  const [pulseId, setPulseId] = useState(0);
  const pulseNavigation = useCallback(() => {
    setPulse(true);
    setPulseId(current => current + 1);
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => setPulse(false), 400);
    const show = () => {
      setPulse(true);
      clearTimeout(timer);
      timer = setTimeout(() => setPulse(false), 400);
    };
    window.addEventListener("popstate", show);
    window.addEventListener("pageshow", show);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", show);
      window.removeEventListener("pageshow", show);
    };
  }, [pulseId]);

  const setLinkPending = useCallback((id: string, active: boolean) => {
    setLinks(current => {
      if (current.has(id) === active) return current;
      const next = new Set(current);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  const value = useMemo(() => ({
    startNavigation: (action: () => void) => {
      pulseNavigation();
      startTransition(action);
    },
    setLinkPending,
    pulseNavigation,
  }), [setLinkPending, pulseNavigation]);

  return (
    <NavigationContext.Provider value={value}>
      <NavigationProgress active={pulse || pending || links.size > 0} label={locale === "fa" ? "در حال بارگذاری…" : "Loading…"} />
      {children}
    </NavigationContext.Provider>
  );
}

export function LinkPending() {
  const { pending } = useLinkStatus();
  const { setLinkPending } = useNavigation();
  const id = useId();
  useEffect(() => {
    setLinkPending(id, pending);
    return () => setLinkPending(id, false);
  }, [id, pending, setLinkPending]);
  return null;
}
