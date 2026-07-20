# TermSheet coding instructions

This is a strict Angular 17 application for a browser-local real estate deal book.

## TypeScript and Angular

- Keep strict type checking enabled and do not introduce `any`.
- Use standalone components and lazy-loaded feature routes.
- Prefer Reactive Forms and native Angular control flow (`@if`, `@for`, `@switch`).
- Use `ChangeDetectionStrategy.OnPush` for components.
- Keep shared state inside focused root-provided stores. Expose read-only Observables and use the async pipe in templates.
- Keep domain calculations and predicates pure.
- Keep browser persistence behind `BrowserStorageService`.
- Preserve the demo-only authentication warning; browser guards are not production security.

## Accessibility

- Maintain WCAG AA contrast, visible keyboard focus, semantic form labels, and text equivalents for color-coded states.
- Preserve reduced-motion behavior.
- Never render user-entered text through `innerHTML`.

## Domain rules

- `Cap Rate = NOI / Purchase Price × 100`.
- Purchase Price must be greater than zero.
- NOI may be positive, zero, or negative.
- A 5%–12% Cap Rate is typical; values outside the band remain valid and saveable.
- Deal Name matching is a trimmed, case-insensitive substring search.
- Minimum and maximum Purchase Price filters are inclusive and combine with name using AND logic.
