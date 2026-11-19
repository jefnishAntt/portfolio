# Jefnish ANTT · Portfolio

Personal portfolio built with Next.js (App Router), React, Tailwind CSS v4 and Framer Motion.

## Run locally

```bash
pnpm install
pnpm dev
```

## Where things live

- `src/config.ts`: profile, experience, education, toolkit and social links
- `src/data/`: case studies, writing, lab projects and brain region text
- `src/styles/theme.css`: all colours, light and dark
- `src/components/brain/`: the 3D brain and its explorer
- `public/me.jpg`: profile photo (black and white, 1024px)

## Brain model

The site uses `public/models/brain-points.bin`, a point cloud generated from `assets/models/brain.glb` by `scripts/build-brain-points.mjs`. Run that script again only if the model changes.

## Résumé

Put a PDF at `public/resume.pdf`. The Résumé button appears automatically when the file exists.
