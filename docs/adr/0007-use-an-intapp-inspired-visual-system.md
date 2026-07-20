# ADR-0007: Use an Intapp-inspired visual system

- Status: Accepted
- Date: 2026-07-20
- Reference: https://www.intapp.com/about/brand/

## Context

TermSheet should use the company colors, with Intapp Properties supplied as the visual reference. Intapp's official brand guidance defines a core palette and unified typeface.

## Decision

- Use Intapp Blue (`#207CEC`) as the primary interactive color.
- Use Bright Green (`#22ECCF`) sparingly for positive emphasis and selected accents.
- Use Dark Blue (`#003C80`) and Black (`#021123`) for high-contrast structure and typography.
- Use Manrope as the preferred display, body, and interface typeface, with Open Sans, Arial, and sans-serif fallbacks.
- Build a restrained, data-focused application interface rather than reproducing the Intapp marketing page.
- Present the product identity as TermSheet; do not use an official Intapp logo asset unless one is explicitly supplied for that purpose.

## Consequences

- The demo will feel recognizably related to Intapp while remaining an original product interface.
- Semantic success, warning, error, and highlight colors may extend the core palette where accessibility requires it.
- Every foreground/background combination must meet accessible contrast requirements; brand colors will not be used mechanically where they fail.
