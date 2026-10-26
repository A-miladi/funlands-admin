"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Icon } from "@/components/ui/icon";
import {
  persianParts,
  persianToDate,
  persianMonthDays,
  persianMonths,
} from "./persian-calendar";

import { Button } from "@/components/ui/button";
export type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  minYear?: number;
  maxDate?: string;
  minDate?: string;
  className?: string;
};

export function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function validDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  return (
    year >= 100 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function DatePicker({
  value,
  onChange,
  label,
  id,
  name,
  disabled,
  minYear = 1300,
  maxDate,
  minDate,
  className,
}: DatePickerProps) {
  const locale = useLocale();
  const fa = locale === "fa";
  const l = (faText: string, enText: string) => (fa ? faText : enText);
  const num = (n: number) =>
    n.toLocaleString(fa ? "fa-IR" : "en-US", { useGrouping: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const maximum = maxDate && validDate(maxDate) ? maxDate : todayDate;
  const { year: maxYear, month: maxMonth } = persianParts(
    new Date(maximum + "T00:00:00Z"),
  );
  const minimum =
    minDate && validDate(minDate)
      ? minDate
      : persianToDate(minYear, 1, 1).toISOString().slice(0, 10);
  const { year: firstYear } = persianParts(new Date(minimum + "T00:00:00Z"));
  const lowerYear = Math.max(minYear, firstYear);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(maxYear);
  const [month, setMonth] = useState(maxMonth);
  const [selected, setSelected] = useState("");
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [yearPage, setYearPage] = useState(minYear);
  const months = persianMonths;
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  const pageSize = 24;
  const setDateOpen = (next: boolean) => {
    if (next) {
      const date =
        validDate(value) && value <= maximum && value >= minimum
          ? value
          : maximum;
      const { year: nextYear, month: nextMonth } = persianParts(
        new Date(date + "T00:00:00Z"),
      );
      setYear(nextYear);
      setMonth(nextMonth);
      setSelected(validDate(value) ? value : "");
      setYearPage(
        lowerYear + Math.floor((nextYear - lowerYear) / pageSize) * pageSize,
      );
      setView("days");
    }
    setOpen(next);
  };
  const moveMonth = (direction: number) => {
    const next = month - 1 + direction;
    setYear(year + Math.floor(next / 12));
    setMonth((((next % 12) + 12) % 12) + 1);
  };
  const chooseToday = () => {
    const parts = persianParts(new Date(todayDate + "T00:00:00Z"));
    setYear(parts.year);
    setMonth(parts.month);
    setSelected(todayDate);
    setView("days");
  };
  const cellClass =
    "rounded-xl py-3 text-sm font-semibold transition hover:bg-primary-500/10 disabled:cursor-not-allowed disabled:opacity-25";
  const activeClass =
    "bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-500";
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={triggerId} className="text-xs">
          {label}
        </label>
      )}
      <>
        <Button
          variant="outline"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setDateOpen(true)}
          id={triggerId}
          disabled={disabled}
          className={cn(
            "min-h-10 justify-between gap-3 rounded-xl text-xs",
            className,
          )}
        >
          {validDate(value)
            ? new Intl.DateTimeFormat(
                fa ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "UTC",
                },
              ).format(new Date(value + "T00:00:00Z"))
            : l("انتخاب تاریخ", "Select date")}
          <Icon name="calendar" className="size-4 text-primary-400" />
        </Button>
        <dialog
          ref={dialog}
          aria-labelledby={`${triggerId}-title`}
          aria-describedby={`${triggerId}-description`}
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-md overflow-y-auto bg-gradient-to-br p-px from-info-500/50 via-transparent to-fuchsia-400/50 rounded-3xl bg-white p-0 text-base-900 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm dark:bg-card-400 dark:text-title"
        >
          <div
            dir="rtl"
            className="bg-gradient-to-br from-white to-info-100 p-4 dark:from-card-300 dark:to-card-400 rounded-3xl sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 id={`${triggerId}-title`} className="text-sm font-semibold">
                {label}
              </h2>
              <Button
                variant="ghost"
                aria-label={l("بستن تقویم", "Close calendar")}
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center"
              >
                ×
              </Button>
            </div>
            <p id={`${triggerId}-description`} className="sr-only">
              {l(
                "انتخاب تاریخ شمسی. برای تغییر ماه یا سال روی عنوان آن بزنید.",
                "Choose a Persian calendar date. Select the month or year heading to change it.",
              )}
            </p>
            <div className="mb-4 flex items-center justify-between gap-2">
              <Button
                variant="unstyled"
                type="button"
                aria-label={l("ماه قبل", "Previous month")}
                disabled={
                  persianToDate(year, month, 1).toISOString().slice(0, 10) <=
                  minimum
                }
                onClick={() => moveMonth(-1)}
                className="grid size-10 place-items-center text-3xl disabled:opacity-25"
              >
                ‹
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="unstyled"
                  type="button"
                  aria-label={l("انتخاب ماه", "Choose month")}
                  aria-expanded={view === "months"}
                  onClick={() => setView(view === "months" ? "days" : "months")}
                  className="rounded-lg px-2 py-2 text-lg font-bold hover:bg-primary-500/10"
                >
                  {months[month - 1]}
                </Button>
                <Button
                  variant="unstyled"
                  type="button"
                  aria-label={l("انتخاب سال", "Choose year")}
                  aria-expanded={view === "years"}
                  onClick={() => {
                    setView(view === "years" ? "days" : "years");
                    setYearPage(
                      lowerYear +
                        Math.floor((year - lowerYear) / pageSize) * pageSize,
                    );
                  }}
                  className="rounded-lg px-2 py-2 text-lg font-bold hover:bg-primary-500/10"
                >
                  {num(year)}
                </Button>
              </div>
              <Button
                variant="unstyled"
                type="button"
                aria-label={l("ماه بعد", "Next month")}
                disabled={year === maxYear && month >= maxMonth}
                onClick={() => moveMonth(1)}
                className="grid size-10 place-items-center text-3xl disabled:opacity-25"
              >
                ›
              </Button>
            </div>
            <div className="min-h-[288px]">
              {view === "days" && (
                <div className="grid grid-cols-7 text-center">
                  {(fa
                    ? ["ش", "ی", "د", "س", "چ", "پ", "ج"]
                    : ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"]
                  ).map((day) => (
                    <span
                      key={day}
                      className="pb-3 text-xs font-semibold text-neutral-500 dark:text-paragraph"
                    >
                      {day}
                    </span>
                  ))}
                  {Array.from(
                    {
                      length:
                        (persianToDate(year, month, 1).getUTCDay() + 1) % 7,
                    },
                    (_, i) => (
                      <span key={`empty-${i}`} />
                    ),
                  )}
                  {Array.from(
                    { length: persianMonthDays(year, month) },
                    (_, i) => {
                      const date = persianToDate(year, month, i + 1)
                        .toISOString()
                        .slice(0, 10);
                      return (
                        <Button
                          key={date}
                          variant="unstyled"
                          type="button"
                          aria-label={`${num(i + 1)} ${months[month - 1]} ${num(year)}`}
                          aria-pressed={selected === date}
                          disabled={date > maximum || date < minimum}
                          onClick={() => setSelected(date)}
                          className={cn(
                            cellClass,
                            "mx-auto my-1 size-10 p-0",
                            selected === date && activeClass,
                          )}
                        >
                          {num(i + 1)}
                        </Button>
                      );
                    },
                  )}
                </div>
              )}
              {view === "months" && (
                <div className="grid grid-cols-3 gap-2 py-2">
                  {months.map((name, index) => (
                    <Button
                      key={name}
                      variant="unstyled"
                      type="button"
                      aria-pressed={month === index + 1}
                      disabled={
                        (year === maxYear && index + 1 > maxMonth) ||
                        persianToDate(
                          year,
                          index + 1,
                          persianMonthDays(year, index + 1),
                        )
                          .toISOString()
                          .slice(0, 10) < minimum
                      }
                      className={cn(
                        cellClass,
                        "min-h-14",
                        month === index + 1 && activeClass,
                      )}
                      onClick={() => {
                        setMonth(index + 1);
                        setView("days");
                      }}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              )}
              {view === "years" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <Button
                      variant="unstyled"
                      type="button"
                      aria-label={l("سال‌های قبل", "Previous years")}
                      disabled={yearPage <= lowerYear}
                      onClick={() => setYearPage(yearPage - pageSize)}
                      className="size-9 text-2xl disabled:opacity-25"
                    >
                      ‹
                    </Button>
                    <span className="text-sm font-semibold">
                      {num(yearPage)} –{" "}
                      {num(Math.min(yearPage + pageSize - 1, maxYear))}
                    </span>
                    <Button
                      variant="unstyled"
                      type="button"
                      aria-label={l("سال‌های بعد", "Next years")}
                      disabled={yearPage + pageSize > maxYear}
                      onClick={() => setYearPage(yearPage + pageSize)}
                      className="size-9 text-2xl disabled:opacity-25"
                    >
                      ›
                    </Button>
                  </div>
                  <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto overscroll-contain [scrollbar-color:var(--color-primary-500)_transparent]">
                    {Array.from(
                      {
                        length: Math.max(
                          0,
                          Math.min(pageSize, maxYear - yearPage + 1),
                        ),
                      },
                      (_, i) => yearPage + i,
                    ).map((item) => (
                      <Button
                        key={item}
                        variant="unstyled"
                        type="button"
                        aria-pressed={year === item}
                        className={cn(cellClass, year === item && activeClass)}
                        onClick={() => {
                          setYear(item);
                          setMonth((previous) =>
                            Math.min(
                              previous,
                              item === maxYear ? maxMonth : 12,
                            ),
                          );
                          setView("months");
                        }}
                      >
                        {num(item)}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-neutral-200 pt-4 dark:border-white/15">
              <Button
                variant="unstyled"
                type="button"
                onClick={chooseToday}
                disabled={todayDate < minimum || todayDate > maximum}
                className="rounded-xl bg-primary-500/10 px-3 py-3 text-xs font-medium text-primary-600 dark:text-primary-300"
              >
                {l("امروز", "Today")}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="rounded-xl bg-error-500/10 px-3 py-3 text-sm text-error-500"
                >
                  {l("انصراف", "Cancel")}
                </Button>
                <Button
                  variant="unstyled"
                  type="button"
                  disabled={
                    !validDate(selected) ||
                    selected > maximum ||
                    selected < minimum
                  }
                  onClick={() => {
                    onChange(selected);
                    setOpen(false);
                  }}
                  className="rounded-xl bg-primary-500 px-3 py-3 text-sm text-white disabled:opacity-35"
                >
                  {l("تأیید تاریخ", "Confirm date")}
                </Button>
              </div>
            </div>
          </div>
        </dialog>
      </>
      {name && (
        <input
          type="hidden"
          name={name}
          value={validDate(value) ? value : ""}
        />
      )}
    </div>
  );
}
