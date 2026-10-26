"use client";
import { useId, useState } from "react";
import { useAdmin } from "../../admin-context";
import { Empty } from "../widgets";
import { finiteValue, palette } from "./chart-utils";

export function RingChart({rows, center, caption}: {rows: {label:string;value:number}[];center?:string;caption?:string}) {
  const {number,l}=useAdmin(), id=useId(), [selected,setSelected]=useState<number|null>(null);
  const total=rows.reduce((sum,row)=>sum+finiteValue(row.value),0), circumference=2*Math.PI*72;
  if(!rows.length) return <Empty/>;
  const active=selected!==null ? rows[selected] : undefined;
  return <div className="flex flex-col items-center gap-5 py-3">
    <div className="relative size-52 shrink-0">
      <div aria-hidden="true" className="absolute inset-9 rounded-full bg-primary-500/10 blur-2xl"/>
      <svg viewBox="0 0 200 200" role="img" aria-label={rows.map(row=>`${row.label}: ${number(row.value)}`).join(", ")} className="relative size-full -rotate-90">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={palette[0]}/><stop offset="100%" stopColor={palette[2]}/></linearGradient></defs>
        {Array.from({length:48},(_,i)=>{const a=i*Math.PI/24;return <line key={i} x1={100+Math.cos(a)*94} y1={100+Math.sin(a)*94} x2={100+Math.cos(a)*97} y2={100+Math.sin(a)*97} className="stroke-primary-400/25" strokeWidth="1"/>;})}
        <circle cx="100" cy="100" r="58" fill="none" className="stroke-primary-400/10" strokeDasharray="1 5"/>
        <circle cx="100" cy="100" r="72" fill="none" strokeWidth="15" className="stroke-primary-500/10"/>
        {rows.map((row,j)=>{const length=total?finiteValue(row.value)/total*circumference:0,start=total?rows.slice(0,j).reduce((sum,item)=>sum+finiteValue(item.value),0)/total*circumference:0;if(!length)return null;return <circle key={row.label} cx="100" cy="100" r="72" fill="none" strokeWidth={selected===j?19:15} opacity={active&&selected!==j?.25:1} stroke={j===0?`url(#${id})`:palette[j%palette.length]} strokeDasharray={`${Math.max(0,length-(rows.length>1?5:0))} ${circumference}`} strokeDashoffset={-start} strokeLinecap="round" className="motion-safe:transition-[stroke-width,opacity] motion-safe:duration-200"/>;})}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"><span className="mb-2 h-1 w-5 rounded-full bg-primary-500/60"/><strong className="font-inter text-3xl font-semibold tracking-tight">{active?`${number(total?active.value/total*100:0)}%`:center??number(total)}</strong><span className="mt-2 max-w-28 text-[10px] text-base-600 dark:text-paragraph">{active?.label??caption??l("مجموع", "Total")}</span></div>
    </div>
    <div className="w-full space-y-2" onMouseLeave={()=>setSelected(null)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setSelected(null);}}>{rows.map((row,j)=><button type="button" key={row.label} onMouseEnter={()=>setSelected(j)} onFocus={()=>setSelected(j)} onClick={()=>setSelected(j)} aria-pressed={selected===j} className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-primary-400/10 bg-white/30 px-3 py-2.5 text-start text-[10px] transition hover:border-primary-400/30 hover:bg-primary-500/5 focus-visible:outline-2 focus-visible:outline-primary-400 dark:bg-white/[.025]">
      <i className="size-2 shrink-0 rounded-full ring-4 ring-primary-500/5" style={{backgroundColor:palette[j%palette.length]}}/><span className="text-base-600 dark:text-paragraph">{row.label}</span><b className="ms-auto font-inter text-sm">{number(row.value)}</b><span className="min-w-10 rounded-md bg-primary-500/5 px-1.5 py-1 text-center text-[9px] text-primary-600 dark:text-primary-300">{number(total?row.value/total*100:0)}%</span>
    </button>)}</div>
  </div>;
}
export function CompletionChart({completed,total}:{completed:number;total:number}) {
 const {number,l}=useAdmin(), count=Math.min(Math.max(0,completed),Math.max(0,total));
 return <RingChart center={`${number(total?count/total*100:0)}%`} caption={l("نرخ تکمیل", "Completion rate")} rows={[{label:l("تکمیل‌شده", "Completed"),value:count},{label:l("سایر شروع‌کنندگان", "Other starters"),value:Math.max(0,total-count)}]}/>;
}
