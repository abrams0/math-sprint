# Changelog

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
