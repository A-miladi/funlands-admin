"use client";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { signInDemo } from "@/app/[locale]/auth/login/actions";
const subscribeToStorage = (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
};
function readRememberedEmail() {
    try {
        return localStorage.getItem("funlands-demo-email") ?? "";
    }
    catch {
        return "";
    }
}
export function useLoginModel() {
    const t = useTranslations("Auth");
    const router = useRouter();
    const locale = useLocale();
    const savedEmail = useSyncExternalStore(subscribeToStorage, readRememberedEmail, () => "");
    const [editedEmail, setEmail] = useState<string | null>(null);
    const email = editedEmail ?? savedEmail;
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [remember, setRemember] = useState(true);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        let valid = false;
        try {
            const result = await signInDemo(email.trim(), password);
            valid = result.ok;
            if (!valid) { setStatus("error"); toast.error(t("error")); }
        } catch { setStatus("error"); toast.error(t("error")); }
        if (valid) {
            try {
                if (remember)
                    localStorage.setItem("funlands-demo-email", email.trim());
                else
                    localStorage.removeItem("funlands-demo-email");
            }
            catch {
                /* Sign-in preview also works when browser storage is unavailable. */
            }
        }
        if (valid) {
            router.replace(`/${locale}`);
        }
        else
            setStatus("error");
    }
    return { t, email, setEmail, password, setPassword, visible, setVisible, remember, setRemember, status, setStatus, submit };
}
export type LoginModel = ReturnType<typeof useLoginModel>;
