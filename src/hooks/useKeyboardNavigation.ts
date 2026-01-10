// src/hooks/useKeyboardNavigation.ts

import { useEffect, useCallback } from "react";
import { useScrollNavigation } from "../providers";

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
}

export const useKeyboardNavigation = (
  options: UseKeyboardNavigationOptions = {}
) => {
  const { enabled = true } = options;
  const { sections, activeSection, navigateToSection } = useScrollNavigation();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't interfere with form inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const currentIndex = sections.findIndex((s) => s.id === activeSection);

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
          event.preventDefault();
          if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1].id);
          }
          break;

        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1].id);
          }
          break;

        case "Home":
          event.preventDefault();
          navigateToSection(sections[0].id);
          break;

        case "End":
          event.preventDefault();
          navigateToSection(sections[sections.length - 1].id);
          break;

        // Number keys 1-5 for direct section access
        case "1":
        case "2":
        case "3":
        case "4":
        case "5": {
          const index = parseInt(event.key) - 1;
          if (index < sections.length) {
            event.preventDefault();
            navigateToSection(sections[index].id);
          }
          break;
        }
      }
    },
    [enabled, sections, activeSection, navigateToSection]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
};

export default useKeyboardNavigation;
