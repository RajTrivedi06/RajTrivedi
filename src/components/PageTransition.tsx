// src/components/PageTransition.tsx

import { ReactNode, createContext, useContext } from "react";

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

// Single-page scroll site: there are no route changes to animate between.
// Kept as a passthrough wrapper so any consumers of usePageTransition keep
// working without depending on react-router.
export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <TransitionContext.Provider value={{ startTransition: () => {} }}>
      {children}
    </TransitionContext.Provider>
  );
};

export default PageTransition;
