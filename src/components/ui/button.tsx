import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";
export const buttonStyles = {
  primary:
    "inline-flex h-[49px] w-full items-center justify-center gap-3.5 rounded-[10px] bg-primary-500 text-sm font-semibold text-white shadow-[0_5px_20px_#8d2ceb20] hover:bg-primary-600 active:scale-[.99]",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-white px-3 py-2.5 text-[11px] hover:border-primary-400 dark:border-white/[.07] dark:bg-[#120b24]",
  ghost:
    "inline-flex items-center justify-between rounded-lg hover:bg-primary-500/5",
  unstyled: "",
};
export type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof buttonStyles;
  loading?: boolean;
};
export function Button({
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "cursor-pointer transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400 disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transition-none",
        buttonStyles[variant],
        className,
      )}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current motion-reduce:animate-none"
        />
      )}
      {children}
    </button>
  );
}
