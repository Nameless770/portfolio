# Mahmoud Khaled — Portfolio

A retro-RPG portfolio: a title screen, a pixel-art world, and a game menu where each section of the CV is a screen. Visitors earn XP and trophies as they explore, with Byte the owl as a guide. A **Plain CV** mode shows everything on one normal page.

Built with React 19 and Vite. There are no image files: every sprite and the background landscape are drawn in code.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Build and deploy

```bash
npm run build
```

The static site is written to `dist/`. Asset paths are relative, so you can upload `dist/` to any static host: GitHub Pages, Netlify, Vercel or Cloudflare Pages.

## Where things live

| File | What it holds |
| --- | --- |
| `src/data.js` | **All content**: bio, skills, projects, experience, contacts, achievements, Byte's lines and default settings |
| `public/Mahmoud_Khaled_CV.pdf` | The CV offered for download (keep the same file name, or update `PROFILE.cvFile`) |
| `src/world.js` | The five colour realms and the animated background |
| `src/sprites.js` | Pixel-art icons, stored as run-length-encoded rows |
| `src/sfx.js` | 35 chiptune sound effects, synthesised live (off by default; press **M** or use the HUD button). Try them all in Options → Sound test |
| `src/App.jsx` | Game state: scenes, XP, trophies, keyboard controls |
| `src/components/` | The title screen, game screen, tabs, plain CV and overlays |
| `src/styles.css` | Pixel frames, layout and the phone/tablet layout |

## Controls

- **↑ / ↓**: move through the menu
- **Enter**: select
- **Esc**: close a dialog
- **M**: sound on/off
- **↑ ↑ ↓ ↓ ← → ← → B A**: the secret. It gives 999 XP and unlocks a hidden realm.
