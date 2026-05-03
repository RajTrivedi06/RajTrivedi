# Link Purpose Audit — 02c (WCAG 2.4.4)

Date: 2026-04-21
Scope: `src/pages/*`, `src/components/NavDock.tsx`, `src/components/ui/*` (carousel, magnetic-button, section-indicator, bento-grid, interactive-hover-button).
Standard: WCAG 2.1 §2.4.4 **Link Purpose (In Context)** (Level A).

## Summary

Files reviewed: 8.
Links/buttons inventoried: 19 distinct interactive destinations.
**Violations:** 3 critical, 2 medium, 3 nice-to-have.

Breakdown by type:
- Icon-only links without accessible names: **2** (critical)
- Ambiguous / duplicate links pointing to the same destination with unclear label: **1** (critical)
- `href="#"` placeholder destinations: **2** (1 critical, 1 medium)
- Decorative icons not marked `aria-hidden`: **4** (medium)
- Generic `sr-only` phrasing ("Previous slide") in project carousel: **1** (nice-to-have)
- Missing toggle-state announcement on accordion-style pill: **1** (medium)

NavDock and SectionIndicator use proper `aria-label` patterns and pass cleanly. The Carousel next/prev buttons use `sr-only` siblings, which pass — the phrasing is just generic.

---

## Inventory

| # | File:Line | Rendered label | `aria-label` / `title` / sr-only | `href` | Accessible name |
|---|---|---|---|---|---|
| 1 | `pages/HomePage.tsx` | (no interactive content) | — | — | — |
| 2 | `pages/AboutPage.tsx` | (no links/buttons in content) | — | — | — |
| 3 | `components/ui/narrative-timeline.tsx` | (cards are `<div>`, not links) | — | — | — |
| 4 | `pages/SkillsPage.tsx:180-204` | `{skill.name}` + `{skill.experience}` + chevron | — | button | e.g. "Python 3 production apps" ✓ |
| 5 | `pages/ProjectsPage.tsx:158-168` | `<ExternalLink>` icon only (hover-revealed overlay) | none | `{project.liveUrl}` | **empty** ✗ |
| 6 | `pages/ProjectsPage.tsx:169-179` | `<Github>` icon only (hover-revealed overlay) | none | `{project.githubUrl}` | **empty** ✗ |
| 7 | `components/ui/carousel.tsx:201-220` | `<ArrowLeft>` + sr-only "Previous slide" | sr-only "Previous slide" | button | "Previous slide" ✓ |
| 8 | `components/ui/carousel.tsx:224-248` | `<ArrowRight>` + sr-only "Next slide" | sr-only "Next slide" | button | "Next slide" ✓ |
| 9 | `pages/ConnectPage.tsx:87-108` | `<EnvelopeClosedIcon>` + "Email" | `title="Email"` | `mailto:rajtri286@gmail.com` | "Email" (minimally descriptive — doesn't say whose) |
| 10 | `pages/ConnectPage.tsx:111-134` | `<GitHubLogoIcon>` + "GitHub" | `title="GitHub"` | `https://github.com/RajTrivedi06` | "GitHub" |
| 11 | `pages/ConnectPage.tsx:137-160` | `<LinkedInLogoIcon>` + "LinkedIn" | `title="LinkedIn"` | `https://www.linkedin.com/in/raj-trivedi-a28589210/` | "LinkedIn" |
| 12 | `pages/ConnectPage.tsx:163-189` | `<FileTextIcon>` + "Resume" | `title="Download Resume"` | `"#"` + onClick `alert(...)` | "Resume" but **placeholder URL** ✗ |
| 13 | `pages/ConnectPage.tsx:195-201` | "rajtri286@gmail.com" (underlined) | — | `mailto:rajtri286@gmail.com` | email address itself ✓ |
| 14 | `components/NavDock.tsx:94-148` | Lucide icons: Home / User / Sparkles / FolderKanban / Send | `aria-label="Navigate to ${label}"` + Tooltip | button → `navigateToSection(id)` | "Navigate to Home" etc. ✓ |
| 15 | `components/ui/section-indicator.tsx:74-109` | colored dot | `aria-label="Go to ${section.label} section"` | button → `scrollIntoView` | "Go to About section" etc. ✓ |
| 16 | `components/ui/bento-grid.tsx:132` | (generic `<a href>` in unused BentoCard variant — not rendered by SkillsPage) | — | `{href}` | — (dead code path) |
| 17 | `pages/SingleScrollPage.tsx:81-128` | `<section aria-label="Home">` etc. | `aria-label=` on sections | — (landmarks, not links) | ✓ |
| 18 | `pages/ConnectPage.tsx:17-42` | decorative ellipse divs | — | none | ✓ (not interactive) |
| 19 | `components/ui/interactive-hover-button.tsx` | (not used by any page) | — | button | — (dead code path) |

---

## Critical

### V1. Icon-only "View Live" link has no accessible name
`src/pages/ProjectsPage.tsx:158-168`

```tsx
{project.liveUrl && (
  <a
    href={project.liveUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-purple-500 rounded-full hover:bg-purple-400 transition-colors"
    onClick={(e) => e.stopPropagation()}
  >
    <ExternalLink className="h-5 w-5 text-white" />
  </a>
)}
```

The anchor contains only a Lucide `<ExternalLink>` icon. No `aria-label`, no `title`, no `sr-only` span, and the icon is not marked `aria-hidden`. Lucide icons render as inline SVG with no `<title>` element, so assistive tech will announce this as the bare word "link" (or the auto-generated file name). In the flat "links list" a screen-reader user pulls up, this entry is indistinguishable from any other unlabeled link.

Compounded by the fact that the anchor sits inside a hover-revealed overlay (`opacity-0 group-hover:opacity-100`), keyboard users tabbing through the page will land on an invisible button with no announced purpose.

**Type:** Image/Icon Link Without Alt Text
**Fix recommendation:** `aria-label={"Open " + project.title + " live site"}` + `aria-hidden="true"` on the `<ExternalLink>`. Also address the hover-reveal visibility (outside 2.4.4 scope — see 02a for focus-visibility concerns).
**WCAG:** 2.4.4 Link Purpose (Level A); also 4.1.2 Name, Role, Value.

### V2. Icon-only "View on GitHub" link has no accessible name AND duplicates destination across three projects
`src/pages/ProjectsPage.tsx:169-179` + `ProjectsPage.tsx:71, 83, 95`

```tsx
<a
  href={project.githubUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
  onClick={(e) => e.stopPropagation()}
>
  <Github className="h-5 w-5 text-white" />
</a>
```

Two compounding problems:
1. Same "no accessible name" issue as V1 — the anchor contains only a `<Github>` icon.
2. Three of the four project records share the **same `githubUrl`** (`https://github.com/RajTrivedi06` — the user's GitHub profile root, not the repo for each project). When a screen-reader user enters the links list, they see three identical entries, all pointing to the same URL, labeled nothing. This is the textbook "ambiguous link" case: **same text → same destination** is OK, **same text → different destinations** is a violation, and here we have **same (empty) text → same destination** for three contexts that claim to be different projects.

**Type:** Icon Link Without Alt Text + Ambiguous Links
**Fix recommendation:** either (a) point each `githubUrl` to the actual repo for the project and add `aria-label={"View " + project.title + " on GitHub"}`, or (b) remove the GitHub button on projects that don't have a repo URL and label the remaining ones individually.
**WCAG:** 2.4.4 Link Purpose (Level A).

### V3. Translalia "Live" button is an `href="#"` placeholder
`src/pages/ProjectsPage.tsx:70`

```tsx
{
  id: 1,
  title: "Translalia",
  status: "live" as const,
  …
  liveUrl: "#",
  githubUrl: "https://github.com/RajTrivedi06",
},
```

Combined with the "🟢 Live" StatusBadge, this link actively misleads: the UI promises the project is live, the button rotates the user back to the current page with a history-stack entry. A keyboard or screen-reader user who follows it ends up on a page that looks identical, scrolls to top, and has no way to know the navigation didn't fail. A sighted user will briefly suspect the page reloaded.

**Type:** Placeholder URL + Ambiguous Purpose
**Fix recommendation:** either wire the real Translalia URL or remove the liveUrl field so the conditional at line 158 hides the button.
**WCAG:** 2.4.4 (ambiguity), 3.2.5 (change on request), and a general UX failure.

---

## Medium

### V4. ConnectPage Resume button points to `#` and shows a native `alert()` instead of downloading
`src/pages/ConnectPage.tsx:163-189`

```tsx
<MagneticButton
  as="a"
  href="#"
  magneticStrength={0.4}
  onClick={(e) => {
    e.preventDefault();
    alert("Resume download coming soon!");
  }}
  …
  title="Download Resume"
>
  <FileTextIcon … />
  <span …>Resume</span>
</MagneticButton>
```

Three intersecting issues:
1. The anchor's `href` is `"#"` — keyboard users cannot tell this is non-functional until they activate it.
2. `preventDefault` + `alert()` replaces the real action with an OS-level modal, which is jarring and unlabeled in assistive tech beyond "Resume download coming soon!".
3. The accessible name is "Resume" (from the `<span>`) — which in isolation doesn't communicate that clicking will open an alert dialog rather than download a file. For a genuine download link, the skill guide flags missing file-type / size metadata; here there's no file at all.

**Fix recommendation:** either ship a real PDF (`href="/raj-trivedi-resume.pdf" download` + update label to "Download résumé (PDF)") or hide the button until the file exists. Do not use an anchor for a non-navigation action.
**WCAG:** 2.4.4 (no meaningful destination), 2.5.3 (label in name — "Resume" doesn't include "download"), 3.2.2 (change on input).

### V5. Decorative icons inside labeled Connect buttons aren't `aria-hidden`
`src/pages/ConnectPage.tsx:104, 130, 156, 185`

```tsx
<EnvelopeClosedIcon className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
<GitHubLogoIcon className="w-6 h-6 …" />
<LinkedInLogoIcon className="w-6 h-6 …" />
<FileTextIcon className="w-6 h-6 …" />
```

Radix UI icons render as `<svg>` elements with default `role="img"` behavior in some screen readers. Paired with the visible text label ("Email", "GitHub", "LinkedIn", "Resume"), assistive tech may announce the icon and the label, producing doubled output like "Envelope Closed Icon Email". Not a 2.4.4 failure (the name is still clear) but it muddies the announced purpose.

**Fix recommendation:** add `aria-hidden="true"` to each icon. Keep the `title=` on the MagneticButton as-is.
**WCAG:** 2.4.4 (clarity), 1.1.1 (non-text content).

---

## Nice-to-have

### V6. Carousel next/prev say "Previous slide" / "Next slide" — acceptable, but generic for this context
`src/components/ui/carousel.tsx:218, 247`

The sr-only labels are inherited from the shadcn/Embla carousel defaults. On this site the carousel contains project cards, not "slides." A screen-reader user scanning the links list will see "Previous slide" and "Next slide" without learning they're scrolling through projects. Not a violation (the purpose — move the carousel — is clear) but the label misses an opportunity to carry context.

**Fix recommendation:** pass `aria-label` overrides from ProjectsPage:
```tsx
<CarouselPrevious aria-label="Previous project" … />
<CarouselNext aria-label="Next project" … />
```

### V7. ConnectPage social button labels don't identify the account
`src/pages/ConnectPage.tsx:107, 131, 157`

The accessible name on the GitHub button is "GitHub" — the href goes to `github.com/RajTrivedi06` but the label doesn't reflect that. In a flat links list ("Email, GitHub, LinkedIn, Resume") a user has to infer from context that these are Raj's accounts. The section heading ("Let's Talk!", `ConnectPage.tsx:64`) is the programmatic context — technically sufficient for 2.4.4 since the links are nested under it — but explicit labels are more robust.

**Fix recommendation:** change `title` (and add `aria-label`) to e.g. "Visit Raj's GitHub profile", "Connect on LinkedIn", "Email Raj".

### V8. InteractiveSkillPill toggles an accordion but doesn't announce the state
`src/pages/SkillsPage.tsx:180-204`

```tsx
<motion.button
  onClick={onClick}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className={…}
>
  <span className="font-medium text-sm">{skill.name}</span>
  <span …>{skill.experience}</span>
  <ChevronDown …rotate-180…}/>
</motion.button>
```

The chevron rotates 180° when active and a related panel expands below (`AnimatePresence` in `SkillsPage.tsx:348-374`). The button has no `aria-expanded`, no `aria-controls`, and no text toggle state. Screen-reader users will hear "Python, 3 production apps" identically whether the panel is open or closed. Not strictly a 2.4.4 failure (the link purpose — select Python — is clear) but the pair is incomplete as an accordion.

**Fix recommendation:** add `aria-expanded={isActive}` and `aria-controls={"skill-detail-" + skill.name}` on the button; put matching `id` on the `<motion.div>` panel.
**WCAG:** 2.4.4 adjacent + 4.1.2 Name, Role, Value.

---

## Passes — noted so regressions are caught later

| Location | Why it passes |
|---|---|
| `components/NavDock.tsx:98-99` | `aria-label="Navigate to ${label}"` + `aria-current="page"` + tooltip |
| `components/ui/section-indicator.tsx:78` | `aria-label="Go to ${section.label} section"` |
| `components/ui/carousel.tsx:218, 247` | sr-only labels present (see V6 for quality note) |
| `pages/ConnectPage.tsx:195-201` | inline mailto link labeled with the full email address |
| `pages/SkillsPage.tsx:180-204` | button has visible text (skill name + experience) — passes 2.4.4; see V8 for related 4.1.2 gap |
| `pages/SingleScrollPage.tsx:81-128` | `aria-label` on each `<section>` landmark |

---

## Overall posture

The scrollytelling shell (NavDock, SectionIndicator, section landmarks) is well-labeled and follows accessibility patterns cleanly. The **Projects carousel** is the hotspot: every interactive element on a project card is either unlabeled (V1, V2), duplicated (V2), or a placeholder (V3). The **Resume button** (V4) is the one on Connect that actively misleads. Fixing V1–V4 resolves all Level A failures; V5–V8 are polish that will also improve non-screen-reader UX.
