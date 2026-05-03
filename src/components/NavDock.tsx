// src/components/NavDock.tsx

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  Sparkles,
  FolderKanban,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useScrollNavigationActions,
  useScrollNavigationProgress,
  useSmoothScrollProgress,
} from "../providers";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "connect", label: "Connect", icon: Send },
];

export function NavDock() {
  const { navigateToSection } = useScrollNavigationActions();
  const { activeSection } = useScrollNavigationProgress();
  const { scrollProgress } = useSmoothScrollProgress();

  const [hovered, setHovered] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -80,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="fixed top-0 left-0 right-0 flex justify-center pt-5 z-50 px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="relative">
        {/* Outer aura glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-pink-500/0 opacity-60 blur-xl"
        />

        {/* Capsule */}
        <div className="relative flex items-center gap-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-2xl px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Top sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            const isHovered = hovered === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateToSection(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered(null)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Navigate to ${label}`}
                className={cn(
                  "relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2",
                  "text-xs sm:text-sm font-medium tracking-wide select-none",
                  "transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white",
                )}
              >
                {/* Soft hover halo (under everything) */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="nav-hover"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                {/* Active "ink" pill, morphs between items */}
                {isActive && (
                  <motion.span
                    layoutId="nav-ink"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/35 via-purple-500/25 to-pink-500/30 border border-purple-400/40 shadow-[0_4px_20px_rgba(155,92,255,0.35)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                {/* Content */}
                <Icon
                  className={cn(
                    "relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200",
                    isActive && "scale-110",
                  )}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll progress hairline, sits flush with the bottom edge of the capsule */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-px w-32 sm:w-44 overflow-hidden rounded-full bg-white/[0.04]"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400/80 via-pink-400/80 to-purple-400/80"
            style={{ width: `${scrollProgress * 100}%` }}
            transition={{ ease: "linear", duration: 0.05 }}
          />
        </div>
      </div>
    </motion.nav>
  );
}

export default NavDock;
