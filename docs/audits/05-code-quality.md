# Code Quality Review — 05

Date: 2026-04-21
Scope: Full `src/` tree — pages, components, providers, hooks, utils, config.
Focus: **long-horizon bite-you-in-six-months concerns** — component boundaries, state mgmt, dup'd logic/styles, dead code, type safety, GSAP/Lenis lifecycle & memory leaks, error boundaries & loading states, testability.
Note: An earlier code review is in `05-code-review.md` (same number; this one uses `-quality.md` per request). Where findings overlap I point to it rather than restating; new axes are expanded in depth here.

---

## Summary

| Axis | Verdict |
|---|---|
| Component boundaries | One oversized page + reusable sub-components defined inline | 🟡 |
| State management | Context overbroadcasts; no prop drilling; no zustand needed | 🟡 |
| Duplicated logic | 4 clear dup clusters — observer-mount-pattern, visibility-check-pattern, external-link pattern, card-shell pattern | 🟡 |
| Duplicated styles | Timeline year badge, bento card shell, tech chip, NavDock scroll-handler pattern | 🟢 |
| Dead code | **~15 UI components + 3 hooks + 1 provider + 2 root-level docs** never imported / never consumed | 🔴 |
| Type safety | 1 real escape (`as any`), ~6 "lying" casts that are defensible, zero `@ts-ignore` | 🟢 |
| GSAP/Lenis lifecycle | Mostly clean — **one leaking Lenis scroll listener**, **one missing rAF cancel**, body CSS vars never reset | 🟡 |
| Error boundaries | **None.** Any render exception = white screen | 🔴 |
| Loading states | None exist and none needed today (no async). Zero infra for the future | 💡 |
| Testability | Zero tests. Hooks are provider-coupled. DOM-reading patterns make unit testing painful | 🟡 |

Most pressing long-horizon risks, in order:
1. **No error boundary anywhere in the tree.**
2. **Dead code at 50%+ of the UI surface** — maintenance drag that compounds.
3. **Lenis↔ScrollTrigger glue leaks its scroll listener on unmount.**
4. **Counter rAF loop has no cleanup.**
5. **`ScrollNavigationProvider` context updates on every scroll tick**, re-rendering every consumer.

---

## Component boundaries

### The shape today
- `App.tsx` (47 lines) — trivial router + PageTransition wrapper.
- `SingleScrollPage.tsx` (133 lines) — composes the 5 section pages as `<section>` landmarks.
- `HomePage`, `AboutPage`, `ConnectPage` — 100–210 lines each, single-purpose.
- `SkillsPage.tsx` (**620 lines, 13 components in one file**).
- `ProjectsPage.tsx` (213 lines, 4 helpers inline).
- `components/ui/*` — 30+ files of varying size.

### Findings

#### 🟡 **CB1. `SkillsPage.tsx` is a file-shaped component library**
Contains: `Counter`, `TypingText`, `InteractiveSkillPill`, `BentoCard`, `EducationCard`, `StatsCard`, `InteractiveSkillsCard`, `FrameworksCard`, `FocusAreasCard`, `AICard`, `InterpersonalCard`, `ExperienceCard`, plus the page. Sub-components fall into three distinct responsibilities:

1. **Reusable primitives** (`Counter`, `TypingText`, `BentoCard`) — belong in `components/ui/`.
2. **Skills-specific cards** (`EducationCard`, `StatsCard`, etc.) — belong in `components/skills/` or at page level in separate files.
3. **Page layout** (`SkillsPage` itself) — the only thing that should stay here.

There is already a `components/ui/bento-grid.tsx` with a `BentoCard` export using a *different prop shape*. In 6 months a new contributor will import the wrong one and debug it.

#### 🟡 **CB2. `ProjectsPage.tsx` has an inline `preloadImages` helper that is domain-agnostic**
`ProjectsPage.tsx:20-26` defines a generic utility. Belongs in `utils/` or should be removed entirely (it's counter-productive per audit 04 C1).

#### 🟢 **CB3. `ConnectPage.tsx` has four near-identical `MagneticButton` blocks**
Lines 87-189. Each button differs only by icon, href, and label. A tiny `<ContactButton icon href label onClick?>` wrapper would reduce 100 lines to 30 and eliminate accidental divergence (e.g. the Resume button's `onClick={alert(...)}` vs the others' default behavior — easier to spot when the shell is shared).

#### 🟢 **CB4. `BackgroundGradientAnimation` does too much**
`background-gradient-animation.tsx` (262 lines) renders:
- 4 animated gradient orbs driven by CSS keyframes.
- 2 orbital gradients driven by CSS keyframes.
- A mouse-following gradient driven by rAF.
- An SVG goo filter definition.
- `FloatingParticles` component.
- Writes to `document.body.style` for CSS variables.
- Detects Safari.

Three of these (mouse tracker, particles, Safari fallback) are independent features that could stand alone. Right now they're one blob.

---

## Prop drilling vs. state management

### Current model
Four nested providers at the app root: `PerformanceProvider → SmoothScrollProvider → ScrollTriggerProvider → ScrollNavigationProvider`. Plus `TooltipProvider` (Radix) inside `NavDock`. No Zustand, no Jotai, no Redux. React Router is used but only for `pathname`-based deep-linking.

### Findings

#### 🟡 **PD1. `ScrollNavigationProvider` broadcasts scroll progress to all consumers on every tick**
`providers/ScrollNavigationProvider.tsx:172-186` — context value object has: `activeSection`, `sections`, `sectionProgress`, `isNavigating`, `navigateToSection`, `registerSectionRef`, `getSectionRef`.

- `sectionProgress` updates on every scroll frame via `useActiveSection.ts:59-60` (`setSectionProgress({ ...progressRef.current })`).
- Every consumer of the context re-renders on every scroll frame whether they read `sectionProgress` or not, because the context value is a new object literal each render.

Today that's NavDock, SingleScrollPage, and possibly PageTransition. At ~60 fps scroll, each gets ~60 re-renders/s. React reconciles and bails on identical props, so this isn't visible as jank — but it's wasted work, and it will compound if more consumers are added.

**Cure:** split the context into a "stable-actions" context and a "frequently-changing state" context, or subscribe via external stores. This is textbook React Context Anti-Pattern.

#### 🟡 **PD2. Same issue in `SmoothScrollProvider`**
`providers/SmoothScrollProvider.tsx:139-149` — exposes `scrollProgress`, `scrollDirection`, `isScrolling` all in one context. Any component using `useSmoothScroll().lenis` re-renders on every scroll tick because `scrollProgress` updates.

Currently only `useScrollTo` consumes `lenis`, and it wraps in `useCallback` so downstream effects depending on `scrollTo` won't re-run needlessly. But the provider itself re-renders, and every time it re-renders it creates a new value object, which invalidates all descendants' context references.

#### 🟢 **PD3. No real prop drilling observed**
SingleScrollPage passes no props down to its section pages. Each page reads what it needs from context. Good.

#### 🟢 **PD4. Unused `PerformanceProvider` context**
Already covered in `05-code-review.md` M2. `usePerformance()` has zero callers. Provider is dead — runs an rAF FPS monitor and maintains state no one reads.

---

## Duplicated logic

#### 🟡 **DL1. IntersectionObserver-to-fire-once pattern duplicated**
- `SkillsPage.tsx:34-51` (`Counter`) — sets up observer, on `isIntersecting` sets `isVisible`, observer never disconnects.
- `SkillsPage.tsx:92-107` (`TypingText`) — identical pattern, different component.
- Plus `useInView` from motion/react is used in ~6 other components (`narrative-timeline.tsx`, `typing-animation.tsx`, `box-reveal.tsx`, etc.) — which is the *correct* way. The SkillsPage two roll their own.

**Cure:** delete the hand-rolled observers, use `useInView` consistently.

#### 🟡 **DL2. "Check initial visibility on mount" effect copy-pasted**
Two near-identical useEffect blocks exist:
- `perspective-container.tsx:81-109` (`ZAxisElement`)
- `scroll-text-reveal.tsx:91-118`

Both parse the `"top X%"` string with the same regex `/top (\d+)%/`, both measure the container's `getBoundingClientRect()`, both compare to `viewportHeight * threshold`, both set a `setTimeout(fn, 100)`. A shared hook `useInitialScrollVisibility({ start, end })` would eliminate the duplication and provide a single place to fix the 100ms magic-wait.

#### 🟢 **DL3. External link pattern duplicated**
Every external link has `target="_blank" rel="noopener noreferrer"` written out longhand. Four in ConnectPage, two per project card in ProjectsPage. Either a small `<ExtLink>` wrapper or an ESLint rule (`react/jsx-no-target-blank`) to enforce it.

#### 🟢 **DL4. Reduced-motion handling pattern duplicated ~12 times**
Every motion component reads `const shouldReduceMotion = useReducedMotion();` and then scatters `shouldReduceMotion ? x : y` ternaries throughout. For simple "skip animation" cases this is clear enough, but for compound cases (`motion.div` with conditional `initial`, `animate`, `whileHover`) the branching reads as noise.

**Cure:** a tiny `motion-reduce` helper that takes a motion prop object and returns the neutered version, or switch to Tailwind's `motion-safe:` / `motion-reduce:` prefix patterns for CSS-driven animations (already used correctly in `shine-border.tsx`).

---

## Duplicated styles

#### 🟢 **DS1. Year badge styling repeated 3+ times**
`narrative-timeline.tsx:57, 186, 228`:

```
"inline-block px-3 py-1 text-xs font-mono text-purple-400 bg-purple-500/10 rounded-full"
```

and variants with `px-2 py-0.5`. Different sizes, same visual. A `<YearBadge>` or design-token class would be cleaner.

#### 🟢 **DS2. Bento card shell repeated**
`"bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl"` appears in `SkillsPage.tsx:224`, `bento-grid.tsx`, `narrative-timeline.tsx:51` (with slight variation). Should be a shared `card-surface` class or component.

#### 🟢 **DS3. Tech chip styling duplicated**
`"px-2 py-0.5 bg-white/5 border border-white/10 ... rounded-full text-[0.65rem]"` in `SkillsPage.tsx:280, 527`. Same shape, different color tokens.

#### 🟢 **DS4. `transition-all duration-300 hover:-translate-y-1` triplet**
Appears in 4 different files' card-hover definitions. A `.hover-lift` utility or consistent card shell would centralize it.

---

## Dead code

#### 🔴 **DC1. ~15 UI components defined but never rendered**
Already enumerated in `04-performance.md` C4 and `05-code-review.md` s1. Names:

```
components/ui/horizontal-scroll.tsx       (159 lines)
components/ui/zoom-section.tsx            (~100)
components/ui/animation-sequence.tsx      (189)
components/ui/hero-parallax.tsx           (249)
components/ui/bento-grid.tsx              (~150)
components/ui/wobble-card.tsx             (~80)
components/ui/staggered-grid.tsx          (~60)
components/ui/box-reveal.tsx              (~50)
components/ui/scroll-box-reveal.tsx       (163)
components/ui/scroll-line-reveal.tsx      (~100)
components/ui/text-reveal.tsx             (~70)
components/ui/animated-section.tsx        (~50)
components/ui/interactive-hover-button.tsx (~80)
```

Total: **~1500 lines of dead UI code.** Tree-shaken at build time, but every file is:
- Shown in IDE search/navigation.
- Counted in `wc -l src/`.
- A candidate for accidental import (see CB1 — `BentoCard` collision).
- A regression risk (if the motion stack is upgraded, these may break silently and no one would know).

#### 🔴 **DC2. 3 hooks exported but never consumed by live code**
```
hooks/useParallax.ts          — defined, not called (pages use ParallaxLayer instead)
hooks/usePinnedSection.ts     — defined, not called
hooks/useScrollAnimation.ts   — defined, not called
```

All three are re-exported by `hooks/index.ts`, so a future `import { usePinnedSection } from "../hooks"` would succeed silently. This creates "API surface" that implies the feature is supported.

#### 🔴 **DC3. `PerformanceProvider` is wrapped but never read**
Already covered. Runs a FPS-monitoring rAF forever with no consumer. Delete or wire up.

#### 🟡 **DC4. `ScrollDebug` component and `SCROLLYTELLING_INVESTIGATION_REPORT.md` / `WEBSITE_DOCUMENTATION.md`**
- `src/components/ScrollDebug.tsx` — rendered with `enabled={false}` at `App.tsx:41` so it's a no-op. Source ships in the bundle (tree-shaken? depends on the `enabled` prop being statically `false`).
- Repo-root planning docs — ~unclear what they refer to; not linked from anywhere. Either archive in `docs/history/` or delete.

#### 🟢 **DC5. `animate-shimmer` keyframe**
`index.css:233-259` defines a `@keyframes shimmer` and a `.animate-shimmer` class. Grep shows no component uses it. Dead CSS.

#### 🟢 **DC6. `disableHorizontalScroll: false` config flag**
`config/touch.ts` and `config/performance.ts` both declare config for features that don't render (`enableHorizontalScroll`, `enableZAxis`, `enableBackgroundEffects`). None of these gate any code path.

---

## Type safety

#### 🟡 **TS1. Single `window as any` escape**
`components/PageTransition.tsx:57` — already called out as **B1** in `05-code-review.md`. The cast is a symptom of the real bug (Lenis is never attached to `window`), not just a type hole.

#### 🟢 **TS2. Impossible intersection type on a ref**
`components/ui/magnetic-button.tsx:50`:

```ts
ref: ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>
```

A DOM element is never *both* a button and an anchor. Structural typing lets this compile, but the refined type should be a discriminated union — `as === "a" ? HTMLAnchorElement : HTMLButtonElement`. A future consumer that calls e.g. `ref.current.click()` works (both have it) but `ref.current.href` would not fail at the type level on a button at runtime.

#### 🟢 **TS3. Unnecessary refs widening**
`components/ui/typing-animation.tsx:50`:

```ts
useInView(elementRef as React.RefObject<Element>, { amount: 0.3, once: true });
```

`elementRef` is `useRef<HTMLElement | null>` — `HTMLElement` extends `Element`. Cast not required; remove.

#### 🟢 **TS4. `mixBlendMode` string→union casts (4 instances)**
`background-gradient-animation.tsx:213, 226, 236, 251` — all cast `blendingValue as React.CSSProperties["mixBlendMode"]` because `blendingValue` is typed `string` in the orb config. Typing the field as `React.CSSProperties["mixBlendMode"]` upstream removes 4 casts and gives autocomplete.

#### 🟢 **TS5. `tl.scrollTrigger as ScrollTrigger`**
`hooks/useScrollAnimation.ts:134` — GSAP types `timeline.scrollTrigger` as `ScrollTrigger | undefined`. The cast drops the undefined branch without checking. This hook is dead (DC2), so low impact, but it's the pattern to watch for: unsafe narrowing of GSAP return types is common.

#### 🟢 **TS6. `finalVariants.container as Variants`**
`components/ui/text-animate.tsx:417` — motion/react's variant type is union-heavy; the cast is defensible. Nothing consumes this component anyway (it is used by HomePage via `TextAnimate` — let me re-check). Actually `TextAnimate` IS used on HomePage. The cast is fine — flagged only for completeness.

#### 🟢 **TS7. Zero `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck`**
Searched — clean. Good discipline.

#### 🟢 **TS8. Widespread non-null assertion operators (`!`)**
Grep for `!\.` returned zero matches outside of strings. Clean.

---

## File / folder structure & naming

#### 🟡 **FS1. Mixed file-naming conventions**
- `NavDock.tsx`, `PageTransition.tsx`, `ScrollDebug.tsx` (PascalCase)
- `narrative-timeline.tsx`, `scroll-progress.tsx`, `typing-animation.tsx` (kebab-case)
- `SingleScrollPage.tsx`, `HomePage.tsx` (PascalCase — pages)
- `useReducedMotion.ts`, `useScrollTo.ts` (camelCase — hooks)

Provider files are PascalCase, UI components are kebab-case, top-level components are PascalCase — almost a convention, but broken in places (`ScrollDebug.tsx` would be `scroll-debug.tsx` under kebab). Pick one and enforce.

#### 🟢 **FS2. `LandingPage.tsx` unused**
`src/pages/LandingPage.tsx` exists but is not imported by `App.tsx`. Either it was superseded by `SingleScrollPage` or it's draft. Delete or rename.

#### 🟢 **FS3. `lib/utils.ts` vs `utils/`**
Two "utility" folders:
- `src/lib/utils.ts` — the standard shadcn `cn()` helper.
- `src/utils/` — `accessibility.ts`, `browser.ts`, `safari-fixes.ts`.

Consolidate or document the distinction. `lib/` is typically for third-party-adjacent helpers; `utils/` for project-specific. The distinction is easy to lose.

#### 🟢 **FS4. `config/` contains dead flags**
`config/performance.ts`, `config/touch.ts`, `config/animations.ts`. The first two have flags no code reads (see DC6). Shrink or delete.

#### 💡 **FS5. No `features/` or `domain/` folder**
As the site grows past pages-as-dumping-grounds, a layout like `src/features/projects/ProjectCard.tsx` becomes useful. Optional now, load-bearing later.

---

## GSAP / Lenis integration — cleanup & memory

Took a systematic pass through every GSAP and Lenis call site.

### 🟡 **GL1. `ScrollTriggerProvider` leaks the Lenis scroll listener on unmount**
`providers/ScrollTriggerProvider.tsx:51-75`

```ts
useEffect(() => {
  if (!lenis) return;
  lenis.on("scroll", ScrollTrigger.update);
  ...
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    setIsReady(false);
  };
}, [lenis]);
```

The cleanup kills all ScrollTriggers but **never calls `lenis.off("scroll", ScrollTrigger.update)`**. If Lenis outlives ScrollTriggerProvider (e.g. the provider unmounts but SmoothScrollProvider stays up), the listener leaks — and more importantly, if the `lenis` dep changes (e.g. SmoothScrollProvider recreates Lenis because `options.duration` changed), the old listener is still bound to the old `ScrollTrigger.update` call and will fire any time the old Lenis instance does. Lenis's `destroy()` removes listeners internally, so this is partially masked — but explicit off() is correct defensive code.

### 🟡 **GL2. `SmoothScrollProvider` registers two scroll listeners, removes zero explicitly**
`providers/SmoothScrollProvider.tsx:87-121`

```ts
lenis.on("scroll", onScroll);
...
lenis.on("scroll", handleScrollStop);
...
return () => {
  cancelAnimationFrame(rafId);
  clearTimeout(scrollTimeout);
  lenis.destroy();
  lenisRef.current = null;
};
```

Again: `lenis.destroy()` cleans up internally, so no leak in practice. But the symmetry is off — explicit `.off()` pairs would match `.on()` one-to-one and survive future refactors where `destroy()` is conditionally skipped.

### 🔴 **GL3. `Counter` rAF loop has no cancel on unmount**
`pages/SkillsPage.tsx:54-70`:

```ts
useEffect(() => {
  if (!isVisible) return;
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
```

No cleanup. If the Counter unmounts mid-animation (e.g. Skills section is replaced by something else, StrictMode double-mount in dev), the rAF chain keeps calling `setCount` on an unmounted component. React 18 logs a warning but doesn't crash. Under StrictMode each effect fires twice, so the first rAF's chain is orphaned on every mount.

**Fix:** capture the rAF handle and cancel in the cleanup:
```ts
let rafId: number;
const animate = (currentTime: number) => {
  ...
  if (progress < 1) rafId = requestAnimationFrame(animate);
};
rafId = requestAnimationFrame(animate);
return () => cancelAnimationFrame(rafId);
```

### 🟡 **GL4. `BackgroundGradientAnimation` writes body CSS variables with no reset**
`components/ui/background-gradient-animation.tsx:88-99`:

```ts
document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
document.body.style.setProperty("--size", size);
document.body.style.setProperty("--blending-value", blendingValue);
```

These persist on the `<body>` element indefinitely. If the component unmounts (today it doesn't because it's pinned at site root), the vars stick around. Lower priority because it can't leak *memory* — just orphaned CSS state.

### 🟢 **GL5. Other GSAP/Lenis cleanup is correct**
Verified:
- `useActiveSection.ts:86-89` — iterates triggersRef and kills ✓
- `useScrollProgress.ts:69` — `st.kill()` ✓
- `useScrollAnimation.ts:137-138` — kills both timeline and trigger ✓
- `useParallax.ts:52` — kills animation ✓
- `usePinnedSection.ts:79` — kills timeline ✓
- `parallax-layer.tsx:52` — kills trigger ✓
- `perspective-container.tsx:146` — kills trigger ✓
- `scroll-text-reveal.tsx:150` — kills trigger ✓
- `animation-sequence.tsx:86` — kills trigger ✓
- `typing-animation.tsx:114` — clears timeout ✓
- `TypingText` in `SkillsPage.tsx:122` — clears interval ✓
- `useScrollURL.ts:57` — clears timeout ✓
- `useReducedMotion.ts:17` — removes event listener ✓
- `useKeyboardNavigation.ts:81` — removes listener ✓
- `NavDock.tsx:56`, `section-indicator.tsx:50` — remove listener ✓
- `background-gradient-animation.tsx:122` — cancels rAF ✓ (the main one; the body-style vars are the leak)

### 🟢 **GL6. `ScrollTrigger.getAll().forEach(kill)` on provider unmount is too broad**
`ScrollTriggerProvider.tsx:72` nukes *every* ScrollTrigger globally — if the app ever hosts a third-party widget that also uses GSAP ScrollTrigger (e.g. an embedded tool, a headless CMS preview), those would be killed too. In this site's case it's a non-issue (single app, single owner). Noted for the principle.

---

## Error boundaries

### 🔴 **EB1. There are none.**
No React.Component subclass with `componentDidCatch`, no third-party error boundary library (react-error-boundary, etc.), no `ErrorBoundary` usage. A single exception during render anywhere in the tree — motion, GSAP setup, typing animation closure, or a refactor that introduces a bug — produces an uncaught React error and a blank white page with no recovery UI.

**Minimum bar:** one root error boundary in `main.tsx` above `<BrowserRouter>` that renders a styled fallback with a "reload" button. Scoped boundaries per section would also help isolate failures.

### 🔴 **EB2. No `window.onerror` / `window.onunhandledrejection` handling**
If the background rAF loop throws, if Lenis' raf throws, if a motion component's animation engine throws — there's no global catch. Errors are silent.

---

## Loading states

### 💡 **LS1. None needed today, zero infra for tomorrow**
The site has no async: no `fetch`, no `Promise` in render paths, no Suspense boundaries, no suspense-enabled data layer. Content is baked into source.

If the site ever adds:
- A Resume PDF fetch (instead of an `alert`).
- Live project data from GitHub API.
- A contact form backed by an email service.
- Analytics.

…there is zero pattern to follow. The first engineer to add async will either roll their own loading state or introduce a library. Either is fine, but **the moment the first async is added, also add a pattern document or a `<DataBoundary>` component** so subsequent async usage doesn't fragment.

### 💡 **LS2. Image loading has no skeletons or placeholders**
Project card images are 13 MB PNG / 2.9 MB JPG. Network-slow users see the card with an empty image area for seconds. A `blurDataURL`-style placeholder, a `LQIP`, or a colored shimmer would improve perceived performance. Audit 04 (C1) recommends compressing the images themselves, which is the bigger win.

---

## Testability

### 🟡 **T1. Zero tests, zero test harness**
Repeated from `05-code-review.md` M3. `package.json` has no test framework.

### 🟡 **T2. Every hook is provider-coupled**
`useSmoothScroll`, `useScrollTrigger`, `useScrollNavigation`, `usePerformance` all throw if called outside their provider:

```ts
throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
```

Unit-testing any component that consumes these requires a full provider tree in the test. That's standard React testing practice but adds friction — a `renderWithProviders(ui, { scroll: stubScrollContext })` helper would be the first test utility to write.

### 🟡 **T3. Pure logic is entangled with side effects**
- `Counter` mixes `useState + IntersectionObserver + rAF + easing math`. The easing math is pure (`easeOutExpo`) and trivially testable, but only if extracted.
- `ZAxisElement`'s initial-visibility-check parses a regex (`/top (\d+)%/`) inline in a useEffect. Extracting to a pure helper would make it unit-testable without jsdom.
- `useActiveSection.ts:93-137` has a clear algorithm (pick the best-visible section from a set) embedded in a useEffect. This is testable but only via render tests, not pure tests.

### 🟡 **T4. DOM-reading in render / effects**
- `BackgroundGradientAnimation` writes `document.body.style` on mount.
- `ZAxisElement` reads `window.innerHeight` and `getBoundingClientRect()` in effects.
- `FloatingParticles` and `TiltCard` read `e.clientX` / bounding rects in handlers.

All testable with jsdom + stubbing, but none trivially.

### 🟡 **T5. `TypingAnimation` uses real-time `setTimeout` char-by-char**
Testing that "Hey, I'm Raj" types out correctly would require jest fake timers (or vitest equivalents) and advancing them per character. Workable, but slow and brittle. A state-machine reducer with injectable clock would test cleanly.

### 🟢 **T6. Provider unit tests would catch B2 (mount thrash) and GL1 (listener leak)**
Both are regression-prone bugs that a mount+unmount test cycle would surface immediately. Testing is the right forum for them.

---

## Ranked "will bite in six months"

1. **🔴 No error boundary.** One typo in a motion component crashes the entire site to a white screen.
2. **🔴 Dead code volume.** 1500+ LOC of unused motion scaffolding + `PerformanceProvider` + 3 unused hooks + 2 root-level docs. Maintenance drag, import-collision risk (BentoCard), regression amplifier on stack upgrades.
3. **🔴 Counter rAF leak (GL3).** Minor today (StrictMode warnings in dev), real bug under route-change or section-swap refactors.
4. **🟡 ScrollTriggerProvider listener leak (GL1).** Works today because providers never unmount. Any refactor that conditions providers will leak.
5. **🟡 Scroll-progress context overbroadcast (PD1, PD2).** 60 fps × N consumers worth of wasted React reconciliation. Will be the first perf regression observed as the site grows.
6. **🟡 SkillsPage.tsx single-file sprawl (CB1).** 13 components + dup'd BentoCard name. New contributor's first bug source.
7. **🟡 No test harness (T1–T5).** A contributor added after 6 months of silent drift will have nothing to catch regressions.
8. **🟢 Duplicated observer and visibility-check patterns (DL1, DL2).** Each copy drifts. Each drift is its own bug.
9. **🟢 Type casts around DOM union refs (TS2) and GSAP narrowing (TS5).** Low today, higher as GSAP types evolve.
10. **💡 Loading-state infra missing (LS1).** Not a problem; a trap waiting for first async.

## Ranked "won't bite"

- Lenis cleanup in `SmoothScrollProvider` — `destroy()` handles it internally; explicit `.off()` is defensive but optional.
- Most type casts (TS3, TS4, TS6, TS7) — cosmetic.
- PerformanceProvider — runs an extra rAF for state no one reads, but it doesn't corrupt anything.
- Naming conventions — mixed but readable.
- Prop drilling — none observed.

## Where the refactors cluster

If you imagine the 6-month refactor plan from this review:

1. **Delete.** ~1500 LOC of dead UI + 3 hooks + PerformanceProvider + 2 root docs + `ScrollDebug`.
2. **Extract.** `BentoCard`, `Counter`, `TypingText`, `ContactButton`, `YearBadge`, `observer+visibility-check` hook, and whatever card-surface class you end up with.
3. **Wrap.** One root `ErrorBoundary`. One `window.onerror` logger.
4. **Fix cleanup.** Counter rAF, ScrollTriggerProvider `.off()`.
5. **Split contexts.** Scroll state (frequent) vs scroll actions (stable).
6. **Add tests.** Start with `useActiveSection` section-picker algorithm and the SmoothScrollProvider reduced-motion branch.

None of these are urgent; all are cheap now and expensive later.
