// src/hooks/useActiveSection.ts

import { useEffect, useState, useRef, RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../providers";

// Section configuration type
export interface SectionConfig {
  id: string;
  ref: RefObject<HTMLElement>;
  threshold?: number; // How much of section must be visible (0-1)
}

interface UseActiveSectionOptions {
  sections: SectionConfig[];
  offset?: number; // Offset from top (for fixed header)
  onChange?: (activeId: string | null) => void;
}

interface UseActiveSectionResult {
  activeSection: string | null;
  sectionProgress: Record<string, number>;
  visibleSections: string[];
}

export const useActiveSection = (
  options: UseActiveSectionOptions
): UseActiveSectionResult => {
  const { sections, offset = 80, onChange } = options;
  const { isReady } = useScrollTrigger();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState<
    Record<string, number>
  >({});
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  const triggersRef = useRef<ScrollTrigger[]>([]);
  const progressRef = useRef<Record<string, number>>({});
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isReady || sections.length === 0) return;

    // Clear existing triggers
    triggersRef.current.forEach((trigger) => trigger.kill());
    triggersRef.current = [];

    // Create ScrollTrigger for each section
    sections.forEach(({ id, ref }) => {
      if (!ref.current) return;

      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: `top ${offset}px`,
        end: "bottom top",
        onUpdate: (self) => {
          // Track progress for each section
          progressRef.current[id] = self.progress;
          setSectionProgress({ ...progressRef.current });
        },
        onEnter: () => {
          visibleRef.current.add(id);
          setVisibleSections([...visibleRef.current]);
        },
        onLeave: () => {
          visibleRef.current.delete(id);
          setVisibleSections([...visibleRef.current]);
        },
        onEnterBack: () => {
          visibleRef.current.add(id);
          setVisibleSections([...visibleRef.current]);
        },
        onLeaveBack: () => {
          visibleRef.current.delete(id);
          setVisibleSections([...visibleRef.current]);
        },
      });

      triggersRef.current.push(trigger);
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, [isReady, sections, offset]);

  // Determine active section based on visibility and position
  useEffect(() => {
    if (visibleSections.length === 0) {
      // No sections visible - likely at very top or bottom
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        const firstSection = sections[0]?.id || null;
        if (firstSection !== activeSection) {
          setActiveSection(firstSection);
          onChange?.(firstSection);
        }
      }
      return;
    }

    if (visibleSections.length === 1) {
      // Only one section visible - it's active
      const newActive = visibleSections[0];
      if (newActive !== activeSection) {
        setActiveSection(newActive);
        onChange?.(newActive);
      }
      return;
    }

    // Multiple sections visible - find the one with most visibility
    // Prioritize the section that's more "entered" into the viewport
    let bestSection = visibleSections[0];
    let bestScore = 0;

    visibleSections.forEach((id) => {
      const progress = progressRef.current[id] || 0;
      // Score based on how centered the section is (0.5 is ideal)
      const score = 1 - Math.abs(progress - 0.5) * 2;

      if (score > bestScore) {
        bestScore = score;
        bestSection = id;
      }
    });

    if (bestSection !== activeSection) {
      setActiveSection(bestSection);
      onChange?.(bestSection);
    }
  }, [visibleSections, sections, activeSection, onChange]);

  return {
    activeSection,
    sectionProgress,
    visibleSections,
  };
};

export default useActiveSection;
