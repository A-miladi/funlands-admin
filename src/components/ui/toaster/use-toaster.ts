"use client";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { prepareToastSounds } from "@/lib/toast-sound";
import type { ToasterPosition } from "./toaster.types";

export function useToaster() {
  useEffect(() => {
    const prepare = () => {
      prepareToastSounds();
      window.removeEventListener("pointerdown", prepare);
      window.removeEventListener("keydown", prepare);
    };
    window.addEventListener("pointerdown", prepare, { passive: true });
    window.addEventListener("keydown", prepare);
    return () => {
      window.removeEventListener("pointerdown", prepare);
      window.removeEventListener("keydown", prepare);
    };
  }, []);

  const locale = useLocale();
  const isRTL = locale === "fa";

  const [position, setPosition] = useState<ToasterPosition>("top-center");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (mq.matches) {
        setPosition(isRTL ? "top-left" : "top-right");
      } else {
        setPosition("top-center");
      }
    };

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, [isRTL]);

  return { isRTL, position };
}
