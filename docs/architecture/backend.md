# Backend architecture

The backend is an ESM TypeScript application in `olinethra-api`. `src/server.ts` connects MongoDB, starts scheduled jobs, listens on `PORT`, and handles SIGINT/SIGTERM. `src/app.ts` configures middleware and mounts `apiRouter` under `/api/v1`.

## Layers

- Routes: one explicit inventory in `src/routes/index.ts`.
- Controllers: transport parsing, Zod validation on selected public/auth operations, and response composition.
- Middleware: JWT authentication, permission checks, rate limits, upload filtering and centralized errors.
- Services: CMS actions, Insights workflow, auth, chat, WhatsApp, Cloudinary/email, quotes, activity and lead scoring.
- Models: Mongoose schemas described in [models](../database/models.md).

## API conventions

JSON endpoints normally use either `{ "success": true, "data": ... }` or legacy shapes such as `{ "success": true, "inquiry": ... }`, `{ "success": true, "conversation": ... }`, or raw CMS exports. Errors use `{ "success": false, "error": { "code", "message", "details?" } }`. This inconsistency is documented as a gap.

Pagination is used by Insights and quotes. `parsePagination` defaults to page 1 and limit 10 and caps the limit at 100; quote listing defaults to page 1 and limit 20. Insights search constructs a regular expression from user input; quotes use MongoDB text search.

## Validation

Zod strictly validates login, Google login, inquiry, application and chat bodies. Other controllers apply selected manual checks, Mongoose validation, or allowlisted CMS fields. The generic validation middleware exists but is not attached in the router. WhatsApp lead updates, user status/role bodies, Insight bodies and quote metadata do not have equivalent strict request schemas.

## Scheduled work and logging

An hourly in-process timer closes open Job/Internship records whose string deadline is before today. CMS reads also run this expiry operation. Morgan logs HTTP requests. `ActivityLog` records selected auth, CMS, inquiry/application, quote, WhatsApp and ML actions. There is no log transport, retention policy, correlation ID or admin-only audit endpoint; the latest 100 activity records are included in the broad admin CMS export.
