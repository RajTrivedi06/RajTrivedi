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

      // Skip all modifier-key combinations. The user's chord belongs to
      // the browser or OS (e.g. Cmd+Home = go to top, Shift+ArrowDown =
      // extend text selection, Ctrl+ArrowDown = jump to end). We only
      // handle bare keys — never hijack a modifier chord.
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return;
      }

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

      // Keyboard-driven navigation is always immediate — do not animate.
      // Home/End are intentionally *not* handled here; the browser should
      // retain its native "scroll container top/bottom" behavior.
      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
          event.preventDefault();
          if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1].id, {
              immediate: true,
            });
          }
          break;

        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1].id, {
              immediate: true,
            });
          }
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
            navigateToSection(sections[index].id, { immediate: true });
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
