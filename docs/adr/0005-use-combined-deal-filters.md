# ADR-0005: Use combined name and price-range filters

- Status: Accepted
- Date: 2026-07-20

## Context

TermSheet must filter by Deal Name and by Purchase Price using greater-than and less-than criteria. The matching data should also be highlighted in the Deal List.

## Decision

The Deal List will expose three optional filter inputs:

- Deal Name, using a trimmed, case-insensitive substring match.
- Minimum Purchase Price, using an inclusive comparison.
- Maximum Purchase Price, using an inclusive comparison.

All active criteria will be combined with AND logic. Minimum and maximum limits may be used independently or together as a range. A minimum greater than the maximum is an invalid filter state and will show inline guidance rather than silently returning misleading results.

Every matching occurrence of the name query will be highlighted while preserving the displayed name's original capitalization. When either price criterion is active, matching Purchase Price cells will receive an accessible visual emphasis. Highlighting will not be conveyed through color alone.

## Consequences

- Users can express both one-sided comparisons and bounded price ranges without changing filter modes.
- The behavior of multiple filters is predictable.
- Name highlighting requires safe text segmentation rather than inserting user-provided HTML.
- Price emphasis applies to qualifying rows because numeric ranges do not normally correspond to a textual substring.
