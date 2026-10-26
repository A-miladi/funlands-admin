"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useAdmin } from "../admin-context";
export const fieldClass =
  "h-11 w-full rounded-lg border border-base-300 bg-white/60 px-3 text-xs text-base-900 focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:border-white/10 dark:bg-background-200 dark:text-title";
export const muted = "text-base-600 dark:text-paragraph";
export function Panel({
  children,
  className = "",
  title,
  description,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card as="section" className={`min-w-0 p-5 ${className}`}>
      {title && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description && (
              <p className={`mt-2 text-xs leading-6 ${muted}`}>{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}
export function Heading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-orbitron text-2xl font-bold leading-relaxed">
          {title}
        </h1>
        {description && (
          <p className={`mt-2 text-xs leading-6 ${muted}`}>{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "success" | "error" | "warning" | "neutral";
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-[10px] ${tone === "success" ? "bg-success-500/10 text-success-700 dark:text-success-400" : tone === "error" ? "bg-error-500/10 text-error-600 dark:text-error-400" : tone === "warning" ? "bg-warning-500/10 text-warning-700 dark:text-warning-400" : "bg-primary-500/10 text-primary-700 dark:text-primary-200"}`}
    >
      {children}
    </span>
  );
}
export function Status({ active }: { active: boolean }) {
  const { l } = useAdmin();
  return (
    <Badge tone={active ? "success" : "neutral"}>
      {active ? l("فعال", "Active") : l("غیرفعال", "Inactive")}
    </Badge>
  );
}
export function Stats({
  items,
}: {
  items: {
    label: string;
    value: ReactNode;
    icon?: string;
  }[];
}) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
      {items.map((item, i) => (
        <Card key={item.label} className="p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className={`text-[11px] ${muted}`}>{item.label}</span>
            <span
              className={`grid size-8 place-items-center rounded-lg ${i % 3 === 0 ? "bg-primary-500/10 text-primary-400" : i % 3 === 1 ? "bg-info-500/10 text-info-500" : "bg-success-500/10 text-success-500"}`}
            >
              <Icon name={item.icon ?? "chart"} />
            </span>
          </div>
          <strong className="block break-words font-inter text-xl font-semibold">
            {item.value}
          </strong>
        </Card>
      ))}
    </div>
  );
}
export function Empty({ text }: { text?: string }) {
  const { l } = useAdmin();
  return (
    <div className={`py-14 text-center text-sm ${muted}`}>
      {text ?? l("موردی برای نمایش وجود ندارد.", "No records to display.")}
    </div>
  );
}
export function Search({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (s: string) => void;
  label: string;
}) {
  return (
    <label className="flex min-w-40 items-center gap-2 rounded-lg border border-base-300 bg-white/40 px-3 dark:border-white/10 dark:bg-background-200">
      <Icon name="search" className={muted} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder={label}
        className="h-11 w-full text-xs"
      />
    </label>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <span id={id} className="text-xs font-medium">
        {label}
      </span>
      <div className="[&_input:not([type=checkbox])]:w-full [&_textarea]:w-full">
        {children}
      </div>
    </div>
  );
}
export function Table({
  columns,
  rows,
  pageSize = 10,
}: {
  columns: string[];
  rows: {
    id: string;
    cells: ReactNode[];
  }[];
  pageSize?: number;
}) {
  const { l, number } = useAdmin();
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize)),
    current = Math.min(page, pages);
  const signature = rows.map((r) => r.id).join("|");
  const [lastSignature, setLastSignature] = useState(signature);
  if (signature !== lastSignature) {
    setLastSignature(signature);
    setPage(1);
  }
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] text-start text-xs">
          <thead className="border-y border-base-300 bg-primary-500/5 dark:border-white/10">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`px-3 py-3 text-start text-[10px] font-medium ${muted}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows
              .slice((current - 1) * pageSize, current * pageSize)
              .map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-base-200 hover:bg-primary-500/[.025] dark:border-white/[.05]"
                >
                  {row.cells.map((cell, i) => (
                    <td key={i} className="px-3 py-3 align-middle leading-6">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <Empty />}
      <div
        className={`mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] ${muted}`}
      >
        <span>
          {l("تعداد رکورد:", "Records:")} {number(rows.length)}
        </span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            {l("قبلی", "Previous")}
          </Button>
          <span>
            {number(current)} / {number(pages)}
          </span>
          <Button
            variant="outline"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
          >
            {l("بعدی", "Next")}
          </Button>
        </div>
      </div>
    </>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
      className="m-auto max-h-[85dvh] w-[min(620px,calc(100%-32px))] overflow-y-auto rounded-2xl border border-primary-400/20 bg-base-100 p-6 text-base-900 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm dark:bg-background-200 dark:text-title"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={id} className="text-base font-semibold">
          {title}
        </h2>
        <Button
          variant="ghost"
          aria-label="Close / بستن"
          onClick={onClose}
          className="size-8"
        >
          <Icon name="close" />
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function FormActions({
  busy,
  onCancel,
}: {
  busy: boolean;
  onCancel?: () => void;
}) {
  const { l } = useAdmin();
  return (
    <div className="mt-6 flex items-center gap-3">
      <Button type="submit" loading={busy} className="max-w-48">
        {l("ذخیره تغییرات", "Save changes")}
      </Button>
      {onCancel && (
        <Button variant="outline" onClick={onCancel}>
          {l("انصراف", "Cancel")}
        </Button>
      )}
    </div>
  );
}
export function ErrorNote({ error }: { error: string }) {
  const { l } = useAdmin();
  return error ? (
    <p
      role="alert"
      className="mt-3 rounded-lg bg-error-500/10 p-3 text-xs leading-6 text-error-600 dark:text-error-300"
    >
      {l(
        "عملیات انجام نشد. ورودی‌ها و دسترسی خود را بررسی کنید.",
        "The operation failed. Check the inputs and your permissions.",
      )}{" "}
      <span className="font-inter">({error})</span>
    </p>
  ) : null;
}
export function Info({ children }: { children: ReactNode }) {
  return (
    <p
      className={`mb-5 rounded-xl border border-info-500/15 bg-info-500/5 p-4 text-xs leading-7 ${muted}`}
    >
      {children}
    </p>
  );
}
