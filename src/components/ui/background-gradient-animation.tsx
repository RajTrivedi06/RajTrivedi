import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useCallback } from "react";

interface GradientOrb {
  color: string;
  opacity: number;
  size: string;
  animation: string;
  blendMode: string;
  position: string;
}

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(0, 0, 0)",
  gradientBackgroundEnd = "rgb(0, 0, 0)",
  firstColor = "155, 92, 255",
  secondColor = "210, 130, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "220, 50, 200",
  pointerColor = "155, 92, 255",
  size = "90%",
  blendingValue = "screen",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const curXRef = useRef(0);
  const curYRef = useRef(0);

  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const [isSafari, setIsSafari] = useState(false);

  // Define 4 gradient orbs with random positions across the screen
  const gradientOrbs: GradientOrb[] = [
    {
      color: firstColor,
      opacity: 0.7,
      size: "100%",
      animation: "gradientFloat1",
      blendMode: blendingValue,
      position: "top-[10%] left-[15%]",
    },
    {
      color: secondColor,
      opacity: 0.65,
      size: "85%",
      animation: "gradientFloat2",
      blendMode: blendingValue,
      position: "top-[60%] right-[20%]",
    },
    {
      color: thirdColor,
      opacity: 0.6,
      size: "95%",
      animation: "gradientFloat3",
      blendMode: blendingValue,
      position: "bottom-[15%] left-[25%]",
    },
    {
      color: fourthColor,
      opacity: 0.65,
      size: "90%",
      animation: "gradientFloat4",
      blendMode: blendingValue,
      position: "top-[35%] right-[10%]",
    },
  ];

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [gradientBackgroundStart, gradientBackgroundEnd, size, blendingValue]);

  // Smooth animation using requestAnimationFrame
  const animate = useCallback(() => {
    if (!interactiveRef.current || !interactive) return;

    curXRef.current += (tgX - curXRef.current) / 15;
    curYRef.current += (tgY - curYRef.current) / 15;

    if (interactiveRef.current) {
      interactiveRef.current.style.transform = `translate(${Math.round(
        curXRef.current
      )}px, ${Math.round(curYRef.current)}px)`;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [tgX, tgY, interactive]);

  useEffect(() => {
    if (interactive) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [interactive, animate]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (interactiveRef.current && interactive) {
        const rect = interactiveRef.current.getBoundingClientRect();
        setTgX(event.clientX - rect.left);
        setTgY(event.clientY - rect.top);
      }
    },
    [interactive]
  );

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-full w-full relative overflow-hidden bg-[linear-gradient(135deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced SVG filter for smoother blur effects */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          {/* Additional filter for subtle glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Content layer */}
      <div className={cn("relative z-10", className)}>{children}</div>

      {/* Enhanced gradient container with multiple orbs */}
      <div
        className={cn(
          "gradients-container absolute inset-0 h-full w-full",
          isSafari ? "blur-3xl" : "[filter:url(#blurMe)_blur(50px)]"
        )}
      >
        {/* Dynamic gradient orbs */}
        {gradientOrbs.map((orb, index) => {
          const animationClasses: Record<string, string> = {
            gradientFloat1: "animate-gradientFloat1",
            gradientFloat2: "animate-gradientFloat2",
            gradientFloat3: "animate-gradientFloat3",
            gradientFloat4: "animate-gradientFloat4",
          };

          return (
            <div
              key={index}
              className={cn(
                animationClasses[orb.animation] || "animate-gradientFloat1",
                orb.position,
                "[transform-origin:center_center]",
                "absolute"
              )}
              style={{
                background: `radial-gradient(circle at center, rgba(${orb.color}, ${orb.opacity}) 0%, rgba(${orb.color}, 0) 60%)`,
                mixBlendMode:
                  orb.blendMode as React.CSSProperties["mixBlendMode"],
                width: orb.size === "100%" ? "var(--size)" : orb.size,
                height: orb.size === "100%" ? "var(--size)" : orb.size,
              }}
            />
          );
        })}

        {/* Orbital gradients for more dynamic movement */}
        <div
          className="absolute top-1/2 left-1/2 animate-gradientOrbit1 opacity-60"
          style={{
            background: `radial-gradient(circle at center, rgba(${firstColor}, 0.5) 0%, rgba(${firstColor}, 0) 70%)`,
            mixBlendMode: blendingValue as React.CSSProperties["mixBlendMode"],
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "60%",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 animate-gradientOrbit2 opacity-50"
          style={{
            background: `radial-gradient(circle at center, rgba(${secondColor}, 0.4) 0%, rgba(${secondColor}, 0) 65%)`,
            mixBlendMode: blendingValue as React.CSSProperties["mixBlendMode"],
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "70%",
          }}
        />

        {/* Interactive mouse-following gradient */}
        {interactive && (
          <div
            ref={interactiveRef}
            className="absolute rounded-full opacity-60 animate-gradientPulse pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.5) 0%, rgba(${pointerColor}, 0) 70%)`,
              mixBlendMode:
                blendingValue as React.CSSProperties["mixBlendMode"],
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              transition: "opacity 0.3s ease",
            }}
          />
        )}
      </div>
    </div>
  );
};
