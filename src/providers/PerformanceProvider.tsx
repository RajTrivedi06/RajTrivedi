// src/providers/PerformanceProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getPerformanceTier,
  getAnimationConfig,
  PerformanceTier,
  AnimationConfig,
} from "../config/performance";

interface PerformanceContextType {
  tier: PerformanceTier;
  config: AnimationConfig;
  fps: number;
  isLowFPS: boolean;
  forceReducedMotion: () => void;
  resetPerformance: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within PerformanceProvider");
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider = ({ children }: PerformanceProviderProps) => {
  const [tier, setTier] = useState<PerformanceTier>(() => getPerformanceTier());
  const [config, setConfig] = useState<AnimationConfig>(() =>
    getAnimationConfig()
  );
  const [fps, setFps] = useState(60);
  const [isLowFPS, setIsLowFPS] = useState(false);
  const [forcedReduced, setForcedReduced] = useState(false);

  // FPS monitoring
  useEffect(() => {
    if (tier === "low") return; // Don't monitor if already low

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;
    let lowFpsCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / elapsed);
        setFps(currentFps);

        // Detect sustained low FPS
        if (currentFps < 30) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            // 3 seconds of low FPS
            setIsLowFPS(true);
            // Auto-downgrade performance tier
            if (tier === "high") {
              setTier("medium");
              setConfig(getAnimationConfig("medium"));
            }
          }
        } else {
          lowFpsCount = 0;
          setIsLowFPS(false);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(rafId);
  }, [tier]);

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      if (!forcedReduced) {
        const newTier = getPerformanceTier();
        setTier(newTier);
        setConfig(getAnimationConfig(newTier));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [forcedReduced]);

  const forceReducedMotion = () => {
    setForcedReduced(true);
    setTier("low");
    setConfig(getAnimationConfig("low"));
  };

  const resetPerformance = () => {
    setForcedReduced(false);
    const newTier = getPerformanceTier();
    setTier(newTier);
    setConfig(getAnimationConfig(newTier));
  };

  return (
    <PerformanceContext.Provider
      value={{
        tier,
        config,
        fps,
        isLowFPS,
        forceReducedMotion,
        resetPerformance,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceProvider;
