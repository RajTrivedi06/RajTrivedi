// src/providers/ScrollNavigationProvider.tsx

import {
  createContext,
  useContext,
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
  RefObject,
} from "react";
import {
  useActiveSection,
  useScrollTo,
  useScrollURL,
  SectionConfig,
} from "../hooks";

// Section definition
export interface Section {
  id: string;
  label: string;
  icon?: string;
}

// Context type
interface ScrollNavigationContextType {
  // State
  activeSection: string | null;
  sections: Section[];
  sectionProgress: Record<string, number>;
  isNavigating: boolean;

  // Actions
  navigateToSection: (sectionId: string) => void;
  registerSectionRef: (sectionId: string, ref: RefObject<HTMLElement>) => void;

  // Refs
  getSectionRef: (sectionId: string) => RefObject<HTMLElement> | null;
}

// Default sections configuration
const DEFAULT_SECTIONS: Section[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "connect", label: "Connect" },
];

// Context
const ScrollNavigationContext =
  createContext<ScrollNavigationContextType | null>(null);

// Hook for consuming context
export const useScrollNavigation = () => {
  const context = useContext(ScrollNavigationContext);
  if (!context) {
    throw new Error(
      "useScrollNavigation must be used within ScrollNavigationProvider"
    );
  }
  return context;
};

// Provider props
interface ScrollNavigationProviderProps {
  children: ReactNode;
  sections?: Section[];
  navOffset?: number;
}

// Provider component
export const ScrollNavigationProvider = ({
  children,
  sections = DEFAULT_SECTIONS,
  navOffset = 80,
}: ScrollNavigationProviderProps) => {
  const { scrollTo } = useScrollTo();
  const [isNavigating, setIsNavigating] = useState(false);
  const sectionRefsMap = useRef<Map<string, RefObject<HTMLElement>>>(new Map());

  // Registration version: bumped on each registerSectionRef call.
  // React 18 batches the N functional-update setStates from N sections
  // registering in the same commit phase into a single re-render, so
  // useActiveSection sees exactly one configs-array rebuild per batch
  // instead of N incremental rebuilds (which would rip down and recreate
  // every ScrollTrigger N times — see audit 05 B2).
  const [registrationVersion, setRegistrationVersion] = useState(0);

  // Register a section ref
  const registerSectionRef = useCallback(
    (sectionId: string, ref: RefObject<HTMLElement>) => {
      sectionRefsMap.current.set(sectionId, ref);
      setRegistrationVersion((v) => v + 1);
    },
    []
  );

  // Derive configs once per registration batch. Stable identity between
  // renders as long as neither `sections` nor `registrationVersion` change,
  // which keeps useActiveSection's effect deps from thrashing.
  const sectionConfigs = useMemo<SectionConfig[]>(() => {
    const configs: SectionConfig[] = [];
    sections.forEach((section) => {
      const sectionRef = sectionRefsMap.current.get(section.id);
      if (sectionRef) {
        configs.push({ id: section.id, ref: sectionRef, threshold: 0.3 });
      }
    });
    return configs;
  }, [sections, registrationVersion]);

  // Get a section ref
  const getSectionRef = useCallback(
    (sectionId: string): RefObject<HTMLElement> | null => {
      return sectionRefsMap.current.get(sectionId) || null;
    },
    []
  );

  // Active section detection
  const { activeSection, sectionProgress } = useActiveSection({
    sections: sectionConfigs,
    offset: navOffset,
  });

  // URL sync
  useScrollURL({
    activeSection,
    enabled: !isNavigating, // Disable during programmatic navigation
    debounceMs: 150,
  });

  // Navigate to a section
  const navigateToSection = useCallback(
    (sectionId: string) => {
      const ref = sectionRefsMap.current.get(sectionId);
      if (!ref?.current) {
        console.warn(`Section ref not found for: ${sectionId}`);
        return;
      }

      setIsNavigating(true);

      scrollTo(ref.current, {
        offset: -navOffset,
        duration: 1.2,
        onComplete: () => {
          // Small delay before re-enabling URL sync
          setTimeout(() => {
            setIsNavigating(false);
          }, 100);
        },
      });
    },
    [scrollTo, navOffset]
  );

  // Handle initial scroll on mount (from URL)
  useEffect(() => {
    const path = window.location.pathname;
    const sectionId = path.split("/").pop()?.toLowerCase() || "home";

    // Only scroll if not already at the section and not on landing page
    if (sectionId && sectionId !== "rajtrivedi" && sectionId !== "") {
      // Delay to ensure refs are registered and Lenis is ready
      const timeoutId = setTimeout(() => {
        navigateToSection(sectionId);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [navigateToSection]);

  return (
    <ScrollNavigationContext.Provider
      value={{
        activeSection,
        sections,
        sectionProgress,
        isNavigating,
        navigateToSection,
        registerSectionRef,
        getSectionRef,
      }}
    >
      {children}
    </ScrollNavigationContext.Provider>
  );
};

export default ScrollNavigationProvider;
