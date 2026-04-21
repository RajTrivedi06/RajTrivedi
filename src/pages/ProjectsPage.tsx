import React from "react";
import { ShineBorder } from "@/components/ui/shine-border";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExternalLink, Github } from "lucide-react";

// Project images: 800×384 (2× the 400×192 render size), AVIF with WebP fallback.
import TranslaliaAvif from "@/assets/projects/translalia.avif";
import TranslaliaWebp from "@/assets/projects/translalia.webp";
import CourseSearchAvif from "@/assets/projects/coursesearch.avif";
import CourseSearchWebp from "@/assets/projects/coursesearch.webp";
import PcbDefectAvif from "@/assets/projects/pcb_defect.avif";
import PcbDefectWebp from "@/assets/projects/pcb_defect.webp";
import MyCosmosJobsAvif from "@/assets/projects/mycosmosjobs.avif";
import MyCosmosJobsWebp from "@/assets/projects/mycosmosjobs.webp";

// Status badge component
const StatusBadge: React.FC<{
  status: "live" | "completed" | "development";
}> = ({ status }) => {
  const styles = {
    live: "bg-green-600 text-white",
    completed: "bg-blue-600 text-white",
    development: "bg-yellow-600 text-black",
  };

  const labels = {
    live: "🟢 Live",
    completed: "✓ Completed",
    development: "🚧 In Development",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Tech tag component
const TechTag: React.FC<{ tech: string }> = ({ tech }) => (
  <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded">
    {tech}
  </span>
);

// Project data with links
const projects = [
  {
    id: 1,
    title: "Translalia",
    status: "live" as const,
    subtitle: "Oxford University AIDCPT Project",
    description:
      "AI poetry-translation workspace for students (ages 12-16) focused on translator agency and cultural nuance. Features preference-driven prompting generating multiple translation variants across language varieties.",
    imageAvif: TranslaliaAvif,
    imageWebp: TranslaliaWebp,
    imageAlt: "Translalia - AI Poetry Translation",
    tech: ["Next.js", "React", "TypeScript", "Supabase", "GPT-4/5", "Redis"],
    liveUrl: "#",
    githubUrl: "https://github.com/RajTrivedi06",
  },
  {
    id: 2,
    title: "MadHelp",
    status: "completed" as const,
    subtitle: "AI Course Planning Assistant",
    description:
      "Full-stack AI-powered course planning assistant for UW-Madison students. Features intelligent course recommendations, research lab matching, and interactive prerequisite graph visualization. Semantic search across 200+ labs and thousands of courses.",
    imageAvif: CourseSearchAvif,
    imageWebp: CourseSearchWebp,
    imageAlt: "MadHelp - AI Course Planning",
    tech: ["FastAPI", "Next.js 15", "OpenAI API", "Python"],
    githubUrl: "https://github.com/RajTrivedi06",
  },
  {
    id: 3,
    title: "PCB Defect Detection",
    status: "completed" as const,
    subtitle: "Neural Networks Project",
    description:
      "Machine learning system for detecting defects in printed circuit boards using various neural network architectures including CNNs. Built as part of ECE/CS/ME 539 coursework.",
    imageAvif: PcbDefectAvif,
    imageWebp: PcbDefectWebp,
    imageAlt:
      "Annotated PCB with neural-network bounding boxes highlighting a solder short and a missing pad",
    tech: ["Python", "PyTorch", "CNNs"],
    githubUrl: "https://github.com/RajTrivedi06",
  },
  {
    id: 4,
    title: "MyCosmosJobs",
    status: "development" as const,
    subtitle: "Cosmos Manpower Pvt. Ltd.",
    description:
      "Full-stack job portal rebuild with automated data pipelines, ETL processes, and digital marketing automation tools for high-volume recruitment operations in Gujarat, India.",
    imageAvif: MyCosmosJobsAvif,
    imageWebp: MyCosmosJobsWebp,
    imageAlt: "MyCosmosJobs Portal",
    tech: ["Full-Stack", "ETL", "Automation"],
  },
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full text-white px-4 py-8 sm:px-8 sm:py-12">
      {/* Heading */}
      <h1 className="text-4xl sm:text-6xl font-bold text-purple-600 mb-8">
        The Code Canvas
      </h1>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-7xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {projects.map((project, index) => {
            // First card is visible on initial render across all breakpoints,
            // so it gets fetchpriority=high + eager. The rest lazy-load.
            const isAboveFold = index === 0;
            return (
            <CarouselItem
              key={project.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <TiltCard tiltAmount={8} glareEnabled={true} className="h-full">
                <ShineBorder
                  color="#9B5CFF"
                  borderWidth={1.5}
                  borderRadius={12}
                  className="bg-black flex flex-col rounded-lg overflow-hidden !p-0 h-full group"
                >
                  {/* Image with zoom effect */}
                  <div className="overflow-hidden relative">
                    <picture>
                      <source srcSet={project.imageAvif} type="image/avif" />
                      <source srcSet={project.imageWebp} type="image/webp" />
                      <img
                        src={project.imageWebp}
                        alt={project.imageAlt}
                        width={800}
                        height={384}
                        loading={isAboveFold ? "eager" : "lazy"}
                        decoding="async"
                        {...(isAboveFold
                          ? { fetchPriority: "high" as const }
                          : {})}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </picture>
                    {/* Overlay with links on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-purple-500 rounded-full hover:bg-purple-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-5 w-5 text-white" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="h-5 w-5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-4 text-white flex flex-col justify-start">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h2>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-sm text-purple-400 mb-2">
                      {project.subtitle}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.tech.map((tech) => (
                        <TechTag key={tech} tech={tech} />
                      ))}
                    </div>
                  </div>
                </ShineBorder>
              </TiltCard>
            </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="text-white border-white/20 hover:bg-white/10 bg-black/50 backdrop-blur-sm left-2 sm:-left-12" />
        <CarouselNext className="text-white border-white/20 hover:bg-white/10 bg-black/50 backdrop-blur-sm right-2 sm:-right-12" />
      </Carousel>
    </div>
  );
};

export default ProjectsPage;
