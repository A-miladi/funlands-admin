import { cn } from "@/lib/utils/cn";
export function Progress({
  value,
  className,
  barClassName,
  opacity,
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  opacity?: number;
  label?: string;
}) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <div
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-valuenow={label ? percent : undefined}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
      className={cn(
        "overflow-hidden rounded-full bg-base-200 dark:bg-white/[.02]",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-primary-500", barClassName)}
        style={{ width: `${percent}%`, opacity }}
      />
    </div>
  );
}
