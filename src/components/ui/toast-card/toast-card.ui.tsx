"use client";

import type { ToastCardUiProps } from "@/components/ui/toast-card/toast-card.types";

import { CloseIcon } from "@/components/icons/close";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { toast as sonner } from "sonner";
export function ToastCardUi({
  id,
  title,
  description,
  styles,
  Icon,
}: ToastCardUiProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "w-full min-w-[300px]",
        "flex items-start gap-3 p-4 rounded-2xl",
        "backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        "border",
        "text-base-900 dark:text-title",
        styles.baseBg,
        styles.border,
      )}
    >
      <div
        className={cn("pointer-events-none absolute inset-0", styles.gradient)}
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative shrink-0 size-9 rounded-full",
          "flex items-center justify-center",
          styles.iconBg,
          styles.iconColor,
        )}
      >
        <Icon size={18} className={styles.iconClassName} />
      </div>

      <div className="relative flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold">{title}</p>
        {description && (
          <p className="text-xs opacity-70 mt-0.5">{description}</p>
        )}
      </div>

      <Button
        variant="unstyled"
        onClick={() => sonner.dismiss(id)}
        className={cn(
          "relative shrink-0 size-6 rounded-full",
          "flex items-center justify-center",
          "bg-black/5 dark:bg-white/10",
          "border border-black/10 dark:border-white/10",
          "opacity-60 hover:opacity-100 transition-opacity",
        )}
        aria-label="Close"
      >
        <CloseIcon size={12} />
      </Button>
    </div>
  );
}
