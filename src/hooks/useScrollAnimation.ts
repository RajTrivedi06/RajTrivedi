// src/hooks/useScrollAnimation.ts

import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../providers";
import { useReducedMotion } from "./useReducedMotion";

// Animation configuration type
interface ScrollAnimationConfig {
  // Target element (ref or selector within trigger)
  target?: RefObject<HTMLElement> | string;

  // ScrollTrigger settings
  trigger: RefObject<HTMLElement> | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  pinSpacing?: boolean;
  markers?: boolean;

  // Animation settings
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  duration?: number;
  ease?: string;

  // Callbacks
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (progress: number) => void;

  // Reduced motion fallback
  reducedMotionBehavior?: "none" | "instant" | "simple";
}

interface UseScrollAnimationResult {
  timeline: gsap.core.Timeline | null;
  scrollTrigger: ScrollTrigger | null;
  progress: number;
}

export const useScrollAnimation = (
  config: ScrollAnimationConfig
): UseScrollAnimationResult => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!isReady) return;

    // Get trigger element
    const triggerEl =
      typeof config.trigger === "string"
        ? config.trigger
        : config.trigger.current;

    if (!triggerEl) return;

    // Get target element (defaults to trigger)
    let targetEl: HTMLElement | string | null = null;
    if (config.target) {
      targetEl =
        typeof config.target === "string"
          ? config.target
          : config.target.current;
    }

    // Handle reduced motion
    if (prefersReducedMotion) {
      if (config.reducedMotionBehavior === "none") {
        return; // No animation at all
      }
      if (config.reducedMotionBehavior === "instant" && targetEl && config.to) {
        // Jump to final state instantly
        gsap.set(targetEl, config.to);
        return;
      }
      // "simple" - create ScrollTrigger without animation
    }

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: config.start ?? "top 80%",
        end: config.end ?? "bottom 20%",
        scrub: config.scrub ?? true,
        pin: config.pin ?? false,
        pinSpacing: config.pinSpacing ?? true,
        markers: config.markers ?? false,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
        onEnterBack: config.onEnterBack,
        onLeaveBack: config.onLeaveBack,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          config.onUpdate?.(self.progress);
        },
      },
    });

    // Add animation if target exists
    if (targetEl && (config.from || config.to)) {
      if (config.from && config.to) {
        tl.fromTo(targetEl, config.from, {
          ...config.to,
          duration: config.duration ?? 1,
          ease: config.ease ?? "power2.out",
        });
      } else if (config.to) {
        tl.to(targetEl, {
          ...config.to,
          duration: config.duration ?? 1,
          ease: config.ease ?? "power2.out",
        });
      } else if (config.from) {
        tl.from(targetEl, {
          ...config.from,
          duration: config.duration ?? 1,
          ease: config.ease ?? "power2.out",
        });
      }
    }

    timelineRef.current = tl;
    scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;

    return () => {
      tl.kill();
      scrollTriggerRef.current?.kill();
    };
  }, [isReady, config, prefersReducedMotion]);

  return {
    timeline: timelineRef.current,
    scrollTrigger: scrollTriggerRef.current,
    progress: progressRef.current,
  };
};

export default useScrollAnimation;
