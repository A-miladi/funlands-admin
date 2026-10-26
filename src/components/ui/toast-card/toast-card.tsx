"use client";

import type { ToastCardProps } from "@/components/ui/toast-card/toast-card.types";
import { ToastCardUi } from "./toast-card.ui";
import { useToastCardModel } from "./use-toast-card-model";
export function ToastCard(props: ToastCardProps) {
  const model = useToastCardModel(props);
  return <ToastCardUi {...model} />;
}
export type { ToastKind } from "@/components/ui/toast-card/toast-card.types";
