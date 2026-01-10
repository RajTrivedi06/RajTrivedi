// src/config/touch.ts

export interface TouchConfig {
  // Lenis touch settings
  syncTouch: boolean;
  touchMultiplier: number;
  touchInertiaMultiplier: number;

  // Gesture thresholds
  swipeThreshold: number;
  tapThreshold: number;

  // Animation adjustments
  reducedParallax: boolean;
  simplifiedPerspective: boolean;
  disableHorizontalScroll: boolean;
}

export const getMobileTouchConfig = (): TouchConfig => {
  const isIOSDevice = isIOS();

  return {
    // iOS needs special handling
    syncTouch: !isIOSDevice, // Lenis syncTouch can conflict with iOS momentum
    touchMultiplier: isIOSDevice ? 1.5 : 2,
    touchInertiaMultiplier: isIOSDevice ? 0.8 : 1,

    // Gesture thresholds
    swipeThreshold: 50,
    tapThreshold: 10,

    // Animation adjustments for mobile
    reducedParallax: true,
    simplifiedPerspective: true,
    disableHorizontalScroll: false, // Keep but optimize
  };
};

// Detect touch device
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  const msMaxTouchPoints = (
    navigator as Navigator & { msMaxTouchPoints?: number }
  ).msMaxTouchPoints;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (msMaxTouchPoints ?? 0) > 0
  );
};

// Detect iOS specifically (needs special handling)
export const isIOS = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as Window & { MSStream?: unknown }).MSStream
  );
};
