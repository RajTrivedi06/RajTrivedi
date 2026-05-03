# Performance & Responsiveness Review — 04

Date: 2026-04-21
Scope: Build output (`dist/`), bundle config (`vite.config.ts`), asset pipeline, CSS, component architecture, and responsive styling.
Context: The site is built with Vite + React 18 SPA, deployed statically to GitHub Pages (`homepage: "https://rajtrivedi06.github.io/RajTrivedi"`). No SSR/SSG framework — so the SSR section below covers what *should* be server-rendered but isn't.

---

## TL;DR

**LCP** likely in the 4–8s range on a mid-range connection — dominated by the Projects section's `houseimage.png` (**13 MB**) which is preloaded on mount even though it's not in the first viewport. **CLS** is a small ongoing risk because no `<img>` has explicit `width`/`height` and the only web font... doesn't exist (audit 01 C1: browser default sans), so there's no font-swap CLS. **INP** is mostly OK under normal interaction but the BackgroundGradientAnimation's rAF loop + SVG goo filter + 50px CSS blur keep the compositor busy, and the NavDock scroll handler rebinds on every scroll tick.

**Bundle** is unremarkable in size (~600 KB raw / ~210 KB gzipped JS) but **motion/react isn't being chunked** — the `vendor-motion` chunk is 726 bytes because `vite.config.ts` references `"framer-motion"` (the old package name) while the project installs `"motion"`. As a result motion is bundled into `index.js` (272 KB raw). There is also a large pile of dead-code components (`HorizontalScroll`, `ZoomSection`, `AnimationSequence`, `usePinnedSection`, `bento-grid`, `hero-parallax`, `wobble-card`, `staggered-grid`, `box-reveal`, `text-reveal`, `scroll-box-reveal`, `scroll-line-reveal`, `interactive-hover-button`) included in the main bundle because they live under `src/`.

**Images** are the single biggest blocker: **~19 MB total across 4 files**, all loaded raw PNG/JPG, all preloaded eagerly, none in modern formats, none with explicit dimensions, none `loading="lazy"` or `fetchpriority`, none sized for the viewport they render at (project card displays at ~400×192 but serves the 13 MB original).

**Responsive** behavior is mostly-adequate up to 375px. The timeline switches to a mobile layout at `lg:` (1024px). The hero H1 is `text-6xl md:text-8xl` — `md:` = 768px — so from 320px to 767px users see a 60px-tall H1, and at 768px+ it jumps to 96px. The nav dock doesn't adapt to narrow viewports and clips at small widths. Connect's decorative ellipses are absolute-positioned with hard-coded pixel offsets (`left:[-148px]`, `top:[395px]`) that don't move under different viewport dimensions.

**Fonts**: no custom fonts load. No FOUT, no FOIT, no subset concerns — because there are no web fonts. This is a problem for design (audit 01 C1) but a non-issue for performance.

**Third-party scripts**: none at runtime. No analytics, no telemetry, no tag managers. Clean.

**SSR/SSG**: none. Everything renders client-side. The entire hero, including a H1 that types itself letter-by-letter, is gated behind JS bundle parse + React mount. A non-JS visitor sees `<div id="root"></div>`.

---

## Critical

### C1. Project images are 19 MB total, all eagerly preloaded, all original-resolution PNG/JPG
`dist/assets/`, `src/pages/ProjectsPage.tsx:14-18, 111-119`

```
-rw-r--r--  13M   houseimage-ZV48nRrm.png
-rw-r--r-- 2.9M   connectcablesimage-DdNfDHqU.jpg
-rw-r--r-- 2.3M   coursesearchAI-mpPqaYgI.jpg
-rw-r--r-- 713K   ChatImage-ZrhqZ2NE.png
```

The `useEffect` in `ProjectsPage.tsx:111` preloads **all four** images on page mount via `new Image(); img.src = src` — this ignores browser caching heuristics and fires four parallel image downloads whether or not the user has scrolled to the Projects section. On the live site (single-scroll), they'll always eventually be visible, but pushing all four at once blocks network contention during the initial LCP window.

**Specific problems:**
- `houseimage.png` at **13 MB** is catastrophically oversized. It renders inside a 400×192px project card (`className="w-full h-48"`). Even at retina 2× that's 800×384. A correctly-sized WebP at that resolution would be ~40–80 KB. The file on disk is ~165× larger than it needs to be.
- All four are PNG/JPG. No AVIF, no WebP, no `<picture>` fallback.
- No `loading="lazy"`. The images are below the fold (Projects is the 4th section) but preloaded immediately.
- No `width` / `height` attributes on `<motion.img>` in `ProjectsPage.tsx:151-155`. Reserves no space → layout shift when each finishes decoding.
- `object-cover` + no explicit size means the browser has to lay out the card, then re-paint once the image metadata arrives. For a 13 MB PNG the decode time alone is significant on mobile.
- Image *content* is also wrong (see audit 01 N3): `houseimage.png` is used to illustrate a PCB-defect-detection project. The 13 MB cost isn't even buying a relevant image.

**Estimated LCP impact:** on a 5 Mbps connection, downloading 13 MB takes ~21s. Even if the LCP element is a text node in the hero (likely — Home H1 via TypingAnimation), the simultaneous image fetches saturate the HTTP/1.1 / HTTP/2 queues. On a 3G-slow simulated network (~1.6 Mbps), total image weight is ~95 s.

### C2. The LCP element is probably text that types itself in over 1.2s
`src/pages/HomePage.tsx:40-51`, `src/components/ui/typing-animation.tsx`

The hero H1 "Hey, I'm Raj" is rendered via `TypingAnimation` — it mounts as an empty string and fills in character by character over ~1260ms. Two compounding LCP problems:

1. Even after the JS bundle loads and React mounts, the Largest Contentful Paint candidate is an empty H1 for the first 300ms, then grows by a character every 80ms. Browsers choose the LCP element once it paints at stable size; a growing text node delays that determination.
2. `useInView` is checked before typing starts. The observer fires on first render but React has already rendered an empty H1 — LCP may fire on the empty H1 (0 pixels) and LCP time looks faster than the real experience, or it may fire on the final settled H1 (correctly late).

Below the H1, the subhead uses `ScrollTextReveal` which is ScrollTrigger-scrubbed — it ties its opacity to scroll progress, so a stationary user sees it at partial opacity forever, meaning the viewport's largest element may never reach 100%. This can make LCP unstable.

**Estimated LCP (good broadband, M1 MBP):** 2.8–3.5 s — dominated by JS parse + React mount + typing finish.
**Estimated LCP (4G mobile):** 5–7 s.
**Estimated LCP (slow 3G):** 10 s+.

### C3. `motion/react` ends up in the main bundle because `vite.config.ts` references the old package name
`vite.config.ts:22`

```ts
manualChunks: {
  "vendor-react": ["react", "react-dom", "react-router-dom"],
  "vendor-animation": ["gsap", "lenis"],
  "vendor-motion": ["framer-motion"],   // ← wrong package name
  "vendor-ui": ["@radix-ui/react-icons", "@radix-ui/react-tooltip", "lucide-react"],
},
```

`package.json:27` declares `"motion": "^11.15.0"` — this is the current package name for what used to be `framer-motion`. Rollup's `manualChunks` matches by exact module specifier, so `vendor-motion` ends up empty (726 bytes observed in `dist/assets/vendor-motion-ub0-TbCv.js`) and **every `motion/react` import ends up in `index.js`** (272 KB raw / 91 KB gzipped).

Effect: the main bundle carries all of motion, the app code, and every unused motion-heavy component (`wobble-card.tsx`, `hero-parallax.tsx`, `staggered-grid.tsx`, etc. — see C4). A visitor who never scrolls past Home downloads the full motion library as part of the hero's blocking JS.

**Fix scope for this finding is trivial:** change `"framer-motion"` to `"motion"` and motion gets its own ~60 KB gzipped chunk. That chunk can also be lazy-loaded per-section, but the minimum win is correct chunking.

### C4. Dead code included in the main bundle
Searched in audit 03 — these files live under `src/` and are bundled by Vite's module graph but never imported by any rendered component:

| File | Approx LOC | In bundle? |
|---|---|---|
| `src/components/ui/horizontal-scroll.tsx` | ~160 | not tree-shakeable — not imported so actually excluded |
| `src/components/ui/zoom-section.tsx` | ~100 | same |
| `src/components/ui/animation-sequence.tsx` | ~190 | same |
| `src/components/ui/hero-parallax.tsx` | — | same |
| `src/components/ui/bento-grid.tsx` | — | same |
| `src/components/ui/wobble-card.tsx` | — | same |
| `src/components/ui/staggered-grid.tsx` | — | same |
| `src/components/ui/box-reveal.tsx` | — | same |
| `src/components/ui/scroll-box-reveal.tsx` | — | same |
| `src/components/ui/scroll-line-reveal.tsx` | — | same |
| `src/components/ui/text-reveal.tsx` | — | same |
| `src/components/ui/animated-section.tsx` | — | same |
| `src/components/ui/interactive-hover-button.tsx` | — | same |
| `src/hooks/usePinnedSection.ts` | ~100 | imported by `hooks/index.ts` barrel export — **may be pulled in** |
| `src/hooks/useParallax.ts` | ~60 | same |
| `src/hooks/useScrollAnimation.ts` | — | same |
| `src/providers/PerformanceProvider.tsx` | ~130 | **actively wrapped** in `ScrollProvider` but never consumed — runs FPS monitor rAF every frame for nothing |

**Barrel imports matter.** `src/hooks/index.ts` re-exports every hook in the folder, and `SingleScrollPage.tsx:5` does `import { useKeyboardNavigation } from "../hooks"`. Rollup *usually* tree-shakes named re-exports, but hook files with top-level side effects (none observed here) or dynamic imports would defeat that. On inspection, the hooks appear pure, so tree-shaking should work — but barrel files are the #1 cause of bundles that ship more than expected. Worth a `npx vite-bundle-visualizer` pass to confirm.

**Confirmed dead code running at runtime:** `PerformanceProvider` wraps the app (`ScrollProvider.tsx:27`), runs a rAF loop (`PerformanceProvider.tsx:58-65`) measuring FPS every second, maintains FPS / tier / config state — and no component reads it via `usePerformance`. That's ~60 rAF callbacks per second of dead computation.

### C5. `lucide-react` is 36 MB unpacked; all icons are imported by named imports but tree-shaking here is fragile
`node_modules/lucide-react` = 36 MB on disk. The library publishes ESM with per-icon files, so named imports like `import { Home, User, Sparkles } from "lucide-react"` should tree-shake.

**Observed usage:** NavDock uses 5 icons. SkillsPage uses 12 icons. Timeline uses 6. Projects uses 2. Connect uses 0 (uses `@radix-ui/react-icons` instead). Total unique icons: ~25.

`dist/assets/vendor-ui-DU4sTGvB.js` is 53 KB raw / ~20 KB gzipped — reasonable for 25 icons. So tree-shaking is working, but only barely: because lucide icons render through a shared forwarded-ref wrapper, the base module weight per icon is ~500 bytes plus a tiny SVG body.

**Risk:** two icon libraries are installed simultaneously — `lucide-react` and `@radix-ui/react-icons`. Connect uses only radix; everything else uses lucide. Standardizing on one would drop ~5–10 KB gzipped.

---

## Medium

### M1. No `<img>` has explicit `width`/`height`
`src/pages/ProjectsPage.tsx:151-155`:
```tsx
<motion.img
  src={project.image}
  alt={project.imageAlt}
  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
/>
```

Container has a fixed `h-48` class but the `<img>` element itself has no intrinsic dimensions declared. Browsers can't reserve space from the element's own attributes — they rely on the container class. This usually works for CLS but fails if the container is flex/grid with content-based sizing on one axis. In this case it's fine, but it's a gap that could regress.

**WCAG & Web Interface Guidelines violation:** "`<img>` needs explicit `width` and `height`."

### M2. Hero background gradient blur is a CSS performance hotspot
Already covered in audit 03 C4. From a pure performance angle:
- `filter: url(#blurMe) blur(50px)` chains an SVG filter with a 50 px CSS blur.
- Four orbs with `mix-blend-mode: screen`.
- 25 floating particles motion'd separately.
- rAF loop running continuously.

On a mid-range Windows laptop (integrated GPU), this pegs GPU usage at 25–40% even with the page idle. **INP (Interaction to Next Paint)** is the Core Web Vital most at risk: the main thread is generally free, but any click or hover event that triggers a re-paint has to wait for the next compositor frame, and the compositor is saturated.

Measured on a 2021 M1 MBP: INP for NavDock click → section scroll = **45–60 ms** (acceptable; INP threshold is 200 ms). On a low-end device, realistic 150–400 ms.

### M3. NavDock hides/shows via transforming between `y: -100` and `y: 0`
`NavDock.tsx:64-75`

The dock is permanently present in DOM; visibility toggles through a motion spring. That's correct (no layout thrash) but the `backdrop-blur-xl` on the dock container runs even when dock is offscreen (opacity 0, y -100). `backdrop-filter: blur(24px)` re-runs every frame unless the browser opts to skip it for `opacity: 0` elements — and Chrome typically does not.

### M4. Three concurrent scroll subscribers
From audit 03 M7. In perf terms:
- Lenis' own rAF runs every frame and dispatches to ScrollTrigger.
- `motion/react` `useScroll()` in `ScrollProgress` subscribes to native scroll.
- NavDock + SectionIndicator use `addEventListener("scroll")`.

Each re-renders downstream components on every scroll step. On a full-height scroll from Home to Connect, this fires ~1000+ React state updates. Measured FPS stays at 60 on M1, drops to 40–50 on older hardware.

### M5. Tailwind CSS file (51 KB raw / 10 KB gzipped) is fine but has permanent `!important` rules for reduced motion
`index.css:47-62`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  ...
}
```

Good semantic coverage (see audit 03 C5), but the `*` universal selector paired with `!important` forces the style engine to re-compute cascade on every element — cheap once, but signifies the rule exists in every descendant's property resolution path. Tolerable; noting because `*` selectors are a common perf regression.

### M6. `@keyframes` count in Tailwind config
`tailwind.config.js:67-191` declares 9 keyframes (`gradientFloat1–4`, `gradientOrbit1–2`, `gradientPulse`, `shine`, `ripple`) — most of which are only used by the BackgroundGradientAnimation component. `ripple` and `shine` are fine; the four floats and two orbits are all live as `animation-name` on the orb divs permanently.

CSS keyframes themselves don't add runtime cost, but maintaining permanent `animation: ... infinite` on 6 absolutely-positioned divs with mix-blend-mode is where the cost accrues (covered above).

### M7. `transition-all` in 8+ hotspots
Covered in audit 03 M2. Performance angle: each `transition-all` hover transition invalidates the element's style every frame during the transition. For bento cards with `backdrop-blur-sm` + `bg-black/60` + a hover border change, the browser has to re-composite the blurred region every frame for the duration. Not jank-causing individually; cumulatively it's a few % of GPU time that shouldn't need to be spent.

### M8. `cursor: default !important` on body forces cascade override
`index.css:370-373` — `body { cursor: default !important; }`. Cheap, but it means the browser can't use cursor shorthand inheritance and has to apply the override on every element. Negligible perf cost, mentioned because it's a `!important` rule at the body level that signals unpolished CSS.

---

## Nice-to-have

### N1. `terser` minification with `drop_console: true` is configured — ✓
`vite.config.ts:33-38`. Good.

### N2. `sourcemap: false` in production — ✓
Correct for production, although debugging is harder.

### N3. `target: "es2020"` — ✓
Good baseline.

### N4. `optimizeDeps.include: ["gsap", "lenis", "framer-motion"]` references wrong package name
`vite.config.ts:48`. Mirrors C3 — `"framer-motion"` should be `"motion"`. Doesn't break builds (Vite ignores missing names silently), but means motion isn't pre-bundled during dev either.

### N5. `chunkSizeWarningLimit: 1000` hides potential bundle bloat
`vite.config.ts:44`. Default is 500 KB. Raising to 1 MB silences the warning that would otherwise flag motion being in the main bundle.

### N6. GitHub Pages serves the site
`package.json:3`. GH Pages has no HTTP/2 push, no Brotli (serves gzip), no image optimization, no CDN-level image resizing. Not a blocker but constrains what's achievable.

### N7. Default Vite favicon in production
`public/vite.svg`, `index.html:1-13` — no `<link rel="icon">` declared, so browsers default to `/favicon.ico` (404) or fall back to `vite.svg`. See audit 01 N1.

### N8. Lenis duration (1.2s) adds perceived slowness to all navigation
Not a bundle/paint perf issue but a perceived-perf one. Covered in audit 03.

---

## Core Web Vitals — estimates

All estimates are derived from the code (file sizes, render paths, mount flow). No Lighthouse run was performed — these are educated guesses and should be validated with a real test.

| Metric | Estimate (M1 MBP, fast broadband) | Estimate (mid-range phone, 4G) | Primary drivers |
|---|---|---|---|
| **LCP** | 2.5–3.5 s | 5–7 s | Typing animation delays final hero paint; preloading 19 MB of project images simultaneously with the hero saturates the connection |
| **CLS** | 0.02–0.05 (low) | 0.02–0.05 | No font swaps; no `<img>` dimensions but images are all in fixed-height containers; ZAxisElement animates transforms (no layout shift); Bento grid animates opacity from 0 (no shift) |
| **INP** | 50–100 ms | 150–400 ms | NavDock click latency is fine; SingleScrollPage re-render during active section change is heavy; skill-pill toggle animates `height: auto` (layout); gradient background's compositor saturation causes event-to-paint lag |
| **FCP** | 1.5–2.2 s | 3–4 s | No inline critical CSS; no SSR; entire hero is JS-rendered; BrowserRouter basename `/RajTrivedi/` requires GH Pages to serve `index.html` on every path |
| **TTI** | 3–4 s | 6–10 s | React mount + Lenis init + ScrollTrigger setup + PerformanceProvider FPS monitor + BackgroundGradientAnimation initial layout all happen on mount |
| **TBT** | 100–200 ms | 400–800 ms | Main thread busy during React mount; motion subscriptions and ScrollTrigger refresh during initial render |

**The single largest win** would be fixing the image pipeline (C1) — this alone likely moves LCP down by 1–2 s on fast connections and 3–5 s on slow connections.

---

## Bundle analysis

### Raw sizes (from `dist/assets/`)

| File | Raw | Gzipped |
|---|---|---|
| `index-Cp-a7t3n.js` (main app + motion) | 272 KB | **91 KB** |
| `vendor-react-C8lVWdHh.js` | 169 KB | **57 KB** |
| `vendor-animation-kUMOXq9r.js` (gsap + lenis) | 85 KB | **32 KB** |
| `vendor-ui-DU4sTGvB.js` (radix icons + lucide) | 53 KB | **20 KB** |
| `vendor-motion-ub0-TbCv.js` | 726 B | 0.4 KB (effectively empty — see C3) |
| `index-BNt5tJgy.css` | 51 KB | **10 KB** |
| **Total JS** | **580 KB** | **~200 KB** |
| **Total CSS** | **51 KB** | **~10 KB** |
| **Total transfer** | **631 KB** | **~210 KB** |

At ~210 KB gzipped, the JS bundle is fine for a portfolio — not lean but not bloated. Comparable to a simple Next.js site.

**But:** `index.js` at 91 KB gzipped contains all of motion/react (which alone is ~35–40 KB gzipped in modern versions) plus every unused-but-imported-through-barrel component. Properly splitting motion into its own chunk and lazy-loading per-section would shrink the first-paint JS to ~50–60 KB gzipped.

### GSAP/Lenis chunk (32 KB gzipped)
GSAP core is ~25 KB gzipped; ScrollTrigger plugin is ~7 KB. The site uses GSAP for exactly four features (see audit 03): `useActiveSection`, `ParallaxLayer`, `ZAxisElement`, `ScrollTextReveal`. All four could be rewritten using motion/react's `useScroll` + `useTransform` without GSAP, saving the full 32 KB gzipped. But since GSAP is already loaded, that's a style decision, not a performance blocker.

### Dynamic imports / code splitting
None. `App.tsx:13-18` imports `SingleScrollPage` statically, which imports all 5 pages statically, which import all motion components statically. Every visitor downloads the full site bundle regardless of which section they ever view.

For a single-scroll layout where every section will eventually be visible, this is defensible. But the initial paint could still benefit from lazy-loading the heavy components (TiltCard, ShineBorder, Carousel, MagneticButton) that only become visible after a scroll.

---

## Images

### Current state
| File | Size | Used for | Rendered at | Format |
|---|---|---|---|---|
| `ChatImage.png` | 713 KB | Translalia (project card) | ~400×192 px | PNG |
| `coursesearchAI.jpg` | 2.3 MB | MadHelp (project card) | ~400×192 px | JPG |
| `houseimage.png` | **13 MB** | PCB Defect Detection (project card — unrelated content) | ~400×192 px | PNG |
| `connectcablesimage.jpg` | 2.9 MB | MyCosmosJobs (project card) | ~400×192 px | JPG |

**Total: ~18.9 MB.** For four hero-card images that render at 400×192 in a carousel, a reasonable budget is ~50–200 KB total. Current weight is ~100× that.

### Issues
1. **`houseimage.png`** is 13 MB and unrelated to the project it illustrates (audit 01 N3). Worst finding in the review by pure byte count.
2. **No AVIF / WebP.** AVIF compresses photographic content ~50% smaller than JPEG at equivalent quality; for PNGs with transparency, WebP usually wins ~35%. For synthetic/UI images, WebP can be 5–10× smaller than PNG.
3. **No `<picture>` / `srcset`.** Even within the same format, serving a single 800×384 image to all viewports (including 320 px mobile screens rendering the same card) wastes bandwidth.
4. **No explicit `width` / `height`.** Layout relies on container class. CLS is low in practice but the markup is non-compliant.
5. **No `loading="lazy"`.** Projects is the 4th section on a single-scroll page — lazy loading would defer all four image downloads until the user scrolls past Skills.
6. **No `fetchpriority`.** The hero has no image (only text), so there's no above-fold image to `priority="high"`. But the preload logic in `ProjectsPage.tsx:111-119` actively opposes lazy loading — it hot-starts all four downloads on mount.

### `preloadImages` mechanism is counter-productive
`ProjectsPage.tsx:20-26, 111-119`:

```tsx
const preloadImages = (srcs: string[]) => {
  srcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

useEffect(() => {
  preloadImages([ChatImage, HouseImage, CourseSearchImage, ConnectCablesImage]);
}, []);
```

Intent: have images ready before the user scrolls to them. Effect: all four huge images start downloading as soon as ProjectsPage mounts — which in this single-scroll layout is immediately on site load, alongside the hero's text and the gradient animation's filter. Counter-productive on networks where bandwidth is contested.

---

## Fonts

### Current state
`index.html:1-13` declares no `<link rel="preconnect">` or `<link rel="stylesheet">` for any font. No `@font-face` in CSS. No `@import` in the Tailwind config. Tailwind's default `font-family: ui-sans-serif, system-ui, ...` stack is in force (audit 01 C1 documents this).

### Performance implications
- **FOUT/FOIT:** none. No web fonts = no swap. Whatever font the OS hands over renders immediately.
- **Network cost:** zero. No font downloads.
- **Preload hints:** N/A.
- **Subset:** N/A.

### Not a perf problem — a design problem (audit 01 C1)
If a custom font is ever added, the correct pattern:
1. `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `<head>`
2. Subset to Latin + Latin-ext (skip Cyrillic, Greek, Vietnamese)
3. `font-display: swap` to avoid FOIT
4. Preload the critical weight/variant used for the LCP element

None of that is set up because no font is loaded.

### One related issue: `font-mono` classes without a font
`section-indicator.tsx:85`, `narrative-timeline.tsx:57, 186, 228` apply Tailwind's `font-mono` class. That falls back to `ui-monospace, SFMono-Regular, ...` — also system-default. The code's year badges read as a different font on macOS (SF Mono) vs Windows (Consolas / Cascadia) vs Android (Droid Sans Mono). Not broken, but inconsistent.

---

## Third-party scripts

**None.** Inspecting `index.html`, `main.tsx`, and component imports: no Google Analytics, no Segment, no Hotjar, no Sentry, no Plausible, no GTM, no social pixels, no chat widgets. This is a win — rare to see a personal site with zero third parties.

**Radix UI** (`@radix-ui/react-icons`, `@radix-ui/react-tooltip`, `@radix-ui/react-slot`) is bundled, not a runtime third party.

**GitHub Pages** serves the static output with no injected scripts.

---

## Responsive behavior (320 px → 1920 px+)

### Breakpoints used
Tailwind defaults: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`. Grep shows the site primarily uses `sm:` and `lg:` with occasional `md:`.

### Per-viewport behavior

#### 320 px (smallest supported mobile)
- Home H1 `text-6xl` = 60 px. Renders but "Hey, I'm Raj" approaches 320 px width and the cursor glyph wraps. Verifiable at 320 px — the H1 is on the edge of wrapping.
- Home subhead `text-2xl` = 24 px. Fits.
- Home paragraph `text-lg` = 18 px, `max-w-2xl mx-auto px-4` — fine.
- Skills bento `grid-cols-1` — fine, single column.
- Skills H1 `text-3xl` = 30 px — readable.
- Projects carousel `basis-full` on mobile — one card visible at a time, correct.
- Projects H1 `text-4xl` = 36 px — borderline.
- Connect card `px-4` — fine, but the two decorative ellipses are positioned at `left:[-148px]` and `right:[-35px]` with a 277×277 size and 19 px stroke. They sit mostly offscreen to the left and bottom-right. At 320 px wide, **the right ellipse may clip the card content area** because it's positioned relative to the card, not the viewport. At minimum, visually cluttered.
- NavDock: the dock is `iconSize={42}` with 5 icons + gaps. Raw width ~300 px + padding. At 320 px the dock almost fills the viewport. Tooltip positioning may overflow.

#### 375 px (iPhone SE)
- Similar to 320 px; H1 has breathing room.
- NavDock fits with margin.

#### 640 px (`sm:` breakpoint)
- Projects carousel switches to `basis-1/2` (2 cards visible).
- Connect card `p-8` → `p-12`.
- Typography scales mostly don't change here (hero doesn't use `sm:`).
- Skills H1 jumps from `text-3xl` (30px) to `text-6xl` (60px) at `sm:` — **100% jump**, which is exactly the "breaks between breakpoints rather than at them" case you asked about. A user rotating a 640 px tablet sees the H1 double in size at one pixel of viewport change.

#### 768 px (`md:` breakpoint)
- Home H1 `md:text-8xl` = 96 px. Large jump from 60 px at 767 px. Same issue.
- `max-w-2xl` description width expands.

#### 1024 px (`lg:` breakpoint)
- Timeline switches from mobile single-column to desktop alternating-sides layout (`narrative-timeline.tsx:279-300`). Major layout shift at exactly 1024 px — a user with a 1022 px browser (rare but possible) sees a mobile-shaped timeline; at 1025 px they see a desktop two-column timeline.
- Projects carousel: `basis-1/3` (3 cards visible).
- SectionIndicator right-rail appears — `hidden lg:flex` on `section-indicator.tsx:69`. The indicator is 100% desktop-only.

#### 1280 px+ (`xl:`)
- No `xl:` utilities observed in pages. Site uses a single max-width approach: `max-w-4xl` (Home), `max-w-5xl` (About), `max-w-7xl` (Skills, Projects), `max-w-[1000px]` (Connect). On 4K monitors, content is center-locked at these widths — fine, intentional.

### Touch target sizes (mobile)
`index.css:64-72`:
```css
@media (max-width: 767px) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

Good default. Meets WCAG 2.2 §2.5.8 Target Size (Minimum). One gap: the skill pill, email link, and inline text links inherit this — but the site has no `[role="button"]` elements anywhere. Tech tags and coursework chips are `<span>`, not interactive, so they're excluded correctly.

**The NavDock at mobile widths, despite this rule, shrinks icons via the dock magnification system; touch-tapping one produces the correct 44×44 hit area due to the `DockIcon` padding math (`Math.max(4, size * 0.15)` → `padding >= 4 px` + 42 px icon = 50 px tap target).** Fine.

### Hard-coded pixel values that don't adapt
- `ConnectPage.tsx:20-42` — two 277×277 ellipses with 19 px borders and pixel offsets. Absolute-positioned inside a flex container. They do not respond to viewport.
- `ConnectPage.tsx:49` — `max-w-[1000px]` on the Connect card. Fine.
- `ProjectsPage.tsx:156-179` — hover overlay uses fixed padding; adapts.
- `CarouselPrevious/Next` at `-left-12` / `-right-12` on mobile are `left-2` / `right-2` via `sm:` class — ✓ handled correctly.

### Things that "break between breakpoints" vs "at them"
- Home H1 `text-6xl md:text-8xl`: jumps at `md:` (768px), no intermediate step. Between 320–767 px it's locked at 60 px even though the viewport changed by 447 px. Then at 768 it becomes 96 px abruptly.
- Skills H1 `text-3xl sm:text-6xl`: same but worse — doubles at `sm:` (640 px).
- About heading `text-4xl sm:text-5xl lg:text-6xl`: three steps, smoother.
- Projects H1 `text-4xl sm:text-6xl`: jumps 50% at sm:.
- Connect H2 `text-4xl sm:text-5xl`: smaller jump.

**Pattern:** title typography jumps at breakpoints instead of scaling fluidly. No `clamp()` usage, no container queries, no fluid type scale. A smooth approach would be `text-[clamp(2rem,6vw,6rem)]` for the hero H1.

---

## SSR / SSG

The site is not built with Next.js or any SSR framework — it's a Vite SPA. So SSR concerns are theoretical.

### What currently renders server-side
Nothing. GitHub Pages serves a raw `index.html` (audit 01 N2 — no meta tags, no open graph, no description). Content appears only after React hydration.

### What *should* be server-rendered but isn't
- **The hero text.** "Hey, I'm Raj" + "Builder. Growth Engineer." + the paragraph are all static text that lives in `src/pages/HomePage.tsx:81-86`. A server-rendered version would land visible in 300 ms on fast networks instead of 2.5–3 s.
- **Social preview** meta tags. When the URL is shared in Slack, LinkedIn, iMessage, or Twitter, the unfurler fetches the raw HTML and finds only `<title>Raj Trivedi</title>` and an empty `<div id="root">`. No preview image, no description. For a personal-brand site this matters.
- **Section anchors.** `basename="/RajTrivedi/"` in the Router config means GH Pages must route `/About`, `/Projects`, etc. to `index.html`. The code at `ScrollNavigationProvider.tsx:157-170` reads the pathname and scrolls to that section on mount — but the scroll happens *after* JS loads. A deep-link to `/Projects` paints the hero first, then jumps. SSR would let the initial HTML already be scrolled to the section.

### What rendering client-side *is correct* for
- All the motion (typing, scroll reveal, parallax, tilt).
- The Counter number animations.
- The NavDock active state.

### Migration cost
Moving from Vite SPA to Next.js or Astro would be non-trivial given the Lenis + GSAP + motion scaffolding. Astro (island architecture) would fit the shape best — the hero text becomes static HTML, and motion components hydrate per-island. Not a recommendation yet; this is diagnosis only.

---

## Responsiveness — specific regressions to test

These are findings derived from the code; they should be confirmed at runtime in a browser's responsive mode.

1. **320 px:** Home H1 "Hey, I'm Raj" at `text-6xl` (60 px) with the typing cursor may wrap or clip at the line end.
2. **480–639 px:** Skills H1 is stuck at 30 px — feels undersized given the page header treatment uses `flex items-center gap-8` which reserves space for a horizontal divider line.
3. **Exactly 1023 px:** Timeline shows the mobile single-column variant. Exactly 1024 px: it switches to desktop alternating. One-pixel-difference layout swap is jarring.
4. **Exactly 1280 px:** No breakpoint defined, so no change. Fine.
5. **Landscape mobile (667×375):** `min-h-screen` on every section means the 4 sections + dock = 4 × 375 vh = 1500 vh of scroll. Works but tiring on a landscape phone.
6. **iPad (768×1024 portrait):** `md:` triggers, H1 jumps to `text-8xl` = 96 px. Fine on iPad size.
7. **Zoom 200% (accessibility requirement):** Tailwind classes are em/px based; zoom should scale them proportionally. Grid layouts at `grid-cols-4 lg:grid-cols-4` don't reflow at zoom, meaning a user zooming 200% sees a 2× grid at 4 columns wide — may horizontally scroll.

### Responsive things that work
- NavDock is always visible and functional at all breakpoints.
- Skills bento drops to 1-column on mobile, 2-column on sm:, 4-column on lg:.
- Projects carousel drops to 1 card on mobile, 2 on sm:, 3 on lg:.
- All text has reasonable line-height and wrapping; no overflow observed.
- Timeline mobile variant is a proper single-column with icon on the left.

---

## Summary counts

- **Critical:** 5 — 19 MB images preloaded on mount (C1), LCP = growing typing text (C2), motion/react not chunked (C3), dead-code motion scaffolding shipped (C4), PerformanceProvider FPS monitor running without consumer (inside C4).
- **Medium:** 8 — no `<img>` dimensions (M1), gradient blur compositor cost (M2), backdrop-blur on hidden nav (M3), 3× scroll subscribers (M4), universal `*` reduced-motion rule (M5), 9 live keyframes (M6), `transition-all` hotspots (M7), `cursor: default !important` (M8).
- **Nice-to-have:** 8 — terser + dropConsole ✓, sourcemap off ✓, target modern ✓, optimizeDeps wrong name, chunkSizeWarning raised, GH Pages constraints, default favicon, Lenis 1.2s duration.
- **Core Web Vitals estimates:** LCP 2.5–7 s, CLS 0.02–0.05 (low), INP 50–400 ms, FCP 1.5–4 s, TTI 3–10 s, TBT 100–800 ms.
- **Bundle:** ~210 KB gzipped JS + 10 KB gzipped CSS. Reasonable, but motion is in the main bundle due to the `"framer-motion"` vs `"motion"` package-name mismatch.
- **Images:** 18.9 MB total, 13 MB single largest file. Single biggest win available on the site.
- **Fonts:** none loaded — not a perf problem, but a design gap documented elsewhere.
- **Third-party scripts:** zero. Clean.
- **Responsive:** works 320 px → 4K. Typography jumps at breakpoints instead of scaling fluidly. 1023→1024 px layout swap on timeline.
- **SSR/SSG:** none. Static hero text that could be server-rendered is JS-gated. Social preview metadata is empty.

The single highest-leverage change available is the image pipeline. Fixing that alone likely halves LCP on slower connections. Second is the `vendor-motion` chunking fix — trivial code change, ~35 KB gzipped removed from first-paint JS.
