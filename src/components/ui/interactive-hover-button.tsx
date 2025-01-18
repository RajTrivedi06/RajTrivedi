// src/components/magicui/interactive-hover-button.tsx
import React from "react";
import clsx from "clsx";

interface InteractiveHoverButtonProps {
  text?: string;
  className?: string;
}

const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  text = "Button",
  className,
}) => {
  return (
    <button
      className={clsx(
        // Base styles
        "relative inline-flex items-center justify-center",
        "px-8 py-4", // Increased padding
        "rounded-full border border-[#9B5CFF]",
        "text-[#9B5CFF] font-semibold text-lg leading-none",
        "bg-transparent outline-none select-none",
        "transition-all duration-300 ease-in-out transform",
        // Hover/Focus states
        "hover:bg-[#9B5CFF] hover:text-black hover:scale-105",
        "focus:ring-2 focus:ring-[#9B5CFF] focus:ring-offset-2",
        // Glow shadow
        "shadow-[0_0_10px_rgba(155,92,255,0.4)] hover:shadow-[0_0_20px_rgba(155,92,255,0.8)]",
        className // merge any custom classes
      )}
    >
      {text}
    </button>
  );
};

export default InteractiveHoverButton;
