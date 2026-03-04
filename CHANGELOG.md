# Changelog

## [1.7.0] - 2026-03-04
### Added
- Average time and best average metrics with record indicator.
- Graded round-break messages based on mistake rate.

## [1.6.6] - 2026-03-04
### Fixed
- Answer input now blocks non-numeric characters, including on paste.

## [1.6.5] - 2026-03-04
### Fixed
- Preserve custom domain by copying CNAME into dist/ during build.

## [1.6.4] - 2026-03-04
### Fixed
- Adaptive toggle and heatmap button now render in the menu.
- Build script handles paths with spaces.
- Check button keeps focus on the answer field.

## [1.6.3] - 2026-03-04
### Fixed
- Build script now skips missing optional assets and favicon.svg added to repo.

## [1.6.2] - 2026-03-04
### Fixed
- Added missing adaptive toggle and heatmap UI elements to the menu.

## [1.6.1] - 2026-03-04
### Fixed
- Added missing translations for adaptive difficulty and heatmap UI.

## [1.6.0] - 2026-03-04
### Added
- Adaptive difficulty toggle.
- Spaced repetition due-item injection.
- Fluency heatmap view.

## [1.5.0] - 2026-03-04
### Added
- Learning depth foundations: per-pair stats tracking and spaced repetition deck.

## [1.4.4] - 2026-03-04
### Changed
- Fastest solution now displays tenths of a second.

## [1.4.3] - 2026-03-04
### Changed
- README updated to reflect automatic deployments.

## [1.4.2] - 2026-03-04
### Added
- GitHub Actions deploy workflow to build and publish `dist/` on push to main.

## [1.4.1] - 2026-03-04
### Added
- Deploy script for publishing `dist/` to GitHub Pages (gh-pages branch).

## [1.4.0] - 2026-03-04
### Added
- Build step that outputs static files to `dist/`.
- Cache-busting in build output.

### Changed
- Service worker cache name now versioned via build.
- README updated to reflect current features.

## [1.3.8] - 2026-03-04
### Fixed
- Check button translation ensured for all languages.

## [1.3.7] - 2026-03-04
### Changed
- Forced header controls onto a new row on narrow screens.

## [1.3.6] - 2026-03-04
### Changed
- Adjusted Check button spacing and width to match the answer box.

## [1.3.5] - 2026-03-04
### Changed
- Regenerated favicon and Apple touch icon to match the app logo.

## [1.3.4] - 2026-03-04
### Added
- Favicon and Apple touch icon.

## [1.3.3] - 2026-03-04
### Fixed
- Clean browser tab title and added social meta tags.

## [1.3.2] - 2026-03-04
### Changed
- Mobile header now stacks controls below the title on narrow screens.

## [1.3.1] - 2026-03-04
### Added
- Large on-screen "Check" button and `enterkeyhint` for mobile keyboards.

## [1.3.0] - 2026-03-04
### Added
- Offline support with a service worker and manifest.
- Audio fallback when AudioContext is unavailable.

### Changed
- Switched to local system font stacks to remove network dependency.

## [1.2.6] - 2026-03-04
### Changed
- Progress bar no longer shows ✓/✕; uses screen-reader labels only.
- Round-break overlay now uses translations.

## [1.2.5] - 2026-03-04
### Added
- Accessibility improvements: focus styles, ARIA labels, and non-color progress indicators.

## [1.2.4] - 2026-03-04
### Fixed
- Cleaned up logic modules and tests after prior merge artifacts.

## [1.2.3] - 2026-03-04
### Fixed
- Fixed invalid logic module syntax that broke tests.

## [1.2.2] - 2026-03-04
### Fixed
- Multiplication/division now respect the max number (result <= max).

## [1.2.1] - 2026-03-03
### Fixed
- Restored button functionality when opening `index.html` directly (no module/CORS issues).
- Clarified npm commands must run from the app folder.

## [1.2.0] - 2026-03-03
### Added
- Multiplication and division practice (operands limited to 1–10).
- Basic tests for problem generation and queue behavior.
- Lint script (syntax checks).

### Changed
- Shared problem generation logic moved to `logic.js`.

## [1.1.5] - 2026-03-03
### Fixed
- Daily progress now restores correctly even if only the completion date is stored.

## [1.1.4] - 2026-03-03
### Fixed
- Daily progress now initializes correctly even if the progress date is missing.

## [1.1.3] - 2026-03-03
### Fixed
- Daily progress now persists across reloads for the same day.
- Answer input regains focus after header/menu interactions.

## [1.1.2] - 2026-03-03
### Changed
- Daily goal now counts progress across multiple sessions in a day.

## [1.1.1] - 2026-03-03
### Changed
- Replaced the max-number slider with button presets for better mobile use.

## [1.1.0] - 2026-03-03
### Added
- Mute toggle with persistence.
- Tap-to-continue option for round break overlay.
- Mistake review screen before summary.
- Difficulty presets for max number.
- Daily goal and streak indicator.

### Changed
- Updated translations and UI layout.

## [1.0.0] - 2026-03-03
### Added
- Initial Math Sprint app with session flow, retries, and summary.
- Multi-language UI with flag selector and persistence.
- Audio + animation feedback.

### Changed
- Removed zero operands from addition and subtraction.
