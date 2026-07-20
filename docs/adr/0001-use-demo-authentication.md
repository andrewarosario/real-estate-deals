# ADR-0001: Use browser-only demo authentication

- Status: Accepted
- Date: 2026-07-20

## Context

TermSheet requires a username and password before a user can navigate to private Deal pages. This is a simple demonstration application, and implementing an identity service or backend would materially expand its scope.

## Decision

TermSheet will use clearly labeled demo authentication implemented in the Angular application.

- The login page will visibly identify the predefined username `analyst` and password `termsheet`.
- Successful login will store only the authenticated session state in browser session storage.
- An Angular route guard will prevent unauthenticated navigation to private pages.
- Logging out will clear the authenticated session state.
- The UI and project documentation will state that this mechanism is not production security.

## Consequences

- The demo can exercise login, logout, route protection, redirects, and session restoration without a backend.
- Authentication ends with the browser session.
- Credentials and authorization logic are visible to anyone inspecting the browser application.
- This design must be replaced by server-validated authentication before handling real users or data.
