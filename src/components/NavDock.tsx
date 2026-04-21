// src/components/NavDock.tsx

import { Dock, DockIcon } from "@/components/ui/dock";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useScrollNavigation } from "../providers";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

// Modern icons from lucide-react
import {
  Home,
  User,
  Sparkles,
  FolderKanban,
  Send,
} from "lucide-react";

// Navigation items with section IDs
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "connect", label: "Connect", icon: Send },
];

export function NavDock() {
  const { activeSection, navigateToSection } = useScrollNavigation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide nav on scroll down, show on scroll up
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

  const handleNavClick = (sectionId: string) => {
    navigateToSection(sectionId);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="fixed top-0 left-0 right-0 flex justify-center pt-6 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <TooltipProvider delayDuration={0}>
        <Dock
          direction="middle"
          iconSize={42}
          iconMagnification={58}
          iconDistance={100}
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            const isHovered = hoveredItem === id;

            return (
              <DockIcon key={id} isActive={isActive}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleNavClick(id)}
                      onMouseEnter={() => setHoveredItem(id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      aria-label={`Navigate to ${label}`}
                      aria-current={isActive ? "page" : undefined}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "relative w-full h-full flex items-center justify-center rounded-full",
                        "transition-all duration-300 ease-out",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      {/* Hover glow effect */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 rounded-full bg-white/10"
                          />
                        )}
                      </AnimatePresence>
                      
                      {/* Icon */}
                      <Icon 
                        className={cn(
                          "relative z-10 transition-all duration-200",
                          isActive ? "w-5 h-5" : "w-[18px] h-[18px]"
                        )} 
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      
                      {/* Active dot indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-400"
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={12}>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            );
          })}
        </Dock>
      </TooltipProvider>
    </motion.nav>
  );
}

export default NavDock;
