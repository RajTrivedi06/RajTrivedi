# Portfolio Design Review — 01

Date: 2026-04-21
Scope: Full site walkthrough (Home → About → Skills → Projects → Connect), plus global systems (typography, spacing, color, IA, POV). Diagnosis only — no prescriptions.

---

## TL;DR

The portfolio reads as a **component showcase first, a person second.** Almost every section is organized around a visual effect (typing, tilt, magnetic, bento, scroll-reveal, gradient animation) rather than around a thing you want to say. Voice is present in copy fragments ("people who don't read documentation", "wait, that's actually possible now?") but gets buried under generic effect-driven scaffolding. Purple-on-black with a color-shifting gradient blob is the dominant mood signal, and it's doing almost all the emotional work for the site — strip it away and what's left feels templated.

The strongest section is the About timeline (clear narrative, specific claims). The weakest is Home (effect-dense, low-substance) and Skills (bento sprawl). Projects is functional but undersells the work.

---

## Critical

### C1. No typographic identity — using browser default sans
`src/index.css`, `tailwind.config.js`, `index.html`
No custom font is loaded anywhere. `@font-face`, Google Fonts, `<link rel="preconnect">`, and `font-family` are all absent; Tailwind's default sans stack (system-ui → Apple system → Segoe UI) is in force. Every headline, every body block, and every `font-mono` class on year badges renders with whatever the OS hands over. For a portfolio whose entire premise is "I make things deliberate", this is the single loudest piece of genericness — it flattens Home, About, Skills, Projects, and Connect to the same visual baseline as a Vite starter template. The only reason it doesn't read as default is the gradient background distracting from it.

### C2. Home section says almost nothing about you
`src/pages/HomePage.tsx:40-87`
Three stacked elements: "Hey, I'm Raj" (typing animation), "Builder. Growth Engineer." (word stagger), and a ~50-word paragraph about "things that matter" / "AI-powered tools, full-stack platforms". The copy is abstract — any CS student could ship this exact hero without changing a word. The only specific fact is "UW-Madison." There's no proof, no artifact, no link, no year, no role. The typing animation and perspective transform absorb attention that should be on content. A first-time visitor gets more information about your animation stack than about you in the first viewport.

### C3. Information architecture is a component tour, not a narrative
`src/App.tsx:13-18`, `src/pages/SingleScrollPage.tsx:49-129`
Five sections (Home, About, Skills, Projects, Connect) arranged in the exact default order of every personal-portfolio-template-of-2024. Order does not build an argument — Skills sits between About and Projects even though Projects are the concrete evidence of the Skills. "About" calls itself "Behind the Code," "Skills" calls itself "My Digital Footprint," "Projects" calls itself "The Code Canvas" — three metaphors from three different themes, none anchored to you. The structure is readable but templated; nothing about the sequence, labels, or section breaks is specific to Raj.

### C4. Color strategy is one color + "purple is all moods"
`src/pages/*`, `tailwind.config.js`, `src/components/ui/background-gradient-animation.tsx:14-23`
Every accent — hover borders, focus rings, active nav dots, year badges, gradient borders, shine borders, status dots, skill pills, section headings, link underlines, scrollbar thumb (`#9b5cff` in `index.css:170`), timeline rails, magnetic button highlights — is the same purple family (`purple-400`–`purple-700`, `#9B5CFF`, `#d282ff`). The gradient blob adds a token cyan `#5EE2FF` (Connect ellipse, gradient-animation `thirdColor`) and magenta `#dc32c8` but those only appear in animated backgrounds, not in content. When every meaningful UI element uses the same hue, purple stops meaning anything — it reads as decoration, not signal. The mood defaults to "generic dark-mode AI startup, circa 2024."

### C5. Copy voice is inconsistent and drifts toward AI-ish
`src/pages/HomePage.tsx:81-86`, `src/pages/AboutPage.tsx:11-37`, `src/pages/ConnectPage.tsx:70-82`
Home talks in first-person-specific ("I build things", "people who don't read documentation"). About switches into third-person narrator ("Discovered the magic of turning ideas into code", "Fell into the AI rabbit hole") — reads like an AI-written About section template. Connect snaps into corporate boilerplate: "Interested in working together or have a question? Feel free to reach out. I'm here to help you turn your ideas into amazing digital realities." That last sentence is word-for-word the kind of sentence a fiverr bio template would produce — it completely erases the voice set on Home. Three sections, three different narrators.

### C6. Projects undersells itself — no visible impact, no outcomes
`src/pages/ProjectsPage.tsx:59-108`
Four project cards; three use images from `assets/` that appear to be stock (`houseimage.png`, `connectcablesimage.jpg`) rather than screenshots of the actual product (`houseimage.png` is used for a PCB defect detection project — image and project are unrelated). Descriptions are mechanism-focused ("semantic search across 200+ labs", "preference-driven prompting") with no outcomes, users, metrics, screenshots, or demos. `liveUrl` is hardcoded to `"#"` on Translalia (line 70) — the "Live" status badge is therefore a false promise. Three of four GitHub URLs point to your profile root, not the repo. A visitor who clicks cannot actually see any of these projects.

### C7. About timeline milestones read as generated, not lived
`src/pages/AboutPage.tsx:8-38`
Four milestones labeled "The Spark / The Deep Dive / The Bet / The Build" with copy like "Discovered the magic of turning ideas into code" and "Fell into the AI rabbit hole. Started building tools that think." These are narrative-template headlines — structurally identical to a hundred "my coding journey" posts. Each milestone has one year and one sentence; no artifact, no project name, no specific moment, no person, no place. The most memorable bit of About is the copy ("Shipping products designed for people who don't read documentation"), which reuses a line from Home (`HomePage.tsx:82`) — so the only specific voice on the page is a duplicate.

---

## Medium

### M1. Typographic scale is uncoordinated across sections
- Home H1: `text-6xl md:text-8xl` (`HomePage.tsx:41`)
- About H2 (title): `text-4xl sm:text-5xl lg:text-6xl` (`narrative-timeline.tsx:267`)
- Skills H1: `text-3xl sm:text-6xl` (`SkillsPage.tsx:542`) — skips `4xl` and `5xl`
- Projects H1: `text-4xl sm:text-6xl` (`ProjectsPage.tsx:124`)
- Connect H2: `text-4xl sm:text-5xl` (`ConnectPage.tsx:64`)

There's no system: Home is biggest, About is second, Skills jumps two steps at a single breakpoint, Connect is smallest. Subheads, body copy, eyebrows, and captions use ad-hoc Tailwind sizes with no declared scale. Type rhythm varies page-to-page instead of compounding a voice.

### M2. Section titles compete with each other on weight and style
Home: `text-6xl font-bold` solid white + typing cursor.
About: `text-4xl-6xl font-bold` with purple gradient `bg-clip-text`.
Skills: `text-3xl sm:text-6xl font-bold` with same purple gradient.
Projects: `text-4xl sm:text-6xl font-bold` solid `text-purple-600` (no gradient).
Connect: `text-4xl sm:text-5xl font-bold` solid white.

Three different title treatments (white, gradient, solid purple) in five sections. A reader scrolling top-to-bottom cannot learn "this is how Raj marks a new section" because the treatment changes.

### M3. Spacing system is improvised
Section shells use a mix of `pt-32 pb-12` (Skills, timeline), `py-8 sm:py-12` (Projects), `flex items-center justify-center` with no vertical padding (Connect). Bento gap is `gap-4`. Timeline card uses `p-6`. Experience cards use `p-5`. Connect card uses `p-8 sm:p-12`. Max-widths wobble between `max-w-4xl` (Home), `max-w-5xl` (About), `max-w-7xl` (Skills, Projects), `max-w-[1000px]` (Connect, a one-off magic number). No shared layout token, no shared vertical rhythm — every section was laid out by eye.

### M4. Connect section layout is dated and off-brand
`src/pages/ConnectPage.tsx:16-42, 64-82`
Two hardcoded absolutely-positioned ellipse rings (277×277, 19px border, magic pixel offsets) behind a centered card with animated gradient border. The ring pattern is a 2021-era "dribbble-style" decoration that doesn't appear anywhere else on the site, making Connect visually disconnected from the rest. The card shape (rounded rectangle, animated gradient border, bullet list of contact buttons, "or email me directly at…" footer) is a generic shadcn / aceternity demo — present in hundreds of template sites.

### M5. Skills bento overcrowds the grid with low-signal cards
`src/pages/SkillsPage.tsx:549-576`
Seven bento cards: Education, Stats, AI Powered, Interactive Skills, Focus Areas, Soft Skills, Frameworks. Some are load-bearing (Interactive Skills links skills → projects, genuinely interesting). Others are filler: "AI Powered" is a single typing-animated string listing "GPT-4, Claude, Custom Agents" with no context. "Soft Skills" is three bullet points ("Cross-functional Communication", "End-to-End Project Ownership", "Product & Systems Thinking") — résumé-page clichés that add nothing. "Focus Areas" and "Frameworks" list the same information at different granularities. The page tries to say a lot and ends up saying "I have a bento grid."

### M6. Stats card cites "40% API usage reduced" with no referent
`src/pages/SkillsPage.tsx:304-313`
Large `font-black` counter animating to 40%, captioned "API usage reduced". No indication of which project, what baseline, what method. The Attri.ai experience card lower on the page (`SkillsPage.tsx:610`) mentions "AI support chatbot projected to reduce tickets ~40%" — likely the source, but the stats card presents it as a standalone achievement without context. A hiring reader will either not connect them or will notice and distrust both.

### M7. "Builder. Growth Engineer." subtitle is a two-word identity
`src/pages/HomePage.tsx:63-68`
The one line that's supposed to say *what you do* is two abstract nouns separated by a period. Builder applies to ~everyone in tech. Growth Engineer is narrower but used inconsistently across the site (sometimes "Growth Engineer", sometimes "full-stack", sometimes "technical consultant"). There is no "Raj is the person who does X for Y" positioning anywhere.

### M8. Nav dock hide-on-scroll logic is hostile on short sections
`src/components/NavDock.tsx:40-57`
Dock disappears when scrolling down past 200px and reappears when scrolling up. Between long sections (Skills, Projects) a reader deliberately scrolling through loses the nav; to jump back to About or Home they must first scroll up to reveal the dock. Combined with the right-side `SectionIndicator` (`section-indicator.tsx:62-124`) appearing after 200px, there are two navigation affordances with different visibility rules for different actions — confusing. Also: `lastScrollY` in the dependency array (`NavDock.tsx:57`) rebinds the scroll listener on every scroll tick — a perf smell, not a design one, but worth flagging.

### M9. Purple scrollbar override makes the site feel skinned
`src/index.css:160-176`
Webkit scrollbar thumb forced to `#9b5cff`, hover to `#b47fff`. Firefox scrollbar forced to the same. Scrollbar re-skinning is a telltale of sites trying to look custom — it often reads as skin-deep theming rather than design. The effect here is minor (the scrollbar is rarely visible because most sections are short) but it reinforces the "purple everywhere" issue in C4.

### M10. Home paragraph tries to be two things
`src/pages/HomePage.tsx:81-86`
"I build things that matter — AI-powered tools, full-stack platforms, and products designed for people who don't read documentation. Currently studying CS & Data Science at UW-Madison, working on projects that sit at the intersection of tech, growth, and 'wait, that's actually possible now?'"

Three ideas fighting for one paragraph: (1) a positioning statement, (2) a credential, (3) a personality joke. The joke is the best part and buries itself at the end inside a compound qualifier.

---

## Nice-to-have

### N1. Default Vite favicon still present
`public/vite.svg`, `index.html:1-13`
No `<link rel="icon">` declared in `index.html`; Vite's default `vite.svg` is the only icon in `public/`. Tab will show either the default Vite icon or nothing. For a personal site this is a small but noticeable tell that the shell wasn't customized.

### N2. No `<meta>` description, og-image, theme-color, or title treatment
`index.html:1-13`
`<title>Raj Trivedi</title>` is the only head content. Previews when shared on LinkedIn, Slack, or iMessage will be blank. `<meta name="theme-color">` absent despite site being dark-mode-only — mobile Safari address bar won't tint. `color-scheme: dark` is not set on `<html>`; default browser scrollbars and form controls will render in light mode if any appear.

### N3. Project card images are literally unrelated stock
`src/pages/ProjectsPage.tsx:14-18, 92`
`HouseImage.png` illustrates the PCB defect detection project; `ConnectCablesImage.jpg` illustrates MyCosmosJobs. At a glance it looks like every project is about houses and cables. Adds noise, removes trust.

### N4. Status badges mix emoji and checkmarks inconsistently
`src/pages/ProjectsPage.tsx:38-49`
"🟢 Live", "✓ Completed", "🚧 In Development" — three different visual languages in one three-item set (colored circle emoji, text checkmark, construction emoji). Fine in isolation; reads unprofessional side-by-side.

### N5. Typing animation re-types "GPT-4, Claude, Custom Agents" every time the card enters view
`src/pages/SkillsPage.tsx:109-123, 455-459`
Observed-once-then-type pattern retriggers on every IntersectionObserver hit (threshold 0.1). On the Skills page where this card is always near the fold, a small scroll wiggle can retrigger the effect. Feels fidgety.

### N6. "Behind the Code," "Digital Footprint," "Code Canvas" are three different metaphors
`src/pages/AboutPage.tsx:44`, `SkillsPage.tsx:542-543`, `ProjectsPage.tsx:124`
Each section title reaches for a different creative framing. None of them describe the content literally. A reader scanning the H1s sees a collage of poetic-but-vague labels instead of a clear table of contents.

### N7. "Currently open to: internships, collaborations, interesting conversations"
`src/pages/ConnectPage.tsx:77-82`
"Interesting conversations" is a stock personal-site line. Reads as filler because the two concrete asks (internships, collaborations) already cover the real intent.

### N8. Resume button opens an `alert("Resume download coming soon!")`
`src/pages/ConnectPage.tsx:162-189`
One of four CTA buttons in the primary Connect card is non-functional and uses a native `alert`. Small but load-bearing — a recruiter who clicks this will see an OS-level dialog in 2026.

### N9. `cursor: default !important` forced on body
`src/index.css:370-373`
Overrides browser link cursors. Interactive elements with their own `cursor-pointer` class still work, but anything relying on the default link cursor (e.g. inline `<a>` without Tailwind) will feel dead. A small quirk that subtly degrades interactivity signals.

### N10. `SCROLLYTELLING_INVESTIGATION_REPORT.md` and `WEBSITE_DOCUMENTATION.md` in repo root
Process documents shipped alongside the site source. Not visible to users but signals "work-in-progress scaffolding still present." Worth deciding whether these belong in `/docs` or should be gitignored.

---

## Point of view — does the site say something about you?

**Partly.** There are two sentences on the entire site that sound like a person:
1. "products designed for people who don't read documentation" (Home, About — used twice)
2. "'wait, that's actually possible now?'" (Home)

Both hint at a specific taste: low-friction, taste-led, user-centric, slightly irreverent. That voice exists. It just has nowhere to breathe — every other sentence is either abstract positioning ("builder, growth engineer", "things that matter") or template boilerplate ("turn your ideas into amazing digital realities", "interesting conversations").

The visual layer says even less. Purple gradient + dark mode + bento + typing animation + magnetic buttons + tilt cards + shine borders is the 2024 AI-site starter pack. Nothing on the page would look out of place on a portfolio for a different CS student at a different school with different projects. If the name "Raj" and "UW-Madison" were removed, the site would still work as-is for anyone.

The About timeline comes closest to a POV but uses template phrasing ("The Spark / The Deep Dive") that neutralizes it. Projects has the raw material (Oxford, Attri.ai, Cosmos, MadHelp) but delivers it through generic mechanism-focused descriptions instead of stories, screenshots, or outcomes.

**Net:** the site *could* say something — the raw ingredients are there in your project list and in two Home sentences — but the current execution is neutral. A visitor walks away knowing you built things with purple and animations. They don't walk away with a claim about what you believe, what you're betting on, or what you'd argue with them about.

---

## Generic / templated / AI-ish — section by section

| Section | Generic-ness | Notes |
|---|---|---|
| **Home** | High | Purple gradient + typing animation + abstract tagline. Every element is a shadcn / aceternity / magicui primitive. Two sentences of voice, buried. |
| **About (timeline)** | Medium-high | Template milestone phrasing ("The Spark"). Good structure, weak content. Icons (rocket, brain, chart, zap) are clichéd choices. |
| **Skills (bento)** | Medium | Bento grid itself is trendy but not wrong. Stats and Soft Skills cards are résumé filler. Interactive Skills → Projects is the one genuinely original interaction on the site. |
| **Projects** | High | Carousel of tilt cards with status badges, tech tags, overlay buttons on hover. Images don't match projects. No outcomes, no live links. Looks like the Projects page from any "Next.js portfolio template" YouTube tutorial. |
| **Connect** | Very high | Ellipse rings + gradient border card + icon grid + "let's talk!" heading. Textbook template Connect section. "Turn your ideas into amazing digital realities" is AI-written copy. |

---

## Scope of this audit

Diagnostic only — no fixes proposed, by request. Findings are organized so each can be triaged independently; a separate pass (or a follow-up `02-`) should propose a target for each retained finding before implementation.
