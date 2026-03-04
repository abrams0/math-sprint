# Math Sprint

![CI](https://github.com/abrams0/math-sprint/actions/workflows/ci.yml/badge.svg)


A lightweight, browser-based practice app for fast mental math.

## Features
- Avoids repetitive answers back-to-back in a session.
- Adaptive difficulty.
- Spaced repetition for missed pairs.
- Fluency heatmap of slowest pairs.
- Multiplication and division practice (1–10 only).
- Addition and subtraction practice within a chosen max number.
- Multiple operations per session.
- Progress bar with first-try accuracy.
- Second-round retry for missed problems.
- Session summary with accuracy and timing.
- Multilingual UI (EN, LT, DE, RU) with persistence.
- Daily goal + streak indicator (counts across sessions each day and persists across reloads).
- Difficulty presets.
- Mistake review screen.
- Mute toggle with persistence.

## Usage
1. Open `index.html` in a browser.
2. Choose max number (buttons), operations, and problems per session.
3. Answer using the keyboard or the on-screen Check button.

## Versioning
This project uses semantic versioning: `MAJOR.MINOR.PATCH`.

## Development
Run commands from the app folder (where `package.json` lives).
- Run tests: `npm test`
- Run lint: `npm run lint`


## Accessibility
- Keyboard focus styles enabled for all controls.
- ARIA labels and live regions for problem and feedback.
- Progress bar uses accessible labels in addition to color.


## Performance & Reliability
- Fonts use local system stacks (no network dependency).
- Offline support via service worker.
- Audio gracefully disables if AudioContext is unavailable.


## Deployment
- Build: `npm run build` (outputs to `dist/`)
- GitHub Pages auto-deploys on every push to `main`.
- Manual deploy (optional): `scripts/deploy-pages.sh`

