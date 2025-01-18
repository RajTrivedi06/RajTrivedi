// src/pages/SkillsPage.tsx

"use client"; // If you're using Next.js App Router, this is required at the top.
import React from "react";
import { WobbleCard } from "../components/ui/wobble-card";

const SkillsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white px-8 pt-60 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="flex items-center gap-8 pb-4">
          <h1 className="text-2xl sm:text-6xl font-semibold text-purple-600">
            My Digital Footprint
          </h1>
          {/* Single line across, no second border */}
          <div className="flex-1 border-t border-gray-600" />
        </div>

        {/* 2-column layout: Education (left), Skills (right) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* 1) Education */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-gray-100">
              education
            </h2>
            <ul className="space-y-3 text-gray-400 text-lg leading-relaxed">
              <li className="hover:text-white transition-colors duration-200">
                <strong>University of Wisconsin-Madison</strong>
                <br />
                B.S. in Computer Science &amp; Data Science
                <br />
                <em>Expected Graduation: May 2026</em>
              </li>
              <li className="hover:text-white transition-colors duration-200">
                <strong>Relevant Coursework:</strong>
                <br />
                Programming (Java), Data Modeling (R), Data Programming
                (Python), Intro to UI (Web Dev), Intro to Comp Engineering,
                Machine Organization &amp; Programming
              </li>
            </ul>

            {/* Work Experience Cards - moved below Education */}
            <div className="mt-12">
              <h2 className="text-3xl font-semibold mb-6 text-gray-100">
                professional experience
              </h2>

              <div className="grid grid-cols-1 md:grid-row-2 gap-6">
                {/* Experience 1: Library IT Help Desk Technician */}
                <WobbleCard
                  containerClassName="bg-black min-h-[200px] min-w-[200px] p-2 rounded-md flex flex-col justify-center"
                  className="relative w-full"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                    Library IT Help Desk Technician
                  </h3>
                  <p className="text-base sm:text-lg text-gray-200">
                    University of Wisconsin–Madison Memorial Library
                  </p>
                  <p className="mt-4 text-gray-300 leading-relaxed">
                    Provided hands-on tech support and troubleshooting, ensuring
                    efficient library operations and a smooth experience for
                    patrons. Sharpened my interpersonal and technical skills
                    while embracing a service-first mindset.
                  </p>
                </WobbleCard>

                {/* Experience 2: Full-Stack Development Intern @ Attri.ai */}
                <WobbleCard
                  containerClassName="bg-black min-h-[200px] min-w-[200px] p-2 rounded-md flex flex-col justify-center"
                  className="relative w-full"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                    Full-Stack Development Intern
                  </h3>
                  <p className="text-base sm:text-lg text-gray-200">Attri.ai</p>
                  <p className="mt-4 text-gray-300 leading-relaxed">
                    Contributed to end-to-end development using React.js and
                    NestJS, building responsive interfaces and seamless backend
                    services. Learned the art of containerization with Docker
                    and collaborated with design teams using Figma.
                  </p>
                </WobbleCard>
              </div>
            </div>
          </div>

          {/* 2) Skills */}
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-gray-100">
              skills
            </h2>

            {/* Technical Skills */}
            <h3 className="text-xl text-gray-200 mb-2">Technical Skills</h3>
            <ul className="space-y-2 text-gray-400 text-lg leading-relaxed mb-6">
              <li className="hover:text-white transition-colors duration-200">
                Full-Stack Development
              </li>
              <li className="hover:text-white transition-colors duration-200">
                React.js, CSS Frameworks, Containerization
              </li>
              <li className="hover:text-white transition-colors duration-200">
                API Integration, Version Control, UI/UX Design
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Back-End Web Development
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Cybersecurity
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Java, Python, R
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Computer Engineering Concepts
              </li>
            </ul>

            {/* Interpersonal Skills */}
            <h3 className="text-xl text-gray-200 mb-2">Interpersonal Skills</h3>
            <ul className="space-y-2 text-gray-400 text-lg leading-relaxed">
              <li className="hover:text-white transition-colors duration-200">
                Communication &amp; Team Collaboration
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Problem Solving &amp; Time Management
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Customer Service &amp; Operational Efficiency
              </li>
              <li className="hover:text-white transition-colors duration-200">
                Attention to Detail &amp; Technical Troubleshooting
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
