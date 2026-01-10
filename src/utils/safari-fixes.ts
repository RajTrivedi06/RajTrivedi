// src/utils/safari-fixes.ts

import { getBrowserInfo } from "./browser";

export const applySafariFixes = (): void => {
  const { isSafari, isIOS } = getBrowserInfo();

  if (!isSafari && !isIOS) return;

  // Fix 100vh issue on iOS Safari
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  setVH();
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", () => {
    setTimeout(setVH, 100);
  });

  // Add Safari-specific class to body
  document.body.classList.add("is-safari");

  if (isIOS) {
    document.body.classList.add("is-ios");
  }
};

// Call on app init
export const initBrowserFixes = (): void => {
  if (typeof window === "undefined") return;

  applySafariFixes();

  // Add browser info classes to body
  const { name, isMobile } = getBrowserInfo();
  document.body.classList.add(`browser-${name.toLowerCase()}`);

  if (isMobile) {
    document.body.classList.add("is-mobile");
  }
};
