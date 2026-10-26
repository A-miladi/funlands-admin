"use client";
import { useId, useState } from "react";
import { useAdmin } from "../admin-context";
import { Empty, muted } from "./widgets";
import { Progress } from "@/components/ui/progress";
const palette = ["#9c59f2", "#36bffa", "#26cf3a", "#f59e0b", "#ff5b5b"];
export function LineChart({ rows, series }: {
    rows: {
        label: string;
        values: number[];
    }[];
    series: string[];
}) { const { number } = useAdmin(), id = useId(); const [point, setPoint] = useState(0); if (!rows.length)
    return <Empty />; const active = Math.min(point, rows.length - 1), max = Math.max(1, ...rows.flatMap(r => r.values)); const x = (i: number) => 40 + i * 590 / Math.max(1, rows.length - 1), y = (v: number) => 180 - v / max * 150; return <><div className="mb-3 flex flex-wrap gap-4">{series.map((s, i) => <span key={s} className={`flex items-center gap-1.5 text-[10px] ${muted}`}><i className="size-2 rounded-full" style={{ backgroundColor: palette[i % palette.length] }}/>{s}: <b>{number(rows[active]?.values[i] ?? 0)}</b></span>)}<span className={`text-[10px] ${muted}`}>{rows[active]?.label}</span></div><svg role="img" aria-label={series.join(" / ")} viewBox="0 0 660 215" className="w-full overflow-visible"><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor={palette[0]} stopOpacity=".2"/><stop offset="100%" stopColor={palette[0]} stopOpacity="0"/></linearGradient></defs>{[0, 1, 2, 3].map(i => <g key={i}><line x1="40" x2="630" y1={30 + i * 50} y2={30 + i * 50} className="stroke-base-300 dark:stroke-white/5" strokeDasharray="4 5"/><text x="0" y={35 + i * 50} className="fill-base-500 font-inter text-[9px]">{number(Math.round(max * (3 - i) / 3))}</text></g>)}<path d={`M40 180 ${rows.map((r, i) => `L${x(i)} ${y(r.values[0])}`).join(" ")} L630 180 Z`} fill={`url(#${id})`}/>{series.map((s, j) => <polyline key={s} points={rows.map((r, i) => `${x(i)},${y(r.values[j] ?? 0)}`).join(" ")} stroke={palette[j % palette.length]} strokeWidth="2.5" fill="none" strokeLinejoin="round"/>)}{rows.map((r, i) => <circle key={i} cx={x(i)} cy={y(r.values[0])} r={i === active ? 5 : 3} fill={palette[0]} className="cursor-pointer focus:stroke-white focus:stroke-2" role="button" tabIndex={0} aria-label={`${r.label}: ${r.values.join(", ")}`} onMouseEnter={() => setPoint(i)} onFocus={() => setPoint(i)} onClick={() => setPoint(i)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ")
    setPoint(i); }}/>)}{[...new Set([0, Math.floor(rows.length / 2), rows.length - 1])].map(i => <text key={i} x={x(i)} y="207" textAnchor="middle" className="fill-base-500 font-inter text-[9px]">{rows[i].label.slice(5)}</text>)}</svg></>; }
export function Bars({ rows }: {
    rows: {
        label: string;
        value: number;
        count?: number;
    }[];
}) { const { number } = useAdmin(); return rows.length ? <div className="space-y-4">{rows.map(row => <div key={row.label} className="flex items-center gap-3"><span className={`w-24 truncate text-[11px] ${muted}`}>{row.label}</span><Progress value={row.value} label={row.label} className="h-2.5 flex-1"/><span className="w-12 text-end font-inter text-[11px]">{number(row.value)}%</span>{row.count !== undefined && <span className={`w-10 text-end text-[10px] ${muted}`}>{number(row.count)}</span>}</div>)}</div> : <Empty />; }
export function Donut({ completed, total }: {
    completed: number;
    total: number;
}) { const { l, number } = useAdmin(); const rate = total ? completed / total * 100 : 0; return <div className="flex items-center justify-center gap-8"><div className="relative size-36"><svg viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r="48" fill="none" className="stroke-primary-500/10" strokeWidth="11"/><circle cx="60" cy="60" r="48" fill="none" stroke="#8d2ceb" strokeWidth="11" strokeDasharray={`${rate / 100 * 302} 302`} strokeLinecap="round"/></svg><div className="absolute inset-0 grid place-content-center text-center"><strong className="font-inter text-xl">{number(Math.round(rate))}%</strong><span className={`mt-1 text-[10px] ${muted}`}>{l("تکمیل", "Completed")}</span></div></div><div className="space-y-3 text-xs"><p>{l("تکمیل‌شده", "Completed")}: {number(completed)}</p><p className={muted}>{l("سایر شروع‌کنندگان", "Other starters")}: {number(total - completed)}</p></div></div>; }
