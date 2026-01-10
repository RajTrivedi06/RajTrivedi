// src/providers/ScrollProvider.tsx

import { ReactNode } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { ScrollTriggerProvider } from "./ScrollTriggerProvider";
import { ScrollNavigationProvider, Section } from "./ScrollNavigationProvider";
import { PerformanceProvider } from "./PerformanceProvider";

interface ScrollProviderProps {
  children: ReactNode;
  sections?: Section[];
}

const DEFAULT_SECTIONS: Section[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "connect", label: "Connect" },
];

export const ScrollProvider = ({
  children,
  sections = DEFAULT_SECTIONS,
}: ScrollProviderProps) => {
  return (
    <PerformanceProvider>
      <SmoothScrollProvider
        options={{
          duration: 1.2,
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 2,
        }}
      >
        <ScrollTriggerProvider>
          <ScrollNavigationProvider sections={sections} navOffset={80}>
            {children}
          </ScrollNavigationProvider>
        </ScrollTriggerProvider>
      </SmoothScrollProvider>
    </PerformanceProvider>
  );
};

export default ScrollProvider;
