"use client";
import { Icon } from "@/components/ui/icon";
import { muted } from "../dashboard-styles";
import { Button } from "@/components/ui/button";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "exportReport">;
export function DashboardHeading({ t, exportReport }: Props) {
    return (<div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
          <div>
            <p className={`mb-1.5 text-xs ${muted}`}>{t("greeting")}</p>
            <h1 className="font-morabba text-3xl font-bold ltr:font-orbitron ltr:text-2xl">
              {t("overview")}
            </h1>
            <p className={`mt-2 text-xs leading-6 ${muted}`}>
              {t("description")}
            </p>
          </div>
          <Button variant="outline" onClick={exportReport} className={`flex cursor-pointer items-center gap-2 px-3 py-2.5 text-[11px] hover:border-primary-400`}>
            <Icon name="export" className="size-4"/>
            {t("export")}
          </Button>
        </div>);
}
