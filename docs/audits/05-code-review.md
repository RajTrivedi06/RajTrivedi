# Code Quality Review — 05

Date: 2026-04-21
Scope: Live code surface — `src/App.tsx`, `src/main.tsx`, `src/pages/*`, rendered components under `src/components/`, providers, hooks, utils. Performance covered separately in `04-performance.md`; motion in `03-motion.md`; accessibility in `02a/b/c`.
Priorities: 🔴 Blocker → 🟡 Major → 🟢 Minor → 💡 Suggestion.

## Summary

- **🔴 Blockers: 4**
- **🟡 Major: 9**
- **🟢 Minor: 8**
- **💡 Suggestions: 6**

Most blockers are correctness bugs that will bite at specific interaction paths (not simply "unpolished"). The major findings are a mix of React anti-patterns (effects rebinding per tick, dead providers) and structural maintainability debt (dead code > shipping code). **Zero tests exist** — flagged as a standalone major, not a blocker, because the surface is small and has no user-input paths to break.

---

## Critical surface notes

- **No user input exists anywhere on the site.** No forms, no search, no mutations, no auth. Attack surface is limited to whatever the browser fetches from GitHub Pages + the four external links (email, GitHub, LinkedIn, Resume-placeholder).
- **No tests, no test framework installed.** `package.json` has no vitest / jest / playwright. Exit code from `npm run lint` and `npm run typecheck` are the only automated signals.
- **Two planning-dump docs in repo root** (`SCROLLYTELLING_INVESTIGATION_REPORT.md`, `WEBSITE_DOCUMENTATION.md`) — not `src/`, but noted because they suggest mid-project scaffolding was left in.

---

## 🔴 Blockers

### B1. `PageTransition` reads `window.lenis` that is never attached
`src/components/PageTransition.tsx:57-60`

```tsx
const lenis = (window as any).lenis;
if (lenis) {
  lenis.scrollTo(0, { immediate: true });
}
```

`SmoothScrollProvider.tsx` stores the Lenis instance in a ref (`lenisRef.current = lenis`) but never writes it to `window.lenis`. The guard `if (lenis)` masks the bug — this branch is dead. The `(window as any)` cast bypasses TypeScript entirely. Any future route transition that expects this scroll-reset to happen will silently do nothing.

**Why it matters:** this runs on actual route changes. Currently all routes render the same component so the failure is invisible, but a real navigation will break scroll position on transition.

**Fix direction:** expose Lenis via the existing `useSmoothScroll` hook and call `lenis.scrollTo(0, { immediate: true })` through proper context consumption.

### B2. `useActiveSection` re-creates all ScrollTriggers whenever any section ref registers
`src/providers/ScrollNavigationProvider.tsx:88-108`, `src/hooks/useActiveSection.ts:42-90`

`registerSectionRef` is called 5 times on mount (once per section). Each call:
1. Mutates the `sectionRefsMap` ref.
2. Rebuilds a new `configs` array from all registered refs.
3. Calls `setSectionConfigs(configs)`.

`setSectionConfigs` triggers a re-render of `ScrollNavigationProvider`, which re-passes `sectionConfigs` to `useActiveSection`. `useActiveSection` has `sections` in its effect deps (`useActiveSection.ts:90`):

```ts
}, [isReady, sections, offset]);
```

Every array-identity change kills all ScrollTriggers and recreates them. On initial mount that's **5 full rebuilds** (one per register). Then `ScrollTrigger.refresh()` is called each time.

**Why it matters:** each refresh reads the layout of every registered trigger — this is O(n²) layout reads during mount. Currently invisible because n=5, but it's the kind of code that degrades silently as the site grows. It also means the progress/visibility state briefly resets on each rebuild, so the active-section can flicker during first paint.

**Fix direction:** batch the registrations (one setState after all sections register, or use a reducer). Or compute `configs` from the ref map inline inside `useActiveSection`'s effect and depend on a stable sentinel.

### B3. `useKeyboardNavigation` hijacks Home/End/Arrow keys globally without modifier checks
`src/hooks/useKeyboardNavigation.ts:32-71`

The handler listens on `window` and:
- Captures `ArrowDown`/`ArrowUp`/`PageDown`/`PageUp`/`Home`/`End` and triggers the 1.2s Lenis scroll.
- Calls `event.preventDefault()` on all of them.
- Does not check `event.ctrlKey` / `event.metaKey` / `event.altKey` / `event.shiftKey`.

**Consequences:**
- **Home / End** are standard keys for *go to top/bottom of the current scroll container*. Overriding them to animate to the first/last section breaks the default browser behavior without replacement. A user pressing End on Skills expects to jump to the bottom of Skills' content; instead they get a 1.2s animated scroll to Connect.
- **Ctrl+ArrowDown** (jump-to-end on Mac with trackpad-free keyboard) is preventDefault'd and redirected to a section change.
- **Cmd+Home** (Mac: go to top of page) is hijacked.
- **Shift+ArrowDown** (extend text selection on keyboard-accessible text) is hijacked.
- **Tab navigation** still works because the handler only fires on listed keys — but browser search (Cmd+F) focus + ArrowUp/ArrowDown to navigate matches is affected.
- Violates motion rule: "Never animate keyboard-initiated actions."

**Fix direction:** only handle keys with no modifiers; skip Home/End entirely (let the browser do its thing); and use Lenis `immediate: true` for arrow-key jumps so they're instant.

### B4. ConnectPage Resume button uses a blocking native `alert()` as user feedback
`src/pages/ConnectPage.tsx:167-169`

```tsx
onClick={(e) => {
  e.preventDefault();
  alert("Resume download coming soon!");
}}
```

Three layered problems:
1. `href="#"` + preventDefault means the anchor isn't a real link. Keyboard users activating it with Enter get the alert. The accessibility tree still announces this as a link to "#".
2. `alert()` blocks the main thread until dismissed. Animations on the page freeze. The mouse-tracking rAF in `BackgroundGradientAnimation` stalls, Lenis pauses.
3. The user sees an OS-native dialog in 2026 for a personal portfolio button — looks broken or abandoned.

**Fix direction:** either hide the button until a real résumé file exists, or render a custom in-page toast. Do not ship an `alert()` to production.

---

## 🟡 Major

### M1. `NavDock` scroll listener rebinds on every scroll event
`src/components/NavDock.tsx:40-57`

```tsx
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 100) { setIsVisible(true); }
    else if (currentScrollY > lastScrollY && currentScrollY > 200) { setIsVisible(false); }
    else if (currentScrollY < lastScrollY) { setIsVisible(true); }
    setLastScrollY(currentScrollY);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);
```

`setLastScrollY` from inside the handler + `lastScrollY` in the effect deps means every scroll event:
1. Runs the handler → calls `setLastScrollY`.
2. React re-renders NavDock.
3. Effect cleanup removes the old listener.
4. Effect re-runs, adds a new listener.

**Why it matters:** brief window where scroll events are missed between cleanup and re-add (sub-frame, but non-zero). Repeated add/remove pressure on `window`'s listener list. Wastes allocations.

**Fix direction:** store `lastScrollY` in a `useRef`, not `useState`. Bind the listener once with an empty deps array. Or subscribe to Lenis's scroll event from context, not `window`.

### M2. `PerformanceProvider` is wrapped but never consumed
`src/providers/PerformanceProvider.tsx` + `src/providers/ScrollProvider.tsx:27`

The entire performance-tiering system:
- Runs an rAF loop at ~60 fps measuring FPS (`PerformanceProvider.tsx:58-65`).
- Maintains `tier`, `config`, `fps`, `isLowFPS` state.
- Exposes `forceReducedMotion`, `resetPerformance` actions.
- Auto-downgrades `tier` on sustained low FPS.

No component in the project calls `usePerformance()`. `getAnimationConfig()` is never consumed. The `enableParallax` / `enableZAxis` / `enableBackgroundEffects` flags are not gating anything. This is ~150 lines of fully live code computing values that nothing reads.

**Why it matters:** it costs an rAF loop forever, plus a `setState(fps)` every second, plus the mental cost of a developer assuming the tiering does something.

**Fix direction:** either wire it up (gate `BackgroundGradientAnimation`, `ParallaxLayer`, `ZAxisElement`, `FloatingParticles` through config flags) or delete it.

### M3. Zero tests, zero test harness
`package.json` — no `vitest`, `jest`, `@testing-library/react`, `playwright`, `cypress`, or any equivalent.

The site has limited testable surface (no user input, no forms, no state reducers, no utilities with domain logic), but:
- `useActiveSection` has logic (`useActiveSection.ts:93-137`) for picking the best-visible section when multiple are in view. That's an algorithm worth pinning.
- `useSmoothScroll` wraps Lenis init/destroy — a snapshot test would catch regressions in reduced-motion handling.
- `Counter` easing math (`SkillsPage.tsx:58`) is pure — unit-testable.
- `getPerformanceTier` (`config/performance.ts`) has branching logic worth testing (though it's dead, see M2).

**Fix direction:** one vitest + RTL pass on hooks would take ~2 hours and would be a foundation for future work. Not a blocker for a personal portfolio, but the complete absence is notable.

### M4. `ZAxisElement` has three concurrent `useEffect`s with overlapping state transitions
`src/components/ui/perspective-container.tsx:81-148`

Effects:
1. `useEffect` (lines 81-109) — checks initial visibility on mount, may call `progress.set(1)` and `setIsComplete(true)`.
2. `useEffect` (lines 111-148) — handles `prefersReducedMotion` (sets progress=1 and isComplete=true), otherwise creates a ScrollTrigger whose `onRefresh` may also set progress=1 and isComplete=true.
3. The render reads `isComplete` and decides whether to use animated motion values or static end values.

**Race conditions possible:**
- Fast navigation to a section where the element is already past the end threshold: effect 1 sets isComplete=true, effect 2 creates a ScrollTrigger that calls `ScrollTrigger.refresh()` (expensive, sync), `onRefresh` checks `self.progress` — at that moment progress might be <1 depending on exact scroll, re-sets progress, effect 2's teardown then runs.
- On `prefersReducedMotion` change event: effect 2 re-runs and may still have an old trigger from before. The cleanup kills the trigger — OK — but state flags persist.
- `setInitialCheckDone(true)` inside effect 1 triggers a re-render which re-runs effect 1's check (guarded by `initialCheckDone` in deps). Minor but unnecessary.

**Fix direction:** collapse to a single effect. The initial-visibility-check pattern is a workaround for ScrollTrigger not firing `onRefresh` on mount; newer GSAP versions do.

### M5. `TypingAnimation` effect re-runs on every character
`src/components/ui/typing-animation.tsx:66-128`

The effect has `displayedText`, `currentCharIndex`, `currentWordIndex`, and `phase` in its dep array, all of which are set inside the effect. Each character:
1. Effect fires.
2. Sets a `setTimeout` for `typingSpeed` ms.
3. On timeout: calls `setDisplayedText` + `setCurrentCharIndex`.
4. State changes trigger re-render.
5. Effect cleanup clears the timeout (but it already fired, so clearTimeout is a no-op).
6. Effect re-runs.

This works, but it's using `useEffect` where a `useRef` + `setInterval` or a state-machine reducer would be clearer and avoid the React reconciliation overhead per character. For a 12-character word the cost is negligible; for a multi-word loop (`words` prop) it compounds.

### M6. `ScrollNavigationProvider` reads `window.location.pathname` on mount to auto-scroll
`src/providers/ScrollNavigationProvider.tsx:157-170`

```tsx
useEffect(() => {
  const path = window.location.pathname;
  const sectionId = path.split("/").pop()?.toLowerCase() || "home";
  if (sectionId && sectionId !== "rajtrivedi" && sectionId !== "") {
    const timeoutId = setTimeout(() => {
      navigateToSection(sectionId);
    }, 300);
    return () => clearTimeout(timeoutId);
  }
}, [navigateToSection]);
```

Issues:
1. Hardcoded check `sectionId !== "rajtrivedi"` — matches the GitHub Pages `basename="/RajTrivedi/"`. If the repo is renamed or deployed elsewhere, this guard silently misfires (the basename segment is treated as a section ID).
2. `.pop()` after `.split("/")` yields the last non-empty segment. For `/RajTrivedi/Projects` it returns `"Projects"` → lowercased → `"projects"` → valid match. For `/` it returns `""` → falls through to `"home"`. For `/RajTrivedi/` after a trailing-slash it returns `""`. Works by accident.
3. 300 ms setTimeout is a magic number with no comment explaining why. It's waiting for Lenis + refs to register; better to gate on a real readiness signal.
4. No fallback if the section id doesn't match any registered section — `navigateToSection` logs a warning (`ScrollNavigationProvider.tsx:136`) and returns. A URL typo produces a silent no-op.

### M7. React `useCallback` deps on `navigateToSection` miss `navOffset`
`src/providers/ScrollNavigationProvider.tsx:132-154`

```tsx
const navigateToSection = useCallback(
  (sectionId: string) => {
    ...
    scrollTo(ref.current, { offset: -navOffset, duration: 1.2, ... });
  },
  [scrollTo, navOffset]
);
```

This line actually looks correct — `navOffset` is in deps. But the `scrollTo(ref.current, ...)` inside bypasses the hook's `scrollTo(target, options)` signature by passing a resolved DOM node plus options. Checking `useScrollTo.ts:17-39` — `scrollTo` accepts `HTMLElement` ✓. So this is fine.

~~Retraction on the original claim.~~ Re-reading, this is correct. Downgrading to 💡 note: the hook abstractions are stable enough that the deps look right. Leaving the line here to document the check.

**Actual M7:** `useScrollURL` (`hooks/useScrollURL.ts`, imported by ScrollNavigationProvider:125) is used with `enabled: !isNavigating` — but `isNavigating` is set to true in `navigateToSection` and only cleared in a `setTimeout(() => setIsNavigating(false), 100)`. If `scrollTo` completes faster than 100 ms (with `immediate: true` for reduced-motion users), the navigation flag is still true when the URL would naturally sync. URL updates get suppressed when they shouldn't. Edge case.

### M8. `embla-carousel` doesn't loop properly with `loop: true` and 1 card visible on mobile
`src/pages/ProjectsPage.tsx:131-135`

```tsx
<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
>
```

Embla's `loop: true` requires that the total slide width + any gaps > container width. On mobile (`basis-full`) each slide is full-width; loop mode duplicates edge slides to give the illusion of continuous scroll. With only 4 slides and full-width cards, the duplication budget is tight. In some Embla versions this triggers a warning or just silently disables loop. Needs verification in a real browser.

### M9. `SkillsPage.tsx` is 620 lines with 8+ sub-components in one file
`src/pages/SkillsPage.tsx`

Components defined in-file: `Counter`, `TypingText`, `InteractiveSkillPill`, `BentoCard`, `EducationCard`, `StatsCard`, `InteractiveSkillsCard`, `FrameworksCard`, `FocusAreasCard`, `AICard`, `InterpersonalCard`, `ExperienceCard`, plus the page.

That's 13 components in one file. Several (`BentoCard`, `Counter`, `TypingText`) are reusable utility components that should live under `src/components/ui/`. `BentoCard` in particular already has a competing implementation at `src/components/ui/bento-grid.tsx` — same name, different implementation, different prop interface.

**Why it matters:** Duplicate names cause import confusion. File size > 500 LOC is where diff review starts getting harder. Extracting sub-components would also enable per-component tree-shaking if lazy-loaded.

---

## 🟢 Minor

### m1. Every file starts with a path-repeating header comment
`src/App.tsx:1`, `src/pages/HomePage.tsx:1`, etc:

```
// src/pages/HomePage.tsx
```

The filesystem already knows. This is noise on every file and rots if files move.

### m2. `(window as any).lenis` escape hatch
`src/components/PageTransition.tsx:57`

Only use of `any` in the production path I've read. Covered by B1.

### m3. SSR guards in code that never runs server-side
`src/config/performance.ts:3-30`

```ts
if (typeof window === "undefined") return false;
if (typeof navigator === "undefined") return false;
```

The site has no SSR step. These guards add noise and suggest a framework migration that didn't happen.

### m4. `console.warn` in production code path
`src/providers/ScrollNavigationProvider.tsx:136`

```tsx
if (!ref?.current) {
  console.warn(`Section ref not found for: ${sectionId}`);
  return;
}
```

Terser is configured with `drop_console: true` (`vite.config.ts:36`), so this is stripped in prod builds. But `dropConsole` skips `console.error` and `console.warn` in some configurations — worth confirming the exact terser options remove both. Either way, a silent `return` + a throw in dev mode would be more defensible.

### m5. Magic numbers scattered across files
Examples:
- `navOffset = 80` (`ScrollNavigationProvider.tsx:78`, `useScrollTo.ts:50`)
- `stiffness: 260, damping: 20` (`NavDock.tsx:71-74`)
- `duration: 1.2` (Lenis, scrollTo calls, ScrollNavigationProvider.navigateToSection)
- `300ms` waits (ScrollNavigationProvider, ZAxisElement)
- `threshold: 0.1` (IntersectionObserver in Counter and TypingText)

No central motion/timing token file. Each component chose its own values.

### m6. Two ways to handle reduced motion
- `useReducedMotion()` hook — consumed by ~10 components.
- Universal CSS override in `index.css:47-62` — catches everything not using the hook.

Belt + suspenders is fine, but overlapping systems mean regressions go unnoticed in one path because the other picks them up.

### m7. Import style inconsistency
Some files use `@/lib/utils` (path alias), others use `../lib/utils` (relative). `src/components/ui/narrative-timeline.tsx:5` uses `@/hooks/useReducedMotion` while `src/components/ui/scroll-text-reveal.tsx:7` uses `../../hooks`. Both resolve. Mixing them makes grep noisy.

### m8. `MagneticButton` ref typed as an intersection of button and anchor
`src/components/ui/magnetic-button.tsx:50`

```ts
ref: ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>
```

A DOM element is never both. TypeScript accepts it because the intersection has no conflicting members, but the type lies. A discriminated union on `as` would be cleaner: `as === "a" ? HTMLAnchorElement : HTMLButtonElement`.

---

## 💡 Suggestions

### s1. Delete the 15+ unused UI components
From audit 04 C4: `horizontal-scroll`, `zoom-section`, `animation-sequence`, `hero-parallax`, `bento-grid`, `wobble-card`, `staggered-grid`, `box-reveal`, `scroll-box-reveal`, `scroll-line-reveal`, `text-reveal`, `animated-section`, `interactive-hover-button`, `useParallax`, `usePinnedSection`, `useScrollAnimation`. None are imported by any page.

Plus `WEBSITE_DOCUMENTATION.md` and `SCROLLYTELLING_INVESTIGATION_REPORT.md` in the repo root are unused planning docs.

This is ~1500+ LOC of dead scaffolding that costs nothing at runtime (tree-shaken) but bloats code reviews, search results, and the cognitive map of the repo.

### s2. Split Lenis/GSAP/motion into one shared scroll primitive
There are currently three independent scroll subscribers (Lenis → ScrollTrigger callbacks, motion's `useScroll`, `window.addEventListener("scroll")` in NavDock + SectionIndicator). Consolidating on a single `useSmoothScroll`-derived hook would remove the duplicate work and make it easy to reason about ordering.

### s3. Centralize motion tokens
Create `src/config/motion.ts` exporting:
- Standard durations (`fast: 0.15`, `base: 0.3`, `slow: 0.5`, `hero: 1.2`).
- Named easings (`enterCurve`, `moveCurve`, `drawerCurve`).
- Standard spring configs (`subtle`, `bouncy`, `snappy`).

All motion components pull from this. The motion review (03) shows each component chose its own values; consolidation would enforce consistency.

### s4. Type the Lenis instance exposure
If `window.lenis` is intentional (per B1 rewrite), declare it:

```ts
declare global {
  interface Window {
    lenis?: Lenis;
  }
}
```

But the better fix is not to expose it at all and route through context.

### s5. Consider Astro for the static content
Audit 04 notes the hero text is static but JS-gated. Astro's island architecture would render the hero as raw HTML and hydrate the motion components per-island. Non-trivial migration. Only suggest if perf becomes a priority.

### s6. One lint rule would catch several findings
An ESLint rule like `react-hooks/exhaustive-deps` (probably already on via `eslint-plugin-react-hooks`) plus a custom `no-restricted-syntax` targeting `window as any` would surface B1 and several minor findings at commit time. Verify the existing eslint config has the strict preset.

---

## Scoring

Weighted: `3 × 4 (blockers) + 2 × 9 (major) + 0.5 × 8 (minor) + 0.25 × 6 (suggestions) = 12 + 18 + 4 + 1.5 = 35.5`.

Well above the 3.0 minimum.

---

## Priorities for a first pass

If you want to ship *one* pass of cleanup that pays the most per unit effort:
1. **B3 + B4** — fix keyboard hijack and remove the `alert()`. Both are user-facing.
2. **B2 + M1** — fix the mount-time ScrollTrigger thrash and the NavDock scroll-handler rebind. Simplifies the mental model and removes latent bugs.
3. **B1** — route Lenis through context instead of `window.lenis`. Small change, closes a dead branch.
4. **M2 + s1** — delete `PerformanceProvider`, `HorizontalScroll`, `ZoomSection`, `AnimationSequence`, and the other unused scaffolding. Removes the biggest source of "what is this" overhead in the repo.
5. **M9** — break `SkillsPage.tsx` into files. Lets a reviewer scroll through it.

That's probably half a day of focused work and would resolve the 4 blockers and the most expensive major findings without touching design, animation, or accessibility follow-ups.
