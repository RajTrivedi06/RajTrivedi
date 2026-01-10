// src/providers/SmoothScrollProvider.tsx

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import Lenis from "lenis";

// Types
interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollProgress: number;
  scrollDirection: "up" | "down" | null;
  isScrolling: boolean;
}

interface SmoothScrollProviderProps {
  children: ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: "vertical" | "horizontal";
    smoothWheel?: boolean;
    syncTouch?: boolean;
    touchMultiplier?: number;
  };
}

// Default easing function (ease-out-expo)
const defaultEasing = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

// Context
const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollProgress: 0,
  scrollDirection: null,
  isScrolling: false,
});

// Hook for consuming the context
export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error(
      "useSmoothScroll must be used within a SmoothScrollProvider"
    );
  }
  return context;
};

// Provider Component
export const SmoothScrollProvider = ({
  children,
  options = {},
}: SmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : options.duration ?? 1.2,
      easing: options.easing ?? defaultEasing,
      orientation: options.orientation ?? "vertical",
      smoothWheel: prefersReducedMotion ? false : options.smoothWheel ?? true,
      syncTouch: options.syncTouch ?? false,
      touchMultiplier: options.touchMultiplier ?? 2,
    });

    lenisRef.current = lenis;

    // Scroll event handler
    const onScroll = ({
      progress,
      direction,
    }: {
      scroll: number;
      limit: number;
      direction: number;
      velocity: number;
      progress: number;
    }) => {
      setScrollProgress(progress);
      setScrollDirection(direction > 0 ? "down" : direction < 0 ? "up" : null);
      setIsScrolling(true);
    };

    lenis.on("scroll", onScroll);

    // Animation frame loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Scroll stop detection
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScrollStop = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    lenis.on("scroll", handleScrollStop);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(scrollTimeout);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    options.duration,
    options.easing,
    options.orientation,
    options.smoothWheel,
    options.syncTouch,
    options.touchMultiplier,
  ]);

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollProgress,
        scrollDirection,
        isScrolling,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
