// src/components/ui/scroll-box-reveal.tsx

import { useRef, useEffect, ReactNode, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface ScrollBoxRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  boxColor?: string;
  delay?: number; // Delay in terms of scroll progress (0-1)
  className?: string;
  start?: string;
  end?: string;
}

export const ScrollBoxReveal = ({
  children,
  width = "fit-content",
  boxColor = "#9B5CFF",
  delay = 0,
  className = "",
  start = "top 85%",
  end = "top 50%",
}: ScrollBoxRevealProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const progress = useMotionValue(prefersReducedMotion ? 1 : 0);

  // Transform progress to animation states
  // Phase 1 (0-0.5): Box slides in from left
  // Phase 2 (0.5-1): Box slides out to right, content fades in
  const boxScaleX = useTransform(progress, [0, 0.5, 0.5, 1], [0, 1, 1, 0]);
  const boxOrigin = useTransform(
    progress,
    [0, 0.49, 0.5, 1],
    ["0% 50%", "0% 50%", "100% 50%", "100% 50%"]
  );
  const contentOpacity = useTransform(progress, [0.4, 0.6], [0, 1]);

  // Check initial visibility immediately
  useEffect(() => {
    if (!containerRef.current || initialCheckDone) return;

    const checkInitialVisibility = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;

      // Parse start position to get the threshold
      const startMatch = start.match(/top (\d+)%/);
      const startThreshold = startMatch ? parseInt(startMatch[1]) / 100 : 0.85;

      // If element top is above the start threshold, it's already passed
      if (
        rect.top < viewportHeight * startThreshold &&
        rect.top < viewportHeight * 0.5
      ) {
        progress.set(1);
        setHasAnimated(true);
        setInitialCheckDone(true);
      }
    };

    // Check immediately
    checkInitialVisibility();

    // Also check after a short delay to account for layout
    const timer = setTimeout(checkInitialVisibility, 100);

    return () => clearTimeout(timer);
  }, [start, progress, initialCheckDone]);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    // For reduced motion, just show content immediately
    if (prefersReducedMotion) {
      progress.set(1);
      setHasAnimated(true);
      return;
    }

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start,
      end,
      scrub: 0.5,
      onUpdate: (self) => {
        // Apply delay offset
        const adjustedProgress = Math.max(
          0,
          Math.min(1, (self.progress - delay) / (1 - delay))
        );
        progress.set(adjustedProgress);

        // Mark as animated when complete
        if (adjustedProgress >= 1) {
          setHasAnimated(true);
        }
      },
      onRefresh: (self) => {
        // On refresh, check if element has already passed the trigger
        if (self.progress >= 1) {
          progress.set(1);
          setHasAnimated(true);
        } else if (self.progress > 0) {
          const adjustedProgress = Math.max(
            0,
            Math.min(1, (self.progress - delay) / (1 - delay))
          );
          progress.set(adjustedProgress);
        }
      },
    });

    // Force a refresh to check initial state
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, start, end, delay, progress]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width }}
    >
      {/* Animated reveal box - hide after animation completes */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundColor: boxColor,
          scaleX: boxScaleX,
          transformOrigin: boxOrigin,
          display: hasAnimated ? "none" : "block",
        }}
      />

      {/* Content */}
      <motion.div
        style={{
          opacity: hasAnimated ? 1 : contentOpacity,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollBoxReveal;
