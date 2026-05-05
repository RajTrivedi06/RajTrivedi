// src/components/ui/editorial-project-index.tsx
//
// Editorial project showcase. Each project is rendered as a 50/50
// "spread" — image on one side, text on the other, sides alternating
// per row in the classical editorial rhythm. Type stays moderate;
// motion is restricted to a single fade-up when each spread enters
// the viewport. No sticky stage, no scroll-tied transforms — the
// brief was elegant and quiet.

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type ProjectStatus = "live" | "completed" | "development";

export interface EditorialProject {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  status: ProjectStatus;
  imageAvif: string;
  imageWebp: string;
  imageAlt: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
}

const STATUS_META: Record<
  ProjectStatus,
  { label: string; accent: string; dot: string }
> = {
  live: {
    label: "In production",
    accent: "text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.35)]",
  },
  completed: {
    label: "Shipped",
    accent: "text-sky-300",
    dot: "bg-sky-400",
  },
  development: {
    label: "In development",
    accent: "text-amber-300",
    dot: "bg-amber-400",
  },
};

interface ProjectImageProps {
  project: EditorialProject;
  eager?: boolean;
  className?: string;
}

const ProjectImage = ({ project, eager, className }: ProjectImageProps) => (
  <picture className={cn("block", className)}>
    <source srcSet={project.imageAvif} type="image/avif" />
    <source srcSet={project.imageWebp} type="image/webp" />
    <img
      src={project.imageWebp}
      alt={project.imageAlt}
      width={1200}
      height={576}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...(eager ? { fetchPriority: "high" as const } : {})}
      className="block aspect-[800/384] w-full rounded-[3px] object-cover object-center ring-1 ring-white/10 contrast-[1.02] saturate-[0.92]"
    />
  </picture>
);

interface ProjectSpreadProps {
  project: EditorialProject;
  index: number;
  total: number;
}

const ProjectSpread = ({ project, index, total }: ProjectSpreadProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const status = STATUS_META[project.status];
  const reversed = index % 2 === 1;
  const isLast = index === total - 1;

  return (
    <motion.section
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "flex flex-col gap-8 py-12",
        "md:flex-row md:items-center md:gap-12 md:py-16",
        "lg:gap-16 lg:py-20",
        reversed && "md:flex-row-reverse",
        !isLast && "border-b border-white/10",
      )}
    >
      {/* Image takes ~half the row at md+; full-width on mobile. The
          aspect ratio (800/384) is preserved by ProjectImage so the
          image height tracks column width naturally. */}
      <ProjectImage
        project={project}
        eager={index === 0}
        className="w-full md:w-1/2"
      />

      <div className="w-full md:w-1/2">
        {/* Folio: tiny mono running-head with a hairline stub to anchor
            it visually to the text column. */}
        <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-white/40">
          <span aria-hidden className="block h-px w-8 bg-white/25" />
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <h2 className="mb-5 font-serif text-[2.25rem] font-medium leading-[0.95] tracking-[-0.02em] sm:text-[2.75rem] lg:text-[3.25rem]">
          <span className="bg-gradient-to-br from-white via-white to-purple-200 bg-clip-text text-transparent">
            {project.title}
          </span>
        </h2>

        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.22em]">
          <span className={cn("inline-flex items-center gap-2", status.accent)}>
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
            />
            {status.label}
          </span>
          <span className="text-white/35">{project.subtitle}</span>
        </div>

        <p className="mb-6 max-w-[52ch] text-[15px] leading-relaxed text-white/70">
          {project.description}
        </p>

        <ul className="mb-7 flex flex-wrap items-center gap-y-1 font-mono text-[12px] text-white/55">
          {project.tech.map((tech, i) => (
            <li key={tech} className="inline-flex items-center">
              {i > 0 && (
                <span aria-hidden className="mx-3 text-white/25">
                  //
                </span>
              )}
              {tech}
            </li>
          ))}
        </ul>

        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live site`}
                className="group/cta inline-flex items-center gap-2 rounded-sm border-b border-white/30 pb-0.5 text-[15px] text-white transition-colors hover:border-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                <span>Visit live site</span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
                />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                className="inline-flex items-center gap-1.5 rounded-sm text-[13px] text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                <Github aria-hidden className="h-4 w-4" />
                <span>Source</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export interface EditorialProjectIndexProps {
  projects: EditorialProject[];
  className?: string;
}

export const EditorialProjectIndex = ({
  projects,
  className,
}: EditorialProjectIndexProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      {projects.map((p, i) => (
        <ProjectSpread
          key={p.id}
          project={p}
          index={i}
          total={projects.length}
        />
      ))}
    </div>
  );
};

export default EditorialProjectIndex;
