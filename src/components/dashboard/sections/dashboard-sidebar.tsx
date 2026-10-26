"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { muted } from "../dashboard-styles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "router" | "menu" | "setMenu" | "active" | "setActive" | "number" | "nav">;
export function DashboardSidebar({ t, router, menu, setMenu, active, setActive, number, nav }: Props) {
    return (<Card borderVariant="frame" as="aside" className={`fixed inset-y-5 start-5 z-50 flex w-[238px] flex-col overflow-y-auto p-4 shadow-[0_10px_50px_#00000008] transition-transform ${menu ? "" : "max-lg:hidden"} lg:z-20`}>
        <Link href="/" className="mb-7 mt-2 flex items-center gap-2.5 px-2 font-orbitron text-lg font-bold">
          <Image src="/images/LargeLogo.webp" width={35} height={35} alt=""/>
          Funlands<span className="text-primary-500">.</span>
        </Link>
        <div className="mb-7 rounded-xl border border-base-300 bg-base-100 p-3 dark:border-white/[.06] dark:bg-white/[.025]">
          <span className={`text-[10px] ${muted}`}>{t("currentSkin")}</span>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <span className="grid size-8 place-items-center rounded-lg bg-primary-500/15 text-primary-400">
              <Icon name="game"/>
            </span>
            {t("funlands")}
            <span className="ms-auto size-1.5 rounded-full bg-success-500"/>
          </div>
        </div>
        <span className={`mb-3 px-3 text-[10px] ${muted}`}>
          {t("workspace")}
        </span>
        <nav className="space-y-2" aria-label={t("navigation")}>
          {nav.map((n) => (<a key={n.id} href={`#${n.id}`} onClick={() => {
                setActive(n.id);
                setMenu(false);
            }} className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-xs transition-colors ${active === n.id ? "border-primary-500/25 bg-primary-500/15 text-primary-700 dark:text-primary-200" : "border-transparent text-base-600 hover:bg-primary-50 dark:text-paragraph dark:hover:bg-white/[.03]"}`}>
              <Icon name={n.icon}/>
              {t(n.label)}
              {n.id === "technical" && (<span className="ms-auto rounded-md bg-error-500/10 px-1.5 py-.5 text-[10px] text-error-500">
                  {number(4)}
                </span>)}
            </a>))}
        </nav>
        <div className="mt-auto pt-10">
          <div className="mb-4 rounded-xl border border-primary-500/15 bg-primary-500/5 p-3">
            <Icon name="shield" className="mb-2 text-primary-400"/>
            <p className="text-[11px] font-medium">{t("scopeTitle")}</p>
            <p className={`mt-1.5 text-[10px] leading-5 ${muted}`}>
              {t("scopeDescription")}
            </p>
          </div>
          <div className="flex items-center gap-2.5 border-t border-base-300 pt-4 dark:border-white/[.06]">
            <span className="grid size-9 place-items-center rounded-full bg-primary-500/20 font-inter text-xs text-primary-400"><Icon name="user" /></span>
            <div>
              <p className="text-[11px] font-medium">{t("admin")}</p>
              <p className={`mt-1 text-[9px] ${muted}`}>{t("demo")}</p>
            </div>
            <Button variant="unstyled" className="ms-auto cursor-pointer text-base-500 hover:text-error-500" aria-label={t("logout")} onClick={() => router.push("/auth/login")}>
              <Icon name="logout"/>
            </Button>
          </div>
        </div>
      </Card>);
}
