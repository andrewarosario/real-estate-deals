# ADR-0011: Use ESLint for static analysis

- Status: Accepted
- Date: 2026-07-21

## Context

Angular and TypeScript compiler checks catch type and template compilation errors, but they do not enforce all of the code-quality, Angular convention, and template accessibility practices needed for consistent maintenance. TermSheet needs a static-analysis command that runs the same checks during local development and CI. Using ESLint for TypeScript alone was considered, but it would leave Angular component metadata, inline templates, and external HTML templates unchecked.

## Decision

- ESLint will provide static analysis for TypeScript and Angular HTML templates.
- Angular ESLint 17 and ESLint 8 will match the application's Angular 17 toolchain.
- The recommended TypeScript, Angular, template, and template-accessibility rule sets will be enabled.
- Explicit `any` types will be rejected to preserve meaningful TypeScript type checking.
- Angular component and directive selectors will use the existing `app` prefix and their standard kebab-case and camelCase styles.
- `ng lint`, exposed as `npm run lint`, will be the canonical lint command.
- ESLint will focus on correctness and maintainability; code formatting is outside this decision.

## Consequences

- TypeScript and templates receive consistent, framework-aware feedback before runtime.
- Common Angular mistakes and template accessibility issues can fail the lint command.
- The project gains ESLint, TypeScript ESLint, and Angular ESLint development dependencies and configuration that must be maintained.
- Angular ESLint's major version must remain aligned with Angular; the configuration format and ESLint major should be revisited when the application upgrades from Angular 17.
- Existing code must satisfy the selected rules, and newly enabled rules may require deliberate code changes during future upgrades.
