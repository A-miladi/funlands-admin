"use client";
import { SectionHeading } from "@/components/ui/section-heading";
import { activity } from "../dashboard-data";
import { muted } from "../dashboard-styles";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<
  DashboardModel,
  "t" | "point" | "setPoint" | "number" | "multiplier"
>;
export function ActivityChart({
  t,
  point,
  setPoint,
  number,
  multiplier,
}: Props) {
  return (
    <Card as="section" className={`min-w-0 p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <SectionHeading
            title={t("activityTitle")}
            description={t("activityDescription")}
          />
        </div>
        <div className="flex gap-4 font-inter text-[10px]">
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-primary-400" />
            Run
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-info-400" />
            Start
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <strong className="font-inter text-xl font-semibold">
          {number(Math.round(activity[point] * 42 * multiplier))}
        </strong>
        <span className={`text-[10px] ${muted}`}>
          {t("chartRun", { point: number(point + 1) })}
        </span>
      </div>
      <div className="relative mt-3" dir="ltr">
        <svg
          viewBox="0 0 700 235"
          className="w-full overflow-visible"
          role="img"
          aria-label={t("activityTitle")}
        >
          <defs>
            <linearGradient id="run-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8d2ceb" stopOpacity=".22" />
              <stop offset="100%" stopColor="#8d2ceb" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 70, 115, 160, 205].map((y, i) => (
            <g key={y}>
              <line
                x1="40"
                x2="685"
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-base-300 dark:text-white/[.05]"
                strokeDasharray="4 5"
              />
              <text
                x="0"
                y={y + 4}
                fill="currentColor"
                className="font-inter text-[10px] text-base-500"
              >
                {number((4 - i) * 1000)}
              </text>
            </g>
          ))}
          <path
            d={`M40 205 ${activity.map((v, i) => `L${40 + i * 49.3} ${205 - v * 1.65}`).join(" ")} L681 205 Z`}
            fill="url(#run-fill)"
          />
          <polyline
            points={activity
              .map((v, i) => `${40 + i * 49.3},${205 - v * 1.65}`)
              .join(" ")}
            fill="none"
            stroke="#9c59f2"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polyline
            points={activity
              .map((v, i) => `${40 + i * 49.3},${205 - v * 1.18}`)
              .join(" ")}
            fill="none"
            stroke="#36bffa"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line
            x1={40 + point * 49.3}
            x2={40 + point * 49.3}
            y1="15"
            y2="205"
            stroke="#9c59f2"
            strokeOpacity=".35"
            strokeDasharray="4 4"
          />
          {activity.map((v, i) => (
            <circle
              key={i}
              cx={40 + i * 49.3}
              cy={205 - v * 1.65}
              r={i === point ? 6 : 3}
              fill={i === point ? "#ceb9f9" : "#9c59f2"}
              className="cursor-pointer outline-none focus:stroke-white focus:stroke-2"
              tabIndex={0}
              role="button"
              aria-label={t("chartRun", { point: number(i + 1) })}
              onFocus={() => setPoint(i)}
              onMouseEnter={() => setPoint(i)}
              onClick={() => setPoint(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPoint(i);
                }
              }}
            />
          ))}
          {[0, 3, 6, 9, 13].map((i) => (
            <text
              key={i}
              x={40 + i * 49.3}
              y="231"
              textAnchor="middle"
              fill="currentColor"
              className="text-[10px] text-base-500"
            >
              {number(i + 1)}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
}
