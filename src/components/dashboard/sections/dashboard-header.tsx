"use client";
import { HeaderActions } from "@/components/common/header-actions";
import { Icon } from "@/components/ui/icon";
import { muted } from "../dashboard-styles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "setMenu">;
export function DashboardHeader({ t, setMenu }: Props) {
  return (
    <Card
      borderVariant="frame"
      as="header"
      className={`mb-6 flex min-h-[72px] shrink-0 items-center justify-between gap-3 px-4 md:px-6`}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="unstyled"
          className="cursor-pointer lg:hidden"
          aria-label={t("openMenu")}
          onClick={() => setMenu(true)}
        >
          <Icon name="menu" />
        </Button>
        <span className={`hidden text-xs sm:inline ${muted}`}>
          {t("workspace")}
        </span>
        <span className="hidden text-base-400 sm:inline">/</span>
        <span className="text-xs font-medium">{t("overview")}</span>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <span
          className={`hidden items-center gap-1.5 text-[10px] sm:flex ${muted}`}
        >
          <span className="size-1.5 rounded-full bg-success-500" />
          {t("demo")}
        </span>
        <HeaderActions />
      </div>
    </Card>
  );
}
