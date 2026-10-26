"use client";
import { SectionHeading } from "@/components/ui/section-heading";
import { Progress } from "@/components/ui/progress";
import { muted } from "../dashboard-styles";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "number">;
export function LevelCompletion({ t, number }: Props) {
  return (
    <Card as="section" className={`p-5`}>
      <SectionHeading
        title={t("levelsTitle")}
        description={t("levelsDescription")}
      />
      <div className="mt-7 space-y-[18px]">
        {[92, 81, 73, 62, 48, 35].map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`w-12 text-[10px] ${muted}`}>
              {t("level", { n: number(i + 1) })}
            </span>
            <Progress
              value={v}
              opacity={1 - i * 0.1}
              className="h-1.5 flex-1"
              label={t("level", { n: number(i + 1) })}
            />
            <span className="w-7 font-inter text-[10px] text-primary-400">
              {number(v)}%
            </span>
          </div>
        ))}
      </div>
      <p
        className={`mt-6 border-t border-base-300 pt-3 text-[9px] leading-5 dark:border-white/[.06] ${muted}`}
      >
        {t("denominator")}
      </p>
    </Card>
  );
}
