// src/components/ui/magnetic-button.tsx

import { motion } from "motion/react";
import { useRef, useState, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

export const MagneticButton = ({
  children,
  className,
  magneticStrength = 0.3,
  as = "button",
  href,
  target,
  rel,
  onClick,
  title,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || shouldReduceMotion) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const motionProps = {
    ref: ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: shouldReduceMotion ? {} : { x: position.x, y: position.y },
    transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
    className: cn(className),
    onClick,
    title,
  };

  if (as === "a") {
    return (
      <motion.a
        {...motionProps}
        href={href}
        target={target}
        rel={rel}
      >
        {children}
      </motion.a>
    );
  }

  return <motion.button {...motionProps}>{children}</motion.button>;
};

// Magnetic wrapper for any element
interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
}

export const MagneticWrapper = ({
  children,
  className,
  magneticStrength = 0.3,
}: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || shouldReduceMotion) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
