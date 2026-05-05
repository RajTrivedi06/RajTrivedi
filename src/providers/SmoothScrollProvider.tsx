// src/providers/SmoothScrollProvider.tsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import Lenis from "lenis";

// Actions: stable, changes only when the Lenis instance itself changes
// (mount, or options change → effect recreates Lenis). Most consumers
// (ScrollTriggerProvider, PageTransition, useScrollTo) only need this.
interface SmoothScrollActions {
  lenis: Lenis | null;
}

// Progress: 60fps state. Separate context so Actions consumers don't
// re-render on every scroll frame just because scrollProgress ticked.
interface SmoothScrollProgress {
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

const defaultEasing = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const SmoothScrollActionsContext = createContext<SmoothScrollActions | null>(
  null
);
const SmoothScrollProgressContext = createContext<SmoothScrollProgress | null>(
  null
);

export const useSmoothScrollActions = (): SmoothScrollActions => {
  const ctx = useContext(SmoothScrollActionsContext);
  if (!ctx) {
    throw new Error(
      "useSmoothScrollActions must be used within a SmoothScrollProvider"
    );
  }
  return ctx;
};

export const useSmoothScrollProgress = (): SmoothScrollProgress => {
  const ctx = useContext(SmoothScrollProgressContext);
  if (!ctx) {
    throw new Error(
      "useSmoothScrollProgress must be used within a SmoothScrollProvider"
    );
  }
  return ctx;
};

export const SmoothScrollProvider = ({
  children,
  options = {},
}: SmoothScrollProviderProps) => {
  // Lenis lives in state (not a ref) so the Actions context value can be
  // memoized against it, ref mutation doesn't invalidate useMemo deps.
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenisInstance = new Lenis({
      duration: prefersReducedMotion ? 0 : options.duration ?? 1.2,
      easing: options.easing ?? defaultEasing,
      orientation: options.orientation ?? "vertical",
      smoothWheel: prefersReducedMotion ? false : options.smoothWheel ?? true,
      syncTouch: options.syncTouch ?? false,
      touchMultiplier: options.touchMultiplier ?? 2,
    });

    setLenis(lenisInstance);

    // Belt-and-suspenders against scroll-restoration on reload: if the
    // URL has no section hash, snap Lenis (and the underlying scroll
    // position) to 0 immediately. main.tsx already calls window.scrollTo
    // and strips the hash on reload, but Lenis can still latch onto a
    // stale scrollY between those calls and its own mount, and a later
    // ScrollTrigger.refresh() can re-anchor to that. Skipping when a
    // hash is present preserves deep-link behavior — those land in
    // ScrollNavigationProvider's mount effect, which scrolls to the
    // matching section.
    if (!window.location.hash) {
      lenisInstance.scrollTo(0, { immediate: true });
    }

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

    lenisInstance.on("scroll", onScroll);

    let rafId: number;
    const raf = (time: number) => {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScrollStop = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    lenisInstance.on("scroll", handleScrollStop);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(scrollTimeout);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, [
    options.duration,
    options.easing,
    options.orientation,
    options.smoothWheel,
    options.syncTouch,
    options.touchMultiplier,
  ]);

  // Actions value changes identity only when lenis is (re)created.
  // Consumers of useSmoothScrollActions do NOT re-render on scroll frames.
  const actionsValue = useMemo<SmoothScrollActions>(
    () => ({ lenis }),
    [lenis]
  );

  // Progress value is a new object every frame by design, its consumers
  // opt in to 60fps updates.
  const progressValue = useMemo<SmoothScrollProgress>(
    () => ({ scrollProgress, scrollDirection, isScrolling }),
    [scrollProgress, scrollDirection, isScrolling]
  );

  return (
    <SmoothScrollActionsContext.Provider value={actionsValue}>
      <SmoothScrollProgressContext.Provider value={progressValue}>
        {children}
      </SmoothScrollProgressContext.Provider>
    </SmoothScrollActionsContext.Provider>
  );
};

export default SmoothScrollProvider;
