import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// Project images: 800×384 (2× the 400×192 render size), AVIF with WebP fallback.
import TranslaliaAvif from "@/assets/projects/translalia.avif";
import TranslaliaWebp from "@/assets/projects/translalia.webp";
import CourseSearchAvif from "@/assets/projects/coursesearch.avif";
import CourseSearchWebp from "@/assets/projects/coursesearch.webp";
import MyCosmosJobsAvif from "@/assets/projects/mycosmosjobs.avif";
import MyCosmosJobsWebp from "@/assets/projects/mycosmosjobs.webp";

// Project data with links.
//
// `liveUrl` and `githubUrl` both use `string | null | undefined`:
// - `string`  → render the affordance.
// - `null`    → explicit "no repo / no public site for this project yet"
//               (distinct from the field being missing; the null signals
//               we considered the decision, not that we forgot).
// - absent    → same effect as null at render time.
// The JSX renders a control only when the value is a non-empty string,
// so projects with no URLs simply ship with no external-link buttons.
interface Project {
  id: number;
  title: string;
  status: "live" | "completed" | "development";
  subtitle: string;
  description: string;
  imageAvif: string;
  imageWebp: string;
  imageAlt: string;
  tech: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Translalia",
    status: "live",
    subtitle: "Oxford University AIDCPT Project",
    description:
      "AI poetry-translation workspace for students (ages 12-16) focused on translator agency and cultural nuance. Features preference-driven prompting generating multiple translation variants across language varieties.",
    imageAvif: TranslaliaAvif,
    imageWebp: TranslaliaWebp,
    imageAlt: "Translalia - AI Poetry Translation",
    tech: ["Next.js", "React", "TypeScript", "Supabase", "GPT-4/5", "Redis"],
    liveUrl: null,
    githubUrl: null,
  },
  {
    id: 2,
    title: "MadHelp",
    status: "completed",
    subtitle: "AI Course Planning Assistant",
    description:
      "Full-stack AI-powered course planning assistant for UW-Madison students. Features intelligent course recommendations, research lab matching, and interactive prerequisite graph visualization. Semantic search across 200+ labs and thousands of courses.",
    imageAvif: CourseSearchAvif,
    imageWebp: CourseSearchWebp,
    imageAlt: "MadHelp - AI Course Planning",
    tech: ["FastAPI", "Next.js 15", "OpenAI API", "Python"],
    githubUrl: null,
  },
  {
    id: 3,
    title: "MyCosmosJobs",
    status: "development",
    subtitle: "Cosmos Manpower Pvt. Ltd.",
    description:
      "Full-stack job portal rebuild with automated data pipelines, ETL processes, and digital marketing automation tools for high-volume recruitment operations in Gujarat, India.",
    imageAvif: MyCosmosJobsAvif,
    imageWebp: MyCosmosJobsWebp,
    imageAlt: "MyCosmosJobs Portal",
    tech: ["Full-Stack", "ETL", "Automation"],
  },
];

// Status gets three coordinated channels (colored dot + uppercase micro-caps
// label + muted subtitle) so it never relies on color alone — the tokens
// satisfy §1.4.1 and read as editorial meta, not a loud pill.
const STATUS_META: Record<
  Project["status"],
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

// -- ProjectRow ---------------------------------------------------------
//
// One full-width editorial row per project. Controls live inline at the
// bottom and are always focusable; no affordance hides behind hover. A row
// with neither liveUrl nor githubUrl simply omits the action block
// entirely — no disabled buttons, no dead anchors.

const ProjectRow: React.FC<{
  project: Project;
  index: number;
  total: number;
  isAboveFold: boolean;
}> = ({ project, index, total, isAboveFold }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-120px" });
  const hasAnyUrl = Boolean(project.liveUrl || project.githubUrl);
  const status = STATUS_META[project.status];

  // Reduced-motion users get no entrance animation — content is in its
  // final position on first paint. Everyone else gets a brief rise+fade.
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
        transition: {
          duration: 0.7,
          ease: [0.22, 0.61, 0.36, 1] as const,
        },
      };

  return (
    <motion.article
      ref={ref}
      {...motionProps}
      className="group relative grid gap-x-10 gap-y-6 border-b border-white/15 py-14 first:pt-2 last:border-b-0 md:grid-cols-[auto_1fr]"
    >
      {/* Editorial index: 01 / 03. Decorative — hidden from AT. */}
      <span
        aria-hidden
        className="font-mono text-[11px] tracking-[0.35em] text-white/40 md:self-start md:pt-3"
      >
        {String(index + 1).padStart(2, "0")}
        &nbsp;/&nbsp;
        {String(total).padStart(2, "0")}
      </span>

      <div className="space-y-6">
        {/* Eyebrow: status + subtitle */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.22em]">
          <span
            className={cn(
              "inline-flex items-center gap-2",
              status.accent,
            )}
          >
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
            />
            {status.label}
          </span>
          <span className="text-white/35">{project.subtitle}</span>
        </div>

        {/* Display title — system serif stack via Tailwind's font-serif.
            A later pass can swap in a variable face (Fraunces / Newsreader)
            via tailwind.config.js without touching this file. */}
        <h2 className="font-serif text-[2.5rem] font-medium leading-[0.95] tracking-[-0.02em] sm:text-[3.5rem]">
          <span className="bg-gradient-to-br from-white via-white to-purple-200 bg-clip-text text-transparent">
            {project.title}
          </span>
        </h2>

        {/* Lede */}
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-white/70">
          {project.description}
        </p>

        {/* Image strip — subdued, supporting role. Desaturated by default;
            returns to full saturation on hover as a quiet reward, not a
            requirement for any action. */}
        <picture>
          <source srcSet={project.imageAvif} type="image/avif" />
          <source srcSet={project.imageWebp} type="image/webp" />
          <img
            src={project.imageWebp}
            alt={project.imageAlt}
            width={1200}
            height={260}
            loading={isAboveFold ? "eager" : "lazy"}
            decoding="async"
            {...(isAboveFold ? { fetchPriority: "high" as const } : {})}
            className="mt-2 h-44 w-full rounded-[2px] object-cover object-top contrast-[1.03] saturate-[0.92] transition-[filter] duration-500 group-hover:saturate-100 motion-reduce:transition-none sm:h-56"
          />
        </picture>

        {/* Stack byline — mono tokens separated by faint // marks. */}
        <ul className="flex flex-wrap items-center gap-y-1 font-mono text-[12px] text-white/55">
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

        {/* Controls — always visible, only render for URLs that exist.
            Accessible names carry the 02c fixes: "Open {title} live site"
            and "View {title} on GitHub". Focus rings match the pattern
            landed in 3303d82 (solid purple-400, offset against black). */}
        {hasAnyUrl && (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
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
    </motion.article>
  );
};

// -- Page ---------------------------------------------------------------

const ProjectsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full text-white px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        {/* Section header — count read as an editorial "folio" mark. */}
        <header className="mb-12 flex items-baseline justify-between gap-6 border-b border-white/15 pb-6">
          <h1 className="text-3xl font-bold sm:text-5xl">
            <span className="bg-gradient-to-br from-white via-white to-purple-300 bg-clip-text text-transparent">
              The Code Canvas
            </span>
          </h1>
          <span
            aria-hidden
            className="font-mono text-[11px] tracking-[0.35em] text-white/35"
          >
            ({String(projects.length).padStart(2, "0")})
          </span>
        </header>

        {/* Editorial stack — full-width rows, one per project. */}
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            total={projects.length}
            isAboveFold={i === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
