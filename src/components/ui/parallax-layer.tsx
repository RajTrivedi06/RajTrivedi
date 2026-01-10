// src/components/ui/parallax-layer.tsx

import { useRef, useEffect, ReactNode, CSSProperties } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // -2 to 2, negative = opposite direction
  direction?: "vertical" | "horizontal" | "both";
  scale?: { start: number; end: number };
  opacity?: { start: number; end: number };
  rotate?: { start: number; end: number };
  className?: string;
  style?: CSSProperties;
  easing?: "none" | "smooth";
}

export const ParallaxLayer = ({
  children,
  speed = 0.5,
  direction = "vertical",
  scale,
  opacity,
  rotate,
  className = "",
  style = {},
  easing = "smooth",
}: ParallaxLayerProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0.5); // Start at middle

  useEffect(() => {
    if (!isReady || !ref.current || prefersReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      scrub: easing === "smooth" ? 1 : true,
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, easing, progress]);

  // Calculate movement distance based on speed
  const distance = 100 * Math.abs(speed);
  const isReversed = speed < 0;

  // Transform values - always call hooks unconditionally
  const yValue = useTransform(
    progress,
    [0, 1],
    isReversed ? [distance, -distance] : [-distance, distance]
  );

  const xValue = useTransform(
    progress,
    [0, 1],
    isReversed ? [distance, -distance] : [-distance, distance]
  );

  // Always call useTransform, use default values if not provided
  const scaleValue = useTransform(
    progress,
    [0, 1],
    scale ? [scale.start, scale.end] : [1, 1]
  );

  const opacityValue = useTransform(
    progress,
    [0, 1],
    opacity ? [opacity.start, opacity.end] : [1, 1]
  );

  const rotateValue = useTransform(
    progress,
    [0, 1],
    rotate ? [rotate.start, rotate.end] : [0, 0]
  );

  // Apply spring for smoother movement
  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  const smoothY = useSpring(yValue, springConfig);
  const smoothX = useSpring(xValue, springConfig);

  // Determine which transforms to apply
  const y =
    direction !== "horizontal" ? (easing === "smooth" ? smoothY : yValue) : 0;
  const x =
    direction !== "vertical" ? (easing === "smooth" ? smoothX : xValue) : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        y: prefersReducedMotion ? 0 : y,
        x: prefersReducedMotion ? 0 : x,
        scale: scale ? scaleValue : undefined,
        opacity: opacity ? opacityValue : undefined,
        rotate: rotate ? rotateValue : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxLayer;
