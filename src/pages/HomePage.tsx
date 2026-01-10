// src/pages/HomePage.tsx

import { TypingAnimation } from "../components/ui/typing-animation";
import { ScrollTextReveal } from "../components/ui/scroll-text-reveal";
import { TextAnimate } from "../components/ui/text-animate";
import { ParallaxLayer } from "../components/ui/parallax-layer";
import {
  ZAxisElement,
  PerspectiveContainer,
} from "../components/ui/perspective-container";

const HomePage = () => {
  return (
    <div className="relative w-full text-white">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background decorative elements with parallax */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Slow-moving background circles */}
          <ParallaxLayer speed={0.2} className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
          </ParallaxLayer>
        </div>

        {/* Main content with perspective */}
        <PerspectiveContainer
          perspective={1200}
          className="relative z-10 max-w-4xl mx-auto px-6"
        >
          <div className="text-center">
            {/* Main heading - typing animation */}
            <ZAxisElement
              zStart={-200}
              zEnd={0}
              opacityStart={0}
              opacityEnd={1}
              start="top 90%"
              end="top 50%"
            >
              <TypingAnimation
                className="text-6xl md:text-8xl font-bold text-white mb-4 block"
                duration={80}
                delay={300}
                startOnView={true}
                showCursor={true}
                blinkCursor={true}
                cursorStyle="line"
                as="h1"
              >
                Hey, I'm Raj
              </TypingAnimation>
            </ZAxisElement>

            {/* Subheading - word reveal */}
            <ZAxisElement
              zStart={-150}
              zEnd={0}
              opacityStart={0}
              opacityEnd={1}
              start="top 85%"
              end="top 45%"
            >
              <ScrollTextReveal
                text="Builder. Growth Engineer."
                className="text-2xl md:text-4xl text-gray-400 mb-8 justify-center"
                direction="up"
                stagger={0.15}
              />
            </ZAxisElement>

            {/* Description - TextAnimate with blurInUp animation */}
            <div className="max-w-2xl mx-auto px-4 py-2">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-gray-300 text-lg leading-relaxed"
                delay={0.2}
                duration={0.5}
                once={true}
              >
                I build things that matter — AI-powered tools, full-stack
                platforms, and products designed for people who don't read
                documentation. Currently studying CS & Data Science at
                UW-Madison, working on projects that sit at the intersection of
                tech, growth, and "wait, that's actually possible now?"
              </TextAnimate>
            </div>
          </div>
        </PerspectiveContainer>

        {/* Foreground parallax element - decorative SVG */}
        <ParallaxLayer
          speed={0.6}
          className="absolute bottom-10 right-10 pointer-events-none"
          opacity={{ start: 0.2, end: 0.6 }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            className="text-purple-500/30"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line
              x1="50"
              y1="10"
              x2="50"
              y2="90"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line
              x1="10"
              y1="50"
              x2="90"
              y2="50"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </ParallaxLayer>
      </section>
    </div>
  );
};

export default HomePage;
