"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { api } from "@/lib/admin/client";
import { useAdmin } from "../admin-context";
import { Heading, Panel, Info, ErrorNote, fieldClass, muted } from "../shared/widgets";
export function SettingsPage() {
    const { data, l, can, mutate, refresh } = useAdmin(), [limit, setLimit] = useState<number | null>(null), [account, setAccount] = useState("admin@funlands.ir"), [busy, setBusy] = useState(false), [error, setError] = useState("");
    if (!data)
        return null;
    async function policy(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try {
        await mutate("policy", "PATCH", { maxFileMB: limit ?? data!.policy.maxFileMB });
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    return <><Heading title={l("تنظیمات محیط نمایشی", "Demo workspace settings")}/><Info>{l("داده‌ها و فایل‌های بارگذاری‌شده فقط در حافظهٔ سرور محلی نگه داشته می‌شوند و با راه‌اندازی مجدد به نمونه‌های اولیه برمی‌گردند. این محیط به بک‌اند واقعی یا کاربران واقعی متصل نیست.", "Data and uploaded files live in local server memory and reset on restart. This workspace has no connection to a production backend or real users.")}</Info><div className="grid gap-5 xl:grid-cols-2"><Panel title={l("حساب و محدودهٔ فعلی", "Current account & scope")}><dl className="space-y-4 text-xs"><p>{data.currentAdmin.email}</p><p>{l("پوسته", "Skin")}: {data.currentAdmin.skinId}</p><p>{l("رمز ورود نمونه", "Demo password")}: <code>Funlands123!</code></p><p className={muted}>{l("برای تست نقش‌ها، از حساب نمونهٔ دیگر وارد شوید.", "Switch demo accounts to test role restrictions.")}</p></dl><div className="mt-5 space-y-4"><Select aria-label={l("حساب آزمایشی", "Demo account")} value={account} onValueChange={setAccount} options={["admin", "content", "games", "support", "viewer"].map(name => ({ value: `${name}@funlands.ir`, label: `${name}@funlands.ir` }))}/><Button variant="outline" disabled={busy} onClick={async () => { setBusy(true); setError(""); try {
        await api("login", "POST", { email: account, password: "Funlands123!" });
        await refresh();
        toast.success(l("حساب آزمایشی تغییر کرد.", "Demo account switched."));
    }
    catch (e) {
        setError((e as Error).message);
        toast.error(l("تغییر حساب انجام نشد.", "Unable to switch accounts."));
    }
    finally {
        setBusy(false);
    } }}>{l("ورود با حساب انتخابی", "Switch demo account")}</Button></div></Panel><Panel title={l("سیاست فایل و حذف", "Upload & deletion policy")}><p className={`mb-5 text-xs leading-7 ${muted}`}>{l("حذف نرم است. فایل‌های حذف‌شده برای کاربران قابل دریافت نیستند. سقف اندازه برای فایل و کاور روی سرور نیز کنترل می‌شود.", "Deletion is soft. Deleted files are not accessible. Size limits for files and covers are enforced by the server.")}</p><ul className="mb-5 space-y-2 font-inter text-xs">{Object.entries(data.policy.allowed).map(([type, formats]) => <li key={type}>{type}: {formats.join(", ")}</li>)}</ul><form onSubmit={policy}><label className="block text-xs">{l("حداکثر حجم هر فایل (MB)", "Maximum file size (MB)")}<Input type="number" min={1} max={100} required disabled={!can("roles:write")} value={limit ?? data.policy.maxFileMB} onChange={e => setLimit(Number(e.target.value))} className={`${fieldClass} mt-2`}/></label>{can("roles:write") && <Button variant="outline" type="submit" disabled={busy} className="mt-4">{l("ذخیره سیاست", "Save policy")}</Button>}</form></Panel></div><ErrorNote error={error}/></>;
}
