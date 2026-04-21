// src/providers/ScrollTriggerProvider.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScrollActions } from "./SmoothScrollProvider";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Types
interface ScrollTriggerContextType {
  isReady: boolean;
  refresh: () => void;
}

interface ScrollTriggerProviderProps {
  children: ReactNode;
}

// Context
const ScrollTriggerContext = createContext<ScrollTriggerContextType>({
  isReady: false,
  refresh: () => {},
});

// Hook for consuming the context
export const useScrollTrigger = () => {
  const context = useContext(ScrollTriggerContext);
  if (!context) {
    throw new Error(
      "useScrollTrigger must be used within a ScrollTriggerProvider"
    );
  }
  return context;
};

// Provider Component
export const ScrollTriggerProvider = ({
  children,
}: ScrollTriggerProviderProps) => {
  const { lenis } = useSmoothScrollActions();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!lenis) return;

    // Connect Lenis to ScrollTrigger
    // This ensures ScrollTrigger uses Lenis's scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      scroller: window,
      markers: false, // Set to true for debugging
    });

    // Refresh ScrollTrigger after Lenis is ready
    ScrollTrigger.refresh();

    setIsReady(true);

    // Cleanup
    return () => {
      // Kill all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      setIsReady(false);
    };
  }, [lenis]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refresh = () => {
    ScrollTrigger.refresh();
  };

  return (
    <ScrollTriggerContext.Provider value={{ isReady, refresh }}>
      {children}
    </ScrollTriggerContext.Provider>
  );
};

export default ScrollTriggerProvider;
