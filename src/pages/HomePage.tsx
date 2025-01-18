"use client";

import React from "react";
import BoxReveal from "@/components/ui/box-reveal";

const HomePage: React.FC = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-black text-white">
      {/* Decorative SVG in the corner */}
      <div className="absolute bottom-4 right-4 opacity-80">
        <svg
          width="344"
          height="133"
          viewBox="0 0 344 133"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.4">
            <path d="M374 66.3H0" stroke="#E8E8E8" />
            <path d="M66.1504 0V132.3" stroke="#E8E8E8" />
            <path d="M112.914 112.914L19.3682 19.3682" stroke="#E8E8E8" />
            <path d="M112.914 19.3682L19.3682 112.914" stroke="#E8E8E8" />
          </g>
        </svg>
      </div>

      {/* Animated text reveals */}
      <BoxReveal boxColor="#9B5CFF" duration={0.5}>
        <h1 className="mb-4 text-8xl font-semibold">Hey, I’m Raj</h1>
      </BoxReveal>

      <BoxReveal boxColor="#9B5CFF" duration={1}>
        <h2 className="text-4xl text-right text-gray-400">
          Welcome to my Website
        </h2>
      </BoxReveal>

      <BoxReveal boxColor="#9B5CFF" duration={1.5}>
        <p className="mt-4 max-w-2xl text-left text-gray-300 text-lg">
          I’m a passionate software engineer who loves crafting interactive web
          experiences. This portfolio showcases my projects, my journey, and
          what I’m currently exploring. Take a look around and get in touch!
        </p>
      </BoxReveal>

      {/* Optionally, another reveal for NavDock or a CTA button */}
      <BoxReveal boxColor="#9B5CFF" duration={0.5}>
        <div className="mt-6"></div>
      </BoxReveal>
    </div>
  );
};

export default HomePage;
