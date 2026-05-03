# Use of Color Audit — 02b (WCAG 1.4.1)

Date: 2026-04-21
Scope: `src/pages/*`, `src/components/NavDock.tsx`, `src/components/ui/*`, `src/index.css`.
Standard: WCAG 2.1 §1.4.1 **Use of Color** (Level A) — "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."

## Summary

Files reviewed: 12.
**Violations:** 1 critical, 2 medium, 4 nice-to-have (borderline).

Good news: the site has no forms (so no required-field markers, no validation states, no error color-coding), no charts/graphs (so no legend issues), and no inline text links that rely on color alone — the single mailto on Connect has both color and underline. Status badges and nav-active states are redundantly encoded. The one real failure is in the About page timeline's "highlight" milestone, which is distinguished purely by gradient hue.

---

## Critical

### V1. NarrativeTimeline "highlight" milestone distinguished only by warmer gradient
`src/components/ui/narrative-timeline.tsx:133-141`, `:207-217`
`src/pages/AboutPage.tsx:36` (`highlight: true` set on the "Now / The Build" milestone)

The `highlight` flag is the semantic signal that says "this one is different / current." Visually the only thing it changes is the icon bubble's gradient and shadow:

```tsx
milestone.highlight
  ? "bg-gradient-to-br from-purple-400 to-pink-500 shadow-pink-500/25"
  : "bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/25"
```

No size change, no ring, no "current" badge, no icon swap, no label, no `aria-current`, no position offset. A user with protanopia or deuteranopia may not perceive the purple→pink shift at all; a user on a monochrome display sees the identical bubble. The text beside it says `year: "Now"` which *does* communicate currency — but only because the author hand-wrote that string; any other `highlight: true` milestone would lose the meaning entirely.

**Type:** Status Indicator (color-only)
**Affected users:** CVD users, low-vision, monochrome displays.
**WCAG:** 1.4.1 Use of Color (Level A).

---

## Medium

### V2. Connect page "Currently open to" inline list encoded with color only
`src/pages/ConnectPage.tsx:77-82`

```tsx
<p className="text-gray-400 text-base mb-8">
  Currently open to:{" "}
  <span className="text-purple-400">
    internships, collaborations, interesting conversations
  </span>
</p>
```

The purple span visually separates the list of opportunities from the surrounding prose, signaling "these are the actual values." Without the color cue there is no markup distinction (no `<ul>`, no `<strong>`, no `<em>`, no `<mark>`) — a screen reader or monochrome reader sees one continuous run of text. Borderline: the colon *does* carry some of the meaning, so info is not strictly color-only. Flagged because the same pattern is replicated elsewhere on the site (Connect's social icon labels rely on color change plus layout — those are OK because of icons + structure).

**Type:** Categorical Emphasis (color-only)
**WCAG:** 1.4.1 Use of Color (Level A) — borderline.

### V3. Focus indicator on NavDock conveyed only via low-contrast purple ring
`src/components/NavDock.tsx:104`

```tsx
"focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 …"
```

This is strictly a §1.4.11/§2.4.11 contrast issue (covered in 02a), but it also intersects §1.4.1 because the ring is the *only* affordance that differentiates focus from the default state — no size change, no translation, no secondary indicator. If the user's display or vision suppresses the purple tint, there is no other way to tell which dock icon is focused. `aria-current` is set on the *active* state but not on the *focused* state. Mentioned here for completeness; the fix for 02a's focus-ring contrast would resolve this too.

**Type:** Interactive Focus State
**WCAG:** 1.4.1 + 2.4.7 (Focus Visible).

---

## Nice-to-have / borderline

### V4. Interactive hover states on every button rely on color shifts only
Affected: `src/pages/ConnectPage.tsx` MagneticButtons, `src/pages/SkillsPage.tsx` `InteractiveSkillPill` and tech chip hovers, `src/components/ui/narrative-timeline.tsx:50-55` timeline card, `src/components/ui/dock.tsx` DockIcon.

Hover → bg shifts and border hue shifts. On `MagneticButton` there's also a magnetic translation, which counts as non-color. On `InteractiveSkillPill` default→hover the *only* differentiator is `hover:border-purple-400 hover:bg-purple-500/10` — no scale, no shadow, no underline. This is technically not a §1.4.1 violation (hover doesn't convey semantic information), but the skill guide calls out "hover states with only color changes" as a concern for CVD users trying to discover affordances. Considered nice-to-have.

### V5. SectionIndicator active dot — color + size; label hidden behind hover
`src/components/ui/section-indicator.tsx:93-108`

Active vs inactive dot differs by background color (purple-500 vs gray-600) *and* size (12px vs 8px). Size difference is non-color, so the control itself passes §1.4.1. However the section's *name* is only revealed on hover (`whileHover={{ opacity: 1 }}`), so a CVD user who can't parse the dot position must mouse over each dot to figure out which section it represents. Passes strictly, but the affordance is fragile.

### V6. StatusBadge — redundant encoding but emoji-dependent
`src/pages/ProjectsPage.tsx:28-49`

```tsx
live: "🟢 Live",
completed: "✓ Completed",
development: "🚧 In Development",
```

Passes 1.4.1 because each badge has a text label in English. Noted for awareness: the decorative prefix varies in form (emoji circle, ascii checkmark, emoji construction sign) — on devices with missing emoji fonts the "🟢" and "🚧" render as tofu boxes, leaving "Live" and "In Development" as plain text. Not a violation but brittle.

### V7. InteractiveSkillPill active vs default — redundantly encoded
`src/pages/SkillsPage.tsx:182-204`

Active state = bg-purple-500 solid + `text-white` + chevron rotated 180°. The chevron rotation is a non-color differentiator, so the control passes §1.4.1. Good pattern; listed here so any future refactor preserves the rotation.

### V8. NavDock active icon — redundantly encoded
`src/components/NavDock.tsx:105-147`

Active state = slightly larger icon (`w-5 h-5` vs `w-[18px]`), heavier stroke (`strokeWidth={2.5}` vs 2), purple dot indicator below, `aria-current="page"`, white text on purple-tinted bubble. Multiple non-color indicators + correct ARIA. Passes cleanly. Noted so future redesigns preserve at least one non-color cue.

---

## Categories checked — N/A on this site

| Category | Status | Notes |
|---|---|---|
| Form validation (error / success / warning) | **N/A** | No `<form>`, `<input>`, `<textarea>`, or `<select>` on any page. |
| Required-field indicators | **N/A** | No forms. |
| Data viz / chart legends | **N/A** | No `<svg>` chart, no recharts/victory/d3 usage. The `Counter` component is a single number, no comparison. |
| Link-only-by-color in body copy | **Pass** | Only inline text link is the mailto at `ConnectPage.tsx:195-200`, which has both `text-purple-400` *and* `underline`. |
| Tag / category color coding | **Pass** | `TechTag` (`ProjectsPage.tsx:52-56`) is uniform `bg-gray-800 text-gray-300` — no category coloring. Tailwind coursework chips (`SkillsPage.tsx:279-286`) also uniform. |
| Sort / filter / selection color-only | **N/A** | No sort, filter, or multi-select controls. |
| Progress-step color-only | **N/A** | No step / wizard UI. |

---

## Recommendations (priority order)

These are proposed changes — save for the follow-up implementation pass.

1. **V1 fix (critical).** Add a non-color differentiator to the `highlight` milestone. Options:
   - Render a small "Current" text badge next to the "Now" label.
   - Scale the highlighted bubble (`h-16 w-16` vs `h-14 w-14`) or add a ring (`ring-2 ring-white/20`).
   - Set `aria-current="step"` on the milestone container so assistive tech announces it.

2. **V2 fix (medium).** Wrap the list items in semantic markup:
   ```tsx
   Currently open to:{" "}
   <mark className="bg-transparent text-purple-400">
     internships, collaborations, interesting conversations
   </mark>
   ```
   or convert to a bullet list. The purple remains for visual hierarchy; the `<mark>` makes the emphasis machine-readable.

3. **V3 fix (medium).** Replace `ring-purple-500/50` with solid `ring-purple-400` (also addresses 02a focus-contrast failure). Consider doubling up: `ring-2 + outline-offset-2` alongside a 1px inner white ring so the ring stays visible against a purple gradient backdrop.

4. **V4 note (nice-to-have).** Add a second affordance to primary button hovers — e.g. `hover:-translate-y-0.5` or `hover:shadow-lg` — so hover is perceivable without color.

---

## Overall posture

The site is largely safe under §1.4.1 *because it has so few information-carrying states*: no forms, no charts, no tagged categories. The patterns that do exist (nav active, skill pill active, status badges, mailto link) all encode redundantly. The one real failure is the timeline highlight, which is load-bearing semantically but invisible without color. Fix V1 and the site clears Level A for Use of Color.
