"use client";

import { KIND_STYLES } from "@/components/ui/toast-card/toast-card.styles";
import type { ToastCardProps } from "@/components/ui/toast-card/toast-card.types";
export function useToastCardModel({ id, kind, title, description }: ToastCardProps) {
  const styles = KIND_STYLES[kind];
  const Icon = styles.Icon;
  return {
    id,
    title,
    description,
    styles,
    Icon,
  };
}
