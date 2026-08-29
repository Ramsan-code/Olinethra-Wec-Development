# Testing and quality

The Express project uses Vitest and Supertest. Suites cover helpers, authorization, Google auth decisions, CMS security/field filtering, WhatsApp challenge/signature helpers, API validation and ML lead scoring/readiness. Tests connect to the configured `olinethra-test` MongoDB instance; they are not hermetic. There are no frontend unit/component/E2E tests and no accessibility or visual-regression suite.

Run `npm test`, `npm run typecheck`, and `npm run build` inside `olinethra-api`. Run `npm run lint` and `npm run build` at the repository root. Only claim a result for commands actually executed; a missing MongoDB service is an environment failure, not a passing suite.

## High-value missing coverage

- Full Google callback/BFF cookie forwarding and refresh rotation/reuse behavior.
- Authorization tests for every authenticated-only WhatsApp, quote, ML and full-CMS endpoint.
- Live webhook raw-body signature rejection and event idempotency.
- CMS action validation across every entity/status enum.
- Quote upload/stream/delete and Cloudinary failure paths.
- Frontend role-aware navigation, form flows and admin redirect behavior.
- Insights fallback/outage visibility, SEO and CTA tracking.
- ML export PII policy and TypeScript/Python threshold consistency.
