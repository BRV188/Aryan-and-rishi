/**
 * projects.js — single source of truth for every piece of work on the site.
 *
 * To add a film, a documentary, an editing job or a showreel, append an object
 * to the relevant array below. Nothing else needs to change: the grids,
 * sections, hover previews and featured block are all rendered from this file.
 *
 * Media notes
 * -----------
 * `poster`  - still image shown before playback. Path relative to the site root.
 * `src`     - video file. Leave as null while you have no cut yet; the
 *             placeholder renders a film-frame treatment instead of a dead player.
 * `fallback`- inline SVG data URI. Only needed if you have no poster image.
 *
 * Recommended encodes (keeps the page fast):
 *   - MP4  (H.264, 1080p, no audio) for broad support
 *   - WebM (VP9) as a lighter alternative
 *   - poster as AVIF/WebP + JPG fallback
 */

const PROJECTS = [
  {
    id: 'who-the-funk-are-you',
    title: 'WHO THE FUnK ARE YOU?',
    year: '2025',
    category: 'Short Film',
    role: 'Director / Editor',
    blurb: 'A film about identity, overthinking and the different versions of ourselves.',
    description:
      'A short film built around the gap between who we are and who we think we are. Shot handheld across a single night, the piece leans on performance and rhythm rather than plot — the edit carries the argument.',
    poster: 'assets/stills/funk-1.jpg',
    src: null,
    featured: true,
    // Asymmetric editorial grid: each project declares its own span.
    // ratio controls the frame, size controls the column weight.
    size: 'wide',
    ratio: '16 / 9',
    tone: 'a',
  },
  {
    id: 'chai',
    title: 'CHAI',
    year: '2025',
    category: 'Short Documentary',
    role: 'Director / Editor',
    blurb: 'Small conversations, held long enough to become honest.',
    description:
      'A short documentary about everyday rituals and the people who keep them. Mostly observation, very little narration.',
    poster: 'assets/stills/chai-1.jpg',
    src: null,
    size: 'tall',
    ratio: '4 / 5',
    tone: 'b',
  },
  {
    id: 'documentary-projects',
    title: 'DOCUMENTARY PROJECTS',
    year: '2024',
    category: 'Documentary',
    role: 'Editor',
    blurb: 'Culture, people and the everyday life of a city that never stops moving.',
    description:
      'Longer-form documentary editing across culture, identity and daily life. Work that trusts the audience to stay.',
    poster: 'assets/stills/doc-1.jpg',
    src: null,
    size: 'standard',
    ratio: '16 / 9',
    tone: 'c',
  },
  {
    id: 'youtube-creator-work',
    title: 'YOUTUBE / CREATOR WORK',
    year: '2024',
    category: 'Editing · Storytelling',
    role: 'Editor',
    blurb: 'Retention as a storytelling problem, not a gimmick.',
    description:
      'Ongoing editing partnerships with creators. Hook, structure, pacing and a finish that feels like a film rather than a format.',
    poster: 'assets/stills/yt-1.jpg',
    src: null,
    size: 'standard',
    ratio: '16 / 9',
    tone: 'd',
  },
  {
    id: 'experimental-work',
    title: 'EXPERIMENTAL WORK',
    year: '2024',
    category: 'Visual Experiment',
    role: 'Editor',
    blurb: 'Tests. No brief, no deadline, no safe answer.',
    description:
      'Visual experiments built to find a language rather than deliver a deliverable. Motion, sound and rhythm pushed until something breaks.',
    poster: 'assets/stills/exp-1.jpg',
    src: null,
    size: 'tall',
    ratio: '4 / 5',
    tone: 'e',
  },
];

window.PORTFOLIO_DATA = { PROJECTS };
