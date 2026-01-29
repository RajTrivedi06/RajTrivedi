// src/components/ui/section-indicator.tsx

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface SectionIndicatorProps {
  sections: Section[];
  className?: string;
}

export const SectionIndicator = ({
  sections,
  className,
}: SectionIndicatorProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Show indicator after scrolling past first screen
      setIsVisible(window.scrollY > 200);

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3",
        className
      )}
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className="group flex items-center gap-3 justify-end"
          aria-label={`Go to ${section.label} section`}
        >
          {/* Label - appears on hover */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className={cn(
              "text-xs font-mono whitespace-nowrap transition-colors",
              activeSection === index ? "text-purple-400" : "text-gray-500"
            )}
          >
            {section.label}
          </motion.span>

          {/* Dot indicator */}
          <motion.div
            className={cn(
              "rounded-full transition-all duration-300",
              activeSection === index
                ? "bg-purple-500 w-3 h-3"
                : "bg-gray-600 w-2 h-2 group-hover:bg-purple-400"
            )}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: activeSection === index ? 1 : 0.8,
                  }
            }
            whileHover={shouldReduceMotion ? {} : { scale: 1.2 }}
          />
        </button>
      ))}

      {/* Progress line connecting dots */}
      <div className="absolute right-[5px] top-0 bottom-0 w-[2px] -z-10">
        <div className="absolute inset-0 bg-gray-700/50 rounded-full" />
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-500 to-purple-400 rounded-full origin-top"
          style={{
            height: `${((activeSection + 1) / sections.length) * 100}%`,
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default SectionIndicator;
