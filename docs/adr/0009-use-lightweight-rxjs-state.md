# ADR-0009: Use lightweight RxJS state behind browser-storage adapters

- Status: Accepted
- Date: 2026-07-20

## Context

TermSheet needs shared authentication state, Deal state, persistent browser data, and derived filtered results. The requirements explicitly ask for state management and BehaviorSubjects, while the application's current size does not justify a separate state-management framework.

## Decision

- Root-provided authentication and Deal stores will own private `BehaviorSubject` instances.
- Components consume read-only Observables and use the async pipe where practical.
- Filtered Deals are derived with RxJS composition rather than copied into a second mutable collection.
- Components send changes through explicit store methods.
- A browser-storage adapter isolates `sessionStorage` and `localStorage` access and handles unavailable storage safely.
- Pure domain functions own Cap Rate calculation, rate classification, and filter predicates.

## Consequences

- State flow remains small, observable, and testable without NgRx boilerplate.
- Browser persistence can later be replaced with a server adapter without rewriting presentation components.
- Store snapshots are available only for synchronous routing and form initialization needs.
- If the domain grows to include concurrent server updates, optimistic mutations, or many collaborating feature stores, this decision should be revisited.
