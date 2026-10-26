"use client";
import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { muted } from "../dashboard-styles";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "period" | "setPeriod" | "number">;
export function PeriodFilter({ t, period, setPeriod, number }: Props) {
    const options = ["today", "week", "month"].map(value => ({ value, label: t(value) }));
    return <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><SegmentedControl className="max-sm:hidden" label={t("periodLabel", { days: number(period === "today" ? 1 : period === "week" ? 7 : 30) })} options={options} value={period} onValueChange={setPeriod}/><Select className="sm:hidden" aria-label={t("periodLabel", { days: number(period === "today" ? 1 : period === "week" ? 7 : 30) })} options={options} value={period} onValueChange={setPeriod}/><span className={`flex items-center gap-2 text-[10px] ${muted}`}><Icon name="calendar" className="size-4"/>{t("periodLabel", { days: number(period === "today" ? 1 : period === "week" ? 7 : 30) })}</span></div>;
}
