// src/components/ui/floating-particles.tsx

import { motion } from "motion/react";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  colors?: string[];
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export const FloatingParticles = ({
  count = 20,
  className,
  minSize = 2,
  maxSize = 4,
  minDuration = 3,
  maxDuration = 6,
  colors = ["rgba(255,255,255,0.3)", "rgba(155,92,255,0.4)", "rgba(210,130,255,0.3)"],
}: FloatingParticlesProps) => {
  const shouldReduceMotion = useReducedMotion();

  // Generate particles with stable positions using useMemo
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: minDuration + Math.random() * (maxDuration - minDuration),
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count, minSize, maxSize, minDuration, maxDuration, colors]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Star-like particles variant
export const StarParticles = ({
  count = 30,
  className,
}: {
  count?: number;
  className?: string;
}) => {
  const shouldReduceMotion = useReducedMotion();

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, [count]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
