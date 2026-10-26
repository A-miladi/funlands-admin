"use client";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/lib/toast";
import { api } from "@/lib/admin/client";
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
            await api("login", "POST", { email: email.trim(), password });
            valid = true;
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
        if (valid)
            router.push("/");
        else
            setStatus("error");
    }
    return { t, email, setEmail, password, setPassword, visible, setVisible, remember, setRemember, status, setStatus, submit };
}
export type LoginModel = ReturnType<typeof useLoginModel>;
