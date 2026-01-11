// src/pages/LandingPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { usePageTransition } from "@/components/PageTransition";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { startTransition } = usePageTransition();

  const navigateHome = () => {
    // Start the transition animation
    startTransition();

    // Navigate after a brief delay to allow animation to start
    setTimeout(() => {
      navigate("/Home");
    }, 50);
  };

  return (
    <BackgroundGradientAnimation
      className="relative h-screen w-full"
      gradientBackgroundStart="#000000"
      gradientBackgroundEnd="#000000"
      firstColor="155, 92, 255"
      secondColor="210, 130, 255"
      thirdColor="100, 100, 255"
      fourthColor="220, 50, 200"
      pointerColor="155, 92, 255"
      blendingValue="hard-light"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* CTA button that takes user to /Home */}
        <div onClick={navigateHome}>
          <InteractiveHoverButton
            text="Welcome, Let's get started"
            className="px-12 py-6 text-xl"
          />
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default LandingPage;
