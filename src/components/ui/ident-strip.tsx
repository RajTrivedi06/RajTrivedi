// src/components/ui/ident-strip.tsx
//
// Editorial triptych used as the third beat of HomePage. Replaces three
// repetitive icon+label+value cards with one hairline-divided ribbon and
// per-field motion treatments. Choreographed with motion/react primitives:
//
//   • clip-path "scanner" wipes for cell entrance
//   • spring-pop chip stagger w/ index-parity tilt on hover
//   • "stamp" entrance for the UW credential badge w/ wobble on hover
//   • cursor-tracked radial spotlight per cell (useMotionValue + useMotionTemplate)
//   • split-flap-style flip for the index counter ("003 · 003")
//   • useScroll-driven parallax drift on the whole ribbon
//   • ambient scanline that sweeps once a section is mounted
//
// Reduced-motion: ambient + entrance motion is suppressed; static state
// matches the final post-animation visual exactly.

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FOCUS_TAGS = ["AI", "Growth", "Product"] as const;
const COUNTER_DIGITS = ["0", "0", "3"] as const;

const SPRING_POP = { type: "spring", stiffness: 380, damping: 18 } as const;
const EASE_OUT_SOFT = [0.25, 0.4, 0.25, 1] as const;

// ── Slate header ───────────────────────────────────────────────────────
// "Ident ────── 003 · 003", a film-credit slate that boots in.

const SlateHeader = ({ reduced }: { reduced: boolean }) => {
  const letters = ["I", "d", "e", "n", "t"];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center gap-4 mb-6 md:mb-8"
    >
      {/* "Ident" letters, start tightly tracked + faded, expand to final
          tracking. Reads as a logo locking in. */}
      <motion.span
        variants={{
          hidden: { letterSpacing: "0em", opacity: 0 },
          visible: {
            letterSpacing: "0.5em",
            opacity: 1,
            transition: { duration: 0.7, ease: EASE_OUT_SOFT, delay: 0.05 },
          },
        }}
        className="text-[10px] font-mono uppercase text-purple-300 inline-flex"
        aria-label="Ident"
      >
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: 4, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.32,
                  delay: reduced ? 0 : i * 0.05,
                  ease: EASE_OUT_SOFT,
                },
              },
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>

      {/* Hairline draws in left → right */}
      <motion.span
        aria-hidden="true"
        variants={{
          hidden: { scaleX: 0 },
          visible: {
            scaleX: 1,
            transition: {
              duration: 0.9,
              delay: reduced ? 0 : 0.15,
              ease: EASE_OUT_SOFT,
            },
          },
        }}
        style={{ originX: 0 }}
        className="h-px flex-1 bg-gradient-to-r from-purple-500/60 via-white/10 to-transparent"
      />

      {/* "003 · 003" digits flip in like a split-flap board */}
      <motion.span
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: reduced ? 0 : 0.6,
              staggerChildren: reduced ? 0 : 0.06,
            },
          },
        }}
        className="text-[10px] font-mono tracking-[0.25em] text-purple-300/70 inline-flex items-center gap-1"
      >
        {COUNTER_DIGITS.map((d, i) => (
          <FlipDigit key={`a${i}`} digit={d} reduced={reduced} />
        ))}
        <span aria-hidden="true" className="px-1 text-purple-300/40">·</span>
        {COUNTER_DIGITS.map((d, i) => (
          <FlipDigit key={`b${i}`} digit={d} reduced={reduced} />
        ))}
      </motion.span>
    </motion.div>
  );
};

const FlipDigit = ({ digit, reduced }: { digit: string; reduced: boolean }) => (
  <motion.span
    variants={{
      hidden: reduced
        ? { opacity: 0 }
        : { opacity: 0, rotateX: -90, y: -6 },
      visible: reduced
        ? { opacity: 1 }
        : {
            opacity: 1,
            rotateX: 0,
            y: 0,
            transition: { type: "spring", stiffness: 320, damping: 22 },
          },
    }}
    style={{ transformStyle: "preserve-3d", transformPerspective: 600 }}
    className="inline-block tabular-nums"
  >
    {digit}
  </motion.span>
);

// ── Cell wrapper with cursor-tracked spotlight ─────────────────────────

interface IdentCellProps {
  index: "i" | "ii" | "iii";
  label: string;
  delay: number;
  reduced: boolean;
  children: React.ReactNode;
}

const IdentCell = ({
  index,
  label,
  delay,
  reduced,
  children,
}: IdentCellProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Off-screen start so the spotlight isn't visible until the user hovers.
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(168, 85, 247, 0.18), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-200);
    mouseY.set(-200);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={reduced ? undefined : handleMouseMove}
      onMouseLeave={reduced ? undefined : handleMouseLeave}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT_SOFT }}
      className="group relative bg-black/70 px-6 py-7 md:px-7 md:py-8 overflow-hidden transition-colors"
    >
      {/* Cursor spotlight */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0"
        />
      )}

      {/* Scanner wipe, reveals the cell content from left to right via
          clip-path. Sits behind text so it's a true unveiling, not a fade. */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 100%)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.7,
            delay: delay + 0.05,
            ease: EASE_OUT_SOFT,
          }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/15 via-purple-500/8 to-transparent"
        />
      )}

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-5">
        <dt className="text-[10px] font-mono uppercase tracking-[0.4em] text-purple-300">
          {label}
        </dt>
        <span
          aria-hidden="true"
          className="font-mono text-xs italic text-purple-300/40 select-none"
        >
          {index}.
        </span>
      </div>

      <div className="relative">{children}</div>

      {/* Hover hairline, draws from origin-left on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.div>
  );
};

// ── i. Focus, spring-pop chips with magnetic tilt ─────────────────────

const FocusBody = ({ reduced }: { reduced: boolean }) => (
  <motion.dd
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          delayChildren: reduced ? 0 : 0.45,
          staggerChildren: reduced ? 0 : 0.07,
        },
      },
    }}
    className="flex flex-wrap gap-1.5"
  >
    {FOCUS_TAGS.map((tag, i) => (
      <motion.span
        key={tag}
        variants={{
          hidden: reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 14, scale: 0.6, rotate: i % 2 === 0 ? -8 : 8 },
          visible: reduced
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                transition: SPRING_POP,
              },
        }}
        whileHover={
          reduced
            ? undefined
            : {
                y: -3,
                scale: 1.06,
                rotate: i % 2 === 0 ? 2 : -2,
                transition: { type: "spring", stiffness: 400, damping: 14 },
              }
        }
        className="cursor-default rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-sm font-medium text-white shadow-sm shadow-purple-900/20 backdrop-blur-sm"
      >
        {tag}
      </motion.span>
    ))}
  </motion.dd>
);

// ── ii. Studying, word-blur reveal + stamp animation for UW W ─────────

const studyingWords = ["CS", "&", "Data", "Science"];

const StudyingBody = ({ reduced }: { reduced: boolean }) => (
  <dd>
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduced ? 0 : 0.5,
            staggerChildren: reduced ? 0 : 0.08,
          },
        },
      }}
      className="text-base md:text-lg font-semibold leading-tight tracking-tight text-white"
      aria-label="CS and Data Science"
    >
      {studyingWords.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden="true"
          variants={{
            hidden: reduced
              ? { opacity: 0 }
              : { opacity: 0, y: 10, filter: "blur(8px)" },
            visible: reduced
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.45, ease: EASE_OUT_SOFT },
                },
          }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {w}
        </motion.span>
      ))}
    </motion.p>

    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-gray-400">
      {/* W badge stamps in: starts large + rotated, snaps to final */}
      <motion.span
        aria-hidden="true"
        initial={
          reduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 1.9, rotate: -18 }
        }
        whileInView={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, rotate: 0 }
        }
        viewport={{ once: true }}
        transition={
          reduced
            ? { duration: 0.2 }
            : {
                duration: 0.4,
                delay: 0.85,
                ease: [0.34, 1.56, 0.64, 1], // overshoot
              }
        }
        whileHover={
          reduced
            ? undefined
            : {
                rotate: [0, -8, 8, -4, 0],
                transition: { duration: 0.55 },
              }
        }
        className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-red-600/95 text-[10px] font-bold text-white shadow-sm shadow-red-900/40 ring-1 ring-red-300/20"
      >
        W
      </motion.span>
      <motion.span
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
        whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.4,
          delay: reduced ? 0 : 1,
          ease: EASE_OUT_SOFT,
        }}
        className="uppercase tracking-[0.18em]"
      >
        UW–Madison
      </motion.span>
    </div>
  </dd>
);

// ── iii. Status, bouncing dot + word reveal + shimmering accent ───────

const statusWords = ["Building", "things"];

const StatusBody = ({ reduced }: { reduced: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <dd
      className="flex items-start gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Live dot, primary ping always; on hover, a second concentric
          ring expands further for a satisfying "pulse harder" feel. */}
      <motion.span
        aria-hidden="true"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0 }}
        whileInView={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={
          reduced
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 360, damping: 14, delay: 0.5 }
        }
        className="relative mt-2 flex h-2 w-2 shrink-0"
      >
        {!reduced && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
        )}
        <AnimatePresence>
          {hovered && !reduced && (
            <motion.span
              key="echo"
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 4.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-emerald-300"
            />
          )}
        </AnimatePresence>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
      </motion.span>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: reduced ? 0 : 0.55,
              staggerChildren: reduced ? 0 : 0.08,
            },
          },
        }}
        className="text-base md:text-[17px] font-medium leading-snug text-white"
      >
        {statusWords.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            variants={{
              hidden: reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 8, filter: "blur(6px)" },
              visible: reduced
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.4, ease: EASE_OUT_SOFT },
                  },
            }}
            className="inline-block mr-[0.25em]"
          >
            {w}
          </motion.span>
        ))}
        {/* "that matter", accent with a continuously sweeping shimmer */}
        <motion.span
          variants={{
            hidden: reduced
              ? { opacity: 0 }
              : { opacity: 0, y: 8, filter: "blur(6px)" },
            visible: reduced
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.45, ease: EASE_OUT_SOFT },
                },
          }}
          className="inline-block font-semibold text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(110deg, #d8b4fe 0%, #f9a8d4 25%, #ffffff 50%, #f9a8d4 75%, #d8b4fe 100%)",
            backgroundSize: "200% 100%",
          }}
          {...(!reduced && {
            animate: { backgroundPosition: ["0% 50%", "200% 50%"] },
            transition: {
              duration: 4.5,
              repeat: Infinity,
              ease: "linear",
            },
          })}
        >
          that matter
        </motion.span>
      </motion.p>
    </dd>
  );
};

// ── Main strip ─────────────────────────────────────────────────────────

export const IdentStrip = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Subtle scroll parallax, ribbon drifts ±8px through the section.
  // Disabled under reduced motion.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yDrift = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    <motion.section
      ref={ref}
      aria-label="At a glance"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      style={reduced ? undefined : { y: yDrift }}
      className="mt-16 md:mt-20"
    >
      <SlateHeader reduced={reduced} />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55, delay: 0.2, ease: EASE_OUT_SOFT }}
        className="relative"
      >
        <dl className="relative grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
          <IdentCell index="i" label="Focus" delay={0.25} reduced={reduced}>
            <FocusBody reduced={reduced} />
          </IdentCell>

          <IdentCell index="ii" label="Studying" delay={0.35} reduced={reduced}>
            <StudyingBody reduced={reduced} />
          </IdentCell>

          <IdentCell index="iii" label="Status" delay={0.45} reduced={reduced}>
            <StatusBody reduced={reduced} />
          </IdentCell>
        </dl>

        {/* Ambient scanline, sweeps top → bottom every ~7s once mounted.
            Echoes the terminal scanline above, ties the two beats together. */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "linear",
              delay: 2,
            }}
            className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-300/70 to-transparent rounded-2xl"
          />
        )}
      </motion.div>
    </motion.section>
  );
};

export default IdentStrip;
