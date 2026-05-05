// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ScrollProvider } from "./providers";
import { initBrowserFixes } from "./utils/safari-fixes";
import "./index.css";

// Apply browser-specific fixes
initBrowserFixes();

// Disable browser scroll restoration
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// On reload, force the scroll position to 0 and drop the section hash
// before React mounts. This forecloses three different ways the page
// can boot mid-document:
//   1. Browser remembers scrollY across reloads (manual mode is set
//      above, but we explicitly scroll to 0 as belt-and-suspenders).
//   2. Native anchor scroll if the URL still has `#section`.
//   3. Lenis / ScrollTrigger.refresh() picking up a non-zero starting
//      scrollY when they initialize and treating it as the rest state.
// Deep-links from elsewhere (navigation.type === "navigate") still keep
// their hash, so shared `/#projects` links continue to work.
const navEntry = performance.getEntriesByType("navigation")[0] as
  | PerformanceNavigationTiming
  | undefined;
if (navEntry?.type === "reload") {
  window.scrollTo(0, 0);
  if (window.location.hash) {
    const { pathname, search } = window.location;
    window.history.replaceState({}, "", pathname + search);
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScrollProvider>
      <App />
    </ScrollProvider>
  </React.StrictMode>
);
