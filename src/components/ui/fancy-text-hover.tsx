import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SCATTER_TRANSFORMS: Record<number, { x: string; y: string; rotate: number }> = {
  1: { x: "-15%", y: "60%", rotate: 8 },
  2: { x: "-30%", y: "30%", rotate: 4 },
  3: { x: "-20%", y: "40%", rotate: -6 },
  4: { x: "0%", y: "8%", rotate: -8 },
  5: { x: "0%", y: "-20%", rotate: 5 },
  6: { x: "0%", y: "20%", rotate: -3 },
  7: { x: "0%", y: "-40%", rotate: -5 },
  8: { x: "0%", y: "15%", rotate: 10 },
};

export interface FancyLinkItem {
  label: string;
  href: string;
}

const DEFAULT_LINKS: FancyLinkItem[] = [
  { label: "Github", href: "https://github.com/RajTrivedi06" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/raj-trivedi-a28589210/" },
];

interface FancyTextHoverProps {
  links?: FancyLinkItem[];
  className?: string;
}

export default function FancyTextHover({
  links = DEFAULT_LINKS,
  className,
}: FancyTextHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cleanups: Array<() => void> = [];
      const anchors =
        containerRef.current.querySelectorAll<HTMLAnchorElement>(".fancy-word");

      anchors.forEach((anchor) => {
        const text = anchor.textContent ?? "";
        anchor.textContent = "";

        text.split("").forEach((char, i) => {
          const outer = document.createElement("span");
          outer.className = "inline-block";
          gsap.set(outer, {
            transition: "transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)",
          });

          const inner = document.createElement("span");
          inner.className = "inline-block";

          const letter = document.createElement("span");
          letter.className = "inline-block";
          letter.textContent = char;

          inner.appendChild(letter);
          outer.appendChild(inner);
          anchor.appendChild(outer);

          const randomDelay = Math.floor(Math.random() * 5);

          const onEnter = () => {
            const transform = SCATTER_TRANSFORMS[i + 1];
            if (transform) {
              gsap.to(outer, {
                xPercent: parseFloat(transform.x),
                yPercent: parseFloat(transform.y),
                rotation: transform.rotate,
                duration: 0.2,
                ease: "power3.inOut",
              });
            }

            gsap.to(inner, {
              keyframes: [
                { yPercent: 0, duration: 0 },
                { yPercent: -3, duration: 2.5, ease: "power3.inOut" },
                { yPercent: 0, duration: 2.5, ease: "power3.inOut" },
              ],
              repeat: -1,
              delay: randomDelay,
            });
          };

          const onLeave = () => {
            gsap.killTweensOf(inner);
            gsap.to(outer, {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              duration: 0.35,
              ease: "power3.inOut",
            });
            gsap.to(inner, {
              yPercent: 0,
              duration: 0.35,
              ease: "power3.inOut",
            });
          };

          anchor.addEventListener("mouseenter", onEnter);
          anchor.addEventListener("mouseleave", onLeave);

          cleanups.push(() => {
            anchor.removeEventListener("mouseenter", onEnter);
            anchor.removeEventListener("mouseleave", onLeave);
          });
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full flex-col items-center justify-between gap-10 p-4", className)}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="fancy-word text-4xl font-semibold uppercase tracking-wide text-white no-underline transition duration-250 ease-[cubic-bezier(0.76,0,0.24,1)] hover:text-primary sm:text-5xl"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
