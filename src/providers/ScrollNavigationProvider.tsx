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

// Actions: stable callbacks + the (stable-by-default) sections array.
// Identity never changes after mount, so consumers that only use these
// (e.g. SingleScrollPage's registerSectionRef call) never re-render on
// scroll frames.
interface ScrollNavigationActions {
  sections: Section[];
  navigateToSection: (
    sectionId: string,
    options?: { immediate?: boolean }
  ) => void;
  registerSectionRef: (sectionId: string, ref: RefObject<HTMLElement>) => void;
  getSectionRef: (sectionId: string) => RefObject<HTMLElement> | null;
}

// Progress: per-frame state. New object every tick — consumers opt in.
interface ScrollNavigationProgress {
  activeSection: string | null;
  sectionProgress: Record<string, number>;
}

// Default sections configuration
const DEFAULT_SECTIONS: Section[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "connect", label: "Connect" },
];

const ScrollNavigationActionsContext =
  createContext<ScrollNavigationActions | null>(null);
const ScrollNavigationProgressContext =
  createContext<ScrollNavigationProgress | null>(null);

export const useScrollNavigationActions = (): ScrollNavigationActions => {
  const ctx = useContext(ScrollNavigationActionsContext);
  if (!ctx) {
    throw new Error(
      "useScrollNavigationActions must be used within ScrollNavigationProvider"
    );
  }
  return ctx;
};

export const useScrollNavigationProgress = (): ScrollNavigationProgress => {
  const ctx = useContext(ScrollNavigationProgressContext);
  if (!ctx) {
    throw new Error(
      "useScrollNavigationProgress must be used within ScrollNavigationProvider"
    );
  }
  return ctx;
};

interface ScrollNavigationProviderProps {
  children: ReactNode;
  sections?: Section[];
  navOffset?: number;
}

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

  const getSectionRef = useCallback(
    (sectionId: string): RefObject<HTMLElement> | null => {
      return sectionRefsMap.current.get(sectionId) || null;
    },
    []
  );

  // Active section detection — updates sectionProgress every frame.
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

  // Navigate to a section. `immediate: true` skips the Lenis animation —
  // used by keyboard navigation so arrow / PageUp/Down / digit keys jump
  // instantly (motion rule: never animate keyboard-initiated actions).
  const navigateToSection = useCallback(
    (sectionId: string, options: { immediate?: boolean } = {}) => {
      const ref = sectionRefsMap.current.get(sectionId);
      if (!ref?.current) {
        console.warn(`Section ref not found for: ${sectionId}`);
        return;
      }

      setIsNavigating(true);

      scrollTo(ref.current, {
        offset: -navOffset,
        duration: options.immediate ? 0 : 1.2,
        immediate: options.immediate,
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

  // Handle initial scroll on mount (from URL hash, e.g. /RajTrivedi/#projects).
  // We intentionally only run this once: re-running on every navigateToSection
  // identity change would re-snap the user to the URL hash mid-scroll.
  const didInitialScrollRef = useRef(false);
  useEffect(() => {
    if (didInitialScrollRef.current) return;

    const sectionId = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (!sectionId || sectionId === "home") {
      didInitialScrollRef.current = true;
      return;
    }

    // Delay to ensure refs are registered and Lenis is ready
    const timeoutId = setTimeout(() => {
      navigateToSection(sectionId);
      didInitialScrollRef.current = true;
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [navigateToSection]);

  // Actions identity is stable across scroll frames: it only changes when
  // `sections` or `navigateToSection` change (both rare — `sections` is
  // typically the module-level DEFAULT_SECTIONS, navigateToSection depends
  // only on `scrollTo` and `navOffset`). registerSectionRef and
  // getSectionRef are useCallback([]) so their identity never changes.
  const actionsValue = useMemo<ScrollNavigationActions>(
    () => ({
      sections,
      navigateToSection,
      registerSectionRef,
      getSectionRef,
    }),
    [sections, navigateToSection, registerSectionRef, getSectionRef]
  );

  const progressValue = useMemo<ScrollNavigationProgress>(
    () => ({ activeSection, sectionProgress }),
    [activeSection, sectionProgress]
  );

  return (
    <ScrollNavigationActionsContext.Provider value={actionsValue}>
      <ScrollNavigationProgressContext.Provider value={progressValue}>
        {children}
      </ScrollNavigationProgressContext.Provider>
    </ScrollNavigationActionsContext.Provider>
  );
};

export default ScrollNavigationProvider;
