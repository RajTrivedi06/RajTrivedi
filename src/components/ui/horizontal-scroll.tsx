// src/components/ui/horizontal-scroll.tsx

import { ReactNode, useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  speed?: number; // How many viewport widths to scroll through
  showProgress?: boolean;
  progressColor?: string;
}

export const HorizontalScroll = ({
  children,
  className = "",
  containerClassName = "",
  speed = 1,
  showProgress = true,
  progressColor = "#9B5CFF",
}: HorizontalScrollProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const progress = useMotionValue(0);

  // Measure content width
  useEffect(() => {
    if (!scrollRef.current) return;

    const updateWidth = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        setContentWidth(Math.max(0, scrollWidth - viewportWidth));
      }
    };

    updateWidth();
    
    // Recalculate on resize
    window.addEventListener("resize", updateWidth);
    
    // Also recalculate after a short delay to account for images loading
    const timeout = setTimeout(updateWidth, 500);

    return () => {
      window.removeEventListener("resize", updateWidth);
      clearTimeout(timeout);
    };
  }, [children]);

  // Set up horizontal scroll
  useEffect(() => {
    if (
      !isReady ||
      !containerRef.current ||
      !scrollRef.current ||
      contentWidth === 0
    )
      return;

    if (prefersReducedMotion) {
      // For reduced motion, just show all content without scroll effect
      return;
    }

    // Calculate how much vertical scroll space we need
    const scrollDistance = contentWidth * speed;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, contentWidth, speed, progress]);

  // Transform scroll progress to horizontal movement
  const x = useTransform(progress, [0, 1], [0, -contentWidth]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, mass: 0.5 });

  // Progress bar width
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ height: "100vh" }}
    >
      {/* Progress indicator */}
      {showProgress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
          <motion.div
            className="h-full"
            style={{
              width: progressWidth,
              backgroundColor: progressColor,
            }}
          />
        </div>
      )}

      {/* Horizontal scroll content */}
      <motion.div
        ref={scrollRef}
        className={`flex items-center h-full ${className}`}
        style={{
          x: prefersReducedMotion ? 0 : smoothX,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Individual item for horizontal scroll
interface HorizontalScrollItemProps {
  children: ReactNode;
  className?: string;
  width?: string;
}

export const HorizontalScrollItem = ({
  children,
  className = "",
  width = "80vw",
}: HorizontalScrollItemProps) => {
  return (
    <div
      className={`flex-shrink-0 h-full flex items-center justify-center ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
};

export default HorizontalScroll;

