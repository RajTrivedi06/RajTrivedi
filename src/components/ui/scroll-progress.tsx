// src/components/ui/scroll-progress.tsx

import { motion, useScroll } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-400 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default ScrollProgress;
