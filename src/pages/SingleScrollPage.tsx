// src/pages/SingleScrollPage.tsx

import { useRef, useEffect } from "react";
import { useScrollNavigation } from "../providers";
import { useKeyboardNavigation } from "../hooks";
import NavDock from "../components/NavDock";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
import { ScrollProgress } from "../components/ui/scroll-progress";
import { SectionIndicator } from "../components/ui/section-indicator";

// Page components used as sections
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import SkillsPage from "./SkillsPage";
import ProjectsPage from "./ProjectsPage";
import ConnectPage from "./ConnectPage";

export default function SingleScrollPage() {
  const { registerSectionRef } = useScrollNavigation();

  // Enable keyboard navigation
  useKeyboardNavigation({ enabled: true });

  // Section refs
  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const connectRef = useRef<HTMLElement>(null);

  // Register refs with navigation provider
  useEffect(() => {
    registerSectionRef("home", homeRef);
    registerSectionRef("about", aboutRef);
    registerSectionRef("skills", skillsRef);
    registerSectionRef("projects", projectsRef);
    registerSectionRef("connect", connectRef);
  }, [registerSectionRef]);

  // Section config for side indicator
  const sectionConfig = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "connect", label: "Connect" },
  ];

  return (
    <div className="relative w-full">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Section Navigation Indicator */}
      <SectionIndicator sections={sectionConfig} />

      {/* Fixed background gradient */}
      <div className="fixed inset-0 -z-10">
        <BackgroundGradientAnimation
          className="h-full w-full"
          containerClassName="h-full w-full"
          gradientBackgroundStart="#000000"
          gradientBackgroundEnd="#000000"
          firstColor="155, 92, 255"
          secondColor="210, 130, 255"
          thirdColor="100, 220, 255"
          fourthColor="220, 50, 200"
          pointerColor="155, 92, 255"
          blendingValue="screen"
        />
      </div>

      {/* Content with semi-transparent overlay */}
      <div className="relative bg-black/40">
        {/* Navigation */}
        <NavDock />

        {/* Scroll Container */}
        <main className="relative">
          {/* Home Section */}
          <section
            ref={homeRef}
            id="home"
            aria-label="Home"
            className="relative min-h-screen"
          >
            <HomePage />
          </section>

          {/* About Section */}
          <section
            ref={aboutRef}
            id="about"
            aria-label="About"
            className="relative min-h-screen"
          >
            <AboutPage />
          </section>

          {/* Skills Section */}
          <section
            ref={skillsRef}
            id="skills"
            aria-label="Skills"
            className="relative min-h-screen"
          >
            <SkillsPage />
          </section>

          {/* Projects Section */}
          <section
            ref={projectsRef}
            id="projects"
            aria-label="Projects"
            className="relative min-h-screen"
          >
            <ProjectsPage />
          </section>

          {/* Connect Section */}
          <section
            ref={connectRef}
            id="connect"
            aria-label="Connect"
            className="relative min-h-screen"
          >
            <ConnectPage />
          </section>
        </main>
      </div>
    </div>
  );
}
