import React from "react";
import {
  EditorialProjectIndex,
  type EditorialProject,
} from "@/components/ui/editorial-project-index";

// Project images: 800x384 (2x the 400x192 render size), AVIF with WebP fallback.
import TranslaliaAvif from "@/assets/projects/translalia.avif";
import TranslaliaWebp from "@/assets/projects/translalia.webp";
import CourseSearchAvif from "@/assets/projects/coursesearch.avif";
import CourseSearchWebp from "@/assets/projects/coursesearch.webp";
import MyCosmosJobsAvif from "@/assets/projects/mycosmosjobs.avif";
import MyCosmosJobsWebp from "@/assets/projects/mycosmosjobs.webp";
import BasisAvif from "@/assets/projects/basis.avif";
import BasisWebp from "@/assets/projects/basis.webp";

// `liveUrl` and `githubUrl` use `string | null | undefined`:
// - `string`  -> render the affordance.
// - `null`    -> explicit "no public site/repo for this project yet" — a
//                considered decision rather than a missing field.
// - absent    -> same effect as null at render time.
// The renderer only emits a control when the value is a non-empty string.
const projects: EditorialProject[] = [
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
  {
    id: 4,
    title: "Basis",
    status: "development",
    subtitle: "GPU Compute Fungibility Study",
    description:
      "Public-data study quantifying how much GPU price dispersion across cloud providers is genuinely irreducible. Collects quoted prices from four providers twice daily, normalizes them through rule-based canonicalization, and decomposes log-price variance via sequential ANOVA. Headline finding: 53–95% of H100 SXM 80GB variance is unexplained residual after region, commitment, provider, and bundle controls.",
    imageAvif: BasisAvif,
    imageWebp: BasisWebp,
    imageAlt:
      "Basis dashboard mockup showing GPU price dispersion across providers and a variance decomposition with a dominant residual segment",
    tech: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Next.js",
      "AWS EC2",
      "statsmodels",
      "systemd",
    ],
    liveUrl: null,
    githubUrl: null,
  },
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Editorial running head + display title. The eyebrow + folio
            count frame the title; the title sits at a moderate display
            scale so it reads as a section opener, not a billboard. */}
        <header className="mb-12 border-b border-white/10 pb-8 md:mb-16 md:pb-10">
          <div className="mb-5 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
            <span>Selected Work / 2022—Present</span>
            <span aria-label={`${projects.length} projects total`}>
              <span aria-hidden>(</span>
              {String(projects.length).padStart(2, "0")}
              <span aria-hidden>)</span>
            </span>
          </div>
          <h1 className="font-serif text-4xl font-medium leading-[0.95] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-br from-white via-white to-purple-200 bg-clip-text text-transparent">
              The Code Canvas
            </span>
          </h1>
        </header>

        <EditorialProjectIndex projects={projects} />
      </div>
    </div>
  );
};

export default ProjectsPage;
