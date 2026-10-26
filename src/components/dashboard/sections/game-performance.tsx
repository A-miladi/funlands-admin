"use client";
import { SectionHeading } from "@/components/ui/section-heading";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Sparkline } from "@/components/ui/sparkline";
import { muted } from "../dashboard-styles";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "locale" | "query" | "setQuery" | "number" | "multiplier" | "visibleGames">;
export function GamePerformance({ t, locale, query, setQuery, number, multiplier, visibleGames }: Props) {
    return (<Card as="section" id="performance" className={`mb-5 scroll-mt-5 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <SectionHeading title={t("performance")} description={t("performanceDescription")}/>
            </div>
            <label className={`flex items-center gap-2 rounded-lg border border-base-300 px-3 py-2 dark:border-white/10 ${muted}`}>
              <Icon name="search" className="size-3.5"/>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchGames")} aria-label={t("searchGames")} className="w-36 bg-transparent text-[10px] text-foreground outline-none"/>
            </label>
          </div>
          <div className="overflow-x-auto px-5 pb-3">
            <table className="w-full min-w-[600px] text-start text-[11px]">
              <thead>
                <tr className={`border-y border-base-300 bg-base-100 text-[10px] dark:border-white/[.05] dark:bg-white/[.02] ${muted}`}>
                  {[
            "game",
            "users",
            "runs",
            "starts",
            "completion",
            "trend",
        ].map((k) => (<th key={k} className="px-3 py-3 text-start font-normal">
                      {t(k)}
                    </th>))}
                </tr>
              </thead>
              <tbody>
                {visibleGames.map((g) => (<tr key={g.id} className="border-b border-base-200 last:border-0 dark:border-white/[.04]">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Image src={`/images/mock/${g.image}.webp`} width={38} height={38} alt="" className="size-[38px] rounded-lg object-cover"/>
                        <div>
                          <p className="font-medium">{g.name[locale]}</p>
                          <span className={`mt-1 block font-inter text-[9px] ${muted}`}>
                            {g.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 font-inter">
                      {number(Math.round(g.users * multiplier))}
                    </td>
                    <td className="px-3 font-inter">
                      {number(Math.round(g.runs * multiplier))}
                    </td>
                    <td className="px-3 font-inter">
                      {number(Math.round(g.starts * multiplier))}
                    </td>
                    <td className="px-3">
                      <span className="font-inter text-[10px]">
                        {number(g.completion)}%
                      </span>
                      <Progress value={g.completion} className="mt-1.5 h-1 w-20" barClassName="bg-success-500"/>
                    </td>
                    <td className="px-3">
                      <Sparkline values={g.trend}/>
                    </td>
                  </tr>))}
              </tbody>
            </table>
            {visibleGames.length === 0 && (<p className={`py-10 text-center text-xs ${muted}`}>
                {t("noResults")}
              </p>)}
          </div>
        </Card>);
}
