"use client";

import { toast as sonner } from "sonner";
import { createElement } from "react";
import { playToastSound } from "./toast-sound";
import { ToastCard } from "@/components/ui/toast-card";
import type { ToastKind } from "@/components/ui/toast-card/toast-card.types";

type ShowOptions = {
  description?: string;
  duration?: number;
};

function show(kind: ToastKind, message: string, opts?: ShowOptions) {
  playToastSound(kind);
  return sonner.custom(
    (id) =>
      createElement(ToastCard, {
        id,
        kind,
        title: message,
        description: opts?.description,
      }),
    {
      duration: kind === "loading" ? Infinity : (opts?.duration ?? 4000),
    },
  );
}

export const toast = {
  success: (message: string, description?: string) =>
    show("success", message, { description }),

  error: (message: string, description?: string) =>
    show("error", message, { description }),

  info: (message: string, description?: string) =>
    show("info", message, { description }),

  warning: (message: string, description?: string) =>
    show("warning", message, { description }),

  loading: (message: string, description?: string) =>
    show("loading", message, { description }),

  dismiss: (id?: string | number) => sonner.dismiss(id),

  apiError: (_error: unknown, message: string) => show("error", message),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => {
    const loadingId = show("loading", messages.loading);

    promise
      .then(() => {
        sonner.dismiss(loadingId);
        show("success", messages.success);
      })
      .catch(() => {
        sonner.dismiss(loadingId);
        show("error", messages.error);
      });

    return promise;
  },
};

// Keep native Sonner presentation for existing callers, with the same early sound.
export const nativeToast = {
  success: (...args: Parameters<typeof sonner.success>) => {
    playToastSound("success");
    return sonner.success(...args);
  },
  error: (...args: Parameters<typeof sonner.error>) => {
    playToastSound("error");
    return sonner.error(...args);
  },
  warning: (...args: Parameters<typeof sonner.warning>) => {
    playToastSound("warning");
    return sonner.warning(...args);
  },
};
