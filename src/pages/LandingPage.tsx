// src/pages/LandingPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
// If you want the optional ripple:

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    // This will navigate to /Home,
    // which loads SingleScrollPage and auto-scrolls to Home section
    navigate("/Home");
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
      fifthColor="60, 60, 60"
      pointerColor="155, 92, 255"
      blendingValue="hard-light"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* OPTIONAL ripple 
        <div className="absolute inset-0 pointer-events-none">
          <Ripple
            mainCircleSize={210}
            mainCircleOpacity={0.24}
            numCircles={8}
            className="my-landing-ripple"
          />
        </div>
        */}

        {/* The big button that takes user to /Home */}
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
