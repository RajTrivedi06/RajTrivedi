// src/utils/browser.ts

export interface BrowserInfo {
  name: string;
  version: string;
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isIE: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export const getBrowserInfo = (): BrowserInfo => {
  if (typeof navigator === "undefined") {
    return {
      name: "unknown",
      version: "0",
      isChrome: false,
      isFirefox: false,
      isSafari: false,
      isEdge: false,
      isIE: false,
      isMobile: false,
      isIOS: false,
      isAndroid: false,
    };
  }

  const ua = navigator.userAgent;

  const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isEdge = /Edge|Edg/.test(ua);
  const isIE = /MSIE|Trident/.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid || /Mobile/.test(ua);

  let name = "unknown";
  let version = "0";

  if (isChrome) {
    name = "Chrome";
    version = ua.match(/Chrome\/(\d+)/)?.[1] || "0";
  } else if (isFirefox) {
    name = "Firefox";
    version = ua.match(/Firefox\/(\d+)/)?.[1] || "0";
  } else if (isSafari) {
    name = "Safari";
    version = ua.match(/Version\/(\d+)/)?.[1] || "0";
  } else if (isEdge) {
    name = "Edge";
    version = ua.match(/(?:Edge|Edg)\/(\d+)/)?.[1] || "0";
  }

  return {
    name,
    version,
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    isIE,
    isMobile,
    isIOS,
    isAndroid,
  };
};

// Browser-specific feature checks
export const supportsBackdropFilter = (): boolean => {
  return CSS.supports("backdrop-filter", "blur(10px)");
};

export const supportsSmoothScroll = (): boolean => {
  return "scrollBehavior" in document.documentElement.style;
};

export const supportsIntersectionObserver = (): boolean => {
  return "IntersectionObserver" in window;
};

export const supportsResizeObserver = (): boolean => {
  return "ResizeObserver" in window;
};
