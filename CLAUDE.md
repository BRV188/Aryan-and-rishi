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

## Structure

```
index.html                 markup + inline .js/.no-js class swap in <head>
style.css                  all styles (design tokens at :top in :root)
main.js                    rendering + scroll motion (renderFeatured only)
data/projects.js           ALL content: PROJECTS (5) + BEHIND_WORK (stills)
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
