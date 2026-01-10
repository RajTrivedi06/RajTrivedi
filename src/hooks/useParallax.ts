// src/hooks/useParallax.ts

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { useScrollTrigger } from "../providers";
import { useReducedMotion } from "./useReducedMotion";

interface UseParallaxConfig {
  target: RefObject<HTMLElement>;
  speed?: number; // -1 to 1, negative = opposite direction
  direction?: "vertical" | "horizontal";
  start?: string;
  end?: string;
}

export const useParallax = (config: UseParallaxConfig) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const {
    target,
    speed = 0.5,
    direction = "vertical",
    start = "top bottom",
    end = "bottom top",
  } = config;

  useEffect(() => {
    if (!isReady || prefersReducedMotion || !target.current) return;

    const element = target.current;
    const distance = 100 * speed;

    const animation = gsap.fromTo(
      element,
      {
        [direction === "vertical" ? "y" : "x"]: -distance,
      },
      {
        [direction === "vertical" ? "y" : "x"]: distance,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, [isReady, prefersReducedMotion, target, speed, direction, start, end]);
};

export default useParallax;
