// src/pages/ConnectPage.tsx

import React from "react";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const ConnectPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center text-white overflow-hidden">
      {/* Left ellipse */}
      <div
        className="
          absolute
          w-[277px]
          h-[277px]
          border-[19px]
          border-[#5EE2FF]
          left-[-148px]
          top-[395px]
          rounded-full
        "
      />

      {/* Right ellipse */}
      <div
        className="
          absolute
          w-[277px]
          h-[277px]
          border-[19px]
          border-[#9B5CFF]
          right-[-35px]
          bottom-[-80px]
          rounded-full
        "
      />

      {/* Main card container with an animated gradient "border" */}
      <BackgroundGradient
        animate
        containerClassName="
          relative
          max-w-[1000px]  /* Increased max width from 800px to 1000px */
          w-full
          mx-auto
        "
        className="
          rounded-xl
          p-12                /* Increased padding for a bigger card area */
          shadow-lg
          text-center
          bg-black
        "
      >
        {/* Title */}
        <h2 className="text-5xl font-bold mb-6">Let&rsquo;s Talk!</h2>

        {/* Description */}
        <p className="text-gray-300 text-xl leading-relaxed mb-8 px-6">
          Interested in working together or have a question? Feel free to reach
          out. I’m here to help you turn your ideas into amazing digital
          realities. Looking forward to hearing from you soon!
        </p>

        {/* Contact options row */}
        <div className="flex flex-wrap justify-center gap-10">
          {/* Email button */}
          <a
            href="mailto:rstrivedi2@gmail.com"
            className="
              flex items-center gap-2
              p-4                  /* Larger padding for bigger buttons */
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              transition
            "
          >
            <EnvelopeClosedIcon className="w-6 h-6" />
          </a>

          {/* GitHub button */}
          <a
            href="https://github.com/RajTrivedi06"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              p-4
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              transition
            "
          >
            <GitHubLogoIcon className="w-6 h-6" />
          </a>

          {/* LinkedIn button */}
          <a
            href="https://www.linkedin.com/in/raj-trivedi-a28589210/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              p-4
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              transition
            "
          >
            <LinkedInLogoIcon className="w-6 h-6" />
          </a>
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default ConnectPage;
