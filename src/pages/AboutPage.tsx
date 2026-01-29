// src/pages/AboutPage.tsx

import {
  NarrativeTimeline,
  type TimelineMilestone,
} from "../components/ui/narrative-timeline";

const milestones: TimelineMilestone[] = [
  {
    year: "2022",
    title: "The Spark",
    description:
      "Discovered the magic of turning ideas into code. Built my first full-stack app and fell in love with the craft.",
    icon: "rocket",
  },
  {
    year: "2023",
    title: "The Deep Dive",
    description:
      "Fell into the AI rabbit hole. Started building tools that think — from ML pipelines to intelligent agents.",
    icon: "brain",
  },
  {
    year: "2024",
    title: "The Bet",
    description:
      "Growth engineering is where technical depth meets business impact. Shipped products that users actually want.",
    icon: "chart",
  },
  {
    year: "Now",
    title: "The Build",
    description:
      "Shipping products designed for people who don't read documentation. No friction, just results.",
    icon: "zap",
    highlight: true,
  },
];

const AboutPage = () => {
  return (
    <NarrativeTimeline
      milestones={milestones}
      title="Behind the Code"
      description="The short story of how I think, build, and what I'm betting on."
    />
  );
};

export default AboutPage;
