// src/components/ui/NavDock.tsx

// import React from "react";
import { Link } from "react-router-dom";

// Example: MagicUI Dock
import { Dock, DockIcon } from "@/components/ui/dock";

// Optional: ShadCN tooltip or your own tooltip
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Example icons from lucide-react
import {
  HomeIcon,
  UserIcon,
  CodeIcon,
  FolderIcon,
  MailIcon,
} from "lucide-react";

const navLinks = [
  { label: "Home", to: "/home", icon: HomeIcon },
  { label: "About", to: "/about", icon: UserIcon },
  { label: "Skills", to: "/skills", icon: CodeIcon },
  { label: "Projects", to: "/projects", icon: FolderIcon },
  // { label: "Experience", to: "/experience", icon: BriefcaseIcon },
  { label: "Connect", to: "/connect", icon: MailIcon },
];

export function NavDock() {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center py-4 bg-transparent z-50 text-white">
      <TooltipProvider>
        <Dock
          direction="middle"
          iconSize={40}
          iconMagnification={60}
          iconDistance={140}
        >
          {navLinks.map(({ label, to, icon: Icon }) => (
            <DockIcon key={label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={to}
                    aria-label={label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "w-10 h-10 p-0 flex items-center justify-center rounded-full"
                    )}
                  >
                    <Icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
}
