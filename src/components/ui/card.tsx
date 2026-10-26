import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export const cardStyles =
  "rounded-xl bg-gradient-to-br dark:from-card-300 dark:to-card-400 from-white to-info-100";

export type CardProps = ComponentProps<"div"> & {
  as?: "div" | "section" | "article" | "aside" | "header";
  borderVariant?: "frame" | "corner";
};

export function Card({
  as: Tag = "div",
  borderVariant = "corner",
  className,
  children,
  ...props
}: CardProps) {
  const positioned = /(?:^|\s)(?:relative|absolute|fixed|sticky)(?:\s|$)/.test(
    className ?? "",
  );
  return (
    <Tag
      {...props}
      className={cn(!positioned && "relative", cardStyles, className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br p-px [mask:linear-gradient(#fff_0_0)_content-box_exclude,linear-gradient(#fff_0_0)]",
          borderVariant === "frame"
            ? "from-info-500/30 via-transparent to-fuchsia-400/20"
            : "from-info-200 dark:from-transparent via-transparent dark:to-fuchsia-400/15",
        )}
      />
      {children}
    </Tag>
  );
}
