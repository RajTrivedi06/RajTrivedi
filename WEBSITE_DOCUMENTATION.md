# Raj Trivedi Portfolio Website - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technical Stack](#technical-stack)
3. [Architecture & Routing](#architecture--routing)
4. [Page-by-Page Content Analysis](#page-by-page-content-analysis)
5. [UI Components & Animations](#ui-components--animations)
6. [Styling & Theming](#styling--theming)
7. [Build & Deployment](#build--deployment)
8. [Assets & Resources](#assets--resources)

---

## Overview

This is a modern, animated portfolio website for **Raj Trivedi**, a Computer Science and Data Science student at the University of Wisconsin-Madison (expected graduation: May 2026). The website showcases his projects, skills, experience, and provides contact information.

**Key Features:**
- Single-page scroll experience with smooth section navigation
- Landing page with animated gradient background
- Modern UI with purple-themed color scheme (#9B5CFF)
- Responsive design for all screen sizes
- Interactive animations using Framer Motion
- Fixed navigation dock at the top

**Deployment:** GitHub Pages at `https://rajtrivedi06.github.io/RajTrivedi`

---

## Technical Stack

### Core Technologies
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 6.0.5** - Build tool and dev server
- **React Router DOM 7.1.1** - Client-side routing

### UI & Animation Libraries
- **Framer Motion 11.16.0** - Animation library (used as `motion/react`)
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **tailwindcss-animate 1.0.7** - Additional Tailwind animations
- **Radix UI** - Accessible component primitives:
  - `@radix-ui/react-icons` - Icon library
  - `@radix-ui/react-slot` - Slot component
  - `@radix-ui/react-tooltip` - Tooltip component

### Utility Libraries
- **class-variance-authority** - Component variant management
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes intelligently
- **react-scrollspy** - Scroll spy functionality (installed but not actively used)

### Development Tools
- **ESLint 9.17.0** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **gh-pages** - GitHub Pages deployment

### Build Configuration
- **Base Path:** `/RajTrivedi/` (configured in both `vite.config.ts` and `main.tsx`)
- **Path Alias:** `@/` maps to `src/` directory
- **Homepage:** `https://rajtrivedi06.github.io/RajTrivedi`

---

## Architecture & Routing

### Routing Structure

The application uses a two-tier routing system:

1. **Landing Page Route** (`/`)
   - Standalone page with animated background
   - Entry point with "Welcome, Let's get started" button

2. **Single Scroll Page Routes** (`/Home`, `/About`, `/Skills`, `/Projects`, `/Connect`)
   - All routes render `SingleScrollPage` component
   - Each route auto-scrolls to the corresponding section
   - Sections are stacked vertically in a single scrollable container

### Route Configuration

```typescript
Routes:
- "/" → LandingPage
- "/Home" → SingleScrollPage (section="Home")
- "/About" → SingleScrollPage (section="About")
- "/Skills" → SingleScrollPage (section="Skills")
- "/Projects" → SingleScrollPage (section="Projects")
- "/Connect" → SingleScrollPage (section="Connect")
```

**Note:** Experience route is commented out but structure exists for future use.

### Navigation System

**NavDock Component:**
- Fixed position at the top of the page
- macOS-style dock with icon magnification on hover
- Uses Framer Motion for smooth icon scaling
- Icons from Lucide React:
  - Home (HomeIcon)
  - About (UserIcon)
  - Skills (CodeIcon)
  - Projects (FolderIcon)
  - Connect (MailIcon)
- Tooltips on hover using Radix UI Tooltip

**Scroll Behavior:**
- Smooth scrolling to sections when navigating
- Uses `scrollIntoView({ behavior: "smooth" })`
- Refs are used to target specific sections

---

## Page-by-Page Content Analysis

### 1. Landing Page (`LandingPage.tsx`)

**Purpose:** Entry point with animated background and call-to-action

**Content:**
- Animated gradient background with interactive mouse tracking
- Single button: "Welcome, Let's get started"
- Full-screen layout

**Technical Details:**
- Uses `BackgroundGradientAnimation` component
- Gradient colors:
  - Start/End: Black (#000000)
  - First: Purple (155, 92, 255)
  - Second: Light Purple (210, 130, 255)
  - Third: Blue (100, 100, 255)
  - Fourth: Pink (220, 50, 200)
  - Fifth: Gray (60, 60, 60)
  - Pointer: Purple (155, 92, 255)
- Blending mode: `hard-light`
- Interactive gradient follows mouse cursor
- Navigation to `/Home` on button click

---

### 2. Home Page (`HomePage.tsx`)

**Purpose:** Introduction and welcome message

**Content:**
- **Heading:** "Hey, I'm Raj" (animated reveal)
- **Subheading:** "Welcome to my Website" (animated reveal)
- **Description:** 
  - "I'm a passionate software engineer who loves crafting interactive web experiences. This portfolio showcases my projects, my journey, and what I'm currently exploring. Take a look around and get in touch!"
- Decorative SVG graphic in bottom-right corner

**Technical Details:**
- Uses `BoxReveal` component for text animations
- Staggered animation delays (0.5s, 1s, 1.5s)
- Purple accent color (#9B5CFF)
- Full-screen height with centered content
- Black background with white text

---

### 3. About Page (`AboutPage.tsx`)

**Purpose:** Personal introduction, values, and aspirations

**Content Sections:**

1. **Page Heading:** "Behind the Code" (right-aligned with line on left)

2. **About Me:**
   - Icon: HeartFilledIcon (purple)
   - Content: Introduction to Raj Trivedi
   - Mentions: CS & Data Science student at UW-Madison, graduation May 2026
   - Aspiration: Future founder with big vision

3. **My Values and Aspirations:**
   - Icon: CrumpledPaperIcon (purple)
   - Content: Forward-thinking, learning, creativity + technology
   - Goal: Lead a startup that innovates tech interaction

4. **Why I Do What I Do:**
   - Icon: MixerVerticalIcon (purple)
   - Content: Building meaningful solutions, connecting dots
   - Focus: Making a difference and empowering others

5. **Let's Build the Future:**
   - Icon: RocketIcon (purple)
   - Content: Call to connect with like-minded people
   - Emphasis: Collaboration and real-world impact

**Technical Details:**
- Responsive padding and spacing
- Max-width container (max-w-3xl)
- Gray text hierarchy (gray-300, gray-400)
- Purple accent for icons and headings
- Icons from Radix UI

---

### 4. Skills Page (`SkillsPage.tsx`)

**Purpose:** Education, skills, and professional experience

**Content Structure:**

**Left Column:**

1. **Education:**
   - University of Wisconsin-Madison
   - B.S. in Computer Science & Data Science
   - Expected Graduation: May 2026
   - Relevant Coursework:
     - Programming (Java)
     - Data Modeling (R)
     - Data Programming (Python)
     - Intro to UI (Web Dev)
     - Intro to Comp Engineering
     - Machine Organization & Programming

2. **Professional Experience:**
   - **Library IT Help Desk Technician**
     - University of Wisconsin–Madison Memorial Library
     - Description: Tech support, troubleshooting, service-first mindset
     - Displayed in WobbleCard component
   
   - **Full-Stack Development Intern**
     - Attri.ai
     - Description: React.js, NestJS, Docker, Figma collaboration
     - Displayed in WobbleCard component

**Right Column:**

1. **Technical Skills:**
   - Full-Stack Development
   - React.js, CSS Frameworks, Containerization
   - API Integration, Version Control, UI/UX Design
   - Back-End Web Development
   - Cybersecurity
   - Java, Python, R
   - Computer Engineering Concepts

2. **Interpersonal Skills:**
   - Communication & Team Collaboration
   - Problem Solving & Time Management
   - Customer Service & Operational Efficiency
   - Attention to Detail & Technical Troubleshooting

**Technical Details:**
- Two-column grid layout (responsive: 1 col on mobile, 2 on desktop)
- WobbleCard components for experience items (3D hover effect)
- Hover effects on skill list items (gray-400 → white)
- Large top padding (pt-60) for spacing from NavDock
- Purple heading color (#9B5CFF)

---

### 5. Projects Page (`ProjectsPage.tsx`)

**Purpose:** Showcase portfolio projects

**Current Status:** Contains placeholder project descriptions

**Content Structure:**
- **Heading:** "The Code Canvas" (purple, large font)
- **Grid Layout:** 
  - 1 column on small screens
  - 2 columns on medium screens
  - 4 columns on large screens
- **Project Cards:** 4 placeholder projects
  - Each card uses `ShineBorder` component
  - Image at top (h-48)
  - Title and description below
  - Purple border animation (#9B5CFF)

**Image Assets:**
- ChatImage.png
- houseimage.png
- coursesearchAI.jpg
- connectcablesimage.jpg

**Technical Details:**
- Image preloading on component mount
- Responsive grid with gap spacing
- Max-width constraint (max-w-sm) on cards
- Shine border animation on cards
- Black background with white text

---

### 6. Connect Page (`ConnectPage.tsx`)

**Purpose:** Contact information and social links

**Content:**
- **Heading:** "Let's Talk!"
- **Description:** 
  - "Interested in working together or have a question? Feel free to reach out. I'm here to help you turn your ideas into amazing digital realities. Looking forward to hearing from you soon!"
- **Contact Options:**
  - Email: rstrivedi2@gmail.com (mailto link)
  - GitHub: https://github.com/RajTrivedi06
  - LinkedIn: https://www.linkedin.com/in/raj-trivedi-a28589210/

**Visual Elements:**
- Two decorative ellipses (left and right, partially off-screen)
  - Left: Cyan border (#5EE2FF)
  - Right: Purple border (#9B5CFF)
- Animated gradient border card using `BackgroundGradient` component
- Icons from Radix UI (EnvelopeClosedIcon, GitHubLogoIcon, LinkedInLogoIcon)

**Technical Details:**
- Centered card with max-width (1000px)
- Animated gradient border (cyan to purple)
- Hover effects on contact buttons
- Responsive padding and spacing
- Black background

---

### 7. Experience Page (`ExperiencePage.tsx`)

**Status:** Currently commented out/unused

**Content:** Basic placeholder structure exists but route is disabled

---

## UI Components & Animations

### Core Animation Components

#### 1. BoxReveal (`box-reveal.tsx`)
**Purpose:** Animated text reveal with sliding box effect

**Features:**
- Text fades in from bottom (y: 75 → 0)
- Colored box slides across to reveal text
- Configurable duration and box color
- Uses Framer Motion's `useInView` for scroll-triggered animations

**Usage:** HomePage headings and text

---

#### 2. ShineBorder (`shine-border.tsx`)
**Purpose:** Animated glowing border effect

**Features:**
- Radial gradient border animation
- Configurable:
  - Border radius
  - Border width
  - Animation duration
  - Color (single or array)
- CSS mask technique for border effect
- Continuous animation loop

**Usage:** Project cards on ProjectsPage

---

#### 3. BackgroundGradientAnimation (`background-gradient-animation.tsx`)
**Purpose:** Interactive animated gradient background

**Features:**
- Multiple animated gradient orbs
- Interactive mouse tracking (optional)
- Configurable colors (5 gradient colors + pointer color)
- Blending modes (hard-light, etc.)
- Safari-specific optimizations
- SVG blur filters for smooth effect

**Usage:** LandingPage background

**Animation Details:**
- 5 separate gradient orbs with different animations:
  - `animate-first`: Vertical movement (30s)
  - `animate-second`: Circular movement, reverse (20s)
  - `animate-third`: Circular movement, linear (40s)
  - `animate-fourth`: Horizontal movement (40s)
  - `animate-fifth`: Circular movement (20s)
- Interactive pointer follows mouse cursor

---

#### 4. BackgroundGradient (`background-gradient.tsx`)
**Purpose:** Animated gradient border

**Features:**
- Horizontal gradient animation (left → right → left)
- Configurable animation toggle
- 5-second animation loop
- Cyan to purple gradient (#5ECCFF → #9B5CFF)

**Usage:** ConnectPage card border

---

#### 5. WobbleCard (`wobble-card.tsx`)
**Purpose:** 3D tilt effect card on hover

**Features:**
- Mouse position tracking
- 3D transform based on cursor position
- Parallax effect (background moves opposite to card)
- Noise texture overlay
- Smooth transitions

**Usage:** Experience cards on SkillsPage

---

#### 6. Dock (`dock.tsx`)
**Purpose:** macOS-style navigation dock

**Features:**
- Icon magnification based on mouse proximity
- Smooth spring animations
- Configurable:
  - Icon size
  - Magnification amount
  - Distance threshold
  - Direction (top/middle/bottom)
- Backdrop blur effect
- Uses Framer Motion's `useMotionValue` and `useSpring`

**Usage:** Main navigation (NavDock component)

---

#### 7. InteractiveHoverButton (`interactive-hover-button.tsx`)
**Purpose:** Animated button with hover effects

**Features:**
- Purple border and text (#9B5CFF)
- Glow shadow effect
- Scale transform on hover
- Background fill on hover (purple → black text)
- Focus ring for accessibility

**Usage:** LandingPage CTA button

---

### Supporting UI Components

#### Button (`button.tsx`)
- ShadCN-style button component
- Variant system using class-variance-authority
- Multiple variants (default, destructive, outline, secondary, ghost, link)
- Size variants (default, sm, lg, icon)

#### Tooltip (`tooltip.tsx`)
- Radix UI-based tooltip
- Accessible and keyboard-friendly
- Used in NavDock for icon labels

---

## Styling & Theming

### Color Scheme

**Primary Purple:** `#9B5CFF` (RGB: 155, 92, 255)
- Used for: Headings, borders, icons, accents, buttons

**Secondary Colors:**
- Cyan: `#5EE2FF`, `#5ECCFF`
- Gray scale: Various shades for text hierarchy
- Black: Primary background
- White: Primary text

### Tailwind Configuration

**Custom Animations:**
- `shine`: Border shine effect
- `ripple`: Ripple animation
- `first`, `second`, `third`, `fourth`, `fifth`: Gradient orb movements
- `moveHorizontal`, `moveInCircle`, `moveVertical`: Keyframe animations

**Custom Colors:**
- HSL-based color system with CSS variables
- Dark mode support (configured but not actively used)
- Chart colors defined but not used

**Border Radius:**
- Uses CSS variables: `--radius`
- Calculated variants: `lg`, `md`, `sm`

### CSS Variables

Defined in `index.css`:
- Background/Foreground colors
- Card colors
- Primary/Secondary/Accent colors
- Border/Input/Ring colors
- Chart colors (5 variants)
- Dark mode variants

### Typography

- Font sizes: Responsive (text-4xl to text-8xl for headings)
- Font weights: Bold (700), Semibold (600)
- Line heights: Relaxed for body text
- Text colors: White, gray-300, gray-400 for hierarchy

### Layout Patterns

- **Full-screen sections:** HomePage, LandingPage
- **Centered content:** AboutPage, ConnectPage
- **Grid layouts:** ProjectsPage, SkillsPage
- **Max-width containers:** Used for readability (max-w-3xl, max-w-7xl)

### Responsive Breakpoints

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px

**Responsive Patterns:**
- Grid columns: 1 → 2 → 4 (ProjectsPage)
- Text sizes: Smaller → Larger
- Padding: Reduced on mobile

---

## Build & Deployment

### Build Process

**Development:**
```bash
npm run dev
```
- Vite dev server with HMR
- Fast refresh enabled

**Production Build:**
```bash
npm run build
```
- TypeScript compilation (`tsc -b`)
- Vite production build
- Output: `dist/` directory

**Preview:**
```bash
npm run preview
```
- Preview production build locally

### Deployment

**GitHub Pages:**
```bash
npm run deploy
```
- Pre-deploy: Runs build
- Deploy: Uses `gh-pages` to deploy `dist/` to `gh-pages` branch
- Base path: `/RajTrivedi/` (configured in vite.config.ts)

**Configuration:**
- `package.json` homepage: `https://rajtrivedi06.github.io/RajTrivedi`
- `vite.config.ts` base: `/RajTrivedi/`
- `main.tsx` BrowserRouter basename: `/RajTrivedi/`

### TypeScript Configuration

**Files:**
- `tsconfig.json`: Base config with path aliases
- `tsconfig.app.json`: App-specific config
- `tsconfig.node.json`: Node-specific config

**Path Aliases:**
- `@/*` → `./src/*`

### Linting

**ESLint Configuration:**
- Modern flat config format
- TypeScript support
- React hooks rules
- React refresh plugin

---

## Assets & Resources

### Image Assets

Located in `src/assets/`:
- `ChatImage.png` - Project placeholder image
- `houseimage.png` - Project placeholder image
- `coursesearchAI.jpg` - Project placeholder image
- `connectcablesimage.jpg` - Project placeholder image
- `HomePageProp.svg` - Decorative SVG (not currently used)

### External Links

**Social Media:**
- GitHub: https://github.com/RajTrivedi06
- LinkedIn: https://www.linkedin.com/in/raj-trivedi-a28589210/
- Email: rstrivedi2@gmail.com

### Component Library

**ShadCN UI:**
- Style: "new-york"
- Base color: "zinc"
- CSS variables enabled
- Icon library: Lucide

**Magic UI Components:**
- Custom animated components
- Box reveal animations
- Shine borders
- Wobble cards
- Background gradients

---

## Code Organization

### Directory Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── NavDock.tsx      # Main navigation
│   ├── Navbar.tsx       # Alternative navbar (unused)
│   ├── SiteLayout.tsx   # Layout wrapper (unused)
│   └── AnimatedButton.tsx # Custom button (unused)
├── pages/               # Page components
├── lib/
│   └── utils.ts         # Utility functions (cn)
├── assets/              # Static assets
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

### Component Patterns

- **Functional Components:** All components use React functional components
- **TypeScript:** Full type safety with interfaces
- **Props:** Well-defined prop interfaces
- **Hooks:** useEffect, useState, useRef, useNavigate
- **Animation:** Framer Motion for all animations

---

## Performance Considerations

### Image Optimization
- Image preloading on ProjectsPage
- Responsive image sizing
- Object-fit: cover for consistent aspect ratios

### Animation Performance
- Hardware-accelerated transforms (translate3d, scale3d)
- CSS will-change hints
- Reduced motion considerations (motion-safe classes)
- Efficient re-renders with React.memo potential

### Code Splitting
- Route-based code splitting (React Router)
- Lazy loading potential for future optimization

---

## Accessibility

### Current Implementation
- Semantic HTML elements
- ARIA labels on navigation links
- Keyboard navigation support (Radix UI components)
- Focus states on interactive elements

### Areas for Improvement
- Alt text for decorative images
- Skip to content links
- Screen reader announcements
- Color contrast verification

---

## Browser Compatibility

### Supported Features
- Modern CSS (Grid, Flexbox, CSS Variables)
- ES6+ JavaScript
- CSS Animations
- Backdrop blur (with fallback)

### Safari Optimizations
- Special blur handling in BackgroundGradientAnimation
- User agent detection for Safari-specific code paths

---

## Future Enhancements

### Commented/Unused Features
- Experience page route (structure exists)
- Ripple component on LandingPage (commented)
- Navbar component (alternative navigation)
- SiteLayout component (layout wrapper)

### Potential Additions
- Dark/light mode toggle
- More project details/pages
- Blog section
- Resume download
- Contact form
- Analytics integration

---

## Summary

This is a modern, well-structured portfolio website built with React, TypeScript, and Vite. It features:

- **5 main pages:** Landing, Home, About, Skills, Projects, Connect
- **Smooth animations:** Framer Motion throughout
- **Responsive design:** Mobile-first approach
- **Modern UI:** Purple-themed, clean aesthetic
- **Performance:** Optimized images and animations
- **Accessibility:** Semantic HTML and ARIA labels
- **Deployment:** GitHub Pages with proper base path configuration

The codebase is well-organized, type-safe, and follows modern React best practices. The website effectively showcases Raj Trivedi's skills, education, and projects while providing easy contact options.

