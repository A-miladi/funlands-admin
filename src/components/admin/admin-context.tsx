"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { api, loadAdmin } from "@/lib/admin/client";
import { defaultFilters } from "@/lib/admin/analytics";
import type { Bootstrap, Filters, Permission } from "@/lib/admin/types";
export function useAdminModel() {
    const locale = useLocale() as "fa" | "en", router = useRouter();
    const [data, setData] = useState<Bootstrap | null>(null), [error, setError] = useState(""), [filters, setFilters] = useState<Filters>(defaultFilters), [notice, setNotice] = useState("");
    const l = useCallback((fa: string, en: string) => locale === "fa" ? fa : en, [locale]);
    const refresh = useCallback(async () => { try {
        setData(await loadAdmin());
        setError("");
    }
    catch (e) {
        const message = (e as Error).message;
        if (message === "SESSION_REQUIRED")
            router.replace("/auth/login");
        else
            setError(message);
    } }, [router]);
    useEffect(() => { let alive = true; loadAdmin().then(result => { if (alive)
        setData(result); }).catch(e => { if (!alive)
        return; if (e.message === "SESSION_REQUIRED")
        router.replace("/auth/login");
    else
        setError(e.message); }); return () => { alive = false; }; }, [router]);
    useEffect(() => { if (!notice)
        return; const timeout = setTimeout(() => setNotice(""), 4000); return () => clearTimeout(timeout); }, [notice]);
    const can = (p: Permission) => !!data?.currentRole.permissions.includes(p);
    async function mutate(path: string, method: string, body?: unknown) { const result = await api(path, method, body); await refresh(); setNotice(l("تغییرات ذخیره شد.", "Changes saved.")); return result; }
    const number = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
    const date = (value: string) => value ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Asia/Tehran" }).format(new Date(value)) : "—";
    const duration = (seconds: number) => `${number(Math.floor(seconds / 60))} ${l("دقیقه", "min")} ${number(Math.round(seconds % 60))} ${l("ثانیه", "sec")}`;
    return { data, error, filters, setFilters, notice, setNotice, l, locale, number, date, duration, can, mutate, refresh, router };
}
type Model = ReturnType<typeof useAdminModel>;
const Context = createContext<Model | null>(null);
export function AdminProvider({ children }: {
    children: ReactNode;
}) { return <Context.Provider value={useAdminModel()}>{children}</Context.Provider>; }
export function useAdmin() { const value = useContext(Context); if (!value)
    throw new Error("AdminProvider required"); return value; }
