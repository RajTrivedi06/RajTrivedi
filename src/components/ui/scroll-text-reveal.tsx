// src/components/ui/scroll-text-reveal.tsx

import { useRef, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface ScrollTextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  start?: string;
  end?: string;
  stagger?: number; // Stagger between words (0-1)
  direction?: "up" | "down" | "left" | "right" | "fade";
}

// Individual word component
interface WordProps {
  word: string;
  index: number;
  totalWords: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  stagger: number;
  direction: "up" | "down" | "left" | "right" | "fade";
  className?: string;
}

const Word = ({
  word,
  index,
  totalWords,
  progress,
  stagger,
  direction,
  className,
}: WordProps) => {
  // Calculate word-specific progress based on stagger
  const wordStart = (index / totalWords) * stagger;
  const wordEnd = wordStart + (1 - stagger);

  const wordProgress = useTransform(
    progress,
    [wordStart, Math.min(1, wordEnd)],
    [0, 1]
  );

  // Get transform values based on direction
  const y = useTransform(
    wordProgress,
    [0, 1],
    [direction === "up" ? 20 : direction === "down" ? -20 : 0, 0]
  );
  const x = useTransform(
    wordProgress,
    [0, 1],
    [direction === "left" ? 20 : direction === "right" ? -20 : 0, 0]
  );
  const opacity = useTransform(wordProgress, [0, 1], [0, 1]);

  return (
    <motion.span
      className={`inline-block mr-[0.25em] ${className || ""}`}
      style={{ y, x, opacity }}
    >
      {word}
    </motion.span>
  );
};

export const ScrollTextReveal = ({
  text,
  className = "",
  wordClassName = "",
  start = "top 85%",
  end = "top 40%",
  stagger = 0.1,
  direction = "up",
}: ScrollTextRevealProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(prefersReducedMotion ? 1 : 0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const words = useMemo(() => text.split(" "), [text]);

  // Check initial visibility immediately
  useEffect(() => {
    if (!containerRef.current || initialCheckDone) return;

    const checkInitialVisibility = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;

      // Parse start position
      const startMatch = start.match(/top (\d+)%/);
      const startThreshold = startMatch ? parseInt(startMatch[1]) / 100 : 0.85;

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
      scrub: 0.5,
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
    <div ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <Word
          key={`${word}-${index}`}
          word={word}
          index={index}
          totalWords={words.length}
          progress={progress}
          stagger={stagger}
          direction={direction}
          className={wordClassName}
        />
      ))}
    </div>
  );
};

export default ScrollTextReveal;
