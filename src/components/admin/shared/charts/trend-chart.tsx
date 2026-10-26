"use client";
import { useId, useState } from "react";
import { useAdmin } from "../../admin-context";
import { Empty } from "../widgets";
import { ChartReadout, ChartTooltip } from "./chart-readout";
import { finiteValue, palette, shortLabel, smoothPath, type ChartRow } from "./chart-utils";

export function TrendChart({ rows, series, area = true, independentAxes = false }: {rows: ChartRow[]; series: string[]; area?: boolean; independentAxes?: boolean}) {
  const {number, l} = useAdmin(), id = useId();
  const [point, setPoint] = useState(Math.max(0,rows.length-1));
  const [inspect, setInspect] = useState(false);
  if (!rows.length || !series.length) return <Empty/>;
  const active = Math.min(point, rows.length - 1);
  const maxima = series.map((_, j) => Math.max(1, ...rows.map(row => finiteValue(row.values[j] ?? 0))));
  const sharedMax = Math.max(...maxima);
  const x = (i: number) => rows.length === 1 ? 330 : 48 + i * 558 / (rows.length - 1);
  const y = (value: number, j: number) => 190 - finiteValue(value) / (independentAxes ? maxima[j] : sharedMax) * 158;
  return <>
    <ChartReadout row={rows[active]} series={series} independentAxes={independentAxes}/>
    <div className="relative" onMouseLeave={()=>setInspect(false)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setInspect(false);}}>
    {inspect&&<ChartTooltip row={rows[active]} series={series} left={x(active)/660*100}/>}
    <svg viewBox="0 0 660 236" role="group" aria-label={`${l(area ? "نمودار سطحی" : "نمودار خطی", area ? "Area chart" : "Line chart")}: ${series.join(" / ")}`} className="block w-full [direction:ltr] [--chart-area-opacity:0.32] [--chart-area-base:white] dark:[--chart-area-opacity:0.10] dark:[--chart-area-base:var(--color-card-400)]">
      <defs>{series.map((name,j) => <linearGradient key={name} id={`${id}-area-${j}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={`color-mix(in srgb, ${palette[j % palette.length]} 80%, var(--chart-area-base))`} style={{stopOpacity:"var(--chart-area-opacity)"}}/><stop offset="100%" stopColor={palette[j % palette.length]} stopOpacity="0"/></linearGradient>)}</defs>
      {[0,1,2,3].map(i => <g key={i} aria-hidden="true"><line x1="48" x2="606" y1={32+i*158/3} y2={32+i*158/3} className="stroke-base-300 dark:stroke-white/5" strokeDasharray="3 6"/><text x="38" y={36+i*158/3} textAnchor="end" className="fill-base-500 text-[9px] dark:fill-paragraph">{number(Math.round((independentAxes ? maxima[0] : sharedMax)*(3-i)/3))}</text>{independentAxes && series.length > 1 && <text x="616" y={36+i*158/3} className="fill-info-500 text-[9px]">{number(Math.round(maxima[1]*(3-i)/3))}</text>}</g>)}
      {series.map((name,j) => {
        const points = rows.map((row,i) => ({x:x(i),y:y(row.values[j] ?? 0,j)})), path = smoothPath(points);
        return <g key={name} aria-hidden="true">{area && rows.length > 1 && <path d={`${path} L${x(rows.length-1)},190 L${x(0)},190 Z`} fill={`url(#${id}-area-${j})`}/>}<path d={path} fill="none" stroke={palette[j%palette.length]} strokeWidth="9" opacity=".07"/> <path d={path} fill="none" stroke={palette[j%palette.length]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{rows.map((row,i)=><circle key={i} cx={x(i)} cy={y(row.values[j] ?? 0,j)} r={i===active?5:1.8} fill={area ? palette[j%palette.length] : "var(--color-card-400)"} stroke={palette[j%palette.length]} strokeWidth="1.5"/>)}</g>;
      })}
      <circle aria-hidden="true" cx={x(active)} cy={y(rows[active].values[0]??0,0)} r="11" fill={palette[0]} opacity=".12"/>
      <line aria-hidden="true" x1={x(active)} x2={x(active)} y1="25" y2="190" className="stroke-primary-400/35" strokeDasharray="3 5"/>
      {rows.map((row,i) => <g key={`${row.label}-${i}`} role="button" tabIndex={0} aria-label={`${row.label}: ${series.map((name,j)=>`${name} ${number(row.values[j]??0)}`).join(", ")}`} onMouseEnter={()=>{setPoint(i);setInspect(true);}} onFocus={()=>{setPoint(i);setInspect(true);}} onClick={()=>{setPoint(i);setInspect(true);}} onKeyDown={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();setPoint(i);}}} className="cursor-pointer outline-none focus-visible:stroke-primary-400"><rect x={x(i)-Math.max(5,558/Math.max(1,rows.length-1)/2)} y="22" width={Math.max(10,558/Math.max(1,rows.length-1))} height="175" fill="transparent"/>{(i===0||i===rows.length-1||i%Math.max(1,Math.ceil(rows.length/6))===0)&&<text aria-hidden="true" x={x(i)} y="218" textAnchor="middle" className="fill-base-500 text-[9px] dark:fill-paragraph">{shortLabel(row.label)}</text>}</g>)}
    </svg>
    </div>
  </>;
}
