// src/pages/SkillsPage.tsx

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";
import {
  GraduationCap,
  Code2,
  Briefcase,
  Rocket,
  Cpu,
  Users,
  Zap,
  TrendingUp,
  MessageSquare,
  Target,
  Layers,
  Brain,
  ChevronDown,
} from "lucide-react";

// Animated counter component
const Counter = ({
  target,
  suffix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Easing function for smoother animation
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(easeOutExpo(progress) * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// Typing text animation
const TypingText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, text]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      <span className="animate-[blink-cursor_1s_step-end_infinite]">|</span>
    </span>
  );
};

// Interactive skill data with project connections
interface SkillData {
  name: string;
  experience: string;
  projects: string[];
}

const skillsWithProjects: SkillData[] = [
  {
    name: "Python",
    experience: "3 production apps",
    projects: ["PCB Defect Detection", "ML Pipeline at Attri.AI", "Data ETL Pipelines"],
  },
  {
    name: "TypeScript",
    experience: "5+ shipped products",
    projects: ["Translalia", "MadHelp", "MyCosmosJobs"],
  },
  {
    name: "React/Next.js",
    experience: "4 full-stack apps",
    projects: ["Translalia", "MadHelp", "Portfolio Site"],
  },
  {
    name: "SQL/PostgreSQL",
    experience: "Database design",
    projects: ["MadHelp", "MyCosmosJobs", "Attri.AI"],
  },
  {
    name: "AI/ML",
    experience: "ML pipelines",
    projects: ["Translalia", "PCB Detection", "Trademark Similarity"],
  },
];

// Interactive Skill Pill Component
const InteractiveSkillPill = ({
  skill,
  isActive,
  onClick,
}: {
  skill: SkillData;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-4 py-2 rounded-full border text-left transition-all duration-200",
        "flex items-center gap-2 group",
        isActive
          ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/25"
          : "border-gray-600 text-gray-300 hover:border-purple-400 hover:bg-purple-500/10"
      )}
    >
      <span className="font-medium text-sm">{skill.name}</span>
      <span className={cn(
        "text-xs opacity-70",
        isActive ? "text-purple-100" : "text-gray-500"
      )}>
        {skill.experience}
      </span>
      <ChevronDown 
        className={cn(
          "h-3 w-3 transition-transform duration-200 ml-auto",
          isActive ? "rotate-180" : ""
        )}
      />
    </motion.button>
  );
};

// Bento card wrapper
const BentoCard = ({
  children,
  className,
  shine = false,
  shineColor = ["#9333ea", "#a855f7"],
}: {
  children: React.ReactNode;
  className?: string;
  shine?: boolean;
  shineColor?: string[];
}) => {
  const card = (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl p-5",
        "bg-black/60 backdrop-blur-sm border border-white/10",
        "transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40",
        "group",
        className
      )}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-purple-600/5" />
    </div>
  );

  if (shine) {
    return (
      <ShineBorder
        borderRadius={16}
        borderWidth={1}
        duration={10}
        color={shineColor}
        className="h-full w-full !min-w-0 !bg-transparent !p-0"
      >
        {card}
      </ShineBorder>
    );
  }

  return card;
};

// Education Card
const EducationCard = () => (
  <BentoCard className="flex flex-col" shine>
    <div className="flex items-center gap-3 mb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
        <GraduationCap className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-purple-400/80">
          Education
        </p>
        <h3 className="text-lg font-semibold text-white">UW-Madison</h3>
      </div>
    </div>
    <div className="space-y-2 text-sm text-gray-300">
      <p className="font-medium text-white">
        B.S. Computer Science & Data Science
      </p>
      <p className="text-gray-400">Expected: May 2026</p>
    </div>
    <div className="mt-4 pt-4 border-t border-white/10">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Coursework
      </p>
      <div className="flex flex-wrap gap-1.5">
        {["Machine Learning", "DBMS", "SWE", "AI/ANN", "Data Viz"].map(
          (course) => (
            <span
              key={course}
              className="px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-full text-[0.65rem]"
            >
              {course}
            </span>
          )
        )}
      </div>
    </div>
  </BentoCard>
);

// Stats Card
const StatsCard = () => (
  <BentoCard className="flex flex-col justify-between bg-gradient-to-br from-purple-600/20 to-purple-900/20">
    <div className="flex items-center gap-2 mb-2">
      <TrendingUp className="h-4 w-4 text-purple-400" />
      <span className="text-xs text-purple-300 uppercase tracking-wider">
        Impact
      </span>
    </div>
    <div className="space-y-4">
      <div>
        <div className="text-4xl font-black text-white">
          <Counter target={40} suffix="%" />
        </div>
        <p className="text-sm text-gray-400">API usage reduced</p>
      </div>
      <div>
        <div className="text-2xl font-bold text-purple-400">
          <Counter target={3} suffix="+" />
        </div>
        <p className="text-xs text-gray-500">Production apps shipped</p>
      </div>
    </div>
  </BentoCard>
);

// Interactive Skills Card with project connections
const InteractiveSkillsCard = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const handleSkillClick = (skillName: string) => {
    setActiveSkill(activeSkill === skillName ? null : skillName);
  };

  const activeSkillData = skillsWithProjects.find(s => s.name === activeSkill);

  return (
    <BentoCard className="flex flex-col !overflow-visible" shine>
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-medium text-white">Skills & Projects</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">Click a skill to see projects</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {skillsWithProjects.map((skill) => (
          <InteractiveSkillPill
            key={skill.name}
            skill={skill}
            isActive={activeSkill === skill.name}
            onClick={() => handleSkillClick(skill.name)}
          />
        ))}
      </div>

      {/* Related projects panel */}
      <AnimatePresence>
        {activeSkillData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20">
              <p className="text-xs text-purple-300 mb-2">
                Projects using {activeSkillData.name}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeSkillData.projects.map((project) => (
                  <span
                    key={project}
                    className="px-2 py-1 bg-purple-500/20 rounded-lg text-xs text-purple-200"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BentoCard>
  );
};

// Frameworks Card
const FrameworksCard = () => {
  const frameworks = [
    "React",
    "Next.js",
    "NestJS",
    "TailwindCSS",
    "PostgreSQL",
    "Redis",
    "PyTorch",
    "Docker",
  ];

  return (
    <BentoCard className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-medium text-white">
          Frameworks & Tools
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {frameworks.map((fw, index) => (
          <span
            key={fw}
            className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-full text-xs hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-white transition-all duration-200 cursor-default"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {fw}
          </span>
        ))}
      </div>
    </BentoCard>
  );
};

// Focus Areas Card
const FocusAreasCard = () => (
  <BentoCard
    className="flex flex-col bg-gradient-to-br from-purple-900/30 to-black/30"
    shine
    shineColor={["#a855f7", "#6366f1"]}
  >
    <div className="flex items-center gap-2 mb-4">
      <Target className="h-4 w-4 text-purple-400" />
      <span className="text-sm font-medium text-white">Focus Areas</span>
    </div>
    <div className="space-y-3 flex-1">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-purple-500/10 transition-colors">
        <Cpu className="h-5 w-5 text-purple-400" />
        <span className="text-sm text-gray-200">Full-Stack Development</span>
      </div>
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-purple-500/10 transition-colors">
        <Brain className="h-5 w-5 text-purple-400" />
        <span className="text-sm text-gray-200">AI/ML & Agentic AI</span>
      </div>
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-purple-500/10 transition-colors">
        <Zap className="h-5 w-5 text-purple-400" />
        <span className="text-sm text-gray-200">Growth Engineering</span>
      </div>
    </div>
  </BentoCard>
);

// AI Card with typing effect
const AICard = () => (
  <BentoCard className="flex flex-col">
    <div className="flex items-center gap-2 mb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
        <MessageSquare className="h-4 w-4" />
      </span>
      <span className="text-xs text-purple-300 uppercase tracking-wider">
        AI Powered
      </span>
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <p className="text-xs text-gray-500 mb-1">Building with:</p>
      <p className="text-sm font-medium text-white">
        <TypingText text="GPT-4, Claude, Custom Agents" />
      </p>
    </div>
  </BentoCard>
);

// Interpersonal Skills Card
const InterpersonalCard = () => (
  <BentoCard className="flex flex-col">
    <div className="flex items-center gap-2 mb-4">
      <Users className="h-4 w-4 text-purple-400" />
      <span className="text-sm font-medium text-white">Soft Skills</span>
    </div>
    <div className="space-y-2 text-sm text-gray-300">
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0" />
        <span>Cross-functional Communication</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0" />
        <span>End-to-End Project Ownership</span>
      </div>
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0" />
        <span>Product & Systems Thinking</span>
      </div>
    </div>
  </BentoCard>
);

// Experience Card
const ExperienceCard = ({
  company,
  role,
  period,
  description,
  tags,
  Icon,
  className,
}: {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  Icon: React.ElementType;
  className?: string;
}) => (
  <BentoCard className={cn("flex flex-col", className)} shine>
    <div className="flex items-start gap-3 mb-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 flex-shrink-0">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.15em] text-purple-400/80 mb-0.5">
          {company}
        </p>
        <h3 className="text-base font-semibold text-white leading-tight">
          {role}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{period}</p>
      </div>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed mb-3 flex-1">
      {description}
    </p>
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 rounded-full text-[0.65rem]"
        >
          {tag}
        </span>
      ))}
    </div>
  </BentoCard>
);

const SkillsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full text-white px-8 pt-32 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="flex items-center gap-8 pb-8 mb-8">
          <h1 className="text-3xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            My Digital Footprint
          </h1>
          <div className="flex-1 border-t border-gray-700" />
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {/* Row 1 */}
          <div className="sm:col-span-2 lg:col-span-2 min-h-[200px] opacity-0 animate-fade-in-up bento-card-1">
            <EducationCard />
          </div>
          <div className="min-h-[200px] opacity-0 animate-fade-in-up bento-card-2">
            <StatsCard />
          </div>
          <div className="min-h-[200px] opacity-0 animate-fade-in-up bento-card-3">
            <AICard />
          </div>

          {/* Row 2 */}
          <div className="sm:col-span-2 lg:col-span-2 min-h-[220px] opacity-0 animate-fade-in-up bento-card-4">
            <InteractiveSkillsCard />
          </div>
          <div className="min-h-[220px] opacity-0 animate-fade-in-up bento-card-5">
            <FocusAreasCard />
          </div>
          <div className="min-h-[220px] opacity-0 animate-fade-in-up bento-card-6">
            <InterpersonalCard />
          </div>

          {/* Row 3 */}
          <div className="sm:col-span-2 lg:col-span-2 min-h-[180px] opacity-0 animate-fade-in-up bento-card-7">
            <FrameworksCard />
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-16">
          <div className="flex items-center gap-8 pb-6 mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-100">
              Professional Experience
            </h2>
            <div className="flex-1 border-t border-gray-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ExperienceCard
              company="Oxford University - AIDCPT"
              role="Technical Consultant / Full-Stack Engineer"
              period="Aug 2025 - Present"
              description="Built Translalia, an AI poetry-translation workspace for students focused on translator agency and cultural nuance. Implemented preference-driven prompting with Redis async pipeline."
              tags={["Next.js", "Supabase", "GPT-4", "Redis"]}
              Icon={Code2}
              className="lg:col-span-1"
            />
            <ExperienceCard
              company="Cosmos Manpower Pvt. Ltd."
              role="Growth Engineer / Full-Stack"
              period="Dec 2025 - Present"
              description="Architecting MyCosmosJobs rebuild for high-volume recruitment ops. Automated ETL pipelines and growth experiments across the funnel."
              tags={["PostgreSQL", "ETL", "Automation"]}
              Icon={Briefcase}
            />
            <ExperienceCard
              company="Attri.ai"
              role="Full Stack Developer Intern"
              period="Jun 2024 - Oct 2024"
              description="Built trademark similarity app with ML pipeline. Contributed to AI support chatbot projected to reduce tickets ~40%."
              tags={["Python", "ML", "React", "CV"]}
              Icon={Rocket}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
