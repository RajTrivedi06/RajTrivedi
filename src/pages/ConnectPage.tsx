// src/pages/ConnectPage.tsx

import React from "react";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const ConnectPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
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
          max-w-[1000px]
          w-full
          mx-auto
          px-4
        "
        className="
          rounded-xl
          p-8
          sm:p-12
          shadow-lg
          text-center
          bg-black
        "
      >
        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Let's Talk!</h2>

        {/* Location */}
        <p className="text-purple-400 text-lg mb-4">📍 Madison, WI</p>

        {/* Description */}
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-4 px-2 sm:px-6">
          Interested in working together or have a question? Feel free to reach
          out. I'm here to help you turn your ideas into amazing digital
          realities.
        </p>

        {/* Open to section */}
        <p className="text-gray-400 text-base mb-8">
          Currently open to:{" "}
          <span className="text-purple-400">
            internships, collaborations, interesting conversations
          </span>
        </p>

        {/* Contact options row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
          {/* Email button */}
          <a
            href="mailto:rajtri286@gmail.com"
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
            "
            title="Email"
          >
            <EnvelopeClosedIcon className="w-6 h-6 group-hover:text-purple-400" />
            <span className="text-xs text-gray-400 group-hover:text-white">
              Email
            </span>
          </a>

          {/* GitHub button */}
          <a
            href="https://github.com/RajTrivedi06"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
            "
            title="GitHub"
          >
            <GitHubLogoIcon className="w-6 h-6 group-hover:text-purple-400" />
            <span className="text-xs text-gray-400 group-hover:text-white">
              GitHub
            </span>
          </a>

          {/* LinkedIn button */}
          <a
            href="https://www.linkedin.com/in/raj-trivedi-a28589210/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
            "
            title="LinkedIn"
          >
            <LinkedInLogoIcon className="w-6 h-6 group-hover:text-purple-400" />
            <span className="text-xs text-gray-400 group-hover:text-white">
              LinkedIn
            </span>
          </a>

          {/* Resume button (placeholder) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Resume download coming soon!");
            }}
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-600
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
              cursor-pointer
            "
            title="Download Resume"
          >
            <FileTextIcon className="w-6 h-6 group-hover:text-purple-400" />
            <span className="text-xs text-gray-400 group-hover:text-white">
              Resume
            </span>
          </a>
        </div>

        {/* Email display */}
        <p className="text-gray-500 text-sm">
          Or email me directly at{" "}
          <a
            href="mailto:rajtri286@gmail.com"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            rajtri286@gmail.com
          </a>
        </p>
      </BackgroundGradient>
    </div>
  );
};

export default ConnectPage;
