// src/components/ui/zoom-section.tsx

import { ReactNode, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface ZoomSectionProps {
  children: ReactNode;
  className?: string;
  direction?: "in" | "out"; // Zoom in (approach) or out (recede)
  intensity?: number; // 0.5 to 2, affects zoom strength
  pin?: boolean;
  pinDuration?: number;
}

export const ZoomSection = ({
  children,
  className = "",
  direction = "in",
  intensity = 1,
  pin = false,
  pinDuration = 1,
}: ZoomSectionProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(prefersReducedMotion ? 1 : 0);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    if (prefersReducedMotion) {
      progress.set(direction === "in" ? 1 : 0);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: pin ? "top top" : "top bottom",
      end: pin ? `+=${window.innerHeight * pinDuration}` : "bottom top",
      pin: pin ? contentRef.current ?? false : false,
      pinSpacing: pin,
      scrub: 1,
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, pin, pinDuration, direction, progress]);

  // Calculate zoom values based on direction and intensity
  const scaleRange =
    direction === "in" ? [0.5 * intensity, 1] : [1, 0.5 * intensity];

  const opacityRange = direction === "in" ? [0, 1] : [1, 0];

  const zRange =
    direction === "in" ? [-300 * intensity, 0] : [0, -300 * intensity];

  const scale = useTransform(progress, [0, 1], scaleRange);
  const opacity = useTransform(
    progress,
    [0, 0.3, 0.7, 1],
    [opacityRange[0], 1, 1, opacityRange[1]]
  );
  const z = useTransform(progress, [0, 1], zRange);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center center",
      }}
    >
      <motion.div
        ref={contentRef}
        className="w-full h-full"
        style={{
          scale,
          opacity,
          translateZ: z,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ZoomSection;
