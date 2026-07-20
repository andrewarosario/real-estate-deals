# ADR-0002: Persist demo Deals in the browser

- Status: Accepted
- Date: 2026-07-20

## Context

TermSheet needs pre-filled Deals and must allow users to add Deals. The demo should retain useful work across refreshes and browser restarts without introducing a backend or remote mock API.

## Decision

The Angular application will use a browser-local Deal Store.

- When no saved Deal Store exists, it will initialize from a realistic sample set.
- Deal changes will persist across page refreshes and browser restarts.
- Logging out will clear authentication state but leave the Deal Store unchanged.
- A clearly labeled Reset Demo Data action will replace saved Deals with the original sample set after user confirmation.
- The UI and project documentation will explain that Deal data remains only in the current browser and is not secure or synchronized.

## Consequences

- The demo remains useful without a backend and survives accidental refreshes.
- Authentication lifecycle and Deal data lifecycle remain independent.
- Data is local to one browser profile and is visible to anyone with access to that browser storage.
- Resetting data is intentionally destructive, so the UI must ask for confirmation.
- A future server-backed implementation will need a storage adapter or equivalent seam so browser persistence can be replaced.
