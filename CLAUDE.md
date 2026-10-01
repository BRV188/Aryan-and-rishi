# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

Static portfolio site for **Aryan Vishwakarma** — filmmaker, video editor and
documentary storyteller.

Brand name, written exactly as it should appear on the site:
**More than an editor** — sentence case, never all-caps and never Title Case.
Hero (`More` / `than` / `an editor.`), the craft section (`More than` /
`editing.`) and the footer brand all use this casing, along with the `<title>`,
Open Graph and Twitter meta tags. `text-transform: uppercase` is deliberately
absent from `.hero__title`, `.craft__title` and `.footer__brand`; do not add it
back.

Live at `https://brv188.github.io/Aryan-and-rishi/` (GitHub Pages, deployed from
`main`). No build step — files are served directly.

## Sections (8, in order)

| # | Class | Heading |
|---|---|---|
| 01 | `.hero` | More / than / an editor. + showreel |
| 02 | `.statement` | "I don't just cut footage." |
| 03 | `.featured` | WHO THE FUnK ARE YOU? (rendered from data) |
| 04 | `.craft` | More than editing. + 8 craft pills |
| 05 | `.about` | Who's behind the edit? |
| 06 | `.services` | What I can do |
| 07 | `.process` | From idea to final frame. |
| 08 | `.contact` | Let's make something worth watching. |

Selected Work, The Edit, Filmmaking and Documentary sections were **removed**
by request. Their CSS, JS renderers and data arrays were deleted too — do not
reference `.card`, `.vcard`, `.doccard`, `.work__grid`, `.edit__grid`,
`.behind__grid`, `.docs__grid` or `.filter`; they no longer exist. Re-adding a
work grid means restoring markup, renderer and styles together.

## SECTION MAP — reference this

8 sections, top to bottom. Every one is tagged `data-section="NN"` in
`index.html`, so you can find it instantly.

| # | Name | CSS class | Content lives in | Notes |
|---|---|---|---|---|
| 01 | HERO | `.hero` | `index.html` | One-line title "More than an editor.", showreel, role line. No name |
| 02 | INTRODUCTION | `.statement` | `index.html` | Two lines, no images |
| 03 | FEATURED PROJECT | `.featured` | `data/projects.js` → `PROJECTS` | Title, blurb, video frame, description. No credits, no stills, no name |
| 04 | MORE THAN EDITING | `.craft` | `index.html` | Big heading + 8 craft pills (STORY, FRAMING, …) |
| 05 | ABOUT | `.about` | `index.html` | Bio, 3 paragraphs. No name heading |
| 06 | SERVICES | `.services` | `index.html` | 4 rows: VIDEO EDITING / FILMMAKING / DOCUMENTARY / POST-PRODUCTION |
| 07 | PROCESS | `.process` | `index.html` | 4 steps, 01–04 |
| 08 | CONTACT | `.contact` | `index.html` | Headline, list, 3 buttons |
| — | FOOTER | `.footer` | `index.html` | Brand, role, `© 2026`. No name |

**No name rule:** the personal name does not appear anywhere in the page body —
not in the hero, about, featured credits or footer. It exists only in the
`<head>` meta tags (title, description, author, og:*, twitter:*). Do not add it
back to visible markup.

Also not a numbered section: the fixed bar at the very top (`.topbar`) with
the "MT AE" mark, nav links and Mumbai clock.

### How to ask for a change

Say the number and what you want:

- "section 06 me VIDEO EDITING ka text change karo"
- "section 07 hata do"
- "section 04 ke pills me DIRECTION add karo"
- "section 03 ka video chhota karo"

Text-only changes go in `index.html`. Section 03 changes go in
`data/projects.js`. Colours, sizes and spacing go in `style.css` — tell me the
section number and I'll aim at that block only.

### Removed sections (do not reference)

Selected Work, The Edit, Filmmaking and Documentary were removed. Their CSS,
JS and data were deleted. `.card`, `.vcard`, `.doccard`, `.work__grid`,
`.edit__grid`, `.behind__grid`, `.docs__grid` and `.filter` no longer exist.

## Structure

```
index.html                 all 8 sections' markup
style.css                  all styles (tokens at :top in :root)
main.js                    renderFeatured + scroll motion
data/projects.js           content for 03 only: PROJECTS + BEHIND_WORK
assets/
  favicon.svg              "M/A" monogram
  README.md                which media files go where + encoding guidance
  video/                   (empty — drop showreel.mp4 etc. here)
  stills/                  (empty — drop poster JPGs here)
.github/workflows/deploy.yml   GitHub Pages deploy on push to main
```

## Serving locally

```bash
python -m http.server 8090
# open http://localhost:8090
```

## Adding work — edit ONLY data/projects.js

This is the single source of truth. Never hand-edit `index.html` to add content.

Two arrays:

- `PROJECTS` — five entries. Only the one with `featured: true` renders (the
  Featured Project block). The other four are held in the data file ready for a
  work grid to be restored. `ratio` sets the frame aspect ratio
  (`'16 / 9'`, `'4 / 5'`, etc.).
- `BEHIND_WORK` — production stills. The first four are shown under the
  featured project. Exported as `STILLS`.

Set `src: null` while you have no video cut. The site then renders a labelled
film-frame placeholder instead of a broken player, so layouts stay presentable
while media is being gathered.

## Design system

All tokens are CSS custom properties in `:root` at the top of `style.css`.

- `--bg` `#0a0a0a` · `--bg-alt` `#111110` · `--bg-deep` `#050505`
- `--text` `#f2efe6` (warm white) · `--text-dim` `#a8a49a` · `--muted` `#6f6c64`
- `--border` `#262623` · `--grain-opacity` `0.055`
- `--font-sans` / `--font-display` Inter · `--font-serif` Bodoni Moda (italic
  pull-quotes only) · `--font-mono` (all `.label` meta text)
- `--gutter` fluid page margin · `--section-gap` space between sections
- `--ease` standard · `--ease-out` for reveals

Colour comes from the films and stills. The UI itself stays monochrome — do not
add accent colours, gradients, glassmorphism or rounded cards. The one
`border-radius: 999px` in use is on the craft pills and category filters, which
is intentional and small.

## Animations

CSS-only except where noted. All reveal states start at `opacity: 0` and depend
on JS, which is why the no-JS fallback block at the very bottom of `style.css`
forces everything visible.

- **Reveal** — `[data-reveal]` elements fade up via IntersectionObserver
  (`.is-in`), 80–90ms stagger set through `--delay`
- **Scramble** — `scramble(node)` in `main.js` randomises characters then
  resolves left to right. Hero title on load. Skipped under reduced motion.
- **Hover-play** — `bindHoverPlay()` attaches to any media block that has a
  `src`; muted, looping, `preload="none"`. No-ops when `src` is null.
- **Grain** — fixed SVG turbulence overlay, `grainShift` keyframe
- **Reduced motion** — blanket `0.001ms` override plus explicit resets for
  reveal, craft list and the scroll hint

Motion should feel like editing: controlled and rhythmic. Do not add animation
for its own sake.

## Progressive enhancement

`index.html` sets `class="js"` on `<html>` from a 1-line inline script in
`<head>` (runs before first paint). CSS uses `.js [data-reveal]` so the
hidden-initial-state only applies when JS is present. The `html.no-js` block is
**last** in `style.css` and overrides everything — keep it last and in sync when
adding elements with an `opacity: 0` start state.

## Mobile

`@media (max-width: 900px)` in `style.css` is a dedicated layout, not a shrink:

- Hero title drops to weight 700 / `1.25rem–1.875rem`
- Showreel and featured media go 4:5 for immersion
- Featured stills become a 2-up grid
- About, services and process go single column
- Contact buttons stack full width
- Nav and clock hidden

## Encoding warning

Do not use PowerShell `Get-Content` / `Set-Content` to edit these files. On
Windows PowerShell 5.1 that round-trip mangles the em-dash (U+2014) into
U+201D. Use the editor tools, or if you must script it use
`[System.IO.File]::ReadAllText/WriteAllText` with an explicit
`UTF8Encoding($false)`. Verify with:

```powershell
$b=[System.IO.File]::ReadAllBytes($f)
0..($b.Length-3) | ? { $b[$_] -eq 0xE2 -and $b[$_+1] -eq 0x80 -and $b[$_+2] -eq 0x9D }
# must return nothing
```

## Content accuracy

- Bio facts: started learning editing **2018**, freelancing professionally
  since **2023**
- Copyright year: **2026**
- Contact links in `index.html` (`mailto:aryan@example.com`, Instagram URL) are
  **placeholders** — replace with real ones
- `assets/og.jpg` referenced in meta tags does not exist yet; add a 1200×630
  social card

## Deploy

Push to `main`; Pages redeploys automatically via
`.github/workflows/deploy.yml`. No CI changes needed for content updates.

The repo is **public** — GitHub Pages on the free plan does not serve private
repos. Do not add the repo back to private without also moving hosting.
