"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { api, loadAdmin } from "@/lib/admin/client";
import { defaultFilters } from "@/lib/admin/analytics";
import type { Bootstrap, Filters, Permission } from "@/lib/admin/types";
export function useAdminModel() {
    const locale = useLocale() as "fa" | "en", router = useRouter();
    const sessionRouter = useNextRouter();
    const pathname = usePathname();
    const [data, setData] = useState<Bootstrap | null>(null), [error, setError] = useState(""), [filters, setFilters] = useState<Filters>(defaultFilters);
    const l = useCallback((fa: string, en: string) => locale === "fa" ? fa : en, [locale]);
    const handleSessionError = useCallback((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : "REQUEST_FAILED";
        setError(message);
        if (message === "SESSION_REQUIRED") {
            setData(null);
            // Session redirects must not depend on the progress transition's router identity.
            sessionRouter.replace(`/${locale}/auth/login`);
        }
    }, [locale, sessionRouter]);
    const refresh = useCallback(async () => {
        try {
            setData(await loadAdmin());
            setError("");
        } catch (cause) { handleSessionError(cause); }
    }, [handleSessionError]);
    useEffect(() => {
        const controller = new AbortController();
        loadAdmin(controller.signal).then(result => {
            if (!controller.signal.aborted) { setData(result); setError(""); }
        }).catch(cause => {
            if (!controller.signal.aborted) handleSessionError(cause);
        });
        return () => controller.abort();
    }, [pathname, handleSessionError]);
    const can = (p: Permission) => !!data?.currentRole.permissions.includes(p);
    async function mutate(path: string, method: string, body?: unknown) {
        try {
            const result = await api(path, method, body);
            await refresh();
            toast.success(l("تغییرات ذخیره شد.", "Changes saved."));
            return result;
        } catch (error) {
            toast.error(l("عملیات انجام نشد.", "The operation failed."), l("ورودی‌ها و دسترسی خود را بررسی کنید.", "Check the inputs and your permissions."));
            throw error;
        }
    }
    const number = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
    const date = (value: string) => value ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Asia/Tehran" }).format(new Date(value)) : "—";
    const duration = (seconds: number) => `${number(Math.floor(seconds / 60))} ${l("دقیقه", "min")} ${number(Math.round(seconds % 60))} ${l("ثانیه", "sec")}`;
    return { data, error, filters, setFilters, l, locale, number, date, duration, can, mutate, refresh, router };
}
type Model = ReturnType<typeof useAdminModel>;
const Context = createContext<Model | null>(null);
export function AdminProvider({ children }: {
    children: ReactNode;
}) { return <Context.Provider value={useAdminModel()}>{children}</Context.Provider>; }
export function useAdmin() { const value = useContext(Context); if (!value)
    throw new Error("AdminProvider required"); return value; }
