// src/pages/ConnectPage.tsx
//
// Editorial "Dispatch" contact terminal. Echoes the ident-strip + now-console
// aesthetic of HomePage: hairline-divided cells, mono labels at heavy
// tracking, cursor-tracked spotlights, scanner-wipe entrances, and small
// motion choreography.
//
// Beats:
//   • Slate header with a live Madison clock (split-flap minute tick)
//   • Compose card — copy email triggers TRANSMITTED stamp + flash sweep;
//     magnetic Send → mailto
//   • Three channel cells (Direct / Code / Network) with cursor spotlight
//   • Coordinates footer
//   • DottedSurface — Three.js point grid undulating on two interfering
//     sine waves, scoped to the section as ambient "open channel" noise
//
// Reduced-motion: ambient + entrance motion suppressed; static state matches
// the final post-animation visual.

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";

// Brand icons inlined — lucide-react has deprecated its Github/Linkedin
// glyphs and recommends using authoritative brand SVGs instead.
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.4.98.01 1.97.14 2.89.4 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.55C20.22 21.39 23.5 17.07 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);
import { useEffect, useRef, useState } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EMAIL = "rajtri286@gmail.com";
const SUBJECT = "From rajtrivedi.com";

const EASE = [0.25, 0.4, 0.25, 1] as const;
const STAMP_SPRING = { type: "spring", stiffness: 320, damping: 14 } as const;

interface Channel {
  num: string;
  band: string;
  label: string;
  handle: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const CHANNELS: Channel[] = [
  {
    num: "01",
    band: "Direct",
    label: "Email",
    handle: "rajtri286@gmail.com",
    href: `mailto:${EMAIL}`,
    Icon: Mail,
  },
  {
    num: "02",
    band: "Code",
    label: "Github",
    handle: "@RajTrivedi06",
    href: "https://github.com/RajTrivedi06",
    Icon: GithubIcon,
  },
  {
    num: "03",
    band: "Network",
    label: "Linkedin",
    handle: "raj-trivedi-a28589210",
    href: "https://www.linkedin.com/in/raj-trivedi-a28589210/",
    Icon: LinkedinIcon,
  },
];

// ── Live Madison clock ─────────────────────────────────────────────────
// Aligns the first tick to the next wall-clock minute so the displayed
// minute and the user's actual minute don't drift across mounts.

const formatMadison = (d: Date) => {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  const tz =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      timeZoneName: "short",
    })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value ?? "CDT";
  return { time, tz };
};

const useMadisonTime = () => {
  const [parts, setParts] = useState(() => formatMadison(new Date()));
  useEffect(() => {
    let intervalId: number | undefined;
    const tick = () => setParts(formatMadison(new Date()));
    const now = new Date();
    const msToNext = 60_000 - now.getSeconds() * 1000 - now.getMilliseconds();
    const timeoutId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 60_000);
    }, msToNext);
    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);
  return parts;
};

// ── Slate header ───────────────────────────────────────────────────────

const Slate = ({ reduced }: { reduced: boolean }) => {
  const { time, tz } = useMadisonTime();
  const [hh, mm] = time.split(":");
  const letters = ["D", "i", "s", "p", "a", "t", "c", "h"];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-10"
    >
      <motion.span
        variants={{
          hidden: { letterSpacing: "0em", opacity: 0 },
          visible: {
            letterSpacing: "0.5em",
            opacity: 1,
            transition: { duration: 0.7, ease: EASE, delay: 0.05 },
          },
        }}
        className="inline-flex font-mono text-[10px] uppercase text-purple-300"
        aria-label="Dispatch"
      >
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            aria-hidden
            variants={{
              hidden: { opacity: 0, y: 4, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.32,
                  delay: reduced ? 0 : i * 0.04,
                  ease: EASE,
                },
              },
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>

      <motion.span
        aria-hidden
        variants={{
          hidden: { scaleX: 0 },
          visible: {
            scaleX: 1,
            transition: { duration: 0.9, delay: reduced ? 0 : 0.15, ease: EASE },
          },
        }}
        style={{ originX: 0 }}
        className="hidden h-px flex-1 bg-gradient-to-r from-purple-500/60 via-white/10 to-transparent sm:block"
      />

      <motion.span
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.55, duration: 0.4 } },
        }}
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-purple-300/70"
      >
        <span className="relative flex h-1.5 w-1.5">
          {!reduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-emerald-400/80">LIVE</span>
        <span className="text-purple-300/40">·</span>
        <span className="text-white/85">
          <FlipClock hh={hh} mm={mm} reduced={reduced} />
        </span>
        <span className="text-purple-300/40">{tz}</span>
        <span className="text-purple-300/40">·</span>
        <span className="text-white/60">MADISON</span>
      </motion.span>
    </motion.div>
  );
};

const FlipClock = ({
  hh,
  mm,
  reduced,
}: {
  hh: string;
  mm: string;
  reduced: boolean;
}) => (
  <span className="inline-flex items-center">
    <span>{hh}</span>
    <span className="px-0.5 text-purple-300/40">:</span>
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={mm}
        initial={reduced ? { opacity: 0 } : { opacity: 0, rotateX: -90, y: -4 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, rotateX: 0, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, rotateX: 90, y: 4 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        style={{ transformPerspective: 600, display: "inline-block" }}
      >
        {mm}
      </motion.span>
    </AnimatePresence>
  </span>
);

// ── Compose card ───────────────────────────────────────────────────────

const ComposeCard = ({ reduced }: { reduced: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(168,85,247,0.18), transparent 70%)`;

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  const handleLeave = () => {
    mouseX.set(-300);
    mouseY.set(-300);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Clipboard API may be blocked; surface state anyway so the user
      // sees feedback and can fall back to selecting the visible text.
    }
    setCopied(true);
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(
    () => () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-purple-400/30 bg-black/75 shadow-[0_0_70px_-24px_rgba(139,92,246,0.55)] backdrop-blur-xl"
    >
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0"
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.22),transparent_45%),radial-gradient(circle_at_82%_82%,rgba(236,72,153,0.16),transparent_40%)]"
      />

      {/* Window chrome bar — terminal echo of NowConsole */}
      <div className="relative flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-300/70">
        <span className="inline-flex items-center gap-2">
          <Send aria-hidden className="h-3 w-3" />
          Compose Transmission
        </span>
        <span className="text-purple-300/35">~/dispatch.tx</span>
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <h2 className="font-serif text-[2.25rem] font-medium leading-[0.98] tracking-[-0.02em] sm:text-[3.5rem]">
          <span className="bg-gradient-to-br from-white via-white to-purple-200 bg-clip-text text-transparent">
            Open a channel.
          </span>
        </h2>
        <p className="mt-4 max-w-md text-base text-white/65 sm:text-lg">
          Best for collaborations, internships, and projects worth losing a
          weekend over. Replies usually land within a day.
        </p>

        <div className="mt-8 grid gap-4">
          {/* TO row with copy */}
          <div className="flex items-stretch gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-purple-400/40">
            <div className="flex shrink-0 items-center px-2 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-300/80">
              To
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 border-l border-white/10 px-3">
              <Mail aria-hidden className="h-4 w-4 shrink-0 text-purple-300" />
              <span className="truncate font-mono text-sm text-white/95 sm:text-base">
                {EMAIL}
              </span>
            </div>
            <button
              type="button"
              onClick={onCopy}
              aria-label={copied ? "Email copied" : "Copy email address"}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-1.5 text-emerald-300"
                  >
                    <Check aria-hidden className="h-3.5 w-3.5" />
                    Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Copy aria-hidden className="h-3.5 w-3.5" />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
              Tap Send — your mail client opens, prefilled.
            </div>
            <MagneticButton
              as="a"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              <Send aria-hidden className="h-4 w-4" />
              Send
              <ArrowUpRight
                aria-hidden
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* TRANSMITTED stamp + flash sweep on copy */}
      <AnimatePresence>
        {copied && !reduced && (
          <>
            <motion.div
              key="flash"
              aria-hidden
              initial={{ x: "-110%" }}
              animate={{ x: "120%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-300/15 to-transparent"
            />
            <motion.div
              key="stamp"
              aria-hidden
              initial={{ opacity: 0, scale: 1.7, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              exit={{ opacity: 0, scale: 0.94, rotate: -8 }}
              transition={STAMP_SPRING}
              className="pointer-events-none absolute right-6 top-16 select-none rounded-md border-2 border-emerald-300/80 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-300/90"
            >
              Transmitted ✓
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative border-t border-white/10 bg-white/[0.02] px-5 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        <span className="text-emerald-400/70">▸</span> ready to receive ·
        rate-limited only by my coffee intake
      </div>
    </motion.div>
  );
};

// ── Channel cell ───────────────────────────────────────────────────────

const ChannelCell = ({
  num,
  band,
  label,
  handle,
  href,
  Icon,
  delay,
  reduced,
}: Channel & { delay: number; reduced: boolean }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(168,85,247,0.18), transparent 70%)`;

  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  const handleLeave = () => {
    mouseX.set(-200);
    mouseY.set(-200);
  };

  const isExternal = href.startsWith("http");

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className="group relative flex h-full flex-col justify-between overflow-hidden bg-black/70 px-6 py-7 transition-colors md:px-7 md:py-8"
    >
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      {!reduced && (
        <motion.div
          aria-hidden
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 100%)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: delay + 0.05, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/15 via-purple-500/[0.08] to-transparent"
        />
      )}

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-300">
          CH {num} · {band}
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-300"
        />
      </div>

      <div className="relative mt-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            <Icon className="h-5 w-5 text-purple-300/80" />
            {label}
          </div>
          <div className="mt-1 truncate font-mono text-xs text-white/45">
            {handle}
          </div>
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.a>
  );
};

// ── Page ───────────────────────────────────────────────────────────────

const ConnectPage: React.FC = () => {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full overflow-hidden px-4 py-14 text-white sm:px-8 sm:py-20">
      {/* Ambient backdrop, scoped to this section. Sits behind all content
          via -z-10 and is masked at the edges so it fades into the global
          gradient rather than ending in a hard line. */}
      <DottedSurface
        className="[mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Slate reduced={reduced} />

        <ComposeCard reduced={reduced} />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-10 md:mt-12"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-purple-300/80">
            Channels
            <span
              aria-hidden
              className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent"
            />
            <span className="text-purple-300/40">003</span>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-3">
            {CHANNELS.map((c, i) => (
              <ChannelCell
                key={c.num}
                {...c}
                delay={0.25 + i * 0.08}
                reduced={reduced}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-purple-300/70">⌖</span>
            43.0731° N · 89.4012° W · Madison, WI
          </span>
          <span>© {new Date().getFullYear()} · Raj Trivedi</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ConnectPage;
