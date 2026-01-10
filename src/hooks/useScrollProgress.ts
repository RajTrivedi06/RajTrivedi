// src/hooks/useScrollProgress.ts

import { useEffect, useState, RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../providers";

interface UseScrollProgressOptions {
  target?: RefObject<HTMLElement> | string;
  start?: string;
  end?: string;
  onUpdate?: (progress: number) => void;
}

interface ScrollProgressResult {
  progress: number;
  isInView: boolean;
  scrollTrigger: ScrollTrigger | null;
}

export const useScrollProgress = (
  options: UseScrollProgressOptions = {}
): ScrollProgressResult => {
  const {
    target,
    start = "top bottom",
    end = "bottom top",
    onUpdate,
  } = options;
  const { isReady } = useScrollTrigger();
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState<ScrollTrigger | null>(
    null
  );

  useEffect(() => {
    if (!isReady) return;

    // Determine the trigger element
    let triggerElement: HTMLElement | string | undefined;

    if (typeof target === "string") {
      triggerElement = target;
    } else if (target?.current) {
      triggerElement = target.current;
    }

    if (!triggerElement) return;

    // Create ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: triggerElement,
      start,
      end,
      onUpdate: (self) => {
        setProgress(self.progress);
        setIsInView(self.isActive);
        onUpdate?.(self.progress);
      },
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    setScrollTrigger(st);

    return () => {
      st.kill();
    };
  }, [isReady, target, start, end, onUpdate]);

  return { progress, isInView, scrollTrigger };
};

export default useScrollProgress;
