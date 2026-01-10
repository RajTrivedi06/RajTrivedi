// src/utils/accessibility.ts

import { useEffect, useState } from "react";

// Check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Hook that updates when preference changes
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
};

// Conditional animation values
export const getMotionSafeValue = <T>(
  fullMotion: T,
  reducedMotion: T,
  prefersReduced: boolean
): T => {
  return prefersReduced ? reducedMotion : fullMotion;
};

// Animation duration based on preference
export const getAnimationDuration = (
  normalDuration: number,
  prefersReduced: boolean
): number => {
  return prefersReduced ? 0 : normalDuration;
};

// Skip animation check
export const shouldSkipAnimation = (prefersReduced: boolean): boolean => {
  return prefersReduced;
};
