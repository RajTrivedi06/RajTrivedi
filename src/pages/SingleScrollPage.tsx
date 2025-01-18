import React, { useEffect, useRef } from "react";
import { NavDock } from "@/components/NavDock";

// We import "page" components to use as sections
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import SkillsPage from "./SkillsPage";
import ProjectsPage from "./ProjectsPage";
import ConnectPage from "./ConnectPage";
// import ExperiencePage from "./ExperiencePage"; // commented out for now

type SingleScrollPageProps = {
  section?: keyof typeof SECTION_IDS;
};

// We'll map each route path to a string ID used in our switch
// The user can still type /Experience, but we'll comment that out in the code below
const SECTION_IDS = {
  Home: "home-section",
  About: "about-section",
  Skills: "skills-section",
  Projects: "projects-section",
  Connect: "connect-section",
  // Experience: "experience-section",
};

export default function SingleScrollPage({ section }: SingleScrollPageProps) {
  // Create refs for each section
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  // const experienceRef = useRef<HTMLDivElement>(null);

  // Scroll to the correct section (if any) whenever `section` changes
  useEffect(() => {
    if (!section) return;

    const sectionId = SECTION_IDS[section];
    if (!sectionId) return;

    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    switch (section) {
      case "Home":
        targetRef = homeRef;
        break;
      case "About":
        targetRef = aboutRef;
        break;
      case "Skills":
        targetRef = skillsRef;
        break;
      case "Projects":
        targetRef = projectsRef;
        break;
      case "Connect":
        targetRef = connectRef;
        break;
      // case "Experience":
      //   targetRef = experienceRef;
      //   break;
      default:
        break;
    }

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [section]);

  return (
    <div className="relative w-full bg-black text-white scroll-smooth">
      <NavDock />

      {/* The big vertical stack of sections */}
      <div ref={homeRef} id="home-section">
        <HomePage />
      </div>

      <div ref={aboutRef} id="about-section">
        <AboutPage />
      </div>

      <div ref={skillsRef} id="skills-section">
        <SkillsPage />
      </div>

      <div ref={projectsRef} id="projects-section">
        <ProjectsPage />
      </div>

      <div ref={connectRef} id="connect-section">
        <ConnectPage />
      </div>

      {/*
        If you want to add Experience later, just uncomment:
        <div ref={experienceRef} id="experience-section">
          <ExperiencePage />
        </div>
      */}
    </div>
  );
}
