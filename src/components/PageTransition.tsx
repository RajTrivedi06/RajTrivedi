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
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

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
  const { lenis } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const previousPathRef = useRef<string>(location.pathname);
  const transitionTriggeredRef = useRef(false);
  // Keep the latest Lenis instance in a ref so the transition-completion
  // callback reads the current value without forcing the effect to re-run
  // on every SmoothScrollProvider re-render (which happens on every scroll).
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

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

          // Reset scroll to top after transition. Prefer Lenis so its
          // internal state resets in sync with the DOM scroll position;
          // fall back to native scrollTo if Lenis hasn't mounted yet.
          const activeLenis = lenisRef.current;
          if (activeLenis) {
            activeLenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
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
              : undefined
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
              : undefined
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
