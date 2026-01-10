// src/hooks/useScrollURL.ts

import { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

interface UseScrollURLOptions {
  activeSection: string | null;
  enabled?: boolean;
  debounceMs?: number;
}

export const useScrollURL = (options: UseScrollURLOptions) => {
  const { activeSection, enabled = true, debounceMs = 100 } = options;
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastUpdateRef = useRef<string | null>(null);

  // Convert section ID to route path
  const sectionToPath = useCallback((sectionId: string): string => {
    // Capitalize first letter to match route convention
    const path = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    return `/${path}`;
  }, []);

  // Convert route path to section ID
  const pathToSection = useCallback((path: string): string => {
    // Remove leading slash and lowercase
    const section = path.replace(/^\//, "").toLowerCase();
    return section || "home";
  }, []);

  // Update URL based on active section
  useEffect(() => {
    if (!enabled || !activeSection) return;

    // Debounce URL updates to prevent excessive history entries
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const newPath = sectionToPath(activeSection);
      const currentPath = location.pathname.replace(/\/$/, ""); // Remove trailing slash

      // Only update if path actually changed
      if (newPath !== currentPath && activeSection !== lastUpdateRef.current) {
        lastUpdateRef.current = activeSection;

        // Use replaceState to update URL without adding history entry
        // This prevents back button from cycling through scroll positions
        window.history.replaceState(
          { section: activeSection },
          "",
          `/RajTrivedi${newPath}` // Include base path for GitHub Pages
        );
      }
    }, debounceMs);

    return () => clearTimeout(timeoutRef.current);
  }, [activeSection, enabled, sectionToPath, location.pathname, debounceMs]);

  // Get initial section from URL
  const getInitialSection = useCallback((): string => {
    return pathToSection(location.pathname);
  }, [location.pathname, pathToSection]);

  return {
    getInitialSection,
    sectionToPath,
    pathToSection,
  };
};

export default useScrollURL;
