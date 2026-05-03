// src/pages/ConnectPage.tsx

import React from "react";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MagneticButton } from "@/components/ui/magnetic-button";

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

        {/* Open to section, <mark> gives the list a machine-readable
            emphasis so assistive tech doesn't treat the color-only cue as
            plain prose (audit 02b V2). bg-transparent preserves the
            existing visual treatment. */}
        <p className="text-gray-400 text-base mb-8">
          Currently open to:{" "}
          <mark className="bg-transparent text-purple-400">
            internships, collaborations, interesting conversations
          </mark>
        </p>

        {/* Contact options row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
          {/* Email button */}
          <MagneticButton
            as="a"
            href="mailto:rajtri286@gmail.com"
            magneticStrength={0.4}
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-500
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            "
            title="Email Raj"
            aria-label="Email Raj"
          >
            <EnvelopeClosedIcon
              aria-hidden="true"
              className="w-6 h-6 group-hover:text-purple-400 transition-colors"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
              Email
            </span>
          </MagneticButton>

          {/* GitHub button */}
          <MagneticButton
            as="a"
            href="https://github.com/RajTrivedi06"
            target="_blank"
            rel="noopener noreferrer"
            magneticStrength={0.4}
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-500
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            "
            title="Visit Raj's GitHub profile"
            aria-label="Visit Raj's GitHub profile"
          >
            <GitHubLogoIcon
              aria-hidden="true"
              className="w-6 h-6 group-hover:text-purple-400 transition-colors"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
              GitHub
            </span>
          </MagneticButton>

          {/* LinkedIn button */}
          <MagneticButton
            as="a"
            href="https://www.linkedin.com/in/raj-trivedi-a28589210/"
            target="_blank"
            rel="noopener noreferrer"
            magneticStrength={0.4}
            className="
              flex flex-col items-center gap-2
              p-4
              bg-black
              border border-gray-500
              rounded-lg
              hover:bg-gray-800
              hover:border-purple-500
              transition
              group
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            "
            title="Connect on LinkedIn"
            aria-label="Connect on LinkedIn"
          >
            <LinkedInLogoIcon
              aria-hidden="true"
              className="w-6 h-6 group-hover:text-purple-400 transition-colors"
            />
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
              LinkedIn
            </span>
          </MagneticButton>

          {/* Resume button intentionally omitted until a real résumé file
              exists. Restoring: drop the PDF into public/ and render a
              MagneticButton with as="a" href="/<file>.pdf" download. */}
        </div>

        {/* Email display, gray-500 failed AA on black (4.34:1); gray-400
            is 8.27:1 (audit 02a Table 1). */}
        <p className="text-gray-400 text-sm">
          Or email me directly at{" "}
          <a
            href="mailto:rajtri286@gmail.com"
            className="text-purple-400 hover:text-purple-300 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
          >
            rajtri286@gmail.com
          </a>
        </p>
      </BackgroundGradient>
    </div>
  );
};

export default ConnectPage;
