"use client";
import { useAdmin } from "../admin-context";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { eventTypes, type Filters } from "@/lib/admin/types";
export function FilterBar({
  advanced = false,
  users = false,
  technical = false,
}: {
  advanced?: boolean;
  users?: boolean;
  technical?: boolean;
}) {
  const { data, filters, setFilters, l, locale } = useAdmin();
  if (!data) return null;
  const set = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  function preset(days: number) {
    const to = data!.referenceDate,
      from = new Date(Date.parse(to + "T00:00:00Z") - (days - 1) * 86400000)
        .toISOString()
        .slice(0, 10);
    setFilters((prev) => ({ ...prev, from, to }));
  }
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-base-300 bg-white/30 p-3 dark:border-white/[.06] dark:bg-white/[.015]">
      {[1, 7, 30].map((n) => (
        <Button key={n} variant="outline" onClick={() => preset(n)}>
          {n === 1 ? l("امروز", "Today") : l(`${n} روز`, `${n} days`)}
        </Button>
      ))}
      <DatePicker
        maxDate={filters.to}
        value={filters.from}
        onChange={(value) => set("from", value)}
      />
      <p>to</p>
      <DatePicker
        minDate={filters.from}
        maxDate={data.referenceDate}
        value={filters.to}
        onChange={(value) => set("to", value)}
      />
      {advanced && (
        <>
          <Select
            aria-label={l("بازی", "Game")}
            value={filters.gameId}
            onValueChange={(value) => set("gameId", value)}
            options={[
              { value: "all", label: l("همه بازی‌ها", "All games") },
              ...data.games.map((g) => ({
                value: g.id,
                label: g.title[locale],
              })),
            ]}
          />
          <Select
            aria-label={l("وضعیت بازی", "Game status")}
            value={filters.status}
            onValueChange={(value) => set("status", value)}
            options={[
              { value: "all", label: l("همه وضعیت‌ها", "All statuses") },
              { value: "active", label: l("فعال", "Active") },
              { value: "inactive", label: l("غیرفعال", "Inactive") },
            ]}
          />
        </>
      )}
      {users && (
        <Select
          aria-label={l("شناسه کاربر", "User ID")}
          value={filters.userId}
          onValueChange={(value) => set("userId", value)}
          options={[
            { value: "all", label: l("همه کاربران", "All users") },
            ...data.users.map((u) => ({ value: u.id, label: u.id })),
          ]}
        />
      )}
      {technical && (
        <>
          <Select
            aria-label={l("نوع رویداد", "Event type")}
            value={filters.eventType}
            onValueChange={(value) => set("eventType", value)}
            options={[
              { value: "all", label: l("همه رویدادها", "All events") },
              ...eventTypes.map((type) => ({ value: type, label: type })),
            ]}
          />
          <Select
            aria-label={l("نتیجه اجرا", "Outcome")}
            value={filters.outcome}
            onValueChange={(value) => set("outcome", value)}
            options={[
              { value: "all", label: l("همه نتایج", "All outcomes") },
              { value: "success", label: l("موفق", "Success") },
              { value: "failed", label: l("ناموفق", "Failed") },
            ]}
          />
        </>
      )}
    </div>
  );
}
