"use client";
import { useEffect, useRef, useState } from "react";

export function useNavigationProgress(active: boolean) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!active && progressRef.current === 0) return;
    let timer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval> | undefined;
    if (active) {
      timer = setTimeout(() => {
        setVisible(true);
        // Resume a pending navigation instead of restarting after a loading
        // boundary takes over from its originating link.
        progressRef.current = progressRef.current || 8;
        setProgress(progressRef.current);
        interval = setInterval(() => {
          progressRef.current += (95 - progressRef.current) * 0.08;
          setProgress(progressRef.current);
        }, 300);
      }, 0);
    } else {
      // Link pending and the route loading boundary can hand off on separate
      // renders. Only finish after pending has remained clear briefly.
      timer = setTimeout(() => {
        setProgress(100);
        timer = setTimeout(() => {
          setVisible(false);
          setProgress(0);
          progressRef.current = 0;
        }, 250);
      }, 100);
    }
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [active]);

  return { progress, visible };
}
