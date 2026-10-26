"use client";
import { muted } from "../dashboard-styles";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t">;
export function DashboardFooter({ t }: Props) {
    return (<footer className={`flex flex-wrap items-center justify-between gap-2 px-1 pt-6 pb-1 text-[9px] ${muted}`}>
          <span>{t("mockNotice")}</span>
          <span className="font-inter">Funlands Admin © 2026</span>
        </footer>);
}
