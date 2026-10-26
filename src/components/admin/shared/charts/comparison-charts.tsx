"use client";
import { useId, useState } from "react";
import { useAdmin } from "../../admin-context";
import { Empty, muted } from "../widgets";
import { finiteValue, palette, type PercentRow } from "./chart-utils";

export function Bars({rows}:{rows:PercentRow[]}) {
  const {number,l}=useAdmin();
  if(!rows.length) return <Empty/>;
  return <div className="space-y-2 py-2">{rows.map((row,j)=><div key={row.label} className="group rounded-xl border border-transparent bg-primary-500/[.025] px-3 py-2 transition hover:border-primary-400/15 hover:bg-primary-500/5"><div className="mb-1.5 flex items-center justify-between gap-3 text-[10px]"><span className={`flex items-center gap-2 ${muted}`}><i className="grid size-5 place-items-center rounded-md border border-primary-400/15 bg-primary-500/5 not-italic text-[8px] text-primary-500">{number(j+1)}</i>{row.label}</span><span>{row.count!==undefined&&<small className={`me-3 ${muted}`}>{l("کاربر", "Users")}: {number(row.count)}</small>}<b>{number(row.value)}%</b></span></div><div role="progressbar" aria-label={row.label} aria-valuenow={Math.min(100,finiteValue(row.value))} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-primary-500/5"><div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500" style={{width:`${Math.min(100,finiteValue(row.value))}%`,background:`linear-gradient(90deg, ${palette[0]}, ${j%2?palette[1]:palette[2]})`}}/></div></div>)}</div>;
}

export function RadarChart({rows}:{rows:PercentRow[]}) {
  const {number,l}=useAdmin(), id=useId(), [active,setActive]=useState(0);
  if(rows.length<3) return <Bars rows={rows}/>;
  const point=(i:number, radius:number)=>{const angle=i*2*Math.PI/rows.length-Math.PI/2;return {x:240+Math.cos(angle)*radius,y:160+Math.sin(angle)*radius};};
  const polygon=(radius:number)=>rows.map((_,i)=>{const p=point(i,radius);return `${p.x},${p.y}`;}).join(" ");
  const values=rows.map((row,i)=>point(i,Math.min(100,finiteValue(row.value))*1.1));
  return <><p className={`mb-2 text-xs ${muted}`}>{rows[Math.min(active,rows.length-1)].label}: <b className="text-primary-500 dark:text-primary-300">{number(rows[Math.min(active,rows.length-1)].value)}%</b></p><div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr]"><svg viewBox="0 0 480 330" role="group" aria-label={l("مقایسه راداری نرخ تکمیل بازی‌ها؛ هر محور از صفر تا صد درصد", "Radar comparison of game completion rates; each axis ranges from zero to 100 percent")} className="mx-auto block max-h-80 w-full">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={palette[0]} stopOpacity=".45"/><stop offset="100%" stopColor={palette[1]} stopOpacity=".12"/></linearGradient></defs>
    {[.25,.5,.75,1].map(scale=><polygon key={scale} points={polygon(110*scale)} fill="none" className="stroke-base-300 dark:stroke-white/10"/>)}
    {rows.map((row,i)=>{const end=point(i,110),label=point(i,138);return <g key={row.label}><line x1="240" y1="160" x2={end.x} y2={end.y} className="stroke-base-300 dark:stroke-white/10"/><text x={label.x} y={label.y} textAnchor="middle" className="fill-base-600 text-[10px] dark:fill-paragraph">{row.label.length>19?row.label.slice(0,18)+"…":row.label}</text></g>;})}
    <text x="245" y="48" className="fill-base-500 text-[9px]">100%</text><text x="245" y="157" className="fill-base-500 text-[9px]">0</text>
    <polygon points={values.map(p=>`${p.x},${p.y}`).join(" ")} fill={`url(#${id})`} stroke={palette[0]} strokeWidth="2"/>
    {values.map((p,i)=><g key={rows[i].label} role="button" tabIndex={0} aria-label={`${rows[i].label}: ${number(rows[i].value)}%`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setActive(i);}}} className="cursor-pointer outline-none"><circle cx={p.x} cy={p.y} r="12" fill="transparent"/><circle cx={p.x} cy={p.y} r={active===i?5:3} fill={palette[1]} className="focus:stroke-white"/></g>)}
  </svg><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{rows.map((row,i)=><button type="button" key={row.label} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-3 text-start text-[10px] transition ${active===i?"border-primary-400/30 bg-primary-500/10":"border-primary-400/5 bg-white/20 dark:bg-white/[.02]"}`}><span className={muted}>{row.label}</span><strong className="text-primary-500 dark:text-primary-300">{number(row.value)}%</strong></button>)}</div></div></>;
}
