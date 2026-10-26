import type { ReactNode } from "react";
import { Card } from "./card";
import { Sparkline } from "./sparkline";
export function StatCard({ title, value, icon, change, changeLabel, footer, trend, trendColor }: {
    title: ReactNode;
    value: ReactNode;
    icon: ReactNode;
    change: number;
    changeLabel: string;
    footer: ReactNode;
    trend: number[];
    trendColor?: string;
}) {
    return <Card as="article" className="p-4"><div className="flex items-center justify-between">{icon}<span className="text-[10px] text-success-600 dark:text-success-400" dir="ltr">{change > 0 ? "↗" : "↘"} {changeLabel}%</span></div><p className="mt-4 text-[11px] text-base-600 dark:text-paragraph">{title}</p><div className="mt-1 flex items-end justify-between gap-1"><strong className="font-inter text-[25px] font-semibold tracking-tight">{value}</strong><div className="hidden sm:block"><Sparkline values={trend} color={trendColor}/></div></div><p className="mt-2 text-[9px] text-base-600 dark:text-paragraph">{footer}</p></Card>;
}
