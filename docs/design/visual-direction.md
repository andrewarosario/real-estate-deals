# TermSheet visual direction

## Subject and job

TermSheet is a focused underwriting workspace for real estate professionals. Its primary screen has one job: help an analyst scan a deal book, narrow it quickly, and understand whether each calculated Cap Rate sits inside or outside a typical market band.

## Tokens

### Color

- **Intapp Blue — `#207CEC`:** primary actions, links, active focus, selected controls.
- **Bright Green — `#22ECCF`:** restrained progress accents and the typical Cap Rate band.
- **Dark Blue — `#003C80`:** navigation structure, strong headings, and deep interactive states.
- **Ink — `#021123`:** primary text and the login-page foundation.
- **Paper — `#F4F7FB`:** cool application canvas that keeps dense data calm.
- **Amber — `#B45309`:** atypical Cap Rate warnings, always paired with text or an icon.

### Type

- **Display and interface:** Manrope, matching Intapp's official typography and using deliberate weight changes instead of decorative type.
- **Financial data:** IBM Plex Mono for prices, NOI, percentages, and calibrated scale labels; its fixed-width numerals echo underwriting models and improve column scanning.
- **Fallbacks:** Open Sans, Arial, and sans-serif for interface text; ui-monospace and monospace for financial data.

### Shape and spacing

- Compact 4/8/12/16/24/32/48 spacing rhythm.
- Mostly square data surfaces with restrained 10–14px corner radii on panels and controls.
- Hairline blue-gray dividers; elevation reserved for overlays and the login panel.
- Visible 3px focus treatment with sufficient contrast.

## Layout concept

Desktop is an analyst's deal book: persistent product header, concise page lead, one filter workbench, then a comparison-first table.

```text
┌ TermSheet · Deal book ───────── Local demo ───── Log out ┐
│ Deals                                      + Add deal    │
│ Search name      Minimum price      Maximum price        │
├───────────────────────────────────────────────────────────┤
│ DEAL / ADDRESS │ PURCHASE │ NOI │ CAP RATE + RAIL │ ... │
│ Harbor Exchange│ $…       │ $…  │ 7.4%  ├━●━━┤    │ ... │
└───────────────────────────────────────────────────────────┘
```

Mobile becomes a vertical review queue. Filters are compact, and each card preserves the same semantic order used in the table.

```text
┌ TermSheet ─────────────── Log out ┐
│ Deals                    + Add    │
│ ▾ Filter deals                    │
│ ┌ Harbor Exchange ──────────────┐ │
│ │ 112 Water Street              │ │
│ │ Purchase       NOI            │ │
│ │ $…             $…             │ │
│ │ Cap rate  7.4%  ├━●━━┤ Typical│ │
│ │ Edit                     Delete│ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

## Signature

The **Cap Rate calibration rail** is the memorable, domain-specific element. It places the calculated rate against a marked 5%–12% typical band and pairs position with an explicit Typical/Atypical label. It is useful rather than ornamental and appears consistently in the list and Deal form preview.

## Motion

- One restrained entrance sequence for the login panel and first Deal List render.
- Short state transitions for filter results, rate calibration, and feedback messages.
- No ambient or looping motion.
- All non-essential motion is disabled when reduced motion is requested.

## Self-critique and revision

The first instinct was a row of generic portfolio metric cards. Those would consume the most valuable vertical space without helping the required workflow. The design instead gives prominence to the searchable deal book and spends its single expressive gesture on the Cap Rate calibration rail, a visual that could only belong to this underwriting product.
