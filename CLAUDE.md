# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

Static portfolio site for **Aryan Vishwakarma** — filmmaker, video editor and
documentary storyteller. Brand concept: **"More Than an Editor."**

Live at `https://brv188.github.io/Aryan-and-rishi/` (GitHub Pages, deployed from
`main`). No build step — files are served directly.

## Structure

```
index.html                 markup + inline .js/.no-js class swap in <head>
style.css                  all styles (design tokens at :top in :root)
main.js                    all rendering + scroll motion
data/projects.js           ALL content: projects, editing work, stills, docs
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

This is the single source of truth. Every grid, section, hover preview and the
featured block render from it. Never hand-edit `index.html` to add a project.

Four arrays:

- `PROJECTS` — the Selected Work grid + Featured Project
  - `size: 'wide' | 'standard' | 'tall'` sets the asymmetric column span
  - `ratio` sets the frame aspect ratio (`'16 / 9'`, `'4 / 5'`, etc.)
  - `featured: true` promotes an entry into the Featured Project section
- `EDITING_WORK` — The Edit grid. `cat` must match a filter label
  (`DOCUMENTARY`, `YOUTUBE`, `SHORT FILM`, `COMMERCIAL`, `SOCIAL`, `MOTION`).
  Filters are generated automatically from the data — add a new `cat` value and
  a new filter button appears.
- `BEHIND_WORK` — Behind the Camera stills
- `DOC_WORK` — Documentary strip

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

- Section priority: hero → showreel → work → featured → edit → about → contact
- Cards go full-bleed single column, 4:5 frames
- Behind the Camera shows 4 stills, rest hidden
- Blurbs always visible (no hover on touch)
- Nav and clock hidden

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
