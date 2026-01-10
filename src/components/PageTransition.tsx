// src/components/PageTransition.tsx

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

interface TransitionContextType {
  startTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const usePageTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    return { startTransition: () => {} };
  }
  return context;
};

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isExiting, setIsExiting] = useState(false);
  const previousPathRef = useRef<string>(location.pathname);
  const transitionTriggeredRef = useRef(false);

  const startTransition = () => {
    transitionTriggeredRef.current = true;
    setIsExiting(true);
  };

  useEffect(() => {
    // When pathname changes
    if (location.pathname !== previousPathRef.current) {
      // If transition was triggered, complete it
      if (transitionTriggeredRef.current && isExiting) {
        const timer = setTimeout(() => {
          setIsExiting(false);
          transitionTriggeredRef.current = false;
          previousPathRef.current = location.pathname;

          // Scroll to top immediately after transition
          window.scrollTo({ top: 0, behavior: "instant" });

          // Also ensure smooth scroll is at top
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          }
        }, 600);

        return () => clearTimeout(timer);
      } else {
        // Direct navigation without transition
        previousPathRef.current = location.pathname;
      }
    }
  }, [location.pathname, isExiting]);

  // Check if we're transitioning from root to a section
  const isFromRoot =
    previousPathRef.current === "/" && location.pathname !== "/";

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={
            isFromRoot && transitionTriggeredRef.current
              ? { scale: 0, opacity: 0 }
              : false
          }
          animate={{
            scale: isExiting && transitionTriggeredRef.current ? 0 : 1,
            opacity: isExiting && transitionTriggeredRef.current ? 0 : 1,
          }}
          exit={
            isExiting && transitionTriggeredRef.current
              ? {
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                }
              : false
          }
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            transformOrigin: "center center",
            width: "100%",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};

export default PageTransition;
