import { CheckIcon } from "@/components/icons/check";
import { CloseIcon } from "@/components/icons/close";
import { NotificationIcon } from "@/components/icons/notification";
import { ReloadIcon } from "@/components/icons/reload";
import type { ToastKind, ToastKindStyle } from "./toast-card.types";
export const KIND_STYLES: Record<
  ToastKind,
  ToastKindStyle
> = {
  success: {
    gradient: "bg-gradient-to-l via-success-900/20 from-success-900/50",
    baseBg: "bg-[#e1fee0] dark:bg-background-300",
    border: "border-success-700/40",
    iconBg: "bg-success-500/20",
    iconColor: "text-success-700 dark:text-success-400",
    Icon: CheckIcon,
  },
  error: {
    gradient: "bg-gradient-to-l via-error-900/20 from-error-900/40",
    baseBg: "bg-[#ffe9e7] dark:bg-background-300",
    border: "border-error-700/40",
    iconBg: "bg-error-500/20",
    iconColor: "text-error-700 dark:text-error-400",
    Icon: CloseIcon,
  },
  warning: {
    gradient: "bg-gradient-to-l via-warning-900/20 from-warning-900/50",
    baseBg: "bg-[#fff5ec] dark:bg-background-300",
    border: "border-warning-700/40",
    iconBg: "bg-warning-500/20",
    iconColor: "text-warning-700 dark:text-warning-400",
    Icon: NotificationIcon,
  },
  info: {
    gradient:
      "bg-[radial-gradient(circle_at_top_right,#065986_0%,transparent_65%)]",
    baseBg: "bg-[#f0f9ff] dark:bg-background-300",
    border: "border-info-700/40",
    iconBg: "bg-info-500/20",
    iconColor: "text-info-700 dark:text-info-400",
    Icon: NotificationIcon,
  },
  loading: {
    gradient: "bg-gradient-to-l via-primary-900/20 from-primary-900/50",
    baseBg: "bg-[#f0ebfd] dark:bg-background-300",
    border: "border-primary-700/40",
    iconBg: "bg-primary-500/20",
    iconColor: "text-primary-700 dark:text-primary-400",
    Icon: ReloadIcon,
    iconClassName: "animate-spin",
  },
};
