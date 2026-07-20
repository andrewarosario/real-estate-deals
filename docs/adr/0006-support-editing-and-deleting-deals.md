# ADR-0006: Support editing and deleting Deals

- Status: Accepted
- Date: 2026-07-20

## Context

Although the minimum requirements explicitly call for listing and adding Deals, users need a way to correct an entry or remove one that is no longer wanted. Reset Demo Data is too broad for either task.

## Decision

- Each Deal row will expose Edit and Delete actions.
- Edit will reuse the Deal form with the selected Deal's current values.
- Saving an edit will validate all fields and recalculate Cap Rate.
- Delete will name the affected Deal and require explicit confirmation.
- Delete will remove only that Deal from the browser-local Deal Store.

## Consequences

- TermSheet provides a complete small-scale Deal management workflow.
- Create and Edit share one form model and validation policy.
- Destructive actions remain deliberate and scoped.
- Undo, archive, and Deal history remain outside this version's scope.
