// src/hooks/useScrollURL.ts

import { useEffect, useCallback, useRef } from "react";

interface UseScrollURLOptions {
  activeSection: string | null;
  enabled?: boolean;
  debounceMs?: number;
}

// Read the current section id from `window.location.hash`. We strip a leading
// "#" and an optional leading "/" so both `#home` and `#/home` are accepted.
const readHashSection = (): string => {
  if (typeof window === "undefined") return "";
  const raw = window.location.hash.replace(/^#\/?/, "");
  return raw.toLowerCase();
};

export const useScrollURL = (options: UseScrollURLOptions) => {
  const { activeSection, enabled = true, debounceMs = 100 } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastUpdateRef = useRef<string | null>(null);

  // Keep URL in sync with the active section as the user scrolls.
  // Hash-based URLs (e.g. /RajTrivedi/#home) are GitHub-Pages-safe: refreshing
  // never hits the server with a path it doesn't know about, so there's no 404.
  useEffect(() => {
    if (!enabled || !activeSection) return;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const currentHash = readHashSection();

      if (
        activeSection !== currentHash &&
        activeSection !== lastUpdateRef.current
      ) {
        lastUpdateRef.current = activeSection;

        // replaceState avoids polluting the back/forward history with one
        // entry per section while scrolling. Preserve the current pathname
        // and search so we don't accidentally rewrite the GitHub Pages base.
        const { pathname, search } = window.location;
        window.history.replaceState(
          { section: activeSection },
          "",
          `${pathname}${search}#${activeSection}`
        );
      }
    }, debounceMs);

    return () => clearTimeout(timeoutRef.current);
  }, [activeSection, enabled, debounceMs]);

  // Get initial section from URL hash (e.g. /RajTrivedi/#projects -> "projects")
  const getInitialSection = useCallback((): string => {
    return readHashSection() || "home";
  }, []);

  return {
    getInitialSection,
  };
};

export default useScrollURL;
