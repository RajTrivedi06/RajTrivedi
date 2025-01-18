// src/components/AnimatedButton.tsx
import React from "react";

// 1. Define the prop interface
interface AnimatedButtonProps {
  onClick?: () => void;
}

// 2. Use the interface in your component definition
const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onClick }) => {
  return (
    <button
      // 3. Pass the onClick prop to the button
      onClick={onClick}
      // “group” allows child elements to animate on hover via `group-hover:...`
      className="
        group
        relative inline-flex items-center gap-[4px]
        py-6 px-12
        border-4 border-transparent
        rounded-full
        bg-inherit
        font-semibold
        text-lg
        text-[#9B5CFF]
        shadow-[0_0_0_2px_#9B5CFF]
        cursor-pointer
        overflow-hidden
        transition-colors 
        duration-300 
        ease-out
        hover:text-[#212121]
        hover:shadow-[0_0_0_12px_transparent]
        hover:rounded-[12px]
        active:scale-[0.95]
        active:shadow-[0_0_0_4px_#9B5CFF]
      "
    >
      {/* Left arrow (arr-2) */}
      <svg
        viewBox="0 0 24 24"
        className="
          absolute
          left-[-25%]
          w-8
          fill-[#9B5CFF]
          z-[9]
          transition-all
          duration-300
          ease-out
          group-hover:left-4
          group-hover:fill-[#212121]
        "
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>

      {/* Button text */}
      <span
        className="
          relative
          z-[1]
          -translate-x-3
          transition-transform
          duration-300
          ease-out
          group-hover:translate-x-3
        "
      >
        Lets get started
      </span>

      {/* Expanding circle */}
      <span
        className="
          absolute
          top-1/2 left-1/2
          w-5 h-5
          bg-[#9B5CFF]
          rounded-full
          opacity-0
          -translate-x-1/2 -translate-y-1/2
          transition-all
          duration-300
          ease-out
          group-hover:w-[220px]
          group-hover:h-[220px]
          group-hover:opacity-100
        "
      />

      {/* Right arrow (arr-1) */}
      <svg
        viewBox="0 0 24 24"
        className="
          absolute
          right-4
          w-8
          fill-[#9B5CFF]
          z-[9]
          transition-all
          duration-300
          ease-out
          group-hover:right-[-25%]
          group-hover:fill-[#212121]
        "
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
  );
};

export default AnimatedButton;
