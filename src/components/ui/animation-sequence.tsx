// src/components/ui/animation-sequence.tsx

import {
  ReactNode,
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollTrigger } from "../../providers";
import { useReducedMotion } from "../../hooks";

// Context for sequence progress
interface SequenceContextType {
  progress: number;
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
}

const SequenceContext = createContext<SequenceContextType>({
  progress: 0,
  currentStep: 0,
  totalSteps: 0,
  isActive: false,
});

export const useSequence = () => useContext(SequenceContext);

// Main sequence container
interface AnimationSequenceProps {
  children: ReactNode;
  className?: string;
  steps: number; // Total number of steps/scenes in sequence
  pinDuration?: number; // How many viewport heights to pin for
  showIndicators?: boolean;
  indicatorColor?: string;
}

export const AnimationSequence = ({
  children,
  className = "",
  steps,
  pinDuration = 2,
  showIndicators = true,
  indicatorColor = "#9B5CFF",
}: AnimationSequenceProps) => {
  const { isReady } = useScrollTrigger();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Calculate current step (0-indexed)
  const currentStep = Math.min(Math.floor(progress * steps), steps - 1);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${window.innerHeight * pinDuration}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
      onEnter: () => setIsActive(true),
      onLeave: () => setIsActive(false),
      onEnterBack: () => setIsActive(true),
      onLeaveBack: () => setIsActive(false),
    });

    return () => {
      trigger.kill();
    };
  }, [isReady, prefersReducedMotion, pinDuration, steps]);

  return (
    <SequenceContext.Provider
      value={{
        progress,
        currentStep,
        totalSteps: steps,
        isActive,
      }}
    >
      <div ref={containerRef} className={`relative min-h-screen ${className}`}>
        {/* Step indicators */}
        {showIndicators && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
            {Array.from({ length: steps }).map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor:
                    currentStep >= index
                      ? indicatorColor
                      : "rgba(255,255,255,0.2)",
                  scale: currentStep === index ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </SequenceContext.Provider>
  );
};

// Step component - only visible during its step
interface SequenceStepProps {
  children: ReactNode;
  step: number; // 0-indexed step number
  className?: string;
  transition?: "fade" | "slide" | "zoom" | "none";
}

export const SequenceStep = ({
  children,
  step,
  className = "",
  transition = "fade",
}: SequenceStepProps) => {
  const { currentStep } = useSequence();
  const isVisible = currentStep === step;

  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
    zoom: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
    },
    none: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={step}
          className={`absolute inset-0 flex items-center justify-center ${className}`}
          variants={variants[transition]}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: transition === "none" ? 0 : 0.4,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimationSequence;
