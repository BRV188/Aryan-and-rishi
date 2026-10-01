# assets/

Drop your media here. The site looks for these paths, so keep the filenames or
update `data/projects.js` to match.

## video/

| File | Used by | Notes |
|---|---|---|
| `showreel.mp4` | Hero showreel | Click-to-play with sound. 1080p H.264. |
| `funk.mp4` | Featured — WHO THE FUnK ARE YOU? | Optional. Hover-mutes and loops. |
| `chai.mp4` | CHAI | Optional. |
| `edit-doc.mp4` | The Edit — Documentary | Optional, hover-plays muted. |
| `edit-yt.mp4` | The Edit — YouTube | Optional. |
| `edit-film.mp4` | The Edit — Short Film | Optional. |
| `edit-commercial.mp4` | The Edit — Commercial | Optional. |
| `edit-social.mp4` | The Edit — Social | Optional. |
| `edit-motion.mp4` | The Edit — Motion | Optional. |

## stills/

Poster images for every project. Until a file exists, the site renders a
labelled film-frame placeholder instead of a broken image, so the layout stays
presentable while you gather footage.

Expected: `funk-1.jpg`, `chai-1.jpg`, `doc-1.jpg`, `yt-1.jpg`, `exp-1.jpg`,
`edit-doc.jpg`, `edit-yt.jpg`, `edit-film.jpg`, `edit-commercial.jpg`,
`edit-social.jpg`, `edit-motion.jpg`, `bc-1.jpg` … `bc-6.jpg`,
`doc-real-1.jpg` … `doc-real-4.jpg`.

## Encoding recommendations

- Video: H.264 MP4, 1080p max, **no audio track** (playback is muted), CRF ~23.
  Keep each under ~8 MB.
- Stills: 1600px on the long edge, AVIF or WebP preferred, quality ~72.
- Poster images matter more than you think — they are what loads first on a
  phone, so keep them lean.
