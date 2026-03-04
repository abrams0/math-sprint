# Math Sprint

![CI](https://github.com/abrams0/math-sprint/actions/workflows/ci.yml/badge.svg)


A lightweight, browser-based practice app for fast mental math.

## Features
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
- Tap-to-continue round break (optional).
- Mute toggle with persistence.

## Usage
1. Open `index.html` in a browser.
2. Choose max number (buttons), operations, and problems per session.
3. Answer using the keyboard and press Enter.

## Versioning
This project uses semantic versioning: `MAJOR.MINOR.PATCH`.

## Development
Run commands from the app folder (where `package.json` lives).
- Run tests: `npm test`
- Run lint: `npm run lint`


## Accessibility
- Keyboard focus styles enabled for all controls.
- ARIA labels and live regions for problem and feedback.
- Progress bar shows symbols (✓/✕) in addition to color.


## Performance & Reliability
- Fonts use local system stacks (no network dependency).
- Offline support via service worker.
- Audio gracefully disables if AudioContext is unavailable.

