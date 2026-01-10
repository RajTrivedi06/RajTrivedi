import { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  company?: string;
  location?: string;
  period?: string;
  highlights?: string[];
  tags?: string[];
  href?: string;
  cta?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[28rem] grid-cols-1 gap-6 md:grid-cols-2 lg:auto-rows-[30rem] lg:gap-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  company,
  location,
  period,
  highlights = [],
  tags = [],
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/60",
      "[box-shadow:0_0_0_1px_rgba(255,255,255,.04),0_12px_32px_rgba(0,0,0,.35)]",
      "backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40",
      "min-h-[28rem] lg:min-h-[30rem]",
      className
    )}
    {...props}
  >
    {background && (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {background}
      </div>
    )}
    <div className="relative z-10 flex h-full min-h-0 flex-col gap-5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/20">
            <Icon className="h-6 w-6" />
          </span>
          <div className="flex-1 min-w-0">
            {company && (
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300/80 mb-1">
                {company}
              </p>
            )}
            <h3 className="text-lg font-semibold text-gray-100 leading-tight">
              {name}
            </h3>
            {(location || period) && (
              <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                {[location, period].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 max-h-14 overflow-hidden">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] leading-none text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm leading-relaxed text-gray-300 flex-shrink-0 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
        {description}
      </p>

      {highlights.length > 0 && (
        <ul className="space-y-2.5 text-xs text-gray-300/90 flex-1 min-h-0 overflow-auto pr-1">
          {highlights.map((item) => (
            <li key={`${name}-${item}`} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400/70 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {href && cta && (
        <div className="mt-auto">
          <Button
            variant="link"
            asChild
            size="sm"
            className="p-0 text-purple-300 hover:text-purple-200"
          >
            <a href={href}>
              {cta}
              <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
            </a>
          </Button>
        </div>
      )}
    </div>

    <div className="pointer-events-none absolute inset-0 z-5 transition-all duration-300 group-hover:bg-purple-600/10" />
  </div>
);

export { BentoCard, BentoGrid };
