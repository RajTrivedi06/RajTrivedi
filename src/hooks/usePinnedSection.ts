// src/hooks/usePinnedSection.ts

import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { useScrollTrigger } from "../providers";
import { useReducedMotion } from "./useReducedMotion";

interface PinnedSectionConfig {
  trigger: RefObject<HTMLElement>;
  pinDuration?: number; // How many viewport heights to pin for
  onProgress?: (progress: number) => void;
  markers?: boolean;
}

interface PinnedSectionResult {
  progress: number;
  isPinned: boolean;
  timeline: gsap.core.Timeline | null;
  addAnimation: (
    target: gsap.TweenTarget,
    vars: gsap.TweenVars,
    position?: gsap.Position
  ) => void;
}

export const usePinnedSection = (
  config: PinnedSectionConfig
): PinnedSectionResult => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef(0);
  const isPinnedRef = useRef(false);

  useEffect(() => {
    if (!isReady || !config.trigger.current) return;

    // Skip pinning for reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const trigger = config.trigger.current;
    const pinDuration = config.pinDuration ?? 1;

    // Create timeline with pinned ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top top",
        end: `+=${window.innerHeight * pinDuration}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        markers: config.markers ?? false,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          config.onProgress?.(self.progress);
        },
        onEnter: () => {
          isPinnedRef.current = true;
        },
        onLeave: () => {
          isPinnedRef.current = false;
        },
        onEnterBack: () => {
          isPinnedRef.current = true;
        },
        onLeaveBack: () => {
          isPinnedRef.current = false;
        },
      },
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [isReady, config, prefersReducedMotion]);

  // Function to add animations to the timeline
  const addAnimation = (
    target: gsap.TweenTarget,
    vars: gsap.TweenVars,
    position?: gsap.Position
  ) => {
    if (timelineRef.current) {
      timelineRef.current.to(target, vars, position);
    }
  };

  return {
    progress: progressRef.current,
    isPinned: isPinnedRef.current,
    timeline: timelineRef.current,
    addAnimation,
  };
};

export default usePinnedSection;
