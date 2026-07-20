# TermSheet Domain Context

This document records the shared product language and the business rules that have been confirmed during discovery.

## Product boundary

TermSheet is a web application for real estate professionals to view, create, and filter real estate deals. Deal pages are private and require an authorized user.

## Glossary

### Authorized User

A person who has supplied the demo username and password and may navigate to private pages for the current browser session. This authorization is a product demonstration, not a production security boundary.

### Demo Authentication

The browser-only login mechanism for this version of TermSheet. It accepts the visibly labeled username `analyst` and password `termsheet`, stores only the authenticated session state in session storage, protects private routes with an Angular route guard, and clears the session when the browser session ends or the user logs out.

### Deal

A real estate transaction tracked in TermSheet. A Deal contains a Deal Name, Purchase Price, Address, NOI, and a calculated Cap Rate.

### Deal Name

The human-readable name used to identify and search for a Deal.

### Purchase Price

The dollar price paid for the property. It must be greater than $0. Users can filter Deals whose Purchase Price is greater than or less than a chosen amount.

### Address

The street or property address associated with a Deal.

### NOI

Net Operating Income, expressed in dollars. It may be positive, zero, or negative so TermSheet can represent stabilized, break-even, distressed, and turnaround Deals.

### Cap Rate

The capitalization rate for a Deal, calculated automatically as:

`Cap Rate = NOI / Purchase Price × 100`

A Cap Rate from 5% through 12% is treated as the typical range. Values outside that range remain valid and saveable, but the form and Deal List call them out as atypical. Cap Rate is derived from NOI and Purchase Price and is not directly editable.

### Deal List

The private landing page where an Authorized User sees pre-filled Deals, filters them, and starts creation of one or more new Deals.

On wide screens, Deals appear in a data table. On narrow screens, each Deal becomes a stacked card so values and actions remain readable without horizontal scrolling. Filters adapt into a compact mobile panel without changing their behavior.

### Deal Creation Flow

The private form used to create one Deal at a time. After a valid Deal is saved, the user can either return to the Deal List or open a fresh form to add another Deal. This sequential flow is how TermSheet supports adding multiple Deals; it does not submit a batch of Deals at once.

The same form is reused to edit an existing Deal. Saving an edit recalculates Cap Rate from the current Purchase Price and NOI.

### Deal Maintenance

The actions for correcting or removing a saved Deal. Edit opens the existing Deal in the Deal Creation Flow. Delete permanently removes only the selected Deal from the browser-local Deal Store after the user confirms the action.

### Deal Filter

The combined criteria applied to the Deal List. Deal Name search is a case-insensitive substring match. Optional Minimum Purchase Price and Maximum Purchase Price limits are inclusive. A Deal must satisfy every active criterion to remain visible.

Matching text within a Deal Name is highlighted without changing its original capitalization. When a price limit is active, qualifying Purchase Price cells receive an accessible visual emphasis in addition to normal currency formatting.

### Deal Store

The browser-local collection of Deals used by the demo. It starts with a realistic sample set and persists added Deals across page refreshes, browser restarts, and logout. It is not synchronized to a server or shared across browsers.

### Reset Demo Data

An explicit user action that replaces the current Deal Store with the original pre-filled sample Deals. Logging out does not reset Deal data.

### TermSheet Visual Theme

The application theme is inspired by the official Intapp brand system. It uses Intapp Blue (`#207CEC`) as the primary action color, Bright Green (`#22ECCF`) as a restrained accent, Dark Blue (`#003C80`) and Black (`#021123`) for contrast, and Manrope as the preferred interface typeface. The application retains a distinct TermSheet identity and does not reproduce the corporate marketing site.

## Confirmed technical constraint

- Angular 17.

## Open product decisions

No blocking product decisions remain for the initial demo build.
