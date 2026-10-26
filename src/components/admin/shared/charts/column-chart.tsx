"use client";
import { useId, useState } from "react";
import { useAdmin } from "../../admin-context";
import { Empty } from "../widgets";
import { ChartReadout, ChartTooltip } from "./chart-readout";
import { palette, type ChartRow } from "./chart-utils";

export function ColumnChart({ rows, series, percent = false }: {
  rows: ChartRow[];
  series: string[];
  percent?: boolean;
}) {
  const { number, l } = useAdmin();
  const id = useId();
  const [point, setPoint] = useState(Math.max(0,rows.length-1));
  const [inspect, setInspect] = useState(false);
  if (!rows.length || !series.length) return <Empty />;
  const active = Math.min(point, rows.length - 1);
  const valueAt = (row: ChartRow, index: number) => {
    const value = row.values[index] ?? 0;
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  };
  const max = percent ? 100 : Math.max(1, ...rows.flatMap(row => series.map((_, j) => valueAt(row, j))));
  const plotWidth = Math.max(590, rows.length * Math.max(32, series.length * 10 + 12));
  const width = plotWidth + 70;
  const slot = plotWidth / rows.length;
  const groupWidth = Math.min(slot * .7, series.length * 26);
  const barWidth = groupWidth / series.length;
  const center = (index: number) => 45 + slot * (index + .5);
  const labelsEvery = Math.max(1, Math.ceil(rows.length / 8));
  const formatLabel = (label: string) => /^\d{4}-\d{2}-\d{2}$/.test(label) ? label.slice(5) : label;

  return <>
    <ChartReadout row={rows[active]} series={series} percent={percent}/>
    <div className="relative" onMouseLeave={()=>setInspect(false)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setInspect(false);}}>
    {inspect&&<ChartTooltip row={rows[active]} series={series} percent={percent} left={center(active)/width*100}/>}
    <div className="overflow-x-auto overscroll-x-contain pb-1" dir="ltr">
      <svg role="group" aria-label={`${l("نمودار ستونی", "Column chart")}: ${series.join(" / ")}`} viewBox={`0 0 ${width} 238`} style={{ minWidth: rows.length > 16 ? width : undefined }} className="block w-full">
        <defs>{series.map((name, j) => <linearGradient key={name} id={`${id}-${j}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={palette[j % palette.length]} /><stop offset="100%" stopColor={palette[j % palette.length]} stopOpacity=".12" /></linearGradient>)}</defs>
        {[0, 1, 2, 3].map(i => <g key={i} aria-hidden="true"><line x1="45" x2={width - 25} y1={25 + i * 52} y2={25 + i * 52} className="stroke-base-300 dark:stroke-white/5" strokeDasharray="4 5" /><text x="35" y={29 + i * 52} textAnchor="end" className="fill-base-500 text-[9px] dark:fill-paragraph">{number(Math.round(max * (3 - i) / 3))}{percent ? "%" : ""}</text></g>)}
        {rows.map((row, i) => <g key={`${row.label}-${i}`} role="button" tabIndex={0} aria-label={`${row.label}: ${series.map((name, j) => `${name} ${number(valueAt(row, j))}${percent ? "%" : ""}`).join(", ")}${row.detail ? `, ${row.detail}` : ""}`} onMouseEnter={() => {setPoint(i);setInspect(true);}} onFocus={() => {setPoint(i);setInspect(true);}} onClick={() => {setPoint(i);setInspect(true);}} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setPoint(i); } }} className="group cursor-pointer outline-none">
          <title>{`${row.label}: ${series.map((name, j) => `${name}: ${number(valueAt(row, j))}${percent ? "%" : ""}`).join(" / ")}${row.detail ? ` · ${row.detail}` : ""}`}</title>
          <rect x={center(i) - slot / 2 + 2} y="18" width={Math.max(1, slot - 4)} height="171" rx="5" className={i === active ? "fill-primary-500/5 group-focus:stroke-primary-400" : "fill-transparent group-focus:stroke-primary-400"} />
          {series.map((name, j) => {
            const value = valueAt(row, j), height = Math.min(1, value / max) * 156;
            return <g key={name}><rect x={center(i) - groupWidth / 2 + j * barWidth + 1} y="25" width={Math.max(1,barWidth-2)} height="156" rx="4" className="fill-primary-500/[.025]"/><rect x={center(i) - groupWidth / 2 + j * barWidth + 1} y={181 - height} width={Math.max(1, barWidth - 2)} height={height} rx={Math.min(4, barWidth / 4)} fill={`url(#${id}-${j})`} className="pointer-events-none"/><rect x={center(i)-groupWidth/2+j*barWidth+2} y={181-height} width={Math.max(1,barWidth-4)} height={Math.min(height,2)} rx="1" fill={palette[j%palette.length]} className="pointer-events-none"/></g>;
          })}
          {(i % labelsEvery === 0 || i === rows.length - 1) && <text x={center(i)} y="207" textAnchor="middle" className="pointer-events-none fill-base-500 text-[9px] dark:fill-paragraph">{formatLabel(row.label).length > 17 ? formatLabel(row.label).slice(0, 16) + "…" : formatLabel(row.label)}</text>}
        </g>)}
      </svg>
    </div>
    </div>
  </>;
}

