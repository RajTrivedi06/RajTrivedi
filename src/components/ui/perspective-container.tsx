// src/components/ui/perspective-container.tsx

import { ReactNode, useRef, useEffect, CSSProperties, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface PerspectiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  perspective?: number; // Perspective distance in px
}

export const PerspectiveContainer = ({
  children,
  className = "",
  style = {},
  perspective = 1000,
}: PerspectiveContainerProps) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        perspective: `${perspective}px`,
        perspectiveOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

// Individual element that moves on Z-axis
interface ZAxisElementProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  zStart?: number; // Starting Z position (negative = further away)
  zEnd?: number; // Ending Z position
  rotateXStart?: number;
  rotateXEnd?: number;
  rotateYStart?: number;
  rotateYEnd?: number;
  scaleStart?: number;
  scaleEnd?: number;
  opacityStart?: number;
  opacityEnd?: number;
  start?: string;
  end?: string;
}

export const ZAxisElement = ({
  children,
  className = "",
  style = {},
  zStart = -500,
  zEnd = 0,
  rotateXStart = 0,
  rotateXEnd = 0,
  rotateYStart = 0,
  rotateYEnd = 0,
  scaleStart,
  scaleEnd,
  opacityStart = 0,
  opacityEnd = 1,
  start = "top 90%",
  end = "top 30%",
}: ZAxisElementProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const progress = useMotionValue(prefersReducedMotion ? 1 : 0);

  // Check initial visibility immediately
  useEffect(() => {
    if (!ref.current || initialCheckDone) return;

    const checkInitialVisibility = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;

      // Parse end position to get the threshold
      const endMatch = end.match(/top (\d+)%/);
      const endThreshold = endMatch ? parseInt(endMatch[1]) / 100 : 0.3;

      // If element top is above the end threshold position, animation should be complete
      if (rect.top < viewportHeight * endThreshold) {
        progress.set(1);
        setIsComplete(true);
        setInitialCheckDone(true);
      }
    };

    // Check immediately
    checkInitialVisibility();

    // Also check after a short delay to account for layout
    const timer = setTimeout(checkInitialVisibility, 100);

    return () => clearTimeout(timer);
  }, [end, progress, initialCheckDone]);

  useEffect(() => {
    if (!isReady || !ref.current) return;

    if (prefersReducedMotion) {
      progress.set(1);
      setIsComplete(true);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      scrub: 0.5,
      onUpdate: (self) => {
        progress.set(self.progress);
        if (self.progress >= 1) {
          setIsComplete(true);
        }
      },
      onRefresh: (self) => {
        // Handle elements already past the trigger on page load
        if (self.progress >= 1) {
          progress.set(1);
          setIsComplete(true);
        } else if (self.progress > 0) {
          progress.set(self.progress);
        }
      },
    });

    // Read initial progress from the trigger directly. ScrollTrigger.create
    // measures the trigger as part of construction, so progress is populated.
    // Calling global ScrollTrigger.refresh() here would re-anchor scroll via
    // GSAP's save/restore mechanism and land the page mid-document on reload.
    if (trigger.progress >= 1) {
      progress.set(1);
      setIsComplete(true);
    } else if (trigger.progress > 0) {
      progress.set(trigger.progress);
    }

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, start, end, progress]);

  const z = useTransform(progress, [0, 1], [zStart, zEnd]);
  const rotateX = useTransform(progress, [0, 1], [rotateXStart, rotateXEnd]);
  const rotateY = useTransform(progress, [0, 1], [rotateYStart, rotateYEnd]);
  const opacity = useTransform(progress, [0, 1], [opacityStart, opacityEnd]);

  // Auto-calculate scale based on Z if not provided
  const calculatedScaleStart = scaleStart ?? Math.max(0.5, 1 + zStart / 1000);
  const calculatedScaleEnd = scaleEnd ?? 1 + zEnd / 1000;
  const scale = useTransform(
    progress,
    [0, 1],
    [calculatedScaleStart, calculatedScaleEnd]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        translateZ: isComplete ? zEnd : z,
        rotateX: isComplete ? rotateXEnd : rotateX,
        rotateY: isComplete ? rotateYEnd : rotateY,
        scale: isComplete ? calculatedScaleEnd : scale,
        opacity: isComplete ? opacityEnd : opacity,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
};

export default PerspectiveContainer;
