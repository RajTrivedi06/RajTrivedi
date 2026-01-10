// src/config/performance.ts

// Device detection
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

export const isLowPowerDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;

  // Check for low-end device indicators
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency;

  if (memory && memory < 4) return true;
  if (cores && cores < 4) return true;

  return false;
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Performance tiers
export type PerformanceTier = "high" | "medium" | "low";

export const getPerformanceTier = (): PerformanceTier => {
  if (prefersReducedMotion()) return "low";
  if (isLowPowerDevice()) return "low";
  if (isMobile()) return "medium";
  return "high";
};

// Animation configuration by tier
export interface AnimationConfig {
  enableParallax: boolean;
  enableZAxis: boolean;
  enableHorizontalScroll: boolean;
  enablePinnedSections: boolean;
  enableBackgroundEffects: boolean;
  scrubSmoothness: number;
  parallaxIntensity: number;
  transitionDuration: number;
}

export const getAnimationConfig = (tier?: PerformanceTier): AnimationConfig => {
  const actualTier = tier ?? getPerformanceTier();

  switch (actualTier) {
    case "high":
      return {
        enableParallax: true,
        enableZAxis: true,
        enableHorizontalScroll: true,
        enablePinnedSections: true,
        enableBackgroundEffects: true,
        scrubSmoothness: 1,
        parallaxIntensity: 1,
        transitionDuration: 0.4,
      };
    case "medium":
      return {
        enableParallax: true,
        enableZAxis: true,
        enableHorizontalScroll: true,
        enablePinnedSections: true,
        enableBackgroundEffects: false, // Disable heavy backgrounds
        scrubSmoothness: 0.5,
        parallaxIntensity: 0.5,
        transitionDuration: 0.3,
      };
    case "low":
      return {
        enableParallax: false,
        enableZAxis: false,
        enableHorizontalScroll: false,
        enablePinnedSections: false,
        enableBackgroundEffects: false,
        scrubSmoothness: 0,
        parallaxIntensity: 0,
        transitionDuration: 0,
      };
  }
};
