"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { games, nav, metrics } from "./dashboard-data";
export function useDashboardModel() {
  const t = useTranslations("Dashboard");
  const locale = useLocale() as "fa" | "en";
  const router = useRouter();
  const [period, setPeriod] = useState("week");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [point, setPoint] = useState(10);
  const [active, setActive] = useState("overview");
  const number = (n: number) => new Intl.NumberFormat(locale).format(n);
  const multiplier = period === "today" ? 0.15 : period === "month" ? 3.8 : 1;
  const visibleGames = games.filter((g) =>
    `${g.name.fa} ${g.name.en} ${g.id}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function exportReport() {
    const rows = [
      ["game_id", "game", "runs", "starts", "users", "completion_percent"],
      ...visibleGames.map((g) => [
        g.id,
        g.name[locale],
        Math.round(g.runs * multiplier),
        Math.round(g.starts * multiplier),
        Math.round(g.users * multiplier),
        g.completion,
      ]),
    ];
    const blob = new Blob(
      ["\ufeff" + rows.map((row) => row.join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `funlands-demo-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return {
    t,
    locale,
    router,
    period,
    setPeriod,
    query,
    setQuery,
    menu,
    setMenu,
    point,
    setPoint,
    active,
    setActive,
    number,
    multiplier,
    visibleGames,
    nav,
    metrics,
    exportReport,
  };
}
export type DashboardModel = ReturnType<typeof useDashboardModel>;
