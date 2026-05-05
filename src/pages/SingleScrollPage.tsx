// src/pages/SingleScrollPage.tsx

import { useRef, useEffect } from "react";
import { useScrollNavigationActions } from "../providers";
import NavDock from "../components/NavDock";
import { KeyboardNavigator } from "../components/KeyboardNavigator";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
import { ScrollProgress } from "../components/ui/scroll-progress";

// Page components used as sections
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import SkillsPage from "./SkillsPage";
import ProjectsPage from "./ProjectsPage";
import ConnectPage from "./ConnectPage";

export default function SingleScrollPage() {
  // Actions only, registerSectionRef identity never changes, so this
  // component no longer rerenders on scroll frames (audit 05 PD1).
  const { registerSectionRef } = useScrollNavigationActions();

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

  return (
    <div className="relative w-full">
      {/* Keyboard navigation, isolated so its per-frame rerender (from
          reading activeSection) doesn't cascade through the page subtree. */}
      <KeyboardNavigator />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

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

          {/* Connect Section. Intentionally NOT `min-h-screen`: the
              composer + directory are shorter than a viewport, and as the
              last section there's nothing below to scroll into. Forcing a
              100vh minimum was leaving a long band of empty background
              under the cards. */}
          <section
            ref={connectRef}
            id="connect"
            aria-label="Connect"
            className="relative"
          >
            <ConnectPage />
          </section>
        </main>
      </div>
    </div>
  );
}
