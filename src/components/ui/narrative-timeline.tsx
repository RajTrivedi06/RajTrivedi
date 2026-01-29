// src/components/ui/narrative-timeline.tsx

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { Rocket, Brain, TrendingUp, Zap, Code2, Users } from "lucide-react";

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  icon: "rocket" | "brain" | "chart" | "zap" | "code" | "users";
  highlight?: boolean;
}

interface NarrativeTimelineProps {
  milestones: TimelineMilestone[];
  title?: string;
  description?: string;
  className?: string;
}

const iconMap = {
  rocket: Rocket,
  brain: Brain,
  chart: TrendingUp,
  zap: Zap,
  code: Code2,
  users: Users,
};

const MilestoneCard = ({
  milestone,
  index,
  isLast,
}: {
  milestone: TimelineMilestone;
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;
  const Icon = iconMap[milestone.icon];

  const cardContent = (
    <div
      className={cn(
        "relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6",
        "hover:border-purple-500/50 transition-all duration-300",
        "group cursor-default",
      )}
    >
      {/* Year badge */}
      <span className="inline-block px-3 py-1 text-xs font-mono text-purple-400 bg-purple-500/10 rounded-full mb-3">
        {milestone.year}
      </span>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
        {milestone.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed">
        {milestone.description}
      </p>

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <div className="flex items-start mb-12 last:mb-0">
        <div
          className={cn(
            "w-5/12",
            isEven ? "text-right pr-8" : "order-3 text-left pl-8",
          )}
        >
          {cardContent}
        </div>
        <div className="relative flex flex-col items-center order-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/25">
            <Icon className="h-6 w-6" />
          </div>
          {!isLast && (
            <div className="w-0.5 h-24 bg-gradient-to-b from-purple-500/50 to-transparent mt-2" />
          )}
        </div>
        <div className={cn("w-5/12", isEven ? "order-3" : "text-right pr-8")} />
      </div>
    );
  }

  return (
    <div ref={ref} className="flex items-start mb-12 last:mb-0">
      {/* Card - alternates sides */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={
          isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }
        }
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn(
          "w-5/12",
          isEven ? "text-right pr-8" : "order-3 text-left pl-8",
        )}
      >
        {cardContent}
      </motion.div>

      {/* Center icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative flex flex-col items-center order-2"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg",
            milestone.highlight
              ? "bg-gradient-to-br from-purple-400 to-pink-500 shadow-pink-500/25"
              : "bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/25",
          )}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
        {/* Connecting line */}
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: 96 } : { height: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent mt-2"
          />
        )}
      </motion.div>

      {/* Empty space on opposite side */}
      <div className={cn("w-5/12", isEven ? "order-3" : "text-right pr-8")} />
    </div>
  );
};

// Mobile-friendly single column timeline
const MobileMilestoneCard = ({
  milestone,
  index,
  isLast,
}: {
  milestone: TimelineMilestone;
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();
  const Icon = iconMap[milestone.icon];

  if (shouldReduceMotion) {
    return (
      <div className="flex gap-4 mb-8 last:mb-0">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg">
            <Icon className="h-5 w-5" />
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/50 to-transparent mt-2" />
          )}
        </div>
        <div className="flex-1 pb-8">
          <span className="inline-block px-2 py-0.5 text-xs font-mono text-purple-400 bg-purple-500/10 rounded-full mb-2">
            {milestone.year}
          </span>
          <h3 className="text-lg font-bold text-white mb-1">
            {milestone.title}
          </h3>
          <p className="text-sm text-gray-400">{milestone.description}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-4 mb-8 last:mb-0"
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg",
            milestone.highlight
              ? "bg-gradient-to-br from-purple-400 to-pink-500 shadow-pink-500/25"
              : "bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/25",
          )}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/50 to-transparent mt-2"
          />
        )}
      </div>
      <div className="flex-1 pb-8">
        <span className="inline-block px-2 py-0.5 text-xs font-mono text-purple-400 bg-purple-500/10 rounded-full mb-2">
          {milestone.year}
        </span>
        <h3 className="text-lg font-bold text-white mb-1">{milestone.title}</h3>
        <p className="text-sm text-gray-400">{milestone.description}</p>
      </div>
    </motion.div>
  );
};

export const NarrativeTimeline = ({
  milestones,
  title,
  description,
  className,
}: NarrativeTimelineProps) => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative min-h-screen w-full text-white px-8 pt-32 pb-12",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          animate={
            isHeaderInView || shouldReduceMotion ? { opacity: 1, y: 0 } : {}
          }
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {title && (
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* Desktop Timeline (hidden on mobile) */}
        <div className="hidden lg:block relative">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.title}
              milestone={milestone}
              index={index}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>

        {/* Mobile Timeline (hidden on desktop) */}
        <div className="lg:hidden">
          {milestones.map((milestone, index) => (
            <MobileMilestoneCard
              key={milestone.title}
              milestone={milestone}
              index={index}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NarrativeTimeline;
