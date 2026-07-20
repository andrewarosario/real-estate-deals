# ADR-0004: Create Deals sequentially

- Status: Accepted
- Date: 2026-07-20

## Context

TermSheet must let a user add one or more Deals. A batch editor could create several Deals in one submission, but it would introduce row management, cross-row validation, and partial-save behavior that are disproportionate for this simple application.

## Decision

The Deal Creation Flow will create one Deal per form submission.

- **Save and view deals** saves the current Deal and returns to the Deal List.
- **Save and add another** saves the current Deal and opens a clean creation form.
- Invalid submissions preserve the entered values and show field-level guidance.
- Cap Rate is recalculated live as Purchase Price or NOI changes.
- The application will not provide a multi-row batch form.

## Consequences

- Each save is atomic and has a clear validation result.
- Users can enter several Deals without repeatedly navigating from the Deal List.
- The implementation avoids partial batch failures and complex row controls.
- Bulk import and spreadsheet-style entry remain outside this version's scope.
