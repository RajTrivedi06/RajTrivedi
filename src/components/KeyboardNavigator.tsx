// src/components/KeyboardNavigator.tsx

import { useKeyboardNavigation } from "../hooks";

// Isolated host for useKeyboardNavigation, which reads activeSection from
// ScrollNavigationProgress and therefore rerenders on every scroll frame.
// Rendering this as a small sibling (instead of calling the hook directly
// in SingleScrollPage) keeps the per-frame rerender from cascading into
// the whole page subtree (HomePage, AboutPage, SkillsPage, …).
export function KeyboardNavigator() {
  useKeyboardNavigation({ enabled: true });
  return null;
}

export default KeyboardNavigator;
