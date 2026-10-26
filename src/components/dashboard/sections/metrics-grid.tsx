"use client";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/ui/stat-card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "number" | "multiplier" | "metrics">;
export function MetricsGrid({ t, number, multiplier, metrics }: Props) {
    return <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6" aria-label={t("metrics")}>{metrics.map((metric, i) => <StatCard key={metric.key} title={t(metric.key)} value={<>{number(Math.round(metric.value * (i === 1 || i === 4 ? 1 : multiplier)))}{i === 4 ? "%" : ""}</>} icon={<span className={`grid size-9 place-items-center rounded-xl ${metric.color}`}><Icon name={metric.icon}/></span>} change={metric.change} changeLabel={number(Math.abs(metric.change))} footer={t("previousPeriod")} trend={metric.trend} trendColor={i === 5 ? "#ff5b5b" : i === 2 ? "#9c59f2" : "#26cf3a"}/>)}</section>;
}
