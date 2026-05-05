// src/pages/HomePage.tsx

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TypingAnimation } from "../components/ui/typing-animation";
import { ScrollTextReveal } from "../components/ui/scroll-text-reveal";
import { TextAnimate } from "../components/ui/text-animate";
import { ParallaxLayer } from "../components/ui/parallax-layer";
import { FloatingParticles } from "../components/ui/floating-particles";
import { MagneticButton } from "../components/ui/magnetic-button";
import { IdentStrip } from "../components/ui/ident-strip";
import {
  ZAxisElement,
  PerspectiveContainer,
} from "../components/ui/perspective-container";
import { useScrollTo } from "../hooks";
import { useReducedMotion } from "../hooks/useReducedMotion";

const consoleLog: { tag: string; text: string }[] = [
  { tag: "building", text: "Something nobody asked for, yet." },
  { tag: "shipping", text: "AI tooling that disappears when it works." },
  { tag: "reading", text: "The Pragmatic Programmer (again)." },
  { tag: "status", text: "Open to interesting problems →" },
];

const bootLines: { tag: "BOOT" | "OK" | "READY"; text: string }[] = [
  { tag: "BOOT", text: "kernel.raj v4.2.0: initializing" },
  { tag: "OK", text: "mounting /home/raj/now" },
  { tag: "OK", text: "loading personality.so" },
  { tag: "OK", text: "caffeine subsystem online" },
];

const tagColor: Record<"BOOT" | "OK" | "READY", string> = {
  BOOT: "text-purple-400",
  OK: "text-emerald-400",
  READY: "text-pink-400",
};

type ConsolePhase = "idle" | "booting" | "wiping" | "ready";

const NowConsole = ({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState<ConsolePhase>("idle");

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setPhase("ready");
      return;
    }

    setPhase("booting");
    // Boot duration: dots (≈250ms) + boot log (≈600ms) + progress (≈400ms)
    // + READY hold (≈250ms) ≈ 1500ms. Then a 350ms wipe before prompt.
    const bootTimer = window.setTimeout(() => setPhase("wiping"), 1500);
    const readyTimer = window.setTimeout(() => setPhase("ready"), 1850);
    return () => {
      window.clearTimeout(bootTimer);
      window.clearTimeout(readyTimer);
    };
  }, [isInView, prefersReducedMotion]);

  const showBoot = phase === "booting" || phase === "wiping";
  const liveOn = phase !== "idle";
  const dotsOn = phase !== "idle";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto w-full max-w-2xl"
      role="region"
      aria-label="Currently"
    >
      <div className="relative overflow-hidden rounded-xl border border-purple-500/40 bg-black/85 backdrop-blur-md shadow-2xl shadow-purple-900/30">
        {/* Power-on flash */}
        <AnimatePresence>
          {phase === "booting" && (
            <motion.div
              key="power-flash"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, times: [0, 0.2, 1] }}
              className="pointer-events-none absolute inset-0 z-30 bg-white/40 mix-blend-screen"
            />
          )}
        </AnimatePresence>

        {/* Window chrome */}
        <div className="relative flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
          <span className="flex gap-1.5">
            {(["bg-red-500/80", "bg-yellow-500/80", "bg-green-500/80"] as const).map(
              (c, i) => (
                <motion.span
                  key={c}
                  aria-hidden="true"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    dotsOn
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 22,
                    delay: prefersReducedMotion ? 0 : 0.05 + i * 0.08,
                  }}
                  className={`h-2.5 w-2.5 rounded-full ${c}`}
                />
              ),
            )}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: dotsOn ? 1 : 0 }}
            transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.35 }}
            className="ml-3 text-[11px] font-mono text-gray-500 tracking-wider"
          >
            ~/raj/now.ts
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: liveOn ? 1 : 0.4 }}
            transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.5 }}
            className="ml-auto flex items-center gap-1.5 text-[10px] font-mono"
          >
            <span className="relative flex h-1.5 w-1.5">
              {liveOn && !prefersReducedMotion && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              )}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full transition-colors ${
                  liveOn ? "bg-emerald-400" : "bg-gray-600"
                }`}
              />
            </span>
            <span className={liveOn ? "text-emerald-400/80" : "text-gray-600"}>
              {liveOn ? "LIVE" : "OFFLINE"}
            </span>
          </motion.span>
        </div>

        {/* Body */}
        <div className="relative px-5 py-5 md:px-7 md:py-6 font-mono text-sm md:text-[15px] leading-relaxed min-h-[260px]">
          {/* Continuous scanline (post-boot ambient) */}
          {phase === "ready" && !prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          <AnimatePresence mode="wait">
            {showBoot ? (
              <motion.div
                key="boot"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="space-y-1.5"
              >
                {bootLines.map((line, i) => (
                  <motion.div
                    key={`${line.tag}-${i}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.18,
                      delay: 0.35 + i * 0.13,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-2 text-gray-400"
                  >
                    <span className={`shrink-0 ${tagColor[line.tag]}`}>
                      [ {line.tag.padEnd(5, " ")} ]
                    </span>
                    <span>{line.text}</span>
                  </motion.div>
                ))}

                {/* Progress bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + bootLines.length * 0.13 }}
                  className="flex items-center gap-3 pt-2 text-gray-500"
                >
                  <span className="text-purple-400 shrink-0">[ LOAD  ]</span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                    <motion.span
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 0.42,
                        delay: 0.35 + bootLines.length * 0.13,
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-400"
                    />
                  </span>
                </motion.div>

                {/* READY line */}
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.35 + bootLines.length * 0.13 + 0.45,
                  }}
                  className="flex items-center gap-2 pt-1 text-pink-300"
                >
                  <span className="shrink-0 text-pink-400">[ READY ]</span>
                  <span>all systems nominal</span>
                </motion.div>

                {/* Wipe, sweeping bar across the body during transition */}
                {phase === "wiping" && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ x: "-110%" }}
                    animate={{ x: "110%" }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, filter: "blur(6px)" }
                }
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {/* Prompt + typed command */}
                <div className="flex items-center gap-2 mb-4 text-gray-300">
                  <span className="text-purple-400 select-none">raj@now</span>
                  <span className="text-gray-600 select-none">:~$</span>
                  <TypingAnimation
                    duration={70}
                    delay={150}
                    startOnView={true}
                    showCursor={true}
                    blinkCursor={true}
                    cursorStyle="block"
                    className="text-white"
                  >
                    raj --status
                  </TypingAnimation>
                </div>

                {/* Output lines */}
                <div className="space-y-2">
                  {consoleLog.map((entry, i) => (
                    <motion.div
                      key={entry.tag}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 1.0 + i * 0.18,
                        ease: [0.25, 0.4, 0.25, 1],
                      }}
                      className="group flex items-baseline gap-3 hover:bg-white/[0.02] rounded px-2 -mx-2 py-0.5 transition-colors"
                    >
                      <span className="text-purple-400/70 group-hover:text-purple-300 transition-colors">
                        ▸
                      </span>
                      <span className="text-purple-400 w-20 shrink-0 text-xs uppercase tracking-wider">
                        {entry.tag}
                      </span>
                      <span className="text-gray-300">{entry.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Trailing prompt with idle cursor */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 + consoleLog.length * 0.18 + 0.2 }}
                  className="flex items-center gap-2 mt-5 text-gray-500"
                >
                  <span className="text-purple-400/70 select-none">raj@now</span>
                  <span className="text-gray-600 select-none">:~$</span>
                  <motion.span
                    aria-hidden="true"
                    animate={
                      prefersReducedMotion ? {} : { opacity: [1, 0, 1] }
                    }
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block w-2 h-4 bg-purple-400/80 translate-y-0.5"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subtle CRT/scanline gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/10"
        />
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const { scrollToSection } = useScrollTo();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full text-white">
      {/* Ambient particles span the entire Home section as a connective layer */}
      <FloatingParticles count={28} className="opacity-50" />

      {/* ── Beat 1, Identity ─────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxLayer speed={0.2} className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
          </ParallaxLayer>
        </div>

        <PerspectiveContainer
          perspective={1200}
          className="relative z-10 max-w-4xl mx-auto px-6"
        >
          <div className="text-center">
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

            <div className="max-w-2xl mx-auto px-4 py-2">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-gray-300 text-lg leading-relaxed"
                delay={0.2}
                duration={0.5}
                once={true}
              >
                I build things that matter: AI-powered tools, full-stack
                platforms, and products designed for people who don't read
                documentation. Currently studying CS & Data Science at
                UW-Madison, working on projects that sit at the intersection of
                tech, growth, and "wait, that's actually possible now?"
              </TextAnimate>
            </div>
          </div>
        </PerspectiveContainer>

        <ParallaxLayer
          speed={0.6}
          className="absolute bottom-32 right-10 pointer-events-none hidden md:block"
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
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </ParallaxLayer>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
          aria-hidden="true"
        >
          <span className="text-xs font-mono uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Beat 2, The Pitch ────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-16">
        <ParallaxLayer
          speed={-0.4}
          className="absolute -right-32 top-1/4 pointer-events-none hidden md:block"
          opacity={{ start: 0.15, end: 0.4 }}
        >
          <div className="w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-2xl" />
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.3}
          className="absolute left-0 bottom-10 pointer-events-none hidden lg:block"
          opacity={{ start: 0.1, end: 0.3 }}
        >
          <svg width="200" height="200" viewBox="0 0 100 100" className="text-purple-500/40">
            <path
              d="M 10 50 Q 30 10, 50 50 T 90 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <path
              d="M 10 60 Q 30 20, 50 60 T 90 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <path
              d="M 10 70 Q 30 30, 50 70 T 90 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
            />
          </svg>
        </ParallaxLayer>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-purple-400 font-mono text-xs md:text-sm uppercase tracking-[0.4em] mb-8 flex items-center gap-3"
          >
            <span className="h-px w-12 bg-purple-400/60" />
            What I do
          </motion.p>

          <ScrollTextReveal
            text="I build at the intersection of AI, product, and growth: tools that feel inevitable."
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white"
            direction="up"
            stagger={0.06}
            start="top 80%"
            end="top 30%"
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed"
          >
            Code is the easy part. The interesting work lives in the gap between
            what's technically possible and what someone will actually use on a
            Tuesday afternoon.
          </motion.div>
        </div>
      </div>

      {/* ── Beat 3, Currently / Quick facts / CTA ────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24">
        <ParallaxLayer
          speed={0.25}
          className="absolute inset-0 pointer-events-none"
          opacity={{ start: 0.2, end: 0.5 }}
        >
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl" />
        </ParallaxLayer>

        <div className="relative z-10 max-w-4xl w-full mx-auto">
          <NowConsole prefersReducedMotion={prefersReducedMotion} />

          {/* IDENT, editorial triptych. All motion choreography (cell
              wipe-ins, chip springs, UW stamp, cursor spotlight, ambient
              scanline, status echo) lives in IdentStrip. */}
          <IdentStrip />

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              onClick={() => scrollToSection("projects")}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
            >
              See projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollToSection("connect")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-colors"
            >
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
