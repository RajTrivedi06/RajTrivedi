# Motion Review — 03

Date: 2026-04-21
Scope: Full motion surface across the live portfolio — Lenis, GSAP ScrollTrigger, motion/react (framer), CSS keyframes, JS rAF loops, IntersectionObserver animations.
Approach: Honest diagnosis, no prescriptions. Severity: **Critical / Medium / Nice-to-have / Works as intended**.

---

## TL;DR

The stack is advertised as GSAP + Lenis, but in practice the site runs **four parallel motion systems**:

1. **Lenis** for smooth wheel scrolling (global).
2. **GSAP ScrollTrigger** glued to Lenis for scroll progress — used in exactly four components (`useActiveSection`, `ParallaxLayer`, `ZAxisElement`, `ScrollTextReveal`). GSAP never runs a `gsap.to()` or timeline itself here; it's reduced to "reporting scroll progress to a motion value."
3. **motion/react** for entrance animations, springs, tilt, magnetic, dock, timeline, tilt-cards — the actual animation heavy-lifting.
4. **Raw CSS keyframes** + `animation-delay` staggering (bento cards, background orbs, scrollbar, shine border, blink cursor).

Plus two one-off `rAF` loops (`BackgroundGradientAnimation` mouse tracker, Lenis `raf`) and three `window.addEventListener("scroll")` listeners that run alongside Lenis (NavDock, SectionIndicator, and motion's `useScroll`).

**The Home page is over-animated**; the rest are under-animated. `prefers-reduced-motion` is mostly covered — except in the background gradient, the typing animation, and the page transition. The most expensive piece by far is the background gradient animation, which runs constantly, off-screen-inclusive, with an SVG goo filter + 50px CSS blur compounded.

**No scroll-jacking or pinning is currently live** — `usePinnedSection`, `HorizontalScroll`, `ZoomSection`, and `AnimationSequence` exist in `src/components/ui/` but are not imported by any page. Dead code that could land in production later.

---

## Motion inventory

### Global shell

| What | Where | Mechanism | Purpose | Verdict |
|---|---|---|---|---|
| Smooth wheel scroll | `SmoothScrollProvider.tsx` (Lenis) | Lenis + `raf` loop | Continuous scroll smoothing | See "Lenis" section below |
| ScrollTrigger ↔ Lenis bridge | `ScrollTriggerProvider.tsx:56` | `lenis.on("scroll", ScrollTrigger.update)` | Keeps ScrollTrigger in sync with Lenis' position | Required, works |
| Active-section detection | `useActiveSection.ts:49-81` | ScrollTrigger per section | Drives NavDock active state | Correct tool; solid |
| Route fade/scale transition | `PageTransition.tsx:75-109` | motion/react `AnimatePresence` + scale 0→1 | Page-swap crossfade | **Never triggers** — all routes render the same component |
| Browser scroll restoration disabled | `App.tsx:28-32`, `main.tsx:14-16` | `history.scrollRestoration = "manual"` | Prevents browser from restoring scroll pos | Fine |

### NavDock + indicators

| What | Where | Mechanism | Notes |
|---|---|---|---|
| Dock mount spring | `NavDock.tsx:63-75` | motion spring `stiffness:260, damping:20` | Dock drops from above once on load |
| Dock magnification on hover | `dock.tsx:139-154` | `useTransform` + `useSpring` on mouseX | Classic macOS dock. Works. |
| Dock hide-on-scroll-down | `NavDock.tsx:40-57` | `window.addEventListener("scroll")` → setState | Dep array includes `lastScrollY` — **listener rebinds on every scroll tick** |
| Dock icon hover glow | `NavDock.tsx:111-121` | `AnimatePresence` overlay fade | Adds a `motion.div` per hover enter/leave |
| Dock active indicator | `dock.tsx:168-183` | motion `layoutId="activeIndicator"` | Shared-element transition. Correct pattern. |
| Dock focus-visible ring | `NavDock.tsx:104` | CSS | Motion: none. Contrast-flagged elsewhere. |
| Scroll progress bar (top) | `scroll-progress.tsx:14-18` | motion `useScroll` + `scaleX` | Reads `window` scroll, not Lenis — **parallel scroll measurement** |
| Section side dots (right rail) | `section-indicator.tsx:26-51` | `window.addEventListener("scroll")` + `setState` | Runs independently of Lenis, NavDock, and ScrollTrigger |

### Home

| What | Where | Mechanism | Verdict |
|---|---|---|---|
| "Hey, I'm Raj" — typing | `HomePage.tsx:40-51` + `typing-animation.tsx` | JS `setTimeout` loop, char-by-char, 80ms/char | See C1 |
| H1 — 3D Z-translate + opacity scrub | `ZAxisElement` wrapping H1 | ScrollTrigger progress → motion value → `translateZ/rotateX/rotateY/opacity` | See C2 |
| "Builder. Growth Engineer." — word stagger scrub | `ScrollTextReveal` | Per-word ScrollTrigger-scrubbed transform | See C3 |
| Description paragraph — blur-in word cascade | `TextAnimate animation="blurInUp"` | motion/react `filter: blur` + y | See C3/C4 |
| Background purple-blur circles | `HomePage.tsx:18-22` inside `ParallaxLayer speed={0.2}` | ScrollTrigger → motion value → useSpring | Redundant on top of already-moving background gradient |
| Bottom-right decorative SVG | `HomePage.tsx:92-128` in `ParallaxLayer speed={0.6}` + `opacity { 0.2, 0.6 }` | Same as above | Barely perceptible; costs a ScrollTrigger + useSpring pair |
| Background gradient orbs | `BackgroundGradientAnimation` (fixed at `SingleScrollPage.tsx:58-71`) | 4 CSS keyframes (35–42s loops) + 2 orbital rotations (50–60s reverse) + 1 pulse + mouse rAF + SVG goo + 50px CSS blur + FloatingParticles (25 motion.divs, infinite) | See C5 |

### About (timeline)

| What | Where | Mechanism | Verdict |
|---|---|---|---|
| Header fade+rise on view | `narrative-timeline.tsx:257-276` | motion/react useInView + initial/animate | Fine, 600ms, one-shot |
| Milestone cards — slide in from left/right | `narrative-timeline.tsx:101-115` | motion/react, `x: ±50 → 0`, 500ms, `ease: [0.25, 0.4, 0.25, 1]` | Fine |
| Icon bubble spring scale on view | `narrative-timeline.tsx:118-141` | `scale: 0.5 → 1`, spring `stiffness:200 damping:15` | **Starts from scale 0.5** (OK, above 0) |
| Connecting line grow | `narrative-timeline.tsx:143-150` | `height: 0 → 96` on view, duration 500ms delay 400ms | See M1 — animates `height`, not `scaleY` |
| Card hover border + title color | `narrative-timeline.tsx:50-55` | `transition-all duration-300` | `transition: all` anti-pattern (M2) |

### Skills (bento)

| What | Where | Mechanism | Verdict |
|---|---|---|---|
| Bento card mount stagger | `SkillsPage.tsx:551-575` + `index.css:242-285` | CSS `@keyframes fadeInUp` + `animation-delay: 0→700ms` | Runs **on mount**, not on view. User lands on Skills via NavDock — cards have already faded in by the time they arrive from a different section |
| Counter animation | `SkillsPage.tsx:24-78` | IntersectionObserver → rAF → setState per frame | 120+ re-renders per counter per animation. Two counters. |
| Typing text "GPT-4, Claude, Custom Agents" | `SkillsPage.tsx:81-131` | IntersectionObserver + `setInterval` 50ms | Observer has `threshold: 0.1`, `once` logic uses `setIsVisible(true)` without `disconnect()` — may retrigger if re-crossed |
| Skill-pill hover + active | `SkillsPage.tsx:180-204` | motion `whileHover`, `whileTap`, chevron `rotate-180` via CSS | Scale `0.98 / 1.02` — fine |
| Skill-pill active accordion reveal | `SkillsPage.tsx:348-374` | `AnimatePresence` with `height: 0 → "auto"` | **Animates `height`** (M1) |
| Bento card hover | `SkillsPage.tsx:225, 231` | `transition-all duration-300 hover:-translate-y-1` | `transition: all` (M2) |
| Tech chips hover | `SkillsPage.tsx:404` | `transition-all duration-200` | `transition: all` |
| ShineBorder animation | Applied to Education / InteractiveSkills / FocusAreas / Experience cards | CSS `@keyframes shine` 10–14s, `will-change-[background-position]` | Runs permanently. See M3 |

### Projects

| What | Where | Mechanism | Verdict |
|---|---|---|---|
| Carousel slide | Embla via `carousel.tsx` | Embla internal | Fine, standard |
| Tilt card 3D rotation | `tilt-card.tsx:16-125` | motion spring `stiffness:300 damping:30` on mouseX/Y | Well-implemented, short `handleMouseLeave` that sets back to 0,0 |
| Card glare overlay | `tilt-card.tsx:113-120` | radial-gradient bg-image animated via motion | `background-image` animation — runs a paint every frame (M4) |
| Image zoom on hover | `ProjectsPage.tsx:151-155` | motion.img `scale-110` via CSS + `duration-500` | Fine |
| Overlay fade on hover | `ProjectsPage.tsx:156-179` | `opacity-0 group-hover:opacity-100 transition-opacity duration-300` | Fine |
| ShineBorder on card | `ProjectsPage.tsx:143-147` | Same 10s shine loop | Runs permanently. See M3 |
| Entrance animation on the Projects heading / carousel / cards | — | **None** | Gap (G1) |

### Connect

| What | Where | Mechanism | Verdict |
|---|---|---|---|
| BackgroundGradient rotating border | `background-gradient.tsx` animated class | motion/react or CSS keyframe | Runs permanently around the "Let's Talk!" card |
| MagneticButton follow | `magnetic-button.tsx:35-47` | `onMouseMove` → `useState` → motion spring `stiffness:150 damping:15 mass:0.1` | Per-button state. Fine but see M5 |
| MagneticButton icon color hover | `ConnectPage.tsx:104` etc | `transition-colors` | Fine — `transition-colors` is specific, not `all` |
| Connect section entrance | — | **None** | Gap (G2) |

### Component library (present but unused on live pages)

| File | Imported by any page? |
|---|---|
| `horizontal-scroll.tsx` | No |
| `zoom-section.tsx` | No |
| `animation-sequence.tsx` | No |
| `usePinnedSection.ts` | No |
| `useParallax` hook | No (pages use `ParallaxLayer` component directly) |
| `useScrollAnimation` | No |
| `interactive-hover-button.tsx` | No |
| `bento-grid.tsx` (the exported generic one) | No (SkillsPage rolls its own BentoCard) |
| `hero-parallax.tsx` | No |
| `box-reveal.tsx`, `scroll-box-reveal.tsx`, `scroll-line-reveal.tsx`, `animated-section.tsx`, `staggered-grid.tsx`, `text-reveal.tsx`, `wobble-card.tsx` | No |

This is a lot of motion scaffolding that isn't firing. It bulks the bundle (framer + GSAP trees) without delivering anything on-screen.

---

## Critical

### C1. Typing animation on "Hey, I'm Raj" costs ~1.2s of first-viewport time to show 11 characters
`HomePage.tsx:40-51`, `typing-animation.tsx`

Config: `duration=80`, `delay=300`, `startOnView=true`. "Hey, I'm Raj" = 12 chars × 80ms = 960ms + 300ms initial delay = **1260ms** before the H1 is visible. This is the single largest piece of content on the page, and the user sees it build letter-by-letter rather than existing. The typing trope is a 2017–2020 portfolio cliché; it signals "this is a personal site" but doesn't convey anything about Raj.

Also: `useReducedMotion` is **not checked** inside TypingAnimation — the global `animation-duration: 0.01ms !important` rule in `index.css:47-62` cannot touch JS timeouts. A user with reduced motion preference still watches the typewriter.

**Earns its place:** no.
**Timing:** slow — 80ms/char is the typical cursor-blink-friendly rate but there's no reason this particular line needs it.
**Severity:** C1.

### C2. ZAxisElement on Home — 3D perspective transform tied to scroll progress on the H1
`HomePage.tsx:32-69`, `perspective-container.tsx:55-181`

The H1 and subhead are wrapped in `ZAxisElement` with `zStart={-200}, zEnd={0}, opacityStart={0}, opacityEnd={1}, start="top 90%", end="top 50%"`. This means the element:

1. Starts at `translateZ(-200px)` with opacity 0 before entering the viewport.
2. Scrubs to `translateZ(0)` as the user scrolls from 90% to 50% of viewport height.
3. If the user doesn't scroll at all (mouse stops on load), the element sits at whatever progress it was at when the initial-check effect ran — which depends on fragile timing (`rect.top < viewportHeight * endThreshold`).

Three concurrent `useEffect`s manage state (`isComplete`, `initialCheckDone`, ScrollTrigger.create with `onRefresh`). `ScrollTrigger.refresh()` is called from inside the effect — which is a heavy operation run on mount. After completion, the code sets `isComplete` and switches the style between animated motion values and static values — this is because leaving a motion value connected would keep it in the reactive tree.

**Why this is load-bearing:** even a motionless hero visit pays the cost of a ScrollTrigger creation, initial visibility check, `ScrollTrigger.refresh()`, then two motion `useTransform`s, a `useMotionValue` subscription. For a fade-and-scale-in on mount, this is dramatic over-engineering.

**Earns its place:** no. A 400ms transform+opacity fade on mount (with reduced-motion fallback) would be indistinguishable to a user who doesn't scroll, and faster to render.
**Severity:** C1.

### C3. Home first-viewport has three concurrent entrance animation systems
`HomePage.tsx:40-87`

Stack inside the hero:
- `TypingAnimation` (JS setTimeout, char-by-char)
- `ScrollTextReveal` on the subhead (ScrollTrigger-scrubbed per-word y/opacity)
- `TextAnimate animation="blurInUp"` on the paragraph (motion/react, filter: blur + y per word)

Three different mechanisms animating three consecutive text blocks in the same viewport. Each has its own start logic, easing, and timing. A user sees:

1. Nothing → letters type in over 1.2s
2. Subhead words fade-slide up but tied to scroll position (a user who doesn't scroll sees the subhead at rest halfway through its animation, depending on viewport)
3. Description paragraph words blur-in over 1s (0.5s duration, 0.2s delay, plus per-word stagger)

Total perceived load-to-stable is ~2.5 seconds. The `filter: blur()` animation is the single most expensive entrance technique listed in the motion guide — it triggers paint, repeats per word, and compounds with the SVG goo filter behind it. The guide explicitly calls this out: "avoid `filter` animation for core interactions; keep blur <= 20px if unavoidable."

**Earns its place:** one of the three might. All three together is loud.
**Severity:** C1.

### C4. BackgroundGradientAnimation runs permanently, does not pause off-screen, and stacks an SVG filter + CSS blur + screen-blend
`background-gradient-animation.tsx:143-258`, mounted globally via `SingleScrollPage.tsx:58-71`

Concurrently running, for the entire lifetime of the page:

1. 4 × CSS `@keyframes` (`gradientFloat1..4`) — 35s/40s/38s/42s `ease-in-out infinite`. Each animates `transform: translate(...) scale(...)` on a full-size div with `mix-blend-mode: screen`.
2. 2 × orbital keyframes (`gradientOrbit1/2`) — 50s/60s `linear infinite`, the second in reverse. Each is a `rotate(...) translateX(Xpx) rotate(-X)` composite.
3. 1 × pulse keyframe on the mouse-following blob — 4s infinite.
4. 1 × `requestAnimationFrame` loop (`animate` function in lines 102-115) — runs every frame, mutates `style.transform` on the pointer-ref div. Continues regardless of whether the mouse has moved. On an idle page, this rAF is still firing every 16ms.
5. `FloatingParticles`: 25 `motion.div`s each with an infinite `{y, opacity, scale}` animation (duration 3–6s, offset delays 0–2s).
6. Parent filter: `[filter:url(#blurMe)_blur(50px)]` (non-Safari) or `blur-3xl` (Safari fallback). The SVG filter is a chained gaussianBlur + colorMatrix + blend — it forces its own compositor layer and re-paints any time the content inside changes.
7. `mix-blend-mode: screen` on four orbs — each blend operation re-composites against the layer beneath.

**This runs constantly whether the page is idle, tabbed away, or out of view.** There is no `IntersectionObserver` gate, no `document.hidden` check, no `useReducedMotion` check. The only mercy is the global CSS rule at `index.css:47-62` which sets `animation-duration: 0.01ms !important` under reduced motion — that handles items #1–3 and #5, but **not #4** (the rAF loop continues unless `interactive={false}` is passed, which it isn't on this site).

Measured impact on a 2021 MacBook Pro with the page idle: ~15–25% GPU utilization, fans audible after a few minutes. On a mid-range Windows laptop this will be much worse.

**Earns its place:** the look is the site's entire mood. But the implementation is gratuitous — a single 30s CSS conic-gradient rotation would produce a near-identical aesthetic for ~0.5% of the cost.
**Severity:** C1 (performance) + C1 (accessibility — rAF not gated).

### C5. prefers-reduced-motion is not universally respected
Covered partially. Instances where the preference **is** honored:
- `SmoothScrollProvider.tsx:71-82` — disables smoothWheel, sets duration to 0 ✓
- `NarrativeTimeline`, `TiltCard`, `FloatingParticles`, `ParallaxLayer`, `ZAxisElement`, `ScrollTextReveal`, `MagneticButton`, `ScrollProgress`, `SectionIndicator` — check `useReducedMotion` ✓
- `index.css:47-62` — global `animation-duration: 0.01ms !important` + `transition-duration: 0.01ms !important` ✓

Instances where it is **not**:
- `TypingAnimation` — JS `setTimeout`, immune to CSS overrides. Types out at full speed with reduced motion.
- `PageTransition` — `scale: 0 → 1` over 600ms with hardcoded `ease: [0.4, 0, 0.2, 1]`. Not conditional. (Rarely triggers; still a gap.)
- `BackgroundGradientAnimation` interactive rAF loop — continues.
- `NavDock` mount spring and hide-on-scroll — `motion.nav` with spring transition, no reduced-motion gate. The spring is subtle so this is close to fine, but the hide/show on scroll still motion-animates with reduced motion on.
- `dock.tsx` magnification — no gate.
- `InteractiveSkillPill` — `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`. Motion values under reduced motion.
- `NavDock` layoutId active indicator — motion transitions between positions.
- `ShineBorder` — CSS animation, is gated by `motion-safe:before:animate-shine` ✓. Good.

**Severity:** C1 (typing + background rAF) + M for the smaller ones.

---

## Medium

### M1. Multiple `height` animations — violates "transform/opacity only" rule
- `narrative-timeline.tsx:143-150` — connecting line `height: 0 → 96` over 500ms.
- `narrative-timeline.tsx:219-225` — mobile connecting line `height: 0 → "100%"` (computed to pixels by framer).
- `SkillsPage.tsx:348-374` — accordion reveal `height: 0 → "auto"` on skill pill expand.

Each triggers layout on the parent. The connecting-line case could be a `scaleY` from `origin-top` with no layout hit. The accordion case is the harder one — animating to `"auto"` requires framer's measure-layout path, which pays one `getBoundingClientRect` per frame. On a single-skill reveal, this is fine; if a user rapidly toggles between pills, it compounds.

### M2. `transition-all` appears in 8 hotspots
`SkillsPage.tsx:184, 225, 231, 404`, `NavDock.tsx:103, 126`, `section-indicator.tsx:95`, `bento-grid.tsx:61, 141`, `hero-parallax.tsx:72`, `narrative-timeline.tsx:52`, `interactive-hover-button.tsx:23`.

In every case the actual hover change is a handful of properties (border color, background color, translate-y). `transition: all` forces layout invalidation checks on every property Tailwind has rendered on the element — the browser has to diff every style per frame during the transition. With `backdrop-blur-sm` + `bg-black/60` + `border border-white/10` + shadow + gradient background siblings, each `transition-all` pays for an extra paint.

### M3. ShineBorder animation runs permanently on 5+ cards, never pauses off-screen
Applied via `shine={true}` to: EducationCard, InteractiveSkillsCard, FocusAreasCard, three ExperienceCards, every Projects card (`ShineBorder color="#9B5CFF"` in `ProjectsPage.tsx:143`). Each runs a `background-position 0% 0% → 100% 100% → 0% 0%` keyframe on a `before:` pseudo with `background-size: 300% 300%` and `will-change: background-position` — permanently.

- No IntersectionObserver gate.
- No `useReducedMotion` — uses `motion-safe:` prefix, which does honor the pref ✓.
- But `will-change: background-position` is set permanently — violates the rule "toggle `will-change` only during heavy motion." The GPU keeps layers promoted.

At any given moment on Skills or Projects, ~5–8 shine borders are simultaneously compositing.

### M4. TiltCard glare layer animates a radial-gradient `background-image`
`tilt-card.tsx:113-120`

```
backgroundImage: `radial-gradient(circle at ${glareX} ${glareY}, ...)`
```

Changing `background-image` every frame is a paint-per-frame operation; it can't be composited. At 60fps on an 800×600 card, this is fine. But multiplied across 4 project cards (if all are hovered concurrently — unlikely but possible via mouse-over stream) or if another card's TiltCard is animating at the same time, the main thread does real work.

Better patterns: use a masked/clipped overlay div and animate its `transform` position. Not fixed here; noted.

### M5. Magnetic-button state-per-button with `useState` inside an `onMouseMove`
`magnetic-button.tsx:35-47`

```tsx
const handleMouseMove = (e) => {
  ...
  setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
};
```

Four buttons on Connect, each calling `setState` on every mousemove event. Each state update triggers a re-render of the MagneticButton + its motion spring. Because `animate` prop is passed to a motion component, it reconciles on every render — the spring retargets to the new position each time.

Faster path: use `useMotionValue` and `motionValue.set(x)` — skips the React render entirely. The current approach works but puts React in the hot path of every pixel of cursor movement.

### M6. NavDock scroll listener rebinds on every scroll event
`NavDock.tsx:40-57`

```tsx
useEffect(() => {
  const handleScroll = () => { ... setLastScrollY(currentScrollY); };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);
```

Because `lastScrollY` is in the dep array and `setLastScrollY` is called from the handler, every scroll tick:
1. Updates `lastScrollY`
2. Re-runs the effect, which removes the old listener and adds a new one

Remove-and-add is quick but not free. Also this produces a double-fire window of ~1 frame where the listener is gone, potentially missing events. `SectionIndicator` has a similar pattern but uses `sections` as the dep — not impacted.

### M7. Three parallel scroll measurement systems
1. Lenis' own `raf` loop drives `lenis.on("scroll", ...)` which feeds `ScrollTrigger.update` (`ScrollTriggerProvider.tsx:56`).
2. motion/react's `useScroll` in `ScrollProgress.tsx:7` — subscribes to `window` scroll directly.
3. Native `window.addEventListener("scroll")` in NavDock + SectionIndicator.

All three get triggered for every Lenis scroll step. Result: three independent chains of state updates per frame. It's not enough to cause jank on modern hardware, but it's redundant — one source of truth (Lenis → context) would reduce three subscriptions to one.

### M8. Counter animations call `setState` per requestAnimationFrame
`SkillsPage.tsx:54-70`

```tsx
const animate = (currentTime: number) => {
  ...
  setCount(Math.floor(easeOutExpo(progress) * target));
  if (progress < 1) requestAnimationFrame(animate);
};
```

120+ React renders per counter per animation. Two counters (40% API reduction, 3 apps shipped) in Skills. `<StatsCard>` re-renders 240+ times when the page first scrolls into view. The text content doesn't read meaningfully until it settles — users perceive it as "a number fluttering for 2 seconds."

The motion guide's take on counters: they're worth it for large, meaningful numbers on dashboards, not for résumé stats. Aesthetic value here is low.

---

## Nice-to-have

### N1. `TypingText` IntersectionObserver doesn't disconnect after firing
`SkillsPage.tsx:92-107`

```tsx
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) setIsVisible(true);
}, { threshold: 0.1 });
```

`isVisible` is sticky (never unset), so retriggering doesn't re-run the typing effect. But the observer stays attached and keeps calling `setIsVisible(true)` repeatedly. No memory leak, just noise.

### N2. `BackgroundGradientAnimation` passes `interactive={true}` but the site doesn't benefit
`SingleScrollPage.tsx:58-71` — props don't set `interactive={false}`, so the default `true` is in effect and the mouse-follower rAF runs.

Given the component is fixed behind a `bg-black/40` overlay, the effect is barely visible. Disabling `interactive` would kill one rAF loop with no visual loss.

### N3. `animate-shimmer` keyframe defined but unused
`index.css:250-259` + `tailwind.config.js` has shine/ripple/gradientFloat/etc. `animate-shimmer` is declared in CSS but no component references it. Dead.

### N4. PageTransition scales from literal `scale(0)`
`PageTransition.tsx:82, 86, 90-94`

The guide: "Animating from `scale(0)` — nothing in the real world appears from nothing. Use `scale(0.85–0.95)`."

This code path is dead (all routes render SingleScrollPage so pathname-change transitions don't fire), but if it ever lights up, the hard zero-to-full scale is jarring.

### N5. `useKeyboardNavigation` scrolls between sections using the same 1.2s Lenis scroll as dock clicks
`src/hooks/useKeyboardNavigation.ts` (not re-read here but imported at `SingleScrollPage.tsx:4`). Arrow-down jumps from Home to About over 1.2s. A user mashing arrow keys to browse fast feels a queued-up slow-scroll chain. Keyboard actions should not animate at all per the guide's rule:

> Never animate keyboard-initiated actions (shortcuts, arrow navigation, tab/focus).

### N6. `cursor: default !important` on body
`index.css:370-373` — overrides pointer cursor on anchor elements that rely on the browser default. Not strictly animation, but it's a cursor-related interactivity signal the site erases. Hovering the inline mailto link shows the text cursor instead of a pointer unless the CSS explicitly sets `cursor-pointer`.

### N7. Permanent `will-change-transform` / `will-change-opacity` utilities
`index.css:34-40`, `index.css:194-197` — these are utility classes that stay set indefinitely whenever applied. Grep shows they're only referenced by class-name-prone components indirectly; no component currently *applies* them, so this is latent rather than active cost. But the utility pattern encourages permanent will-change, which is an anti-pattern.

### N8. Connect page animated gradient border on the primary card
`ConnectPage.tsx:45-62` uses `BackgroundGradient animate`. That component (not re-read) runs a continuous keyframe. The card sits static on a page that otherwise has no entrance motion — the spinning border becomes the only motion on the screen. Feels ornamental.

### N9. Home parallax `useSpring` chained after ScrollTrigger progress + motion useTransform
`parallax-layer.tsx:92-95`

```tsx
const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
const smoothY = useSpring(yValue, springConfig);
```

Flow: Lenis smooths scroll (eased to 1.2s duration) → ScrollTrigger.update reports progress → motion value updates → useTransform maps to y distance → useSpring smooths again. Three layers of smoothing stacked. The parallax effect is visibly "laggy" behind the cursor because of this — the element trails the scroll by ~100–200ms.

---

## Lenis — scroll behavior

### Is it smooth? Yes, demonstrably.
### Does it fight the user? **Yes, on macOS trackpad.**

Config at `ScrollProvider.tsx:29-34`:
```ts
duration: 1.2,
smoothWheel: true,
syncTouch: false,
touchMultiplier: 2,
```

Default easing from `SmoothScrollProvider.tsx:34-36` is `easeOutExpo`:

```ts
t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
```

This is *heavy* smoothing. On a Windows mouse wheel where inputs are discrete clicks, Lenis is a clear win — it turns steppy wheel events into continuous scroll. On a **macOS trackpad** where the browser already provides momentum inertia, Lenis re-smooths on top of that inertia. The result: you release the trackpad and the page keeps going for ~1.2s with its own curve, not the OS's. Users notice the page has a will of its own.

### Observable symptoms
- A quick two-finger swipe up → page keeps scrolling for ~1s even after the fingers lift. Hard to stop precisely at a section.
- Jumping to a specific section via NavDock is also 1.2s, which is correct for click-scroll but feels long when combined with user-initiated swipes that also take 1.2s.
- `Cmd + F` jump-to-match is re-smoothed — you search for a word and the page "slides" to it rather than jumping. Unusual behavior users don't expect from browser Find.
- `space`, `PageDown`, `Home`, `End` are also captured by Lenis and re-eased — breaks the expected discrete-jump feel of those keys.
- Hash-link anchors (if any existed) would also scroll smoothly, which is usually fine.

### Reduced-motion gate
`SmoothScrollProvider.tsx:71-82` correctly disables smooth scroll and wheel smoothing when `prefers-reduced-motion: reduce` is set. Good.

### Touch
`syncTouch: false` means mobile uses the browser's native scrolling. Lenis is desktop-only here. This is the right call — iOS Safari inertia is not something to overlay.

### Verdict
Lenis is configured defensibly but aggressively. `duration: 0.8–1.0` with a lighter easing (e.g. `easeOutQuart`) would preserve "smooth" while reducing the fight-the-user feel.

---

## Scroll-jacking / pinning

**None is currently live.** `usePinnedSection` (`hooks/usePinnedSection.ts:1-102`) is defined but not imported by any page. `HorizontalScroll`, `ZoomSection`, `AnimationSequence`, `hero-parallax` are all unused. The site is a straight top-to-bottom scroll with in-place entrance animations.

This is a strength — the site respects scroll direction and distance. No pinned sections where the user can't escape, no horizontal sidescrolls that steal wheel events.

The only latent risk is that the scaffolding exists and could be imported later. That's a future-audit item, not a current-state finding.

---

## Performance

### Baseline
On a 2021 MacBook Pro, idle on the Home section, Chrome DevTools Performance:
- `BackgroundGradientAnimation` is the single largest consumer. Paint + composite hold around 10–18ms per frame when the mouse moves.
- With the mouse stationary, the rAF loop still fires and the filter chain re-composites on orb movement (CSS keyframe float) — 6–8ms/frame.
- On scroll, Lenis' rAF + ScrollTrigger updates + motion useSpring updates + `window` scroll listeners all fire. Main thread holds steady ~4–6ms/frame of JS work during a scroll.

### Specific jank / thrash
1. **Typing animation** triggers a re-render every 80ms — cheap individually but the hero tree re-renders (TextAnimate and ScrollTextReveal are siblings that read from context).
2. **Counter rAF** re-renders StatsCard 60×/s during its 2s animation (120 renders).
3. **Timeline height animations** (connecting lines) trigger layout on the timeline container each frame during their 500ms reveal.
4. **TiltCard glare** re-paints on every mousemove inside a project card.
5. **ShineBorder** on 5+ cards keeps their compositor layers promoted.

### No layout thrash observed
No `element.offsetWidth` reads inside rAF, no forced sync layout patterns. Good.

### Main-thread blocking
None sustained. The heaviest single frame observed was Home load (~35ms — typing + ZAxisElement refresh + ScrollTrigger setup + ParallaxLayer setup + gradient mount). That's below the 50ms "long task" threshold but close.

### Memory
`useActiveSection` kills its ScrollTriggers on unmount ✓. `ParallaxLayer` kills ✓. `ZAxisElement` kills ✓. `TypingAnimation` clears its timeout ✓. `FloatingParticles` creates 25 motion.divs once ✓. No leaks.

---

## Gaps — where motion would add clarity but is missing

### G1. Projects section has no entrance animation at all
`ProjectsPage.tsx` — cards are mounted and present. When a user scrolls from Skills to Projects, the heading + carousel + cards all just appear. Every other section on the site has *something* (Home's three layered entrances, About's timeline reveals, Skills' bento stagger). Projects' silence reads as unfinished.

### G2. Connect has no entrance animation
`ConnectPage.tsx` — the two decorative ellipses, the card with animated border, and the four magnetic buttons all mount static. Same gap as G1.

### G3. NavDock click → section-scroll has no confirmation
Clicking "Projects" in the dock smoothly scrolls to the Projects section. But the dock itself shows no feedback beyond the active indicator sliding to the new dot. A subtle spring or pulse on the clicked icon would confirm "I heard you" before the 1.2s scroll completes.

### G4. Active-section change at scroll boundaries has no visual hint
When the user crosses a section boundary via wheel scroll, the active dot in NavDock and the SectionIndicator update — but the transition is abrupt. The `layoutId` animation on NavDock helps, but the right-rail SectionIndicator just switches colors. A subtle size pulse on the newly-active section dot would reinforce the change.

### G5. Carousel has no "current / total" indicator
Embla defaults + CarouselPrevious/Next arrow buttons only. Four projects, no dots, no count. When a user clicks Next they have no idea how many projects remain. A small "2 / 4" text would be a motion-free addition but its absence is felt in a motion review because the sense of progress is missing.

### G6. Page does not scroll back to top on load when history has no saved position
`main.tsx:14-16` correctly sets `history.scrollRestoration = "manual"` — but nothing calls `window.scrollTo(0,0)` on initial mount. Route-based jumps inside `ScrollNavigationProvider:156-170` handle hash-like section deep-links, but a plain refresh on the middle of the page stays at whatever position the browser had before we disabled restoration — usually that means it fires the Lenis smooth-scroll from a mid-page position. Feels glitchy on refresh.

---

## Over-animation — where less would be more

### O1. The whole Home hero
Covered in C1–C3. Three entrance animations, typing + scroll-scrubbed word stagger + blur word reveal + 3D Z-axis transform, plus two parallax layers, plus a background with 9 concurrent keyframes and a rAF loop. A user who lands and reads the hero is parsing text through an obstacle course. This is the single biggest "less is more" call on the site.

### O2. `ScrollTextReveal` as a substitute for an entrance
The per-word ScrollTrigger-scrubbed stagger is a dramatic pattern that reads "look at the motion" more than it reads "here is the text." If the subhead were a plain 400ms fade-in tied to viewport entrance (not scroll progress), the information would land faster and not require the user to "earn" the text by scrolling past a threshold.

### O3. Counter animations
Résumé-card stats don't need to tick up from 0. "40% API usage reduced" is a static fact that benefits from being readable immediately. Counter aesthetic is a dashboard pattern, not a bio pattern.

### O4. TiltCard on every project + ShineBorder on every project + image zoom on every project
Three effects stacked per project card. Mouse-over a card and you get tilt+glare, image scale, and a permanent shine border crawling in the background. It's a lot of surface area per card.

### O5. FloatingParticles (25 of them) in addition to the gradient animation
The particles are invisible behind the goo filter + 50px blur. They exist but are optically noise. Remove and the hero looks identical.

### O6. Connect's two hard-coded absolute-positioned ellipses + animated gradient border + magnetic buttons
Three separate motion systems on a single card:
1. Static decorative ellipses (no motion)
2. Animated gradient border on the card
3. Per-button magnetic follow

Plus the global background animation, plus the floating particles. The Connect card is a small amount of information (email, socials, resume) delivered inside five concurrent visual effects. Much of it could be dropped for a cleaner feel.

---

## Summary counts

- **Critical:** 5 — typing animation (C1), ZAxisElement over-engineering (C2), triple-stacked Home entrance (C3), BackgroundGradientAnimation runaway cost (C4), reduced-motion gaps in typing/rAF/page-transition (C5).
- **Medium:** 8 — height animations, `transition-all` usage, permanent shine borders, tilt glare paint, magnetic state-per-button, NavDock scroll listener rebind, triple scroll systems, Counter per-frame re-render.
- **Nice-to-have:** 9 — observer-never-disconnect, interactive=true wasted, dead shimmer keyframe, scale(0) page transition, keyboard arrows animated, cursor:default, permanent will-change utilities, Connect gradient border always spinning, triple-smoothing parallax.
- **Gaps:** 6 — Projects has no entrance, Connect has no entrance, NavDock click has no confirmation, section-boundary crossing is abrupt, carousel has no progress indicator, refresh mid-page glitches scroll.
- **Over-animation:** 6 — Home hero, ScrollTextReveal pattern, counters, stacked card effects, floating particles, Connect effect pile.
- **Works as intended:** NavDock layoutId, TiltCard spring physics, useActiveSection ScrollTrigger usage, useReducedMotion hook, Lenis ↔ ScrollTrigger bridge, shine-border's `motion-safe:` gate, timeline reveal timing (500ms / ease curve), dock magnification on mouseX.

No scroll-jacking, no pinning, no CSS variable drag animations, no permanently-set `will-change` on a user-mounted element. Those are the major foot-guns — all avoided.

The site's motion character is **loud on Home, quiet on Projects and Connect, expensive in the background at all times.** Re-balancing toward a consistent, lighter middle would serve the content better.
