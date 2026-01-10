// src/components/ui/scroll-line-reveal.tsx

import { useRef, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface ScrollLineRevealProps {
  text: string;
  className?: string;
  charClassName?: string;
  start?: string;
  end?: string;
  stagger?: number;
}

// Individual character component
interface CharProps {
  char: string;
  index: number;
  totalChars: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  stagger: number;
  className?: string;
}

const Char = ({
  char,
  index,
  totalChars,
  progress,
  stagger,
  className,
}: CharProps) => {
  const charStart = (index / totalChars) * stagger;
  const charEnd = Math.min(1, charStart + 0.3);

  const charOpacity = useTransform(progress, [charStart, charEnd], [0, 1]);
  const charY = useTransform(progress, [charStart, charEnd], [10, 0]);

  return (
    <motion.span
      className={`inline-block ${className || ""}`}
      style={{
        opacity: charOpacity,
        y: charY,
        whiteSpace: char === " " ? "pre" : "normal",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

export const ScrollLineReveal = ({
  text,
  className = "",
  charClassName = "",
  start = "top 80%",
  end = "top 30%",
  stagger = 0.02,
}: ScrollLineRevealProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(prefersReducedMotion ? 1 : 0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const characters = useMemo(() => text.split(""), [text]);

  // Check initial visibility immediately
  useEffect(() => {
    if (!containerRef.current || initialCheckDone) return;

    const checkInitialVisibility = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;

      // Parse start position
      const startMatch = start.match(/top (\d+)%/);
      const startThreshold = startMatch ? parseInt(startMatch[1]) / 100 : 0.8;

      // If element is already above the start threshold, it should be visible
      if (rect.top < viewportHeight * startThreshold) {
        progress.set(1);
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

    if (prefersReducedMotion) {
      progress.set(1);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start,
      end,
      scrub: 0.3,
      onUpdate: (self) => {
        progress.set(self.progress);
      },
      onRefresh: (self) => {
        // On refresh, if already past trigger, set to complete
        if (self.progress >= 1) {
          progress.set(1);
        } else if (self.progress > 0) {
          progress.set(self.progress);
        }
      },
    });

    // Force a refresh to check initial state
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, start, end, progress]);

  return (
    <div ref={containerRef} className={className}>
      {characters.map((char, index) => (
        <Char
          key={`${char}-${index}`}
          char={char}
          index={index}
          totalChars={characters.length}
          progress={progress}
          stagger={stagger}
          className={charClassName}
        />
      ))}
    </div>
  );
};

export default ScrollLineReveal;
