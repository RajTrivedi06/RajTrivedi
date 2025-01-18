// src/pages/AboutPage.tsx
import React from "react";
import {
  HeartFilledIcon,
  CrumpledPaperIcon,
  MixerVerticalIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

const AboutPage: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen w-full bg-black text-white px-8 py-20">
      {/* Page heading on the right, line on the left */}
      <div className="flex items-center gap-8 pb-4 w-full justify-end mb-12">
        {/* The line across */}
        <div className="flex-1 border-t border-gray-600" />
        {/* Larger heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-purple-700 whitespace-nowrap">
          Behind the Code
        </h1>
      </div>

      {/* About Me Section */}
      <section className="mb-12 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4 flex items-center">
          <HeartFilledIcon className="mr-2 text-purple-500" />
          About Me
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          Yo, what’s poppin’? I’m <strong>Raj Trivedi</strong>, a Computer
          Science and Data Science student at UW–Madison, grinding till May
          2026. Yeah, I got coding skills, but more importantly, I got a big
          vision. I see myself stepping up as a founder one day, leading with
          fresh ideas and turning raw data into real impact.
        </p>
      </section>

      {/* My Values and Aspirations Section */}
      <section className="mb-12 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4 flex items-center">
          <CrumpledPaperIcon className="mr-2 text-purple-500" />
          My Values and Aspirations
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          I’m all about that forward-thinking hustle: pushing boundaries,
          learning relentlessly, and never settling for “good enough.” I believe
          in merging creativity and technology, using data to light the path to
          bold new solutions. Someday, I want to stand at the helm of a startup
          that flips the script on how we interact with tech—bridging user needs
          and next-level innovation.
        </p>
      </section>

      {/* Why I Do What I Do Section */}
      <section className="mb-12 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4 flex items-center">
          <MixerVerticalIcon className="mr-2 text-purple-500" />
          Why I Do What I Do
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          Building something that matters, that’s the dream. Whether it’s
          designing smooth user experiences or uncovering insights from complex
          data, I’m fueled by the chance to connect dots people didn’t even know
          existed. At the end of the day, it’s about making a difference and
          empowering others to do the same.
        </p>
      </section>

      {/* Let’s Build the Future Section */}
      <section className="mb-12 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4 flex items-center">
          <RocketIcon className="mr-2 text-purple-500" />
          Let’s Build the Future
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          I’m always down to connect with like-minded folks who share the same
          passion for creating and evolving. If you vibe with pushing limits,
          chasing fresh perspectives, and making real-world impact, let’s link
          up—together, we’ll spark the change we want to see.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
