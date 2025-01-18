"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  // Simple horizontal animation from left -> right -> left
  const variants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  return (
    // Use a small padding (e.g. 2px or 3px) so the gradient border is visible but not too thick
    <div className={cn("relative p-[3px]", containerClassName)}>
      {/* Animated gradient layer (the "border") */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : false}
        animate={animate ? "animate" : false}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: "200% 200%", // scale up so we can animate across
        }}
        className={cn(
          "absolute inset-0 z-[1]", // behind the children
          "rounded-xl", // match child's corner radius
          // We remove or reduce blur to keep corners crisp
          // "blur-sm" or "blur-md" if you want a glow effect
          // "blur-sm",
          // Our linear gradient, from #5ECCFF to #9B5CFF
          "bg-[linear-gradient(to_right,_#5ECCFF,_#9B5CFF)]",
          "transition duration-500" // smooth crossfade
        )}
      />

      {/* The actual card (content) on top */}
      <div
        className={cn(
          // Ensure the child corners line up with the gradient
          "relative z-10 rounded-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
