# ADR-0008: Adapt the Deal table to mobile cards

- Status: Accepted
- Date: 2026-07-20

## Context

The Deal List contains a name, address, three financial values, rate status, and row actions. Preserving that table unchanged on a narrow screen would require horizontal scrolling and make comparison and actions difficult.

## Decision

- Wide screens will present Deals in a structured data table.
- Narrow screens will present the same Deals as stacked cards.
- Mobile cards will preserve every Deal value, Cap Rate status, Edit action, and Delete action.
- Filters will become a compact mobile panel while retaining identical combined-filter behavior.
- Breakpoint changes will not alter the data, active filters, navigation, or available capabilities.

## Consequences

- Mobile users can read and act on Deals without horizontal scrolling.
- The application needs two presentational structures backed by the same filtered state.
- Accessibility semantics must match each structure: table semantics on wide screens and labeled term/value groups on cards.
