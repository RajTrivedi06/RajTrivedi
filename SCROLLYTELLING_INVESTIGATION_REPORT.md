# Portfolio Website Investigation Report

## For Scrollytelling Redesign

**Date:** January 3, 2026  
**Project:** Raj Trivedi Portfolio Website  
**Purpose:** Comprehensive codebase analysis for scrollytelling conversion

---

## Executive Summary

This portfolio website is a React + TypeScript + Vite application deployed on GitHub Pages. It uses a **hybrid routing/scroll architecture**: a standalone landing page at `/` that navigates to a **single-scroll container** (`SingleScrollPage`) where all content sections (Home, About, Skills, Projects, Connect) are stacked vertically.

**Current State:**

- ~2,500 lines of source code across 25 files
- Heavy use of Framer Motion for animations (already installed)
- Tailwind CSS for styling with custom animations defined
- Route-based navigation that triggers `scrollIntoView()` behavior
- 5 main content sections with distinct visual identities

**Key Findings for Scrollytelling:**

1. ✅ **Framer Motion already installed** - can coexist with GSAP or be replaced
2. ✅ **Single-scroll container exists** - architecture is 70% compatible
3. ✅ **Section refs already implemented** - can be repurposed for ScrollTrigger
4. ⚠️ **Router-based scroll needs refactoring** - must move to scroll-driven URLs
5. ⚠️ **No smooth scroll library** - need to add Lenis
6. ⚠️ **Animations are time-based** - need conversion to scroll-driven

**Estimated Complexity:** Medium  
**Estimated Migration Effort:** 15-25 hours

---

## PHASE 1: Project Structure Analysis

### 1.1 Complete Directory Tree

```
src/ (25 files, ~2,500 LOC)
├── App.tsx (37 lines) - USED - Route definitions
├── App.css (1 line) - UNUSED - Empty file, can delete
├── main.tsx (15 lines) - USED - Entry point with BrowserRouter
├── index.css (122 lines) - USED - Global styles, CSS variables
├── vite-env.d.ts - USED - TypeScript env declarations
│
├── assets/ (5 files)
│   ├── ChatImage.png - USED - Project card image
│   ├── connectcablesimage.jpg - USED - Project card image
│   ├── coursesearchAI.jpg - USED - Project card image
│   ├── HomePageProp.svg - UNUSED - Decorative SVG
│   └── houseimage.png - USED - Project card image
│
├── components/ (16 files)
│   ├── NavDock.tsx (74 lines) - USED - Main navigation dock
│   ├── Navbar.tsx (68 lines) - UNUSED - Alternative nav, DELETE
│   ├── SiteLayout.tsx (19 lines) - UNUSED - Layout wrapper, DELETE
│   ├── AnimatedButton.tsx (117 lines) - UNUSED - Custom button, DELETE
│   │
│   └── ui/ (12 files)
│       ├── background-gradient-animation.tsx (182 lines) - USED - Landing page
│       ├── background-gradient.tsx (70 lines) - USED - Connect page card
│       ├── box-reveal.tsx (72 lines) - USED - Home page text reveals
│       ├── button.tsx (58 lines) - USED - Button primitives for NavDock
│       ├── dock.tsx (142 lines) - USED - Navigation dock component
│       ├── interactive-hover-button.tsx (38 lines) - USED - Landing CTA
│       ├── ripple.tsx (67 lines) - UNUSED - Commented out, can DELETE
│       ├── shine-border.tsx (64 lines) - USED - Project cards
│       ├── text-reveal.tsx (74 lines) - UNUSED - Good for scrollytelling!
│       ├── tooltip.tsx (31 lines) - USED - NavDock tooltips
│       ├── typing-animation.tsx (91 lines) - UNUSED - Potential use
│       └── wobble-card.tsx (79 lines) - USED - Experience cards
│
├── lib/
│   └── utils.ts (7 lines) - USED - cn() utility
│
└── pages/ (8 files)
    ├── LandingPage.tsx (56 lines) - USED - Entry splash screen
    ├── SingleScrollPage.tsx (106 lines) - USED - Main scroll container
    ├── HomePage.tsx (59 lines) - USED - Hero section
    ├── AboutPage.tsx (104 lines) - USED - About sections
    ├── SkillsPage.tsx (233 lines) - USED - Education/Skills/Experience
    ├── ProjectsPage.tsx (211 lines) - USED - Project cards
    ├── ConnectPage.tsx (199 lines) - USED - Contact section
    └── ExperiencePage.tsx (15 lines) - UNUSED - Placeholder, DELETE
```

### 1.2 Entry Points & Core Files

#### main.tsx (Entry Point)

```typescript
// Key configuration:
- Uses React 18 createRoot
- BrowserRouter with basename="/RajTrivedi/" (GitHub Pages)
- React.StrictMode enabled
- Imports index.css for Tailwind
```

#### App.tsx (Route Definitions)

```typescript
// Routes:
- "/" → LandingPage (standalone)
- "/Home" → SingleScrollPage section="Home"
- "/About" → SingleScrollPage section="About"
- "/Skills" → SingleScrollPage section="Skills"
- "/Projects" → SingleScrollPage section="Projects"
- "/Connect" → SingleScrollPage section="Connect"
// Note: All non-root routes render the SAME component with different scroll targets
```

#### vite.config.ts

```typescript
- Base path: "/RajTrivedi/"
- Path alias: "@" → "src/"
- Plugin: @vitejs/plugin-react (Babel)
```

### 1.3 Dependency Audit

#### Core Framework

| Package          | Version | Notes                  |
| ---------------- | ------- | ---------------------- |
| react            | ^18.3.1 | Latest React 18        |
| react-dom        | ^18.3.1 | Latest                 |
| react-router-dom | ^7.1.1  | Very recent (Dec 2024) |
| typescript       | ~5.6.2  | Modern TS              |

#### Animation Libraries (CRITICAL)

| Package             | Version  | Status | Scrollytelling Impact                    |
| ------------------- | -------- | ------ | ---------------------------------------- |
| framer-motion       | ^11.16.0 | Active | Can coexist with GSAP                    |
| motion              | ^11.15.0 | Active | Same as framer-motion (new package name) |
| tailwindcss-animate | ^1.0.7   | Active | Keep for CSS animations                  |

**Note:** `framer-motion` and `motion` are the same library (Motion renamed package). Both are imported in different files - should standardize.

#### UI Libraries

| Package                  | Version  | Usage                         |
| ------------------------ | -------- | ----------------------------- |
| @radix-ui/react-icons    | ^1.3.2   | Icons in About, Connect pages |
| @radix-ui/react-slot     | ^1.1.1   | Button component              |
| @radix-ui/react-tooltip  | ^1.1.6   | NavDock tooltips              |
| lucide-react             | ^0.469.0 | NavDock icons                 |
| class-variance-authority | ^0.7.1   | Button/Dock variants          |
| clsx                     | ^2.1.1   | Class utilities               |
| tailwind-merge           | ^2.6.0   | Class merging                 |

#### Unused/Problematic Dependencies

| Package         | Version | Status                     |
| --------------- | ------- | -------------------------- |
| react-scrollspy | ^3.4.3  | **UNUSED** - Should remove |

#### Build Tools

| Package              | Version  |
| -------------------- | -------- |
| vite                 | ^6.0.5   |
| @vitejs/plugin-react | ^4.3.4   |
| tailwindcss          | ^3.4.17  |
| postcss              | ^8.4.49  |
| autoprefixer         | ^10.4.20 |
| gh-pages             | ^6.3.0   |

#### Potential Conflicts for Scrollytelling

1. **react-scrollspy** - Not used but installed. Remove before adding Lenis.
2. **Framer Motion + GSAP** - Can coexist but need careful scope separation.
3. **BrowserRouter scroll restoration** - May conflict with Lenis smooth scroll.

---

## PHASE 2: Routing & Navigation Architecture

### 2.1 Route Configuration

```typescript
// Current Architecture:
BrowserRouter (basename="/RajTrivedi/")
├── "/" → LandingPage (standalone, no NavDock)
└── "/*" → SingleScrollPage + NavDock
    ├── "/Home" → scroll to #home-section
    ├── "/About" → scroll to #about-section
    ├── "/Skills" → scroll to #skills-section
    ├── "/Projects" → scroll to #projects-section
    └── "/Connect" → scroll to #connect-section
```

**Key Insight:** The routing is "fake" - all routes render the same SingleScrollPage component, just with different scroll targets. This is 80% of the way to scrollytelling architecture.

### 2.2 Navigation System (NavDock)

**Location:** `src/components/NavDock.tsx`

**How It Works:**

1. Fixed position at top (`fixed top-0 left-0 right-0 z-50`)
2. Uses React Router `<Link>` components
3. Links to routes like `/home`, `/about`, etc.
4. Route change triggers `useEffect` in SingleScrollPage
5. `scrollIntoView({ behavior: "smooth" })` scrolls to section

**Icon Magnification Animation:**

- Uses Framer Motion's `useMotionValue`, `useSpring`, `useTransform`
- Icons scale from 40px to 60px based on mouse proximity
- Spring physics: `mass: 0.1, stiffness: 150, damping: 12`

**Scrollytelling Impact:**

- NavDock can be preserved with modifications
- Need to change from `<Link>` to scroll triggers
- Active state should be based on scroll position, not route

### 2.3 Current Scroll Implementation

**SingleScrollPage.tsx - Scroll Logic:**

```typescript
// Section refs
const homeRef = useRef<HTMLDivElement>(null);
const aboutRef = useRef<HTMLDivElement>(null);
// ...etc

// Scroll trigger on route change
useEffect(() => {
  if (!section) return;
  // ... switch case to find target ref
  if (targetRef?.current) {
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [section]);
```

**Current Scroll Characteristics:**

- Native browser `scrollIntoView` with `behavior: "smooth"`
- NO custom smooth scroll library (no Lenis, Locomotive, etc.)
- NO scroll event listeners
- NO IntersectionObserver for active section detection
- NO scroll progress tracking

**Section IDs:**

```typescript
const SECTION_IDS = {
  Home: "home-section",
  About: "about-section",
  Skills: "skills-section",
  Projects: "projects-section",
  Connect: "connect-section",
};
```

### 2.4 Page Transition Analysis

**Current State:** No page transitions exist.

- Route changes are instant (no exit animations)
- Scroll is the only "transition"
- No loading states

**For Scrollytelling:**

- Landing → Main transition needs entrance animation
- Could use GSAP timeline for "entering the experience"

---

## PHASE 3: Component Deep Dive

### 3.1 Page Components

#### LandingPage.tsx

```yaml
Purpose: Entry splash screen with animated gradient background
Lines: 56
Props: None
State: None
Hooks: useNavigate()
Child Components:
  - BackgroundGradientAnimation (wrapper)
  - InteractiveHoverButton (CTA)
Animations:
  - 5 animated gradient orbs (CSS keyframes via Tailwind)
  - Mouse-following pointer gradient
  - Button hover effects (CSS)
Event Handlers:
  - onClick → navigate("/Home")
Content:
  - Button text: "Welcome, Let's get started"
Scrollytelling Notes:
  - Could become "Scene 0" - the entry portal
  - Gradient animation is heavy - monitor performance
  - Consider replacing with simpler intro for scroll experience
```

#### SingleScrollPage.tsx

```yaml
Purpose: Container for all content sections
Lines: 106
Props: { section?: "Home" | "About" | "Skills" | "Projects" | "Connect" }
State: None
Hooks: useEffect, useRef (x5)
Ref Architecture:
  - homeRef → #home-section
  - aboutRef → #about-section
  - skillsRef → #skills-section
  - projectsRef → #projects-section
  - connectRef → #connect-section
Scroll Logic:
  - useEffect watches `section` prop
  - Calls scrollIntoView on matching ref
Container Styles:
  - "relative w-full bg-black text-white scroll-smooth"
Scrollytelling Notes:
  - THIS IS THE MAIN REFACTOR TARGET
  - Add Lenis smooth scroll here
  - Add GSAP ScrollTrigger context here
  - Refs can be reused for ScrollTrigger triggers
```

#### HomePage.tsx

```yaml
Purpose: Hero/introduction section
Lines: 59
Animations:
  - BoxReveal (x4) with staggered durations (0.5s, 1s, 1.5s)
  - Purple reveal box color (#9B5CFF)
Content:
  - H1: "Hey, I'm Raj"
  - H2: "Builder. Growth Engineer."
  - P: Bio paragraph about AI tools, UW-Madison
  - Decorative SVG (bottom-right corner)
Section Height: h-screen (100vh)
Scrollytelling Potential:
  - Text reveals can become scroll-triggered
  - Stagger can be driven by scroll progress
  - SVG could animate on scroll
```

#### AboutPage.tsx

```yaml
Purpose: Personal story and philosophy
Lines: 104
Sections: 5
  1. "The Origin Story" (HeartFilledIcon)
  2. "The Bet I'm Making" (RocketIcon)
  3. "How I Build" (MixerVerticalIcon)
  4. "Beyond the Code" (CrumpledPaperIcon)
  5. "Let's Build Something" (ChatBubbleIcon)
Animations: None (static content)
Section Height: min-h-screen
Layout: Centered, max-w-3xl
Scrollytelling Potential:
  - Each section can be a "scene"
  - Icons can animate in
  - Text can reveal word-by-word (use text-reveal.tsx!)
  - Could use horizontal scroll for sections
```

#### SkillsPage.tsx

```yaml
Purpose: Education, experience, skills
Lines: 233 (LARGEST)
Layout: 2-column grid (lg:grid-cols-2)
Left Column:
  - Education (UW-Madison)
  - Professional Experience (3 WobbleCards)
Right Column:
  - Languages & Tools (17 skill tags)
  - Frameworks & Technologies (12 skill tags)
  - Focus Areas (3 bullet points)
  - Interpersonal Skills (4 bullet points)
Animations:
  - WobbleCard 3D tilt effect (Framer Motion)
  - Hover effects on skill tags (Tailwind transition)
Section Height: min-h-screen
Scrollytelling Potential:
  - Skill tags can animate in with stagger
  - WobbleCards can slide in from sides
  - Timeline visualization for experience
  - Progress bar for education
```

#### ProjectsPage.tsx

```yaml
Purpose: Portfolio project showcase
Lines: 211
Layout: Responsive grid (1/2/4 columns)
Projects: 4
  1. Translalia (Live)
  2. MadHelp (Completed)
  3. PCB Defect Detection (Completed)
  4. MyCosmosJobs (In Development)
Components:
  - ShineBorder (animated border)
  - StatusBadge (local component)
  - TechTag (local component)
Animations:
  - ShineBorder radial gradient animation (CSS)
Performance:
  - Image preloading on mount
Section Height: min-h-screen
Scrollytelling Potential:
  - Cards can "fly in" from different directions
  - Z-axis transforms (cards coming toward viewer)
  - Could do horizontal scroll gallery
  - Project details could expand on scroll
```

#### ConnectPage.tsx

```yaml
Purpose: Contact information
Lines: 199
Layout: Centered card with gradient border
Elements:
  - Decorative ellipses (left cyan, right purple)
  - BackgroundGradient animated card
  - 4 contact buttons (Email, GitHub, LinkedIn, Resume)
  - Email display
Animations:
  - BackgroundGradient horizontal animation (Framer Motion, 5s loop)
  - Button hover effects (Tailwind)
Content:
  - Location: Madison, WI
  - Email: rajtri286@gmail.com
  - "Open to: internships, collaborations, interesting conversations"
Section Height: min-h-screen
Scrollytelling Potential:
  - Final "scene" - landing zone
  - Ellipses could animate into view
  - Card could scale/fade in
  - Social icons could stagger in
```

### 3.2 UI Components Inventory

| Component                   | File | Lines | Used By            | Animation Type                      | Reusable for Scrollytelling?       |
| --------------------------- | ---- | ----- | ------------------ | ----------------------------------- | ---------------------------------- |
| BackgroundGradientAnimation | ui/  | 182   | LandingPage        | CSS keyframes + mouse tracking      | ⚠️ Heavy, may need optimization    |
| BackgroundGradient          | ui/  | 70    | ConnectPage        | Framer Motion (5s loop)             | ✅ Can trigger on scroll           |
| BoxReveal                   | ui/  | 72    | HomePage           | Framer Motion (useInView)           | ✅ Already scroll-triggered!       |
| ShineBorder                 | ui/  | 64    | ProjectsPage       | CSS animation (shine)               | ✅ Works as-is                     |
| WobbleCard                  | ui/  | 79    | SkillsPage         | Framer Motion (mouse tracking)      | ✅ Keep for interactivity          |
| Dock                        | ui/  | 142   | NavDock            | Framer Motion (spring)              | ✅ Keep for nav                    |
| InteractiveHoverButton      | ui/  | 38    | LandingPage        | CSS transitions                     | ✅ Works as-is                     |
| Tooltip                     | ui/  | 31    | NavDock            | Radix + CSS                         | ✅ Works as-is                     |
| Button                      | ui/  | 58    | NavDock            | None                                | ✅ Works as-is                     |
| TextRevealByWord            | ui/  | 74    | UNUSED             | **Framer Motion (scrollYProgress)** | ✅ **PERFECT for scrollytelling!** |
| TypingAnimation             | ui/  | 91    | UNUSED             | Interval-based typing               | ⚠️ Could adapt to scroll           |
| Ripple                      | ui/  | 67    | UNUSED (commented) | CSS animation                       | ❌ DELETE                          |

### 3.3 Unused Components

| Component          | Lines | Recommendation                              |
| ------------------ | ----- | ------------------------------------------- |
| Navbar.tsx         | 68    | DELETE - Replaced by NavDock                |
| SiteLayout.tsx     | 19    | DELETE - Not used                           |
| AnimatedButton.tsx | 117   | DELETE - Replaced by InteractiveHoverButton |
| ExperiencePage.tsx | 15    | DELETE - Content moved to SkillsPage        |
| Ripple.tsx         | 67    | DELETE - Commented out                      |
| App.css            | 1     | DELETE - Empty file                         |
| HomePageProp.svg   | -     | DELETE - Not used                           |

**Total deletable:** ~287 lines + 1 asset

---

## PHASE 4: Animation System Audit

### 4.1 Framer Motion Usage

#### BoxReveal (box-reveal.tsx)

```typescript
{
  file: "box-reveal.tsx",
  animationType: "entrance + scroll-triggered",
  elements: [
    {
      type: "motion.div",
      variants: {
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 }
      },
      trigger: "useInView (once: true)",
      duration: "0.5s (configurable)",
      delay: "0.25s"
    },
    {
      type: "motion.div (reveal box)",
      variants: {
        hidden: { left: 0 },
        visible: { left: "100%" }
      },
      trigger: "useInView (once: true)"
    }
  ]
}
// SCROLLYTELLING: Already uses IntersectionObserver! Easy to convert.
```

#### BackgroundGradient (background-gradient.tsx)

```typescript
{
  file: "background-gradient.tsx",
  animationType: "infinite loop",
  element: "motion.div",
  animation: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
  },
  transition: {
    duration: 5,
    repeat: Infinity,
    repeatType: "reverse"
  }
}
// SCROLLYTELLING: Could tie gradient position to scroll progress
```

#### WobbleCard (wobble-card.tsx)

```typescript
{
  file: "wobble-card.tsx",
  animationType: "hover interaction",
  trigger: "onMouseMove, onMouseEnter, onMouseLeave",
  transform: "translate3d + scale3d",
  physics: "No spring, 0.1s ease-out"
}
// SCROLLYTELLING: Keep as-is for interactivity, don't convert
```

#### Dock Icons (dock.tsx)

```typescript
{
  file: "dock.tsx",
  animationType: "proximity-based magnification",
  hooks: ["useMotionValue", "useTransform", "useSpring"],
  transform: "width + height scale",
  spring: { mass: 0.1, stiffness: 150, damping: 12 }
}
// SCROLLYTELLING: Keep as-is, this is navigation interaction
```

#### TextRevealByWord (text-reveal.tsx) - UNUSED BUT PERFECT

```typescript
{
  file: "text-reveal.tsx",
  animationType: "SCROLL-DRIVEN (already!)",
  hooks: ["useScroll", "useTransform"],
  trigger: "scrollYProgress",
  effect: "Word-by-word opacity reveal based on scroll",
  container: "h-[200vh] with sticky inner element"
}
// SCROLLYTELLING: THIS IS ALREADY A SCROLLYTELLING COMPONENT!
// Just not being used. Can serve as a pattern for other conversions.
```

### 4.2 CSS Animations (Tailwind)

#### Defined in tailwind.config.js

```javascript
animation: {
  shine: "shine var(--duration) infinite linear",        // ShineBorder
  ripple: "ripple var(--duration,2s) ease infinite",     // Ripple (unused)
  first: "moveVertical 30s ease infinite",               // BackgroundGradientAnimation
  second: "moveInCircle 20s reverse infinite",           // BackgroundGradientAnimation
  third: "moveInCircle 40s linear infinite",             // BackgroundGradientAnimation
  fourth: "moveHorizontal 40s ease infinite",            // BackgroundGradientAnimation
  fifth: "moveInCircle 20s ease infinite",               // BackgroundGradientAnimation
}

keyframes: {
  shine: { "0%/50%/100%": background-position changes },
  ripple: { scale oscillation },
  moveHorizontal: { translateX(-50%) ↔ translateX(50%) },
  moveInCircle: { rotate(0deg) → rotate(360deg) },
  moveVertical: { translateY(-50%) ↔ translateY(50%) }
}
```

### 4.3 Animation Timing Inventory

```
LANDING PAGE LOAD:
0.0s - ∞    : 5 gradient orbs animate continuously (20-40s cycles)
0.0s - ∞    : Mouse-following gradient (real-time)
hover       : Button glow/scale effect (0.3s)

HOME SECTION (on view):
0.25s - 0.75s  : "Hey, I'm Raj" box reveal (0.5s duration)
0.25s - 1.25s  : Subheading box reveal (1s duration)
0.25s - 1.75s  : Description box reveal (1.5s duration)

ABOUT SECTION:
(none - static content)

SKILLS SECTION:
hover       : Skill tags color transition (0.2s)
hover       : WobbleCard 3D tilt (0.1s ease-out)

PROJECTS SECTION:
0.0s - ∞    : ShineBorder animation (14s cycle)

CONNECT SECTION:
0.0s - ∞    : BackgroundGradient animation (5s cycle)
hover       : Button hover effects
```

### 4.4 Scrollytelling Compatibility Assessment

| Current Animation           | Convert to Scroll? | Effort | Notes                                    |
| --------------------------- | ------------------ | ------ | ---------------------------------------- |
| BackgroundGradientAnimation | ⚠️ Consider        | High   | Heavy; could replace with simpler effect |
| BoxReveal                   | ✅ Yes             | Low    | Already uses IntersectionObserver        |
| BackgroundGradient          | ✅ Yes             | Low    | Tie to scroll progress                   |
| ShineBorder                 | ❌ Keep as-is      | -      | CSS animation, works well                |
| WobbleCard                  | ❌ Keep as-is      | -      | Mouse interaction, not scroll            |
| Dock magnification          | ❌ Keep as-is      | -      | Hover interaction                        |

---

## PHASE 5: Styling Architecture

### 5.1 Tailwind Configuration

```javascript
// tailwind.config.js highlights:
module.exports = {
  darkMode: ["class"], // Dark mode via class (not used currently)
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

  theme: {
    extend: {
      // Custom border radius with CSS variable
      borderRadius: {
        lg: "var(--radius)", // 0.5rem
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Semantic colors via CSS variables
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        // ... shadcn/ui color system
      },

      // Custom animations (5 for gradient, 2 for effects)
      animation: {
        /* documented above */
      },
      keyframes: {
        /* documented above */
      },
    },
  },

  plugins: [require("tailwindcss-animate")], // Animation utilities
};
```

### 5.2 CSS Variables (index.css)

```css
:root {
  /* Backgrounds */
  --background: 0 0% 100%;           /* White */
  --foreground: 240 10% 3.9%;        /* Near black */

  /* Semantic colors */
  --card: 0 0% 100%;
  --popover: 0 0% 100%;
  --primary: 240 5.9% 10%;           /* Dark gray */
  --secondary: 240 4.8% 95.9%;       /* Light gray */
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;      /* Red */

  /* UI elements */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 10% 3.9%;
  --radius: 0.5rem;

  /* Chart colors (unused) */
  --chart-1 through --chart-5
}

.dark {
  /* Dark mode overrides (not currently used) */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}

/* Custom class */
.my-landing-ripple {
  --foreground: 263 100% 70%;  /* Purple for ripple effect */
}
```

### 5.3 Color System

| Color              | Hex             | RGB           | Usage                            |
| ------------------ | --------------- | ------------- | -------------------------------- |
| **Primary Purple** | #9B5CFF         | 155, 92, 255  | Accents, borders, buttons, icons |
| **Secondary Cyan** | #5EE2FF         | 94, 226, 255  | Connect page ellipse, gradients  |
| **Gradient Cyan**  | #5ECCFF         | 94, 204, 255  | Gradient borders                 |
| **Purple 600**     | text-purple-600 | -             | Main headings                    |
| **Purple 700**     | text-purple-700 | -             | Section headings                 |
| **Purple 500**     | text-purple-500 | -             | Icons                            |
| **Purple 400**     | text-purple-400 | -             | Subtitles, links                 |
| **Gray 600**       | border-gray-600 | -             | Borders, dividers                |
| **Gray 400**       | text-gray-400   | -             | Body text                        |
| **Gray 300**       | text-gray-300   | -             | Secondary text                   |
| **Gray 200**       | text-gray-200   | -             | Subheadings                      |
| **Gray 100**       | text-gray-100   | -             | Section titles                   |
| **Gray 800**       | bg-gray-800     | -             | Skill tags                       |
| **Black**          | #000000         | 0, 0, 0       | Primary background               |
| **White**          | #FFFFFF         | 255, 255, 255 | Primary text                     |

### 5.4 Typography

**Font Families:** System defaults (no custom fonts loaded)

**Font Sizes Used:**

- `text-8xl` (6rem) - Main hero heading
- `text-6xl` (3.75rem) - Page section titles
- `text-5xl` (3rem) - Connect page title
- `text-4xl` (2.25rem) - Subheadings
- `text-3xl` (1.875rem) - Section headers
- `text-2xl` (1.5rem) - Sub-section titles
- `text-xl` (1.25rem) - Card titles, skill headers
- `text-lg` (1.125rem) - Body text, descriptions
- `text-base` (1rem) - Standard text
- `text-sm` (0.875rem) - Project descriptions, small text
- `text-xs` (0.75rem) - Badges, labels

**Font Weights:**

- `font-bold` (700) - Headings
- `font-semibold` (600) - Subheadings, titles
- (default 400) - Body text

### 5.5 Layout Patterns

**Container Max-Widths:**

- `max-w-7xl` - Skills page container
- `max-w-3xl` - About page sections
- `max-w-2xl` - Home page description
- `max-w-sm` - Project cards
- `max-w-[1000px]` - Connect card

**Common Padding:**

- `px-4` / `px-8` - Horizontal page padding
- `py-8` / `py-12` / `py-20` - Vertical section padding
- `pt-32` - Skills page top padding (for nav)
- `p-4` / `p-8` / `p-12` - Card padding

**Grid Patterns:**

- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` - Projects
- `grid-cols-1 lg:grid-cols-2` - Skills page

**Z-Index Scale:**

- `z-50` - NavDock (highest)
- `z-20` - BoxReveal overlay
- `z-10` - Card content
- `z-[9]` - AnimatedButton arrows
- `z-[1]` - Gradient backgrounds

### 5.6 Responsive Breakpoints

**Breakpoints Used:**

- `sm:` (640px) - Primary mobile → tablet
- `lg:` (1024px) - Tablet → desktop
- `md:` is rarely used

**Responsive Patterns:**

```css
/* Text scaling */
text-6xl sm:text-8xl      /* Hero heading */
text-2xl sm:text-4xl      /* Subheading */
text-4xl sm:text-6xl      /* Section titles */

/* Grid changes */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  /* Projects */
grid-cols-1 lg:grid-cols-2                  /* Skills */

/* Padding adjustments */
px-4 sm:px-8              /* Page padding */
p-8 sm:p-12               /* Card padding */
```

---

## PHASE 6: Content Extraction

### 6.1 Complete Text Content

#### LandingPage

```
Button: "Welcome, Let's get started"
```

#### HomePage

```
Heading (H1): "Hey, I'm Raj"

Subheading (H2): "Builder. Growth Engineer."

Description (P): "I build things that matter - AI-powered tools, full-stack platforms, and products designed for people who don't read documentation. Currently studying CS & Data Science at UW-Madison, working on projects that sit at the intersection of tech, growth, and 'wait, that's actually possible now?'"
```

#### AboutPage

```
Page Title: "Behind the Code"

Section 1 Title: "The Origin Story"
Section 1 Content: "I've wanted to build something of my own for as long as I can remember. I just didn't know what. So I did what any rational person would do: picked the field everyone was talking about. Turns out, that was actually a good call. What started as riding the hype wave became genuine fascination. CS & Data Science at UW-Madison, graduating May 2026."

Section 2 Title: "The Bet I'm Making"
Section 2 Content: "Here's a take that might age well: the traditional SWE role is evolving. When tedious technical work can be automated, what's left? Engineers who understand the why, not just the how. People who bridge tech and business, who think about distribution as much as architecture. That's Growth Engineering — still under-recognized, but I think it's where things are heading. I'm betting on that."

Section 3 Title: "How I Build"
Section 3 Content: "Every project has reinforced one principle: complexity is fine, confusion is not. You can build something powerful and feature-rich, but if the learning curve makes users feel stupid, you've failed. Good products are learnable. They don't gatekeep. Every design choice should serve the widest possible audience."

Section 4 Title: "Beyond the Code"
Section 4 Content: "Sports. Music. And lately, a weird rabbit hole: the engineering behind iconic fashion pieces — how a handbag gets its structure, why certain fabrics behave the way they do. Fashion engineering is a whole field I didn't know existed. Also, I have opinions about AI uncertainty and why blindly trusting the numbers is... optimistic."

Section 5 Title: "Let's Build Something"
Section 5 Content: "I'm still looking for the right problem to solve — the kind that seemed impossible until suddenly it wasn't. If you're working on something interesting, I'd love to hear about it."
```

#### SkillsPage

```
Page Title: "My Digital Footprint"

Education Section:
- University: "University of Wisconsin-Madison, Madison, WI"
- Degree: "B.S. in Computer Science & Data Science"
- Graduation: "Expected Graduation: May 2026"
- Coursework: "Programming (Java, Python), Data Modelling (R), Intro to Comp Engineering, Intro to UI, Machine Organization, DBMS, Matrix Methods in ML, DS Computing Projects, Intro to ANN, SWE, Sports Analytics, Data Visualization"

Professional Experience Section:
Experience 1:
- Title: "Technical Consultant / Full-Stack Engineer"
- Badge: "Current"
- Company: "Oxford University – AIDCPT / Translalia Project"
- Location: "Remote, Oxford, UK | Aug 2025 – Present"
- Description: "Built Translalia, an AI poetry-translation workspace for students using Next.js, React, TypeScript, Supabase, and GPT-4/5. Architected Redis async pipeline that cut API usage by ~40%."

Experience 2:
- Title: "Growth Engineer / Full-Stack Engineer"
- Badge: "Current"
- Company: "Cosmos Manpower Pvt. Ltd. – MyCosmosJobs Portal"
- Location: "Remote, Gujarat, India | Dec 2025 – Present"
- Description: "Architecting full-stack rebuild of job portal with automated ETL pipelines and database optimization for high-volume recruitment operations."

Experience 3:
- Title: "Full Stack Developer Intern"
- Company: "Attri.ai"
- Location: "Remote, Austin, TX | Jun 2024 – Oct 2024; Jun – July 2025"
- Description: "Built trademark similarity web app with ML-based image comparison. Contributed to AI chatbot projected to reduce support needs by ~40%. Returned Summer 2025 to support team."

Skills Section:
Languages & Tools: Java, Python, R, HTML, CSS, JavaScript, C, Git, Figma, Docker, VS Code, Emacs, Linux, Supabase, Cursor, Azure, Redis

Frameworks & Technologies: React, NestJS, React Native, TypeScript, TailwindCSS, PostgreSQL, NumPy, PyTorch, TanStack, Spring Boot, Next.js, SQL

Focus Areas:
- Full-Stack Development
- AI/ML & Agentic AI
- Growth Engineering

Interpersonal Skills:
- Cross-functional Communication (tech ↔ non-tech)
- End-to-End Project Ownership
- Product Thinking & User-Centric Design
- Problem Decomposition & Systems Thinking
```

#### ProjectsPage

```
Page Title: "The Code Canvas"

Project 1:
- Name: "Translalia"
- Status: "🟢 Live"
- Subtitle: "Oxford University AIDCPT Project"
- Description: "AI poetry-translation workspace for students (ages 12-16) focused on translator agency and cultural nuance. Features preference-driven prompting generating multiple translation variants across language varieties."
- Tech: Next.js, React, TypeScript, Supabase, GPT-4/5, Redis

Project 2:
- Name: "MadHelp"
- Status: "✓ Completed"
- Subtitle: "AI Course Planning Assistant"
- Description: "Full-stack AI-powered course planning assistant for UW-Madison students. Features intelligent course recommendations, research lab matching, and interactive prerequisite graph visualization. Semantic search across 200+ labs and thousands of courses."
- Tech: FastAPI, Next.js 15, OpenAI API, Python

Project 3:
- Name: "PCB Defect Detection"
- Status: "✓ Completed"
- Subtitle: "Neural Networks Project"
- Description: "Machine learning system for detecting defects in printed circuit boards using various neural network architectures including CNNs. Built as part of ECE/CS/ME 539 coursework."
- Tech: Python, PyTorch, CNNs

Project 4:
- Name: "MyCosmosJobs"
- Status: "🚧 In Development"
- Subtitle: "Cosmos Manpower Pvt. Ltd."
- Description: "Full-stack job portal rebuild with automated data pipelines, ETL processes, and digital marketing automation tools for high-volume recruitment operations in Gujarat, India."
- Tech: Full-Stack, ETL, Automation
```

#### ConnectPage

```
Page Title: "Let's Talk!"

Location: "📍 Madison, WI"

Description: "Interested in working together or have a question? Feel free to reach out. I'm here to help you turn your ideas into amazing digital realities."

Open To: "Currently open to: internships, collaborations, interesting conversations"

Contact Links:
- Email: rajtri286@gmail.com
- GitHub: https://github.com/RajTrivedi06
- LinkedIn: https://www.linkedin.com/in/raj-trivedi-a28589210/
- Resume: (placeholder - "coming soon")

Footer: "Or email me directly at rajtri286@gmail.com"
```

### 6.2 Image Assets

| Asset                  | Location    | Used In                      | Notes                     |
| ---------------------- | ----------- | ---------------------------- | ------------------------- |
| ChatImage.png          | src/assets/ | ProjectsPage (Translalia)    | Chat interface screenshot |
| coursesearchAI.jpg     | src/assets/ | ProjectsPage (MadHelp)       | Course search interface   |
| houseimage.png         | src/assets/ | ProjectsPage (PCB Detection) | Placeholder               |
| connectcablesimage.jpg | src/assets/ | ProjectsPage (MyCosmosJobs)  | Cables/network imagery    |
| HomePageProp.svg       | src/assets/ | UNUSED                       | Decorative element        |

### 6.3 External Links

| Type     | URL                                                | Location    |
| -------- | -------------------------------------------------- | ----------- |
| GitHub   | https://github.com/RajTrivedi06                    | ConnectPage |
| LinkedIn | https://www.linkedin.com/in/raj-trivedi-a28589210/ | ConnectPage |
| Email    | mailto:rajtri286@gmail.com                         | ConnectPage |

### 6.4 SVG/Icon Usage

**Inline SVGs:**

- HomePage: Decorative crosshair pattern (bottom-right corner)

**Icon Libraries:**

- Lucide React (NavDock): HomeIcon, UserIcon, CodeIcon, FolderIcon, MailIcon
- Radix Icons (AboutPage): HeartFilledIcon, RocketIcon, MixerVerticalIcon, CrumpledPaperIcon, ChatBubbleIcon
- Radix Icons (ConnectPage): GitHubLogoIcon, LinkedInLogoIcon, EnvelopeClosedIcon, FileTextIcon

**Scrollytelling Potential:**

- Inline SVG paths can be animated with GSAP DrawSVG
- Icons can stagger in with scroll progress

---

## PHASE 7: Performance Baseline

### 7.1 Current Bundle (Estimated)

```
Major Dependencies Contributing to Bundle:
- framer-motion: ~150KB (gzipped: ~50KB)
- motion: Duplicate of above (check tree-shaking)
- react-router-dom: ~30KB
- @radix-ui/*: ~20KB total
- lucide-react: ~5KB (tree-shaken)
- tailwindcss: Compiled to CSS, not in JS bundle
```

**Estimated Total JS Bundle:** ~200-250KB gzipped

### 7.2 Performance Considerations

**Heavy Components:**

1. `BackgroundGradientAnimation` - 5 animated gradient orbs + mouse tracking
2. `WobbleCard` - Mouse move handler on every pixel

**Image Optimization:**

- ✅ Image preloading implemented in ProjectsPage
- ⚠️ No lazy loading
- ⚠️ No srcset/responsive images
- ⚠️ Images are imported directly (no optimization)

**Memoization:**

- ✅ Ripple uses `React.memo`
- ⚠️ Other components don't use memo (may not need it)

### 7.3 Scrollytelling Performance Concerns

1. **BackgroundGradientAnimation** - Consider replacing with CSS-only or simpler effect for landing
2. **WobbleCard mouse tracking** - May conflict with scroll; consider disabling during scroll
3. **5 gradient orbs animating continuously** - Heavy on GPU; should pause when off-screen
4. **Multiple Framer Motion animations** - GSAP may be more performant for scroll-driven

---

## PHASE 8: Integration Points for Scrollytelling

### 8.1 Scroll Container Analysis

**Current Container:**

- Window scroll (not a custom container)
- `SingleScrollPage` div with `scroll-smooth` class
- No overflow:hidden on body/html

**Nested Scroll Contexts:**

- None currently (good for Lenis integration)

**Position Fixed Elements:**

- `NavDock` - `fixed top-0 left-0 right-0 z-50`
- This will work fine with Lenis

### 8.2 Ref Architecture

```typescript
// SingleScrollPage refs (can be reused for ScrollTrigger)
const homeRef = useRef<HTMLDivElement>(null);
const aboutRef = useRef<HTMLDivElement>(null);
const skillsRef = useRef<HTMLDivElement>(null);
const projectsRef = useRef<HTMLDivElement>(null);
const connectRef = useRef<HTMLDivElement>(null);

// BackgroundGradientAnimation
const interactiveRef = useRef<HTMLDivElement>(null);

// BoxReveal
const ref = useRef(null); // IntersectionObserver target

// TypingAnimation (unused)
const elementRef = useRef<HTMLElement | null>(null);

// TextRevealByWord (unused)
const targetRef = useRef<HTMLDivElement | null>(null);
```

### 8.3 Event Handlers

**Current Event Listeners:**

- `onMouseMove` - WobbleCard, BackgroundGradientAnimation, Dock
- `onMouseEnter/Leave` - WobbleCard
- `onClick` - LandingPage button, ConnectPage resume button
- `scrollIntoView` - SingleScrollPage useEffect

**No Current:**

- No `scroll` event listeners
- No `resize` event listeners
- No `wheel` event listeners

### 8.4 State Affecting Scroll

**Route State:**

- `section` prop in SingleScrollPage determines initial scroll position
- Route changes trigger scroll

**Component State:**

- `curX`, `curY`, `tgX`, `tgY` in BackgroundGradientAnimation (mouse position)
- `mousePosition`, `isHovering` in WobbleCard

---

## PHASE 9: Compatibility & Migration Assessment

### 9.1 What Can Be Preserved ✅

- [x] Overall component structure
- [x] Styling system (Tailwind + CSS variables)
- [x] Color palette and theme
- [x] Typography scale
- [x] NavDock component (with modifications)
- [x] ShineBorder, WobbleCard, Tooltip components
- [x] Button component
- [x] All content and copy
- [x] Asset organization
- [x] Path aliases and TypeScript config

### 9.2 What Needs Refactoring ⚠️

1. **SingleScrollPage** → ScrollytellingContainer

   - Add Lenis smooth scroll
   - Add GSAP ScrollTrigger context
   - Change from route-triggered scroll to scroll-triggered routes

2. **NavDock**

   - Change `<Link>` to scroll triggers
   - Add active state based on scroll position
   - Optional: animate/hide on scroll

3. **BoxReveal**

   - Change from `useInView` to ScrollTrigger
   - Add scrub animation option

4. **BackgroundGradient**

   - Tie to scroll progress instead of time-based loop

5. **Page Section Components**
   - Add scroll-triggered entrance animations
   - Consider breaking into smaller "scene" components

### 9.3 What Needs Replacement 🔄

1. **Native scrollIntoView** → Lenis smooth scroll + GSAP ScrollTo
2. **React Router navigation** → Scroll-driven URL updates (optional)
3. **Time-based gradient animations** → Scroll-driven or CSS-only

### 9.4 New Dependencies Required

```json
{
  "dependencies": {
    "lenis": "^1.0.42", // Smooth scroll (formerly @studio-freight/lenis)
    "gsap": "^3.12.5" // Animation + ScrollTrigger
  }
}
```

**GSAP Plugins Needed:**

- ScrollTrigger (free)
- ScrollSmoother (Club GreenSock - optional, works with Lenis instead)
- DrawSVG (Club GreenSock - optional, for SVG animations)

### 9.5 Potential Conflicts

| Conflict                         | Severity | Resolution                                       |
| -------------------------------- | -------- | ------------------------------------------------ |
| Framer Motion + GSAP             | Low      | Use GSAP for scroll, FM for hover/interactions   |
| Lenis + scrollIntoView           | Medium   | Replace all scrollIntoView with lenis.scrollTo() |
| BrowserRouter scroll restoration | Medium   | Disable with `preventScrollReset`                |
| motion package duplicate         | Low      | Standardize on one import style                  |
| react-scrollspy unused           | None     | Remove package                                   |

---

## PHASE 10: Content-to-Scene Mapping

### 10.1 Current Information Architecture

```
Landing Page (/)
    │
    └── Click "Get Started"
          │
          ▼
    SingleScrollPage (/Home, /About, /Skills, /Projects, /Connect)
          │
          ├── Home Section (hero)
          ├── About Section (5 paragraphs)
          ├── Skills Section (education + experience + skills)
          ├── Projects Section (4 cards)
          └── Connect Section (contact)
```

### 10.2 Proposed Scrollytelling Scene Structure

```
SCENE 0: THE PORTAL (Landing)
- Full-screen gradient animation
- "Enter" button triggers transition to Scene 1
- Could animate: zoom into the gradient, fade out button

SCENE 1: INTRODUCTION (Home)
- "Hey, I'm Raj" - word-by-word reveal on scroll
- Subheading fades in
- Description paragraph reveals
- Decorative SVG draws in

SCENE 2: THE ORIGIN (About - Part 1)
- Title "Behind the Code" - splits and moves apart
- "The Origin Story" section animates in from left
- Text reveals paragraph by paragraph

SCENE 3: THE BET (About - Part 2)
- "The Bet I'm Making" section
- Could use horizontal scroll for this section
- RocketIcon animates (launch?)

SCENE 4: THE PHILOSOPHY (About - Part 3)
- "How I Build" section
- "Beyond the Code" section
- "Let's Build Something" section
- These could stack or tile

SCENE 5: THE JOURNEY (Skills/Experience)
- Timeline visualization of experience
- Skill tags fly in and arrange
- Education section parallax scrolls

SCENE 6: THE WORK (Projects)
- Horizontal scroll gallery of project cards
- Or: cards "fly" toward viewer (z-axis)
- Each card expands on scroll progress

SCENE 7: THE CONNECTION (Connect)
- Final "landing zone"
- Card scales up from small to full
- Social icons pop in
- Decorative ellipses animate into view
```

### 10.3 Content Chunks for Animation

**Headlines (large text reveals):**

- "Hey, I'm Raj" → letter stagger
- "Behind the Code" → split animation
- "My Digital Footprint" → typewriter
- "The Code Canvas" → paint brush reveal
- "Let's Talk!" → scale up

**Paragraphs (fade/slide reveals):**

- HomePage description
- 5 AboutPage section paragraphs
- Experience descriptions
- Project descriptions

**Lists (stagger animations):**

- 17 language/tool tags
- 12 framework tags
- 3 focus areas
- 4 interpersonal skills

**Cards (fly-in / z-axis):**

- 3 experience WobbleCards
- 4 project ShineBorder cards
- 4 contact buttons

**Decorative (draw/morph):**

- HomePage crosshair SVG
- ConnectPage ellipses
- Section divider lines

---

## PHASE 11: Technical Debt & Cleanup

### 11.1 Files to Delete

| File                              | Lines          | Reason              |
| --------------------------------- | -------------- | ------------------- |
| src/App.css                       | 1              | Empty               |
| src/pages/ExperiencePage.tsx      | 15             | Unused placeholder  |
| src/components/Navbar.tsx         | 68             | Replaced by NavDock |
| src/components/SiteLayout.tsx     | 19             | Unused              |
| src/components/AnimatedButton.tsx | 117            | Replaced            |
| src/components/ui/ripple.tsx      | 67             | Commented out       |
| src/assets/HomePageProp.svg       | -              | Unused              |
| **Total**                         | **~287 lines** |                     |

### 11.2 Packages to Remove

```json
{
  "react-scrollspy": "^3.4.3" // Never imported
}
```

### 11.3 Inconsistencies to Fix

1. **Motion import inconsistency:**

   - Some files: `import { motion } from "framer-motion"`
   - Some files: `import { motion } from "motion/react"`
   - Standardize on one (recommend `motion/react` as it's newer)

2. **"use client" directive:**

   - Some components have it, some don't
   - Not needed for Vite (Next.js directive)
   - Can remove all instances

3. **React import:**
   - Some files: `import React from "react"`
   - Some files: Don't import React (not needed in React 17+)
   - Can remove explicit React imports

### 11.4 TypeScript Improvements

1. **Missing types:**

   - `BoxRevealProps.children` should be `React.ReactNode` not `JSX.Element`

2. **Any types:**
   - None found (good!)

---

## Key Findings Summary

### For Scrollytelling Redesign

1. ✅ **Architecture is 70% compatible** - SingleScrollPage container with section refs
2. ✅ **Framer Motion already installed** - can coexist with GSAP
3. ✅ **TextRevealByWord component exists** - already scroll-driven, unused
4. ✅ **BoxReveal uses IntersectionObserver** - easy to convert to ScrollTrigger
5. ⚠️ **Route-based scroll needs refactoring** - move to scroll-driven navigation
6. ⚠️ **No smooth scroll library** - need Lenis
7. ⚠️ **Heavy background animations** - may need optimization
8. ❌ **Some unused code** - ~287 lines to delete

### Effort Estimates

| Task                                   | Effort          |
| -------------------------------------- | --------------- |
| Install & configure Lenis              | 1-2 hours       |
| Install & configure GSAP ScrollTrigger | 2-3 hours       |
| Refactor SingleScrollPage              | 4-6 hours       |
| Refactor NavDock                       | 2-3 hours       |
| Convert BoxReveal to ScrollTrigger     | 1-2 hours       |
| Add scroll animations to each section  | 6-10 hours      |
| Testing & polish                       | 3-4 hours       |
| **Total**                              | **19-30 hours** |

### Migration Order (Recommended)

1. **Cleanup first** - Delete unused files, fix inconsistencies
2. **Add Lenis** - Global smooth scroll
3. **Add GSAP ScrollTrigger** - Context provider
4. **Refactor SingleScrollPage** - Remove route-based scroll
5. **Refactor NavDock** - Scroll triggers instead of links
6. **Convert BoxReveal** - ScrollTrigger version
7. **Add section animations** - One section at a time
8. **Optimize performance** - Lazy loading, animation pausing

### Risks

| Risk                                  | Severity | Mitigation                                           |
| ------------------------------------- | -------- | ---------------------------------------------------- |
| Framer Motion + GSAP conflicts        | Medium   | Clear separation of concerns                         |
| Performance on mobile                 | High     | Progressive enhancement, reduce gradient animations  |
| Browser scroll restoration conflicts  | Medium   | Disable React Router scroll restoration              |
| Breaking existing functionality       | Medium   | Incremental migration, keep old code until new works |
| Bundle size increase (~50KB for GSAP) | Low      | Tree-shaking, code splitting                         |

---

## Appendix: Dependency Diff

### Current Dependencies

```json
{
  "@radix-ui/react-icons": "^1.3.2",
  "@radix-ui/react-slot": "^1.1.1",
  "@radix-ui/react-tooltip": "^1.1.6",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^11.16.0",
  "lucide-react": "^0.469.0",
  "motion": "^11.15.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "react-scrollspy": "^3.4.3", // REMOVE
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

### After Migration

```json
{
  "@radix-ui/react-icons": "^1.3.2",
  "@radix-ui/react-slot": "^1.1.1",
  "@radix-ui/react-tooltip": "^1.1.6",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^11.16.0", // Keep for hover interactions
  "gsap": "^3.12.5", // ADD
  "lenis": "^1.0.42", // ADD
  "lucide-react": "^0.469.0",
  "motion": "^11.15.0", // Consider removing (duplicate)
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

---

_End of Investigation Report_
