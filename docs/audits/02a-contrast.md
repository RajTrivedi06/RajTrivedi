# Contrast Audit — 02a

Date: 2026-04-21
Scope: All color pairings in `src/pages/*`, `src/components/NavDock.tsx`, `src/components/ui/*`, `src/index.css`, `tailwind.config.js`.
Method: WCAG 2.1 relative-luminance formula (per W3C §1.4.3 / §1.4.11). No MCP contrast tools available in this environment — ratios computed manually from hex values; conservative rounding.

## Assumptions

- The site's effective background is a `bg-black/40` overlay on top of the `BackgroundGradientAnimation` component. The gradient blobs (purple / cyan / magenta) roam over black, so the effective content background varies between **true black** and **dimly tinted black** at any given moment. Ratios below are computed against **`#000000`** (worst-case for light text, best-case for dark text); when the gradient blob passes under a word, contrast drops below the stated ratio.
- Where text sits on a `bg-gray-900/80` card (Timeline), the ratio is against `#111827` (approx of gray-900 over near-black).
- Tailwind color values taken from Tailwind v3 defaults.
- Font-size threshold for "large text" per WCAG: ≥18pt (~24px) regular, or ≥14pt (~18.66px) bold.
- No form inputs, no placeholders, no `<input>` / `<textarea>` / `<select>` exist on the site — flagged as **N/A** where relevant, not as pass.

## Pass / Fail key

| Marker | Meaning |
|---|---|
| ✓ AA | Meets WCAG 2.1 AA for the column's text category |
| ✓ AAA | Meets WCAG 2.1 AAA for the column's text category |
| ✗ | Fails |
| — | Not applicable at this usage (e.g. background-only) |

Thresholds: Normal text AA=4.5, AAA=7. Large text AA=3, AAA=4.5. UI component / meaningful border AA=3 (§1.4.11).

---

## Summary

Files scanned: 7 page/component files + tailwind / index.css.
Distinct text-on-background pairs analyzed: 20.
Distinct border / UI-boundary pairs analyzed: 8.
**Violations:** 9 text pairs fail AA or AAA at the sizes they're used; 6 UI / border pairs fail §1.4.11's 3:1 requirement.

The most load-bearing failures are:
1. `text-white` on `bg-purple-500` (active skill pill) — 3.96:1, FAILS AA at 14px.
2. White on `bg-green-600` "🟢 Live" status badge — 3.30:1, FAILS AA at 12px.
3. `text-gray-500` muted captions on black — 4.34:1, FAILS AA normal text.
4. `border-gray-600` button borders on black (Connect MagneticButton, Skills pill) — 2.78:1, FAILS §1.4.11.
5. `border-white/10` card borders (Bento, Dock) — 1.21:1, FAILS §1.4.11.
6. Focus ring `ring-purple-500/50` on black — ~2.00:1, FAILS §1.4.11 focus-indicator contrast.

---

## Table 1 — Body / muted / heading text on background

| Pair | Where used | Size | Ratio | AA | AAA | Replacement if failing |
|---|---|---|---|---|---|---|
| `text-white` `#ffffff` on `#000000` | HomePage hero, titles site-wide, dock | all | **21.00:1** | ✓ | ✓ | — |
| `text-gray-100` `#f3f4f6` on `#000000` | `SkillsPage.tsx:582` section heading | 24px+ | **18.88:1** | ✓ | ✓ | — |
| `text-gray-200` `#e5e7eb` on `#000000` | FocusAreasCard row text | 14px | **16.96:1** | ✓ | ✓ | — |
| `text-gray-300` `#d1d5db` on `#000000` | HomePage para, Connect body, timeline | 14–18px | **14.25:1** | ✓ | ✓ | — |
| `text-gray-400` `#9ca3af` on `#000000` | HomePage subhead, Connect "Currently open to", ExperienceCard body | 14–32px | **8.27:1** | ✓ | ✓ | — |
| `text-gray-400` `#9ca3af` on `#111827` (gray-900/80 card) | Timeline description, Skills sub-captions | 14px | **6.99:1** | ✓ | ✗ (borderline) | darken bg or use `#e5e7eb` for AAA |
| `text-gray-500` `#6b7280` on `#000000` | Connect footer "Or email me directly…", `SkillsPage.tsx` eyebrow captions, SectionIndicator inactive labels | 12px | **4.34:1** | ✗ | ✗ | `#9ca3af` (gray-400) → 8.27:1 ✓AA, ✓AAA |
| `text-gray-500` `#6b7280` on `#111827` | StatsCard "Production apps shipped" etc. | 12px | **3.67:1** | ✗ | ✗ | `#c1c4ca` (custom) or `text-gray-400` → 6.99:1 ✓AA |
| `text-purple-300` `#d8b4fe` on `#000000` | BentoCard title hover, Connect email hover | 14–20px | **11.88:1** | ✓ | ✓ | — |
| `text-purple-400` `#c084fc` on `#000000` | Year badges, Connect location, experience company eyebrow, skill icons, subtitle on project card | 12–18px | **7.95:1** | ✓ | ✓ | — |
| `text-purple-400` `#c084fc` on `#111827` | Timeline year badge over gray-900/80 card | 12px | **6.72:1** | ✓ | ✗ | `#e2cfff` → 9.9:1 ✓AAA |
| `text-purple-500` `#a855f7` on `#000000` | (No plain text usage — only backgrounds) | — | 5.31:1 | — | — | — |
| `text-purple-600` `#9333ea` on `#000000` | `ProjectsPage.tsx:124` section heading (also used as gradient stop elsewhere) | 36–60px (large) | **3.90:1** | ✓ large | ✗ large AAA | for non-large reuse: `#a855f7` (purple-500) → 5.31:1 or use `#c084fc` → 7.95:1 |
| `text-purple-500` via `bg-clip-text` gradient (purple-400→purple-600) | Skills H1, Timeline H2 | large | **~4.9:1** (measured at mid-gradient `#b06bd5`) | ✓ large | ✗ large AAA | anchor gradient lighter: `#d8b4fe`→`#a855f7` → ~7:1 ✓ |
| `text-white` on `bg-purple-500` `#a855f7` | InteractiveSkillPill active state `SkillsPage.tsx:186-188` | 14px (normal) | **3.96:1** | ✗ | ✗ | darken bg to `#7e22ce` (purple-700) → 6.97:1 ✓AA normal |
| `text-purple-100` `#f3e8ff` on `bg-purple-500` | Active skill-pill experience subtext | 12px | **3.35:1** | ✗ | ✗ | darken bg to `#6b21a8` → 7.5:1 ✓AA normal |
| `text-purple-200` `#e9d5ff` on `bg-purple-500/20` (~`#221131`) | "Projects using …" chips in skill reveal | 12px | **~11.7:1** | ✓ | ✓ | — |
| `text-gray-300` `#d1d5db` on `bg-gray-800` `#1f2937` | TechTag chips on Projects cards | 12px | **9.96:1** | ✓ | ✓ | — |
| `text-gray-400` on `bg-white/5` (~`#0d0d0d`) | MagneticButton label "Email/GitHub/LinkedIn/Resume" | 12px | **8.19:1** | ✓ | ✓ | — |
| `text-purple-300` on `bg-purple-500/10` (~`#11091a`) | Eyebrow labels inside purple tinted panels | 12px | **11.8:1** | ✓ | ✓ | — |

---

## Table 2 — Links

| Pair | Where used | Size | Ratio | AA | AAA | Replacement |
|---|---|---|---|---|---|---|
| `text-purple-400` underline on `#000000` | `mailto` link `ConnectPage.tsx:195-200` | 14px | **7.95:1** | ✓ | ✓ | — |
| `text-purple-300` hover on `#000000` | same link hover | 14px | **11.88:1** | ✓ | ✓ | — |
| `text-purple-400` hover `text-white` (ConnectPage icon group-hover state) | MagneticButton text hover | 12px | **21:1 / 7.95:1** | ✓ | ✓ | — |

---

## Table 3 — Button states

Buttons on this site are: NavDock icon buttons, MagneticButton CTAs (Connect), InteractiveSkillPill (Skills), Carousel Previous/Next (Projects), StatusBadge (non-interactive but styled like a button).

| Button / state | Ratio | AA | AAA | Replacement |
|---|---|---|---|---|
| **NavDock icon, default** — `text-gray-400` icon on `bg-black/30` over black (~#0d0d0d) | **8.19:1** | ✓ | ✓ | — |
| **NavDock icon, hover** — `text-white` on same bg | **~19:1** | ✓ | ✓ | — |
| **NavDock icon, active** — `text-white` on `bg-gradient-purple-500/30→600/20` over black (~`#2b1040`) | **~13:1** | ✓ | ✓ | — |
| **NavDock icon, focus ring** — `ring-purple-500/50` on `ring-offset-black/50` effectively purple-500/50 on black (~`#542a7b`) | **2.00:1** | ✗ | ✗ | use solid `ring-purple-400` → 7.95:1 ✓ §1.4.11 |
| **MagneticButton (Connect), default** — icon `currentColor` defaults to `text-white`, label `text-gray-400`, bg `bg-black`, border `border-gray-600` | border **2.78:1**, text-gray-400 **8.27:1** | border ✗, text ✓ | border ✗, text ✓ | border → `#737373` (neutral-500) or `#a855f7` (purple-500) → 3.01:1 / 5.31:1 ✓ §1.4.11 |
| **MagneticButton, hover** — `bg-gray-800` `border-purple-500`, icon `text-purple-400`, label `text-white` | border **5.31:1**, icon **7.95:1**, label **16.1:1** | ✓ | ✓ | — |
| **MagneticButton, focus/active** — no distinct focus style declared beyond browser default | — | ✗ (no visible focus) | ✗ | add `focus-visible:ring-2 ring-purple-400` |
| **MagneticButton, disabled** — not implemented | N/A | — | — | — |
| **InteractiveSkillPill, default** — `text-gray-300` + `text-gray-500` on `border-gray-600` on black | text 14.25:1 & 4.34:1, border 2.78:1 | text-gray-500 ✗, border ✗ | ✗ | text → `text-gray-400` (8.27:1), border → `border-gray-500` (4.34:1) ✓ §1.4.11 |
| **InteractiveSkillPill, hover** — `hover:border-purple-400 hover:bg-purple-500/10` | border 7.95:1 | ✓ | ✓ | — |
| **InteractiveSkillPill, active** — `text-white` + `text-purple-100` on `bg-purple-500` | **3.96:1 / 3.35:1** | ✗ | ✗ | darken bg to `purple-700` `#7e22ce` → 6.97:1 / 4.52:1, or switch label to 16px (large) |
| **InteractiveSkillPill, focus** — no `focus-visible:` rule | — | ✗ | ✗ | add ring |
| **InteractiveSkillPill, disabled** — not implemented | N/A | — | — | — |
| **Carousel Previous/Next** — `text-white` + `border-white/20` + `bg-black/50 backdrop-blur-sm` | icon **21:1**, border on effective `#000000` → `#333` → **3.23:1** | ✓ | border ✗ AAA | — |
| **Carousel nav, hover** — `hover:bg-white/10` (~#1a1a1a), icon white | **~17:1** | ✓ | ✓ | — |
| **Carousel nav, focus** — no `focus-visible:` rule | — | ✗ | ✗ | add ring |
| **StatusBadge "Live"** — `text-white` on `bg-green-600` `#16a34a` | **3.30:1** | ✗ | ✗ | bg → `#15803d` (green-700) → 4.65:1 ✓AA normal, or restrict to large text |
| **StatusBadge "Completed"** — `text-white` on `bg-blue-600` `#2563eb` | **5.17:1** | ✓ | ✗ | bg → `#1e40af` (blue-800) → 8.6:1 ✓AAA |
| **StatusBadge "In Development"** — `text-black` on `bg-yellow-600` `#ca8a04` | **7.15:1** | ✓ | ✓ | — |
| **Hover overlay on project card** — `text-white` on `bg-purple-500` icon bubble, `bg-gray-700` icon bubble | 3.96:1 / 9.05:1 | purple ✗, gray ✓ | ✗ / ✗ | purple bubble → purple-700 `#7e22ce` |

---

## Table 4 — Form inputs / placeholders

No `<input>`, `<textarea>`, `<select>`, or native form is rendered on any page. The Connect page uses anchor tags and icon buttons only; Skills has `<motion.button>` pills but no text input.

| Pair | Status |
|---|---|
| Input text on input bg | **N/A** — no inputs |
| Input placeholder color | **N/A** — no inputs |
| Input border default | **N/A** |
| Input border focus | **N/A** |
| Input border error | **N/A** |
| Input disabled state | **N/A** |

If a contact form is added later, it will need its own pass.

---

## Table 5 — Borders that carry meaning (§1.4.11)

A border "carries meaning" when it bounds an interactive element or a distinct content region (cards, dividers, state indicators). Purely decorative lines are excluded.

| Border | Where | Background | Ratio | §1.4.11 (≥3:1) | Replacement |
|---|---|---|---|---|---|
| `border-gray-600` `#4b5563` | MagneticButton default, InteractiveSkillPill default | `#000000` | **2.78:1** | ✗ | `#6b7280` (gray-500) → 3.85:1 ✓ |
| `border-gray-700` `#374151` | SkillsPage H1 rule, Experience H2 rule | `#000000` | **2.04:1** | ✗ (if treated as meaningful) / OK if decorative | `#4b5563` (gray-600) → 2.78:1 still ✗; use `#6b7280` for 3:1 |
| `border-gray-700/50` over gray-900 | Timeline milestone card | `#111827` | **~1.6:1** | ✗ | `border-purple-500/50` → ~4:1 ✓ |
| `border-white/10` (~`#1a1a1a`) | BentoCard, Dock, FocusArea rows, tech chip borders | `#000000` | **1.21:1** | ✗ | `border-white/25` (~`#404040`) → 3.14:1 ✓ |
| `border-purple-500/30` (~`#321745`) | Dock active indicator ring | `#000000` | **1.48:1** | ✗ | `border-purple-500` solid → 5.31:1 ✓ |
| `border-purple-500/40` (~`#43205c`) | BentoCard hover border | `#000000` | **1.77:1** | ✗ | `border-purple-500` → 5.31:1 ✓ |
| `border-purple-500` solid `#a855f7` | MagneticButton hover, InteractiveSkillPill active | `#000000` | **5.31:1** | ✓ | — |
| `border-[#9B5CFF]` ShineBorder stroke | Projects card, Skills cards | `#000000` | **5.37:1** | ✓ | — |
| ellipse strokes `#5EE2FF` / `#9B5CFF` (Connect) | decorative | `#000000` | **13.80:1 / 5.37:1** | ✓ | — |

---

## Table 6 — Focus indicators

WCAG 2.2 §2.4.11 + §1.4.11 require focus indicators to have 3:1 contrast against adjacent colors and be "not obscured."

| Element | Focus style | Ratio | §1.4.11 / §2.4.11 | Replacement |
|---|---|---|---|---|
| NavDock icon button | `focus-visible:ring-2 ring-purple-500/50 ring-offset-2 ring-offset-black/50` | **~2.00:1** (ring-purple-500/50 against black) | ✗ | `ring-purple-400` solid → 7.95:1 ✓ |
| MagneticButton (Connect) | none (browser default outline; site body sets `cursor: default !important` but leaves outline) | — | ✗ (no explicit focus-visible) | add `focus-visible:ring-2 ring-purple-400 ring-offset-2 ring-offset-black` |
| InteractiveSkillPill | none | — | ✗ | add ring as above |
| Carousel Previous / Next | none beyond `hover` | — | ✗ | add ring |
| Anchor links (Connect) | none declared | browser default | ✗ reliably | add `focus-visible:outline-purple-400 outline-2 outline-offset-2` |

---

## Table 7 — Scrollbar / overflow UI

| Pair | Ratio | §1.4.11 | Notes |
|---|---|---|---|
| `::-webkit-scrollbar-thumb` `#9B5CFF` on track `#1a1a1a` | **4.45:1** | ✓ | — |
| Scrollbar hover thumb `#b47fff` on `#1a1a1a` | **7.19:1** | ✓ | — |

---

## Top suggestions in priority order

1. **`text-gray-500` → `text-gray-400`** site-wide. Single largest source of body-copy contrast failures (Connect footer, SkillsPage captions, SectionIndicator inactive labels, StatsCard subheads). Ratio jumps from 4.34 → 8.27:1.
2. **StatusBadge "Live" bg `green-600 #16a34a` → `green-700 #15803d`.** 3.30 → 4.65. Removes an AA failure on a badge that's rendered as 12px normal text.
3. **InteractiveSkillPill active bg `purple-500 #a855f7` → `purple-700 #7e22ce`.** 3.96 → 6.97 for the primary label, 3.35 → 5.84 for the experience subtext. Also aligns with the hover/focus tokens.
4. **Card borders `border-white/10` → `border-white/25`** (or introduce a semantic `--border-card` token). Brings Bento, Dock, and FocusArea card boundaries above the 3:1 floor; currently all at 1.21:1 they are essentially invisible to users with reduced vision.
5. **MagneticButton / skill-pill default border `border-gray-600` → `border-gray-500`.** 2.78 → 4.34:1. Small change that fixes the two most-visible button shells.
6. **Focus ring `ring-purple-500/50` → `ring-purple-400`** (solid) on NavDock, and introduce the same token on MagneticButton, InteractiveSkillPill, Carousel nav, and Connect anchors. Currently focus is either invisible or at 2:1.
7. **Timeline card border `border-gray-700/50` on `bg-gray-900/80`** is at ~1.6:1 — the card is effectively borderless. Use a purple tint (`border-purple-500/40` on gray-900 ≈ 3.2:1) or bump opacity.
8. **Gradient headings (purple-400 → purple-600).** Safe for "Behind the Code" and "My Digital Footprint" because they are large text, but do not reuse the gradient at normal-text sizes anywhere — the mid-stop `~#b06bd5` would fail AA at body sizes.

---

## Caveats

- The `BackgroundGradientAnimation` component moves luminous purple / cyan / magenta blobs behind the entire site. Wherever these blobs pass under dark text or low-contrast borders, instantaneous contrast may rise **or fall** by 1–2 points below the values listed. Worst-case animations should be measured against the peak gradient state, not the black baseline; a dedicated pass with an animation-paused screenshot is recommended but outside this audit's scope.
- All opacity-based colors (`bg-black/40`, `border-white/10`, `purple-500/30`, etc.) are analyzed by solving the alpha composite against pure black. If a screen-blend gradient sits underneath at any moment, the effective mixed color changes — ratios in Table 5 are upper bounds.
- No ratios were computed for gradients rendered via `bg-clip-text` beyond the mid-stop approximation; full compliance requires every point along the gradient to meet the threshold (or, pragmatically, only the darker endpoint).
