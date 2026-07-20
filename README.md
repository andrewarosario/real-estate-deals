# TermSheet

TermSheet is a focused Angular 17 demo for managing a browser-local real estate deal book. It calculates Cap Rate automatically, shows whether a rate is inside the typical 5%–12% band, and keeps the complete workflow behind a labeled demo login.

## Demo login

- Username: `analyst`
- Password: `termsheet`

This is browser-only demonstration authentication. It is not suitable for real users or confidential data.

## Features

- Guarded login and private routes with session persistence.
- Eight realistic seed deals.
- Add, edit, and delete individual deals.
- “Save and add another” sequential entry.
- Browser-local Deal persistence and explicit sample-data reset.
- Case-insensitive Deal Name search with safe matching-text highlights.
- Inclusive minimum and maximum Purchase Price filters with combined AND behavior.
- Automatically calculated Cap Rate and a visual 5%–12% calibration rail.
- Non-blocking atypical-rate guidance, including support for zero and negative NOI.
- Desktop data table and mobile deal cards.
- Accessible form errors, dialog semantics, focus states, live feedback, and reduced-motion support.

## Run locally

Requirements: Node.js 18.13+ or 20.x and npm.

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Verify

```bash
npm run build
npm run test:ci
```

Tests run with Jest through `jest-preset-angular`. Use `npm test` for a single local run,
`npm run test:watch` while developing, or `npm run test:coverage` for a coverage report.

## Architecture

- Standalone Angular components and lazy-loaded feature routes.
- Reactive Forms for login, filters, and Deal maintenance.
- Functional route guards for authenticated and guest-only routes.
- Lightweight RxJS state management with `BehaviorSubject`, derived Observables, and the async pipe.
- A browser-storage adapter keeps `sessionStorage` and `localStorage` out of components.
- Pure domain functions own calculation, classification, and filtering rules.
- Custom pipes render Cap Rate and split highlight matches without inserting user-controlled HTML.
- Custom directives handle intentional focus and matching-price emphasis.

The living glossary is in [`CONTEXT.md`](CONTEXT.md), accepted architectural decisions are in [`docs/adr`](docs/adr), and the visual rationale is in [`docs/design/visual-direction.md`](docs/design/visual-direction.md).

## Local data

- Authentication flag: `sessionStorage`
- Deal book: `localStorage`
- Logout clears only authentication.
- “Reset demo data” replaces local changes with the original seed deals after confirmation.
