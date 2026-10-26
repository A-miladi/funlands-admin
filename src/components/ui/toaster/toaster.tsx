"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useToaster } from "./use-toaster";

export function Toaster() {
  const { isRTL, position } = useToaster();
  return (
    <SonnerToaster
      dir={isRTL ? "rtl" : "ltr"}
      position={position}
      offset={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
      mobileOffset={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
      toastOptions={{
        unstyled: true,
      }}
    />
  );
}
