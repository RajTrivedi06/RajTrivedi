// src/components/ui/staggered-grid.tsx

import { motion, useInView, Variants } from "motion/react";
import { useRef, ReactNode, Children, isValidElement } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

const getItemVariants = (direction: string): Variants => {
  const distance = 50;

  const initialState = (() => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, scale: 0.95 };
      case "down":
        return { opacity: 0, y: -distance, scale: 0.95 };
      case "left":
        return { opacity: 0, x: distance, scale: 0.95 };
      case "right":
        return { opacity: 0, x: -distance, scale: 0.95 };
      case "scale":
        return { opacity: 0, scale: 0.8 };
      default:
        return { opacity: 0, y: distance, scale: 0.95 };
    }
  })();

  return {
    hidden: initialState,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };
};

export const StaggeredGrid = ({
  children,
  className,
  staggerDelay = 0.15,
  initialDelay = 0,
  direction = "up",
}: StaggeredGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = getItemVariants(direction);

  // Custom container variants with configurable stagger
  const customContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={customContainerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Individual item component for more control
interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export const StaggeredItem = ({ children, className }: StaggeredItemProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default StaggeredGrid;
