"use client";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { LoginModel } from "../use-login-model";
type Props = Pick<LoginModel, "t" | "setEmail" | "setPassword" | "setStatus">;
export function DemoCredentials({ t, setEmail, setPassword, setStatus }: Props) {
    return (<div className="mt-[23px] rounded-[10px] border border-dashed border-primary-500/25 bg-primary-500/[.025] px-3.5 py-[13px] [&>div]:flex [&>div]:items-center [&>div]:gap-[7px] [&_strong]:text-[10px] [&_strong]:font-medium [&_strong]:text-(--muted) [&_button]:ms-auto [&_button]:cursor-pointer [&_button]:text-[10px] [&_button]:text-primary-400 [&_p]:mt-2.5 [&_p]:text-center [&_p]:font-inter [&_p]:text-[10px] [&_p]:text-(--muted) [&_p_span]:px-[7px] [&_p_span]:opacity-40 [&_small]:mt-[9px] [&_small]:block [&_small]:text-[9px] [&_small]:leading-relaxed [&_small]:text-(--muted)">
                <div>
                  <span className="size-[5px] rounded-full bg-primary-400"/>
                  <strong>{t("demoTitle")}</strong>
                  <Button variant="unstyled" type="button" className="group inline-flex items-center gap-2 rounded-lg bg-primary-500/10 px-2.5 py-2 font-semibold hover:bg-primary-500/20" onClick={() => {
            setEmail("admin@funlands.ir");
            setPassword("Funlands123!");
            setStatus("idle");
        }}>
                    <Icon name="arrow" className="size-4 rotate-180 text-primary-400 motion-safe:animate-pulse rtl:rotate-0" />
                    {t("fillDemo")}
                  </Button>
                </div>
                <p dir="ltr">
                  admin@funlands.ir <span>/</span> Funlands123!
                </p>
                <small>{t("demoNote")}</small>
              </div>);
}
