/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      animation: {
        // Existing animations
        shine: "shine var(--duration) infinite linear",
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
        // Enhanced animations for the background gradient component - random floating
        gradientFloat1: "gradientFloat1 35s ease-in-out infinite",
        gradientFloat2: "gradientFloat2 40s ease-in-out infinite",
        gradientFloat3: "gradientFloat3 38s ease-in-out infinite",
        gradientFloat4: "gradientFloat4 42s ease-in-out infinite",
        gradientOrbit1: "gradientOrbit1 50s linear infinite",
        gradientOrbit2: "gradientOrbit2 60s linear infinite reverse",
        gradientPulse: "gradientPulse 4s ease-in-out infinite",
      },
      keyframes: {
        // Existing keyframes
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
        // Enhanced keyframes for random floating across screen
        gradientFloat1: {
          "0%": {
            transform: "translate(0%, 0%) scale(1)",
          },
          "25%": {
            transform: "translate(120%, 80%) scale(1.2)",
          },
          "50%": {
            transform: "translate(80%, -60%) scale(0.85)",
          },
          "75%": {
            transform: "translate(-90%, 40%) scale(1.1)",
          },
          "100%": {
            transform: "translate(0%, 0%) scale(1)",
          },
        },
        gradientFloat2: {
          "0%": {
            transform: "translate(0%, 0%) scale(1)",
          },
          "20%": {
            transform: "translate(-100%, 60%) scale(1.15)",
          },
          "40%": {
            transform: "translate(70%, -80%) scale(0.9)",
          },
          "60%": {
            transform: "translate(-50%, -30%) scale(1.25)",
          },
          "80%": {
            transform: "translate(110%, 50%) scale(0.95)",
          },
          "100%": {
            transform: "translate(0%, 0%) scale(1)",
          },
        },
        gradientFloat3: {
          "0%": {
            transform: "translate(0%, 0%) scale(1)",
          },
          "30%": {
            transform: "translate(90%, -70%) scale(1.18)",
          },
          "50%": {
            transform: "translate(-120%, 90%) scale(0.88)",
          },
          "70%": {
            transform: "translate(60%, -40%) scale(1.05)",
          },
          "100%": {
            transform: "translate(0%, 0%) scale(1)",
          },
        },
        gradientFloat4: {
          "0%": {
            transform: "translate(0%, 0%) scale(1)",
          },
          "25%": {
            transform: "translate(-80%, -90%) scale(1.22)",
          },
          "45%": {
            transform: "translate(100%, 70%) scale(0.92)",
          },
          "65%": {
            transform: "translate(-60%, 100%) scale(1.08)",
          },
          "85%": {
            transform: "translate(50%, -50%) scale(0.98)",
          },
          "100%": {
            transform: "translate(0%, 0%) scale(1)",
          },
        },
        gradientOrbit1: {
          "0%": {
            transform: "rotate(0deg) translateX(300px) rotate(0deg) scale(1)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateX(300px) rotate(-360deg) scale(1.1)",
          },
        },
        gradientOrbit2: {
          "0%": {
            transform: "rotate(0deg) translateX(400px) rotate(0deg) scale(1)",
          },
          "100%": {
            transform:
              "rotate(-360deg) translateX(400px) rotate(360deg) scale(0.9)",
          },
        },
        gradientPulse: {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.2)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
