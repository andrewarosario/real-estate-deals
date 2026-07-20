# ADR-0003: Treat the typical Cap Rate range as guidance

- Status: Accepted
- Date: 2026-07-20

## Context

Cap Rate is calculated as NOI divided by Purchase Price. A typical realistic Cap Rate is 5%–12%, but TermSheet may also be used to evaluate distressed, turnaround, or otherwise atypical Deals.

Rejecting values outside the typical range would prevent users from recording mathematically valid Deals and would confuse market guidance with data validity.

## Decision

- Purchase Price must be greater than $0.
- NOI may be positive, zero, or negative.
- Cap Rate is calculated automatically and cannot be edited directly.
- A Cap Rate from 5% through 12%, inclusive, is labeled typical.
- A Cap Rate below 5% or above 12% is labeled atypical but remains valid and saveable.
- The creation form will show the calculated Cap Rate and any atypical status before saving.
- The Deal List will use accessible text and visual treatment to distinguish typical and atypical rates.

## Consequences

- TermSheet supports a wider range of real-world underwriting scenarios.
- Users receive useful market context without being blocked.
- Negative and zero Cap Rates are valid outcomes when NOI is negative or zero.
- Styling cannot be the only way the application communicates the rate status.
