// src/hooks/useScrollTo.ts

import { useCallback } from "react";
import { useSmoothScrollActions } from "../providers";

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
  onComplete?: () => void;
}

export const useScrollTo = () => {
  // Narrow subscription: lenis only — Actions context identity is stable
  // across scroll frames, so this hook's consumers don't rerender at 60fps.
  const { lenis } = useSmoothScrollActions();

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options: ScrollToOptions = {}) => {
      if (!lenis) {
        // Fallback to native scroll if Lenis isn't ready
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        } else if (typeof target === "string") {
          const element = document.querySelector(target);
          element?.scrollIntoView({ behavior: "smooth" });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      lenis.scrollTo(target, {
        offset: options.offset ?? 0,
        duration: options.duration,
        immediate: options.immediate ?? false,
        onComplete: options.onComplete,
      });
    },
    [lenis]
  );

  const scrollToTop = useCallback(
    (options: ScrollToOptions = {}) => {
      scrollTo(0, options);
    },
    [scrollTo]
  );

  const scrollToSection = useCallback(
    (sectionId: string, options: ScrollToOptions = {}) => {
      scrollTo(`#${sectionId}`, { offset: -80, ...options }); // -80 for NavDock height
    },
    [scrollTo]
  );

  return { scrollTo, scrollToTop, scrollToSection };
};

export default useScrollTo;
