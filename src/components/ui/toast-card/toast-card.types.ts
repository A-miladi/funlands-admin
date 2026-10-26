export type ToastCardProps = {
  id: string | number;
  kind: ToastKind;
  title: string;
  description?: string;
};
export type ToastKind = "success" | "error" | "info" | "warning" | "loading";
export type ToastKindStyle = {
  gradient: string;
  baseBg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{ size?: number; className?: string; }>;
  iconClassName?: string;
};
import type { useToastCardModel } from "./use-toast-card-model";
export type ToastCardUiProps = ReturnType<typeof useToastCardModel>;
