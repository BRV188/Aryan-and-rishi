# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project

Static portfolio site — filmmaking, video editing, documentary storytelling and
post-production. **No personal name appears anywhere on the site**, not in the
body and not in the `<head>` meta tags. Do not add a name to markup, meta tags
or contact links.

Brand name, written exactly as it should appear on the site:
**More than an editor** — sentence case, never all-caps and never Title Case.
Hero (`More` / `than` / `an editor.`), the craft section (`More than` /
`editing.`) and the footer brand all use this casing, along with the `<title>`,
Open Graph and Twitter meta tags. `text-transform: uppercase` is deliberately
absent from `.hero__title`, `.craft__title` and `.footer__brand`; do not add it
back.

Live at `https://brv188.github.io/Aryan-and-rishi/` (GitHub Pages, deployed from
`main`). No build step — files are served directly.

## Sections (7, in order)

| # | Class | Heading |
|---|---|---|
| 01 | `.hero` | More than an editor. + showreel |
| 02 | `.statement` | "I don't just cut footage." |
| 03 | `.craft` | More than editing. + 8 craft pills |
| 04 | `.about` | Who's behind the edit? |
| 05 | `.services` | What I can do |
| 06 | `.process` | From idea to final frame. |
| 07 | `.contact` | Let's make something worth watching. |

Selected Work, The Edit, Filmmaking, Documentary and Featured Project sections
were **removed** by request. Their CSS, JS renderers and data arrays were
deleted too — `data/projects.js` is gone, and `renderFeatured()`,
`buildMedia()`, `bindHoverPlay()` no longer exist. Do not reference `.card`,
`.vcard`, `.doccard`, `.work__grid`, `.edit__grid`, `.behind__grid`,
`.docs__grid`, `.featured`, `.featured__*`, `.still` or `.filter`; they no
longer exist. Re-adding a
work grid means restoring markup, renderer and styles together.

## SECTION MAP — reference this

7 sections, top to bottom. Every one is tagged `data-section="NN"` in
`index.html`, so you can find it instantly.

| # | Name | CSS class | Content lives in | Notes |
|---|---|---|---|---|
| 01 | HERO | `.hero` | `index.html` | One-line title "More than an editor.", showreel, role line |
| 02 | INTRODUCTION | `.statement` | `index.html` | Two lines, no images |
| 03 | MORE THAN EDITING | `.craft` | `index.html` | Big heading + 8 craft pills (STORY, FRAMING, …) |
| 04 | ABOUT | `.about` | `index.html` | Bio, 3 paragraphs |
| 05 | SERVICES | `.services` | `index.html` | 4 rows: VIDEO EDITING / FILMMAKING / DOCUMENTARY / POST-PRODUCTION |
| 06 | PROCESS | `.process` | `index.html` | 4 steps, 01–04 |
| 07 | CONTACT | `.contact` | `index.html` | Headline, list, 3 buttons |
| — | FOOTER | `.footer` | `index.html` | Brand, role, `© 2026` |

**No name rule:** no personal name anywhere — body or head. The `<title>`,
description, `author`, `og:*` and `twitter:*` tags all carry the brand only.

Also not a numbered section: the fixed bar at the very top (`.topbar`) with
the "MT AE" mark, nav links and Mumbai clock.

### How to ask for a change

Say the number and what you want:

- "section 06 me VIDEO EDITING ka text change karo"
- "section 07 hata do"
- "section 04 ke pills me DIRECTION add karo"
- "section 03 ke pills me SCORE add karo"

Text-only changes go in `index.html`. Colours, sizes and spacing go in
`style.css` — tell me the section number and I'll aim at that block only.

### Removed sections (do not reference)

Selected Work, The Edit, Filmmaking, Documentary and Featured Project were
removed. Their CSS, JS and data were deleted. `.card`, `.vcard`, `.doccard`,
`.work__grid`, `.edit__grid`, `.behind__grid`, `.docs__grid`, `.featured*`,
`.still*` and `.filter` no longer exist.

## Structure

```
index.html                 all 7 sections' markup
style.css                  all styles (tokens at :top in :root)
main.js                    scroll motion only (reveal, scramble, pills, clock, reel)
assets/
  favicon.svg              "M/A" monogram
  README.md                which media files go where + encoding guidance
  video/                   (empty — drop showreel.mp4 etc. here)
.github/workflows/deploy.yml   GitHub Pages deploy on push to main
```

## Serving locally

```bash
python -m http.server 8090
# open http://localhost:8090
```

## Adding content

There is no data file any more. Every word on the site lives directly in
`index.html`. Edit the markup there.

The showreel is the only media: drop `showreel.mp4` into `assets/video/` and it
plays on click. `.reel` reads `data-src` from `index.html`; if that attribute is
empty or the file is missing, the reel shows its designed placeholder instead of
a broken player.

## Design system

All tokens are CSS custom properties in `:root` at the top of `style.css`.

- `--bg` `#0a0a0a` · `--bg-alt` `#111110` · `--bg-deep` `#050505`
- `--text` `#f2efe6` (warm white) · `--text-dim` `#a8a49a` · `--muted` `#6f6c64`
- `--border` `#262623` · `--grain-opacity` `0.055`
- `--font-sans` / `--font-display` Inter · `--font-serif` Bodoni Moda (italic
  pull-quotes only) · `--font-mono` (all `.label` meta text)
- `--gutter` fluid page margin · `--section-gap` space between sections
- `--ease` standard · `--ease-out` for reveals

Colour comes from the films. The UI itself stays monochrome — do not
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
- **Reel** — clicking `.reel` builds a `<video>` from `data-src`; controls on,
  loops. No-ops if `data-src` is empty or the file is missing.
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
- Showreel goes 4:5 for immersion
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
- Contact links in `index.html` (`mailto:hello@example.com`, Instagram URL) are
  **placeholders** — replace with real ones
- `assets/og.jpg` referenced in meta tags does not exist yet; add a 1200×630
  social card

## Deploy

Push to `main`; Pages redeploys automatically via
`.github/workflows/deploy.yml`. No CI changes needed for content updates.

The repo is **public** — GitHub Pages on the free plan does not serve private
repos. Do not add the repo back to private without also moving hosting.
