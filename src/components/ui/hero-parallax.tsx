import { CheckIcon } from "@radix-ui/react-icons";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type BentoDemo = "menu" | "status" | "timeline" | "urgent" | "emoji" | "stack";

export type HeroParallaxItem = {
  title: string;
  description: string;
  demo: BentoDemo;
};

interface HeroParallaxProps {
  items: HeroParallaxItem[];
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

export const HeroParallax = ({
  items,
  className,
  eyebrow,
  title,
  description,
  showHeader = true,
}: HeroParallaxProps) => {
  if (!items.length) return null;

  const shouldRenderHeader =
    showHeader && (Boolean(eyebrow) || Boolean(title) || Boolean(description));

  return (
    <div
      className={cn(
        "relative min-h-screen w-full text-white px-8 pt-32 pb-12",
        className
      )}
    >
      <div className="mx-auto max-w-6xl lg:flex lg:flex-col lg:justify-center">
        {shouldRenderHeader && (
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-purple-600 sm:text-5xl lg:text-6xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "grid gap-8 sm:gap-10 md:grid-cols-2 xl:grid-cols-3",
            shouldRenderHeader ? "mt-12" : "mt-4"
          )}
        >
          {items.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-[26px] border border-gray-700 bg-gray-900 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-600/50"
            >
              <div className="flex min-h-[160px] items-center justify-center rounded-[22px] border border-gray-800 bg-gray-800/50 px-4">
                <BentoDemo variant={item.demo} />
              </div>
              <div className="mt-4 text-left">
                <h3 className="text-lg font-semibold text-gray-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const BentoDemo = ({ variant }: { variant: BentoDemo }) => {
  switch (variant) {
    case "menu":
      return (
        <div className="w-full max-w-[240px] rounded-[22px] bg-[#14161C] p-3 text-white shadow-[0_18px_30px_rgba(0,0,0,0.35)]">
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6]/30">
                <span className="h-3 w-3 rounded-full bg-[#3B82F6]" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-semibold">Access check</p>
                <p className="text-[0.6rem] text-white/60">Verified</p>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.55rem] text-white/70">
                ID required
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E]/20">
                <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
              </span>
              <div>
                <p className="text-xs font-semibold text-white/90">Workspace</p>
                <p className="text-[0.6rem] text-white/50">Live sync</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A855F7]/20">
                <span className="h-3 w-3 rounded-full bg-[#A855F7]" />
              </span>
              <div>
                <p className="text-xs font-semibold text-white/90">
                  Translation
                </p>
                <p className="text-[0.6rem] text-white/50">Queued</p>
              </div>
            </div>
          </div>
        </div>
      );
    case "status":
      return (
        <div className="flex items-center gap-3 rounded-full bg-[#00BF72] px-5 py-2 text-white shadow-[0_12px_24px_rgba(0,191,114,0.35)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
            <CheckIcon className="h-4 w-4 text-[#00BF72]" />
          </span>
          <span className="text-sm font-semibold">Status verified</span>
        </div>
      );
    case "timeline":
      return (
        <div className="w-full max-w-[240px] rounded-[22px] border border-gray-700 bg-gray-800/50 px-4 py-3">
          <div className="relative space-y-3 pl-6">
            <span className="absolute left-2 top-2 h-[calc(100%-16px)] w-px bg-purple-600/30" />
            {[
              ["Prototype shipped", "Today"],
              ["Metrics aligned", "2:14p"],
              ["Launch window", "Fri"],
            ].map(([label, time], index) => (
              <div
                key={label}
                className={cn(
                  "relative flex items-center justify-between gap-3 pb-3",
                  index === 2 ? "pb-0" : "border-b border-gray-700"
                )}
              >
                <span className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-purple-400">
                    {label}
                  </p>
                  <p className="text-[0.6rem] text-gray-400">Completed</p>
                </div>
                <span className="text-[0.6rem] text-gray-400">{time}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "urgent":
      return (
        <div className="flex w-full max-w-[240px] items-center justify-between gap-4 rounded-[20px] border border-gray-700 bg-gray-800/50 px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.3)]">
          <div>
            <p className="text-sm font-semibold text-gray-100">Urgent review</p>
            <p className="text-[0.65rem] text-gray-400">Decision needed</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-full border border-gray-700 bg-gray-800 px-2.5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            <Flame className="h-3.5 w-3.5 text-orange-500" />
          </div>
        </div>
      );
    case "emoji":
      return (
        <div className="relative w-full max-w-[240px] overflow-hidden">
          <div className="flex items-center gap-4 -translate-x-6">
            {[
              ["🛰️", "bg-purple-900/30 border border-purple-600/20"],
              ["🧠", "bg-pink-900/30 border border-pink-600/20"],
              ["🎧", "bg-blue-900/30 border border-blue-600/20"],
              ["✨", "bg-yellow-900/30 border border-yellow-600/20"],
              ["🧩", "bg-green-900/30 border border-green-600/20"],
            ].map(([emoji, color], index) => (
              <div
                key={`${emoji}-${index}`}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-lg shadow-[0_10px_20px_rgba(0,0,0,0.3)]",
                  index === 2 ? "h-14 w-14 text-xl" : "",
                  color
                )}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      );
    case "stack":
      return (
        <div className="w-full max-w-[240px] rounded-[22px] border border-gray-700 bg-gray-800/50 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {[
              [
                "User-first",
                "bg-blue-900/30 text-blue-400 border border-blue-600/20",
              ],
              [
                "Growth",
                "bg-green-900/30 text-green-400 border border-green-600/20",
              ],
              [
                "Systems",
                "bg-purple-900/30 text-purple-400 border border-purple-600/20",
              ],
            ].map(([label, classes]) => (
              <span
                key={label}
                className={cn(
                  "rounded-full px-3 py-1 text-[0.6rem] font-semibold",
                  classes
                )}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-700">
            <div className="h-full w-2/3 rounded-full bg-purple-600" />
          </div>
          <div className="mt-2 flex justify-between text-[0.6rem] text-gray-400">
            <span>Clarity score</span>
            <span>74%</span>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default HeroParallax;
