"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  aggregate,
  filterEvents,
  progress,
  timeline,
} from "@/lib/admin/analytics";
import { exportCSV, exportExcel, type ExportCell } from "@/lib/admin/export";
import { useAdmin } from "../admin-context";
import { FilterBar } from "../shared/filter-bar";
import { Heading, Stats, Panel, Table, Info, muted } from "../shared/widgets";
import { TrendChart, RingChart } from "../shared/charts";
type SavedReport = {
  id: string;
  kind: string;
  from: string;
  to: string;
  created: string;
  rows: ExportCell[][];
};
export function ReportsPage() {
  const { data, filters, l, locale, number, date, can } = useAdmin(),
    [kind, setKind] = useState("games"),
    [saved, setSaved] = useState<SavedReport[]>([]),
    [generated, setGenerated] = useState(false);
  if (!data) return null;
  const options = [
    {
      value: "games",
      label: l("عملکرد بازی‌ها", "Game performance"),
      allowed: can("games:read"),
    },
    {
      value: "users",
      label: l("گزارش کاربران", "Users"),
      allowed: can("users:read"),
    },
    {
      value: "individual",
      label: l("کاربر–بازی", "User–game progress"),
      allowed: can("users:read"),
    },
    {
      value: "errors",
      label: l("رویدادها و خطاها", "Events & incidents"),
      allowed: can("errors:read"),
    },
    {
      value: "content",
      label: l("توزیع محتوا", "Content distribution"),
      allowed: can("content:read"),
    },
  ].filter((o) => o.allowed);
  const selected = options.some((o) => o.value === kind)
    ? kind
    : (options[0]?.value ?? "content");
  const events = filterEvents(data, filters),
    a = aggregate(events),
    series = timeline(events, filters.from, filters.to);
  let rows: ExportCell[][] = [];
  if (selected === "games")
    rows = [
      [
        "game_id",
        "title",
        "runs",
        "starts",
        "unique_users",
        "full_completions",
        "completion_rate_percent",
        "total_seconds",
        "average_seconds",
        "failures",
        "crashes",
      ],
      ...data.games
        .filter((g) => filters.gameId === "all" || g.id === filters.gameId)
        .map((g) => {
          const a = aggregate(events.filter((e) => e.gameId === g.id));
          return [
            g.id,
            g.title[locale],
            a.runs,
            a.starts,
            a.users,
            a.completions,
            a.completion,
            a.totalSeconds,
            a.averageSeconds,
            a.failures,
            a.crashes,
          ];
        }),
    ];
  else if (selected === "users")
    rows = [
      [
        "user_id",
        "joined_at",
        "assigned_games",
        "unique_games_played",
        "runs",
        "starts",
        "full_completions",
        "total_seconds",
        "active",
      ],
      ...data.users
        .filter((u) => filters.userId === "all" || u.id === filters.userId)
        .map((u) => {
          const es = events.filter((e) => e.userId === u.id),
            a = aggregate(es);
          return [
            u.id,
            u.joinedAt,
            u.assignedGames.length,
            new Set(
              es
                .filter((e) => e.type === "start" && e.success)
                .map((e) => e.gameId),
            ).size,
            a.runs,
            a.starts,
            a.completions,
            a.totalSeconds,
            u.active,
          ];
        }),
    ];
  else if (selected === "individual")
    rows = [
      [
        "user_id",
        "game_id",
        "run",
        "start",
        "completed_levels",
        "highest_level",
        "progress_percent",
        "completed",
        "total_seconds",
      ],
      ...data.users
        .filter((u) => filters.userId === "all" || u.id === filters.userId)
        .flatMap((u) =>
          data.games
            .filter(
              (g) =>
                u.assignedGames.includes(g.id) &&
                (filters.gameId === "all" || g.id === filters.gameId),
            )
            .map((g) => {
              const es = events.filter(
                  (e) => e.userId === u.id && e.gameId === g.id,
                ),
                a = aggregate(es),
                p = progress(es, g.levels);
              return [
                u.id,
                g.id,
                a.runs,
                a.starts,
                p.done.join("|"),
                p.highest,
                p.percent,
                p.complete,
                a.totalSeconds,
              ];
            }),
        ),
    ];
  else if (selected === "errors")
    rows = [
      [
        "event_id",
        "game_id",
        "user_id",
        "session_id",
        "type",
        "success",
        "code",
        "version",
        "timestamp",
        "resolution",
      ],
      ...events.map((e) => [
        e.id,
        e.gameId,
        e.userId,
        e.sessionId,
        e.type,
        e.success,
        e.code ?? "",
        e.version,
        e.timestamp,
        e.resolution,
      ]),
    ];
  else
    rows = [
      [
        "content_id",
        "title",
        "type",
        "category",
        "active",
        "size_bytes",
        "created_at",
      ],
      ...data.contents
        .filter(
          (c) =>
            c.createdAt.slice(0, 10) >= filters.from &&
            c.createdAt.slice(0, 10) <= filters.to,
        )
        .map((c) => [
          c.id,
          c.title,
          c.type,
          c.category,
          c.active,
          c.fileSize,
          c.createdAt,
        ]),
    ];
  const metadata: ExportCell[][] = [
    ["skin", data.currentAdmin.skinId],
    ["from", filters.from],
    ["to", filters.to],
    ["game", filters.gameId],
    ["user", filters.userId],
    [],
    ...rows,
  ];
  return (
    <>
      <Heading
        title={l("گزارش‌ها و خروجی", "Reports & export")}
        description={l(
          "گزارش تفکیکی و تجمیعی در محدودهٔ همین پوسته",
          "Individual and aggregate reports within this skin",
        )}
      />
      <FilterBar advanced users technical />
      <Info>
        {l(
          "گزارش فقط منابع مجاز شما را شامل می‌شود. نرخ تکمیل کامل = کاربران یکتای تکمیل‌کننده از میان شروع‌کنندگان همان بازی در بازه. زمان فقط از نشست دارای Start و Exit یا Crash معتبر محاسبه می‌شود.",
          "Reports contain only your permitted resources. Full completion uses unique completers among starters of each game in the period. Duration uses sessions with a valid Start and Exit or Crash.",
        )}
      </Info>
      <div className="mb-5 flex flex-wrap gap-3">
        <Select
          aria-label={l("نوع گزارش", "Report type")}
          value={selected}
          onValueChange={(value) => {
            setKind(value);
            setGenerated(false);
          }}
          options={options}
        />
        <Button
          variant="outline"
          onClick={() => {
            setSaved((prev) => [
              {
                id: crypto.randomUUID(),
                kind: selected,
                from: filters.from,
                to: filters.to,
                created: new Date().toISOString(),
                rows: metadata,
              },
              ...prev,
            ]);
            setGenerated(true);
          }}
        >
          {l("ایجاد گزارش", "Generate report")}
        </Button>
        <Button
          variant="outline"
          onClick={() => exportCSV(metadata, `funlands-${selected}`)}
        >
          CSV ↓
        </Button>
        <Button
          variant="outline"
          onClick={() => exportExcel(metadata, `funlands-${selected}`)}
        >
          Excel
        </Button>
      </div>
      {generated && (
        <Info>
          {l(
            "گزارش در فهرست پایین ایجاد شد؛ نسخهٔ آن مطابق فیلترهای لحظهٔ ایجاد ذخیره شده است.",
            "The report was added below with a snapshot of the filters and rows at generation time.",
          )}
        </Info>
      )}
      <Stats
        items={[
          { label: l("کاربر یکتا", "Unique users"), value: number(a.users) },
          { label: "Start", value: number(a.starts) },
          { label: "Run", value: number(a.runs) },
          {
            label: l("تکمیل کامل", "Full completions"),
            value: number(a.completions),
          },
          { label: l("خطا", "Errors"), value: number(a.failures) },
          {
            label: l("ردیف گزارش", "Report rows"),
            value: number(rows.length - 1),
          },
        ]}
      />
      <div className="mb-5 grid gap-5 xl:grid-cols-2">
        <Panel title={l("روند کاربران یکتا", "Unique users over time")}>
          <TrendChart
            rows={series.map((s) => ({ label: s.date, values: [s.users] }))}
            series={[l("کاربران یکتا", "Unique users")]}
          />
        </Panel>
        <Panel title={l("توزیع محتوا", "Content distribution")}>
          <RingChart
            rows={[
              {type: "book", label: l("کتاب", "Books")},
              {type: "video", label: l("ویدئو", "Videos")},
              {type: "audio", label: l("صوت", "Audio")},
              {type: "drawing", label: l("نقاشی", "Drawings")},
              {type: "animation", label: l("انیمیشن", "Animations")},
            ].map(({type, label}) => ({label, value: data.contents.filter(content => content.type === type).length}))}
          />
        </Panel>
      </div>
      <Panel title={l("پیش‌نمایش گزارش", "Report preview")} className="mb-5">
        <Table
          columns={rows[0]?.map(String) ?? []}
          rows={rows.slice(1).map((cells, i) => ({
            id: String(i),
            cells: cells.map((value) => String(value)),
          }))}
        />
      </Panel>
      <Panel
        title={l(
          "گزارش‌های ایجادشده در این نشست",
          "Reports generated in this session",
        )}
      >
        <Table
          columns={[
            l("نوع", "Type"),
            l("پوسته", "Skin"),
            l("بازه", "Period"),
            l("زمان ایجاد", "Generated"),
            l("دریافت", "Download"),
          ]}
          rows={saved.map((report) => ({
            id: report.id,
            cells: [
              report.kind,
              data.currentAdmin.skinId,
              `${report.from} — ${report.to}`,
              date(report.created),
              <div key="actions" className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => exportCSV(report.rows, report.kind)}
                >
                  CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportExcel(report.rows, report.kind)}
                >
                  Excel
                </Button>
              </div>,
            ],
          }))}
        />
        <p className={`mt-3 text-[10px] ${muted}`}>
          {l(
            "فهرست گزارش‌ها در این نشست نمایشی نگه داشته می‌شود.",
            "Report history is kept for this demo page session.",
          )}
        </p>
      </Panel>
    </>
  );
}
