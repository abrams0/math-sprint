# Math Sprint

![CI](https://github.com/abrams0/math-sprint/actions/workflows/ci.yml/badge.svg)


A lightweight, browser-based practice app for mental math and German word classes.

## Version 2

Version 2 runs alongside the original app at `/v2/`. The original root URL remains available and both home screens contain a direct version switch.

V2 is designed around confidence-first practice:
- Smart sprints prioritize division and multiplication weaknesses while beginning with approachable 2, 3, 5, and 10 fact families.
- Division mistakes receive an inverse multiplication clue and an immediate retry.
- Personal-best competition rewards first-try accuracy and successful corrections more than raw speed.
- Per-fact mastery and due dates adapt future problem selection without changing V1 data.
- Weekly progress, skill mastery, first-try accuracy, correction count, median pace, and recent sessions are stored locally and shown in Insights.
- Progress can be exported as a private JSON report.
- The complete V2 interface is available in English, Lithuanian, German, and Russian.

## German Grammar (2.2.0)

Open **Deutsch · Wortarten** from either math home screen, or visit `/grammar/`.
- Choose 10, 20 or 30 words. Answer with **1 = Nomen**, **2 = Verb**, **3 = Adjektiv**; no Enter or mouse needed. The same buttons work on touchscreens.
- Each session balances all three classes and uses distinct words. Feedback explains mistakes and gives a German example sentence. Missed words return after the round until answered correctly.
- A review screen advances automatically after 4.5 seconds, or immediately with Continue. Feedback lasts 1.4 seconds for correct answers and 3.2 seconds for mistakes.
- The setup page shows the latest 20 completed grammar lessons in a soft-wave graph: thin stems, outlined dots, a smooth green line and a light gradient, oldest on the left and newest on the right. The fixed scale is 0%, 50%, 100%; a collapsible results table provides dates and exact percentages.
- History stores first-try correct answers / original session size, not eventual accuracy after retries. Only completed lessons count, saved immediately at the final answer. Abandoned lessons are excluded.
- Results persist in `localStorage` under `mathSprintGrammar:history:v1`, independently of math data. Only the latest 20 are retained. They stay on this browser/device and do not sync; clearing site data removes them. Previously completed lessons cannot be recovered because earlier versions did not save them.
- If browser storage is blocked or full, practice still works and a warning explains that results may not survive closing/reloading. The chart works without third-party chart libraries or additional network requests.
- The summary shows first-try accuracy, total elapsed time (including feedback/review pauses until the final answer), and the number of corrected words.
- Instructions are available in EN/LT/DE/RU; vocabulary, examples and category names remain German. German capitalization is intentionally preserved as a learning clue.
- Classifications load from the [Wikidata Query Service](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service) ([lexical categories](https://www.wikidata.org/wiki/Wikidata:Lexicographical_data/Documentation/Lexical_categories), [CC0 data](https://www.wikidata.org/wiki/Wikidata:Data_access)). No API key or backend is needed.
- `grammar/logic.js` contains a 360-word allowlist mixing familiar and more challenging third-grade vocabulary and locally written example sentences, **not** a classified fallback deck. The API supplies categories; duplicate lexemes are merged and ambiguous, invalid, unsupported or missing classifications are excluded. At least ten words of each class are required.
- The candidate list includes animals, everyday objects, actions, descriptive words and third-grade vocabulary such as Freundschaft, Verantwortung, beobachten, vergleichen and zuverlässig. Each has a German example sentence. The displayed count reflects the usable words returned by the dictionary, not a fixed limit or session length.
- Dictionary queries are split into six sequential batches of 60 candidates to avoid oversized URLs and request bursts. A failed batch rejects the whole load; no partial deck is presented.
- Online loading is required on every page load. HTTP errors, timeouts or insufficient data show a Retry button, not guessed answers or an offline fallback. The loaded words are kept in memory for replay; no dictionary data is persisted. Completed-session scores are stored locally as described below.
- Only the vocabulary query is sent to Wikidata. Answers and learner information are not sent; the dictionary service receives normal network metadata such as IP address. Math statistics are unchanged.
- Translations live separately in `grammar/i18n.js`. The grammar section has no service worker; existing math offline support is unchanged.

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
1. Serve the app folder locally with `python3 -m http.server 8000` and open `http://localhost:8000/`. V2 and grammar use ES modules and need HTTP rather than a `file://` URL.
2. Choose max number (buttons), operations, and problems per session.
3. Answer using the keyboard or the on-screen Check button.

## Versioning
This project uses semantic versioning: `MAJOR.MINOR.PATCH`. Package/grammar release: **2.2.0**; V2: **2.1.0**; original math app: **1.9.0**. Each app has its own `APP_VERSION` for cache-busting.

## Development
Run commands from the app folder (where `package.json` lives).
- Run tests: `npm test` (math, grammar API validation, balanced word selection, retry queues, translation parity, history persistence/validation/chart geometry and build artifacts; API tests use fixtures, not live requests)
- Run lint: `npm run lint`
- Build both math versions and grammar: `npm run build`


## Accessibility
- Keyboard focus styles enabled for all controls.
- ARIA labels and live regions for problem and feedback.
- Progress bar uses accessible labels in addition to color.


## Performance & Reliability
- Fonts use local system stacks (no network dependency).
- Math practice supports offline use via service workers; grammar loads its word classes online with a 15-second timeout and manual retry.
- Audio gracefully disables if AudioContext is unavailable.


## Deployment
- Build: `npm run build` (outputs to `dist/`)
- GitHub Pages auto-deploys on every push to `main`.
- Manual deploy (optional): `scripts/deploy-pages.sh`
