// src/config/animations.ts

// Easing functions
export const EASINGS = {
  // Standard easings
  easeOut: "power2.out",
  easeIn: "power2.in",
  easeInOut: "power2.inOut",

  // Smooth/cinematic
  smooth: "power3.out",
  smoothIn: "power3.in",
  smoothInOut: "power3.inOut",

  // Bouncy/playful
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",

  // Sharp/snappy
  sharp: "power4.out",

  // Linear
  linear: "none",

  // Custom cubic bezier (for CSS)
  css: {
    smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Duration presets (in seconds)
export const DURATIONS = {
  instant: 0,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0,

  // Specific use cases
  fadeIn: 0.3,
  fadeOut: 0.2,
  slideIn: 0.4,
  scaleIn: 0.35,
  textReveal: 0.5,
  sectionTransition: 0.8,
  horizontalScroll: 1.2,
};

// Delay presets
export const DELAYS = {
  none: 0,
  micro: 0.05,
  small: 0.1,
  medium: 0.2,
  large: 0.4,

  // Stagger values
  staggerFast: 0.03,
  staggerNormal: 0.08,
  staggerSlow: 0.15,
};

// ScrollTrigger timing configurations
export const SCROLL_TRIGGERS = {
  // Standard content reveal
  contentReveal: {
    start: "top 85%",
    end: "top 50%",
    scrub: 0.5,
  },

  // Heading reveals (earlier trigger)
  headingReveal: {
    start: "top 90%",
    end: "top 60%",
    scrub: 0.3,
  },

  // Parallax (full viewport)
  parallax: {
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },

  // Pinned sections
  pinned: {
    start: "top top",
    scrub: 1,
  },

  // Z-axis perspective
  perspective: {
    start: "top 90%",
    end: "top 40%",
    scrub: 0.5,
  },

  // Card reveals
  cardReveal: {
    start: "top 85%",
    end: "top 55%",
    scrub: 0.4,
  },
};

// Motion variants for Framer Motion
export const MOTION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: DURATIONS.fadeIn, ease: EASINGS.css.smooth },
    },
  },

  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATIONS.slideIn, ease: EASINGS.css.smooth },
    },
  },

  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATIONS.slideIn, ease: EASINGS.css.smooth },
    },
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: DURATIONS.scaleIn, ease: EASINGS.css.bounce },
    },
  },

  staggerChildren: {
    visible: {
      transition: {
        staggerChildren: DELAYS.staggerNormal,
      },
    },
  },
};

// Tuning values for easy adjustment
export const TUNING = {
  // HomePage
  home: {
    headingReveal: {
      stagger: 0.03,
      duration: 0.8,
    },
    subtitleReveal: {
      stagger: 0.15,
      delay: 0.2,
    },
    descriptionReveal: {
      start: "top 80%",
      end: "top 45%",
    },
  },

  // AboutPage
  about: {
    pinnedDuration: 3,
    stepTransition: 0.4,
    indicatorScale: 1.5,
  },

  // ProjectsPage
  projects: {
    horizontalSpeed: 1.5,
    cardStagger: 0.1,
    cardZStart: -50,
  },

  // SkillsPage
  skills: {
    tagStagger: 0.03,
    experienceCardDelay: 0.15,
  },

  // ConnectPage
  connect: {
    zoomIntensity: 0.8,
    buttonStagger: 0.05,
    rotatingCircleSpeed: 180,
  },

  // Global
  global: {
    navDockDelay: 0.2,
    scrollDebounce: 150,
    urlUpdateDebounce: 100,
  },
};
