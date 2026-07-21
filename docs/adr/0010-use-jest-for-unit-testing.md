# ADR-0010: Use Jest for Angular unit testing

- Status: Accepted
- Date: 2026-07-21

## Context

TermSheet needs a fast, reliable unit-test workflow for its Angular 17 components, directives, pipes, guards, services, and domain utilities. The test suite must run consistently in local development and CI while enforcing the repository's coverage targets. Jasmine with Karma was considered, but its browser-runner setup adds startup and configuration overhead that is unnecessary for this application. Vitest was also considered, but Jest has a mature Angular integration through `jest-preset-angular` and meets the project's current needs without adopting additional build tooling.

## Decision

- Jest will be the unit-test runner and assertion framework.
- `jest-preset-angular` will provide Angular and TypeScript test integration.
- Tests will run in a JSDOM environment and use Angular's `TestBed` where framework integration is required.
- The repository will provide commands for one-time, watch, coverage, and CI test runs.
- CI coverage thresholds will remain at 100% for statements, functions, and lines, and at least 90% for branches.
- Jasmine and Karma dependencies, configuration, and test APIs will not be introduced.

## Consequences

- Developers use one fast, headless test workflow locally and in CI.
- Tests can use Jest mocks, spies, matchers, and snapshot capabilities consistently.
- Browser behavior supplied by JSDOM is an approximation; browser-specific interactions may still require end-to-end tests in a real browser.
- Angular and Jest upgrades must be checked for compatibility with `jest-preset-angular`.
- Existing Angular examples written for Jasmine may require small syntax or mocking adaptations before they can be reused.
