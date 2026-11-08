# MissionLens

MissionLens is a responsive educational space exploration site built with React, TypeScript, Vite, React Router, Three.js, React Three Fiber, Drei, and Motion. It runs as a self-contained frontend; story content is local and narration uses the browser's Web Speech API.

## Setup

Install Node.js 20.19+ or 22.12+ and npm, then open a terminal in this folder.

```bash
npm install
npm run dev
```

Vite prints a local URL (normally `http://localhost:5173`). Open that URL in a browser.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` type-checks the app and writes the production site to `dist/`.

## Project map

- `src/app/App.tsx` — routes, shared shell, story archive, reader, narration, Science Lab, videos, and About page.
- `src/pages/HardwareLabPage.tsx` — lazy-loaded 3D exhibit viewer and labels.
- `src/styles/global.css` — responsive application styles.
- `src/types/mission.ts` — shared story and exhibit types.
- `/about` — MissionLens purpose, approach, and mission timeline.
- `src/data/catalog.ts` — typed mission and science exhibit content.
- `src/data/stories.json` — all five stories and their 42 slides, extracted from `prompt.txt`.
- `public/models/` — supplied GLB files.
- `public/videos/` — supplied landing background and lunar first-person videos.
- `public/assets/` — local fallback poster image.

## Generate story narration

Story audio is generated once and served as local MP3 files. Copy `.env.example` to `.env.local`, add an ElevenLabs API key with Text to Speech access there, then run `npm run narration:generate`. The generator uses the ElevenLabs voice **Alice - Clear, Engaging Educator**, saves one MP3 per slide under `public/audio/`, and writes the manifest used by the reader. Existing clips are skipped. Keep `.env.local` private; it is excluded from Git.

## Asset notes

The story visuals use clearly marked concept diagrams when a matching mission photograph was not present among the local assets. The landing poster is a supplied Apollo Moon image. Local 3D models were supplied without author or license metadata; their panels identify that limitation. Mission facts link to official NASA pages. The site is independent and does not imply NASA endorsement.
