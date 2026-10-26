"use client";
import { useAdmin } from "../../admin-context";
import { palette, type ChartRow } from "./chart-utils";

export function ChartReadout({row,series,percent=false,independentAxes=false}:{row:ChartRow;series:string[];percent?:boolean;independentAxes?:boolean}) {
  const {number,l}=useAdmin();
  return <div className="mb-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
    <div className="flex flex-wrap gap-2">{series.map((name,j)=><div key={name} className="relative min-w-24 overflow-hidden rounded-xl border border-base-300/60 bg-white/45 px-3 py-2 dark:border-white/5 dark:bg-white/[.025]">
      <div aria-hidden="true" className="absolute inset-y-3 start-0 w-0.5 rounded-full" style={{backgroundColor:palette[j%palette.length]}}/>
      <span className="flex items-center gap-1.5 text-[9px] text-base-500 dark:text-paragraph"><i className="size-1.5 rounded-full" style={{backgroundColor:palette[j%palette.length]}}/>{name}</span>
      <strong className="mt-1 block font-inter text-lg font-semibold leading-none tracking-tight" style={{color:palette[j%palette.length]}}>{number(row.values[j]??0)}{percent?"%":""}</strong>
      {independentAxes&&<small className="mt-1 block text-[8px] text-base-500 dark:text-paragraph">{j===0?l("محور چپ", "Left axis"):l("محور راست", "Right axis")}</small>}
    </div>)}</div>
    <span className="rounded-full border border-primary-400/15 bg-primary-500/5 px-3 py-1.5 text-[9px] text-base-600 dark:text-paragraph">{row.label}</span>
  </div>;
}

export function ChartTooltip({row,series,percent=false,left}:{row:ChartRow;series:string[];percent?:boolean;left:number}) {
  const {number}=useAdmin();
  return <div role="tooltip" className="pointer-events-none absolute top-0 z-10 min-w-32 -translate-x-1/2 rounded-xl border border-primary-400/25 bg-white/95 p-3 shadow-xl shadow-primary-900/10 backdrop-blur-xl dark:bg-card-400/95" style={{left:`${Math.max(20,Math.min(80,left))}%`}}>
    <p className="mb-2 text-[9px] text-base-500 dark:text-paragraph">{row.label}</p>
    {series.map((name,j)=><div key={name} className="mt-1 flex items-center justify-between gap-5 text-[10px]"><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full" style={{backgroundColor:palette[j%palette.length]}}/>{name}</span><b>{number(row.values[j]??0)}{percent?"%":""}</b></div>)}
    {row.detail&&<p className="mt-2 border-t border-primary-500/10 pt-2 text-[9px] text-base-500 dark:text-paragraph">{row.detail}</p>}
  </div>;
}
