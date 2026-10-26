"use client";
import { Icon } from "@/components/ui/icon";
import { games } from "../dashboard-data";
import { incidents } from "../dashboard-data";
import { muted } from "../dashboard-styles";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "locale">;
export function RecentIncidents({ t, locale }: Props) {
    return (<Card as="section" id="technical" className={`scroll-mt-5 p-5`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t("recentErrors")}</h2>
              <span className="rounded-md bg-error-500/10 px-2 py-1 text-[9px] text-error-500">
                {t("sampleEvents")}
              </span>
            </div>
            <div className="space-y-1">
              {incidents.map((e) => (<div key={e.id} className="flex items-center gap-3 rounded-lg border-b border-base-200 py-3 last:border-0 dark:border-white/[.04]">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${e.level === "error" ? "bg-error-500/10 text-error-500" : "bg-warning-500/10 text-warning-500"}`}>
                    <Icon name={e.level === "error" ? "reject" : "warning"} className="size-4"/>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px]">
                      {games[e.game].name[locale]}{" "}
                      <span className={`ms-1 font-inter text-[9px] ${muted}`}>
                        / {e.type}
                      </span>
                    </p>
                    <p className={`mt-1 font-inter text-[9px] ${muted}`}>
                      {e.code}
                    </p>
                  </div>
                  <time className={`font-inter text-[10px] ${muted}`}>
                    {e.time}
                  </time>
                </div>))}
            </div>
          </Card>);
}
