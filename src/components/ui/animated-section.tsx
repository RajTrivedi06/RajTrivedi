// src/components/ui/animated-section.tsx

import { motion, useInView } from "motion/react";
import { useRef, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export const AnimatedSection = ({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 75,
}: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    if (shouldReduceMotion) return { x: 0, y: 0 };
    switch (direction) {
      case "up":
        return { x: 0, y: distance };
      case "down":
        return { x: 0, y: -distance };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const initialPosition = getInitialPosition();

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, ...initialPosition }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...initialPosition }
      }
      transition={{
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
