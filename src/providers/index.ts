// src/providers/index.ts

export {
  SmoothScrollProvider,
  useSmoothScrollActions,
  useSmoothScrollProgress,
} from "./SmoothScrollProvider";
export {
  ScrollTriggerProvider,
  useScrollTrigger,
} from "./ScrollTriggerProvider";
export { ScrollProvider } from "./ScrollProvider";
export {
  ScrollNavigationProvider,
  useScrollNavigationActions,
  useScrollNavigationProgress,
} from "./ScrollNavigationProvider";
export type { Section } from "./ScrollNavigationProvider";
