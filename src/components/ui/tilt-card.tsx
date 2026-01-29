// src/components/ui/tilt-card.tsx

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  perspective?: number;
  glareEnabled?: boolean;
}

export const TiltCard = ({
  children,
  className,
  tiltAmount = 15,
  perspective = 1000,
  glareEnabled = true,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth animation
  const springConfig = { stiffness: 300, damping: 30 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${tiltAmount}deg`, `-${tiltAmount}deg`]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${tiltAmount}deg`, `${tiltAmount}deg`]
  );

  // Glare effect position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.15, 0, 0.15]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || shouldReduceMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize to -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        {/* Content with 3D depth */}
        <div
          style={{
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full"
        >
          {children}
        </div>

        {/* Glare overlay */}
        {glareEnabled && (
          <motion.div
            style={{
              backgroundImage: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25) 0%, transparent 50%)`,
              opacity: glareOpacity,
            }}
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// Simpler hover lift effect
interface HoverLiftCardProps {
  children: ReactNode;
  className?: string;
  liftAmount?: number;
}

export const HoverLiftCard = ({
  children,
  className,
  liftAmount = 8,
}: HoverLiftCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{
        y: -liftAmount,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
