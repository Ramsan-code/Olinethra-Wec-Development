# API reference

Base path: `/api/v1`. JSON errors use `{ "success": false, "error": { "code", "message", "details" } }`.

## Public reads

- `GET /health` — service/database status; no authentication.
- `GET /cms` — filtered aggregate used by the existing public frontend.
- `GET /projects` and `GET /projects/:slug` — published portfolio.
- `GET /team` — active team members.
- `GET /services` — active services.
- `GET /faqs` — published FAQs.
- `GET /internships` and `GET /jobs` — open opportunities after expiry evaluation.
- `GET /settings` — public site settings.

## Public writes

- `POST /inquiries` (alias `/contact`) — `{name,email,company?,projectType?,budget?,message}`. Returns `201`-style persisted inquiry data in the legacy shape. Rate limited.
- `POST /applications` — `{applicantName,email,phone?,opportunityTitle,opportunityType,resumeUrl,coverNote?}`. Returns `201`; personal data is never exposed publicly.
- `POST /chat` — `{messages:[{role:"user"|"assistant",content}]}`. Uses current CMS data, with a safe unavailable-information fallback. Rate limited.

## Authentication

- `POST /auth/login` — `{email,password}`; rate limited; sets HTTP-only access and refresh cookies.
- `GET /auth/me` — requires the access cookie or Bearer access token.
- `POST /auth/refresh` — validates and rotates the HTTP-only refresh/access cookies.
- `POST /auth/logout` — protected; clears cookies.

## Admin CMS compatibility API

`GET /admin/cms` requires authentication and returns all dashboard collections. `POST /admin/cms` requires authentication and accepts the dashboard contract `{action,entity?,data}`. Actions are `create`, `update`, `delete`, and `updateSettings`; supported entities are team, internships, jobs, projects, services, faqs, chatbotKnowledge, applications, inquiries, and notifications. Invalid data/action returns 400, missing objects return 404, and unauthenticated calls return 401.
