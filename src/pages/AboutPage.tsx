// src/pages/AboutPage.tsx
import {
  HeroParallax,
  type HeroParallaxItem,
} from "../components/ui/hero-parallax";

const heroParallaxItems: HeroParallaxItem[] = [
  {
    title: "Origin Story",
    description:
      "Chased the hype, stayed for the craft. CS + Data Science at UW-Madison, class of 2026.",
    demo: "menu",
  },
  {
    title: "The Bet I'm Making",
    description:
      "Growth engineering blends product, distribution, and systems. The best builders ship with context.",
    demo: "timeline",
  },
  {
    title: "How I Build",
    description:
      "Clarity over confusion. Remove friction before features and make onboarding simple.",
    demo: "status",
  },
  {
    title: "Bridge Builder",
    description:
      "I translate between technical depth and business outcomes, and prototype fast.",
    demo: "stack",
  },
  {
    title: "Beyond the Code",
    description:
      "Sports, music, and the engineering behind iconic fashion pieces.",
    demo: "emoji",
  },
  {
    title: "Let's Build Something",
    description:
      "Open to internships, collaborations, and interesting conversations.",
    demo: "urgent",
  },
];

const AboutPage = () => {
  return (
    <HeroParallax
      items={heroParallaxItems}
      title="Behind the Code"
      description="The short story of how I think, build, and what I am betting on."
    />
  );
};

export default AboutPage;
