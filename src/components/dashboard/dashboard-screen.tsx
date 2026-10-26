"use client";
import { Button } from "@/components/ui/button";
import { useDashboardModel } from "./use-dashboard-model";
import { DashboardSidebar } from "./sections/dashboard-sidebar";
import { DashboardHeader } from "./sections/dashboard-header";
import { DashboardHeading } from "./sections/dashboard-heading";
import { PeriodFilter } from "./sections/period-filter";
import { MetricsGrid } from "./sections/metrics-grid";
import { ActivityChart } from "./sections/activity-chart";
import { LevelCompletion } from "./sections/level-completion";
import { GamePerformance } from "./sections/game-performance";
import { RecentIncidents } from "./sections/recent-incidents";
import { ContentSummary } from "./sections/content-summary";
import { DashboardFooter } from "./sections/dashboard-footer";
export function DashboardScreen() {
  const model = useDashboardModel();
  return (
    <div className="h-dvh overflow-hidden bg-base-100 p-3 text-base-900 md:p-5 dark:bg-background-300 dark:text-title">
      {model.menu && (
        <Button
          variant="unstyled"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label={model.t("closeMenu")}
          onClick={() => model.setMenu(false)}
        />
      )}
      <DashboardSidebar {...model} />

      <main className="flex h-full min-h-0 min-w-0 flex-col lg:ms-[258px]">
        <DashboardHeader {...model} />
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div id="overview">
            <DashboardHeading {...model} />
            <PeriodFilter {...model} />
            <MetricsGrid {...model} />
            <div className="mb-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
              <ActivityChart {...model} />
              <LevelCompletion {...model} />
            </div>
            <GamePerformance {...model} />
            <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
              <RecentIncidents {...model} />
              <ContentSummary {...model} />
            </div>
            <DashboardFooter {...model} />
          </div>
        </div>
      </main>
    </div>
  );
}
