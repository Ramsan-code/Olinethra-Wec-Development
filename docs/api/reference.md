# Complete API reference

The canonical Express base path is `/api/v1`. The frontend normally exposes a same-origin subset under `/api`; see [BFF inventory](#nextjs-bff-inventory). Unless stated otherwise, requests and responses are JSON. Authentication accepts the `olinethra_admin_session` HTTP-only cookie or `Authorization: Bearer <ACCESS_TOKEN>`; refresh uses the `olinethra_admin_refresh` cookie.

All routes receive the general limiter. Auth routes also receive the auth limiter, form routes the form limiter, chat the chat limiter, and Gemini generation routes the AI limiter. See [security controls](../security/security-controls.md).

## Master Express inventory (64 operations)

### Health, webhooks and authentication

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/health` | Public | — | API/database status and API version |
| GET | `/webhooks/whatsapp` | Public | — | Meta verification challenge |
| POST | `/webhooks/whatsapp` | Public | — | Acknowledge and asynchronously process webhook |
| POST | `/auth/login` | Public | — | Local email/password login |
| POST | `/auth/google` | Public | — | Verify Google ID token and authorize MongoDB admin |
| POST | `/auth/refresh` | Refresh cookie | — | Rotate access and refresh session |
| POST | `/auth/logout` | Optional | — | Revoke stored refresh ID and clear cookies |
| GET | `/auth/me` | Required | Any | Return JWT user claims |
| POST | `/auth/activate` | Public | — | Activate legacy token invitation with password |
| POST | `/auth/forgot-password` | Public | — | Generate reset token, returning a generic response |
| POST | `/auth/reset-password` | Public | — | Replace password using reset token |

### Users and public content/forms

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/users` | Required | Super Admin | List administrators without selected secret fields |
| POST | `/users/invite` | Required | Super Admin | Authorize a Google administrator (despite legacy route name) |
| PATCH | `/users/:id/status` | Required | Super Admin | Set `ACTIVE` or `DISABLED` |
| PATCH | `/users/:id/role` | Required | Super Admin | Set an admin role |
| GET | `/projects` | Public | — | Published projects |
| GET | `/projects/:slug` | Public | — | Published project by slug or legacy ID |
| GET | `/team` | Public | — | Active team without email |
| GET | `/services` | Public | — | Active services |
| GET | `/faqs` | Public | — | Published FAQs |
| GET | `/internships` | Public | — | Open, unexpired internships |
| GET | `/jobs` | Public | — | Open, unexpired jobs |
| GET | `/settings` | Public | — | Site settings |
| GET | `/cms` | Public | — | Filtered aggregate CMS snapshot |
| POST | `/inquiries` | Public | — | Create project inquiry |
| POST | `/contact` | Public | — | Alias of inquiry creation |
| POST | `/applications` | Public | — | Apply to an open job/internship |
| POST | `/chat` | Public | — | CMS-aware site assistant |

### CMS, WhatsApp, quotes and ML

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/admin/cms` | Required | Any | Full CMS export including applications, inquiries and activity |
| POST | `/admin/cms` | Required | Entity-dependent | Legacy create/update/delete/settings action |
| GET | `/admin/whatsapp/conversations` | Required | Any | Search/filter conversations |
| GET | `/admin/whatsapp/conversations/:id` | Required | Any | Conversation, lead and ordered messages; resets unread count |
| POST | `/admin/whatsapp/conversations/:id/message` | Required | Any | Send admin message and enter handoff |
| POST | `/admin/whatsapp/conversations/:id/takeover` | Required | Any | Pause AI and enter handoff |
| POST | `/admin/whatsapp/conversations/:id/resume-ai` | Required | Any | Enable AI and set status `QUALIFIED` |
| PATCH | `/admin/whatsapp/conversations/:id/lead` | Required | Any | Update selected lead/conversation fields and rescore |
| GET | `/admin/quotes` | Required | Super/Content Admin* | Paginated quotation archive |
| POST | `/admin/quotes` | Required | Super/Content Admin* | Upload one PDF and metadata |
| GET | `/admin/quotes/:id` | Required | Super/Content Admin* | Quote metadata |
| PATCH | `/admin/quotes/:id` | Required | Super/Content Admin* | Update quote metadata |
| DELETE | `/admin/quotes/:id` | Required | Super Admin | Delete record and Cloudinary file |
| GET | `/admin/quotes/:id/view` | Required | Super/Content Admin* | Inline PDF stream |
| GET | `/admin/quotes/:id/download` | Required | Super/Content Admin* | Attachment PDF stream |
| GET | `/admin/ml/status` | Required | Any | Dataset readiness/model metrics |
| POST | `/admin/leads/:id/score` | Required | Any | Score one lead |
| POST | `/admin/leads/batch-score` | Required | Any | Score all unresolved leads |
| POST | `/admin/ml/retrain` | Required | Any | Export data and run Python training |

`*` Quote access is enforced inside `quote.controller.ts`, not by `requireRole`.

### Insights

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/insights` | Public | — | Paginated published Insights |
| GET | `/insights/categories` | Public | — | Categories; seeds defaults when empty |
| GET | `/insights/:slug` | Public | — | Published post and related posts; increments views |
| POST | `/insights/:id/cta-click` | Public | — | Increment CTA counter |
| GET | `/admin/insights` | Required | Super/Content Admin | Paginated all-status list |
| GET | `/admin/insights/categories` | Required | Any | Categories |
| POST | `/admin/insights/categories` | Required | Super/Content Admin | Create category |
| GET | `/admin/insights/:id` | Required | Super/Content Admin | Read post by legacy/ObjectId |
| POST | `/admin/insights` | Required | Super/Content Admin | Create post; defaults to draft |
| PATCH | `/admin/insights/:id` | Required | Super/Content Admin | Update allowlisted-by-code fields |
| POST | `/admin/insights/:id/publish` | Required | Super/Content Admin | Publish and timestamp |
| POST | `/admin/insights/:id/unpublish` | Required | Super/Content Admin | Return to draft |
| POST | `/admin/insights/:id/archive` | Required | Super/Content Admin | Archive |
| DELETE | `/admin/insights/:id` | Required | Super/Content Admin | Delete post and optional cover asset |
| POST | `/admin/insights/generate` | Required | Super/Content Admin | Gemini article draft; no automatic save/publish |
| POST | `/admin/insights/generate-tech-brief` | Required | Super/Content Admin | Gemini brief from supplied source material |
| POST | `/admin/insights/:id/ai-assist` | Required | Super/Content Admin | Rewrite a supplied section |

## Request details

### Authentication bodies

| Endpoint | Body | Success | Notable errors |
| --- | --- | --- | --- |
| `POST /auth/login` | `email` (email), `password` | `{success,user}` plus cookies | 400 validation, 401 credentials, 403 inactive |
| `POST /auth/google` | `idToken`, `nonce` (32–256 chars) | `{success,user}` plus cookies | 401 token/identity/nonce, 403 unauthorized, 503 unconfigured |
| `POST /auth/activate` | `token`, `password` (min 12) | standard data/message | 400 invalid/expired token |
| `POST /auth/forgot-password` | `email` | generic success | 400 validation |
| `POST /auth/reset-password` | `token`, `password` (min 12) | success message | 400 invalid/expired token |

The refresh and logout calls have no body. Cookie expiry is fixed at 15 minutes and 7 days even though token signing durations are configurable.

### Public form/chat bodies

| Endpoint | Required fields | Optional/constraints | Success |
| --- | --- | --- | --- |
| `/inquiries`, `/contact` | `name` ≤120, valid `email`, `message` 1–10,000 | `company` ≤160, `projectType` ≤120, `budget` ≤80; strict object | `{success,inquiry}` |
| `/applications` | `applicantName`, `email`, `opportunityTitle`, `opportunityType`, valid `resumeUrl` | phone ≤40, coverNote ≤5,000; opportunity must match an open/unexpired record | 201 standard response |
| `/chat` | `messages` array (1–20) | each strict `{role:user|assistant, content:1..4000}` | `{response,suggestedAction?}` |

The application API stores a URL; it does not receive/upload resume bytes.

### CMS action body

```json
{ "action": "create|update|delete|updateSettings", "entity": "projects", "data": {} }
```

Entities are `team`, `internships`, `jobs`, `projects`, `services`, `faqs`, `chatbotKnowledge`, `applications`, `inquiries`, and `notifications`. Each entity has an explicit writable-field allowlist in `cms.service.ts`. Content Admin may mutate team/projects/services/faqs/chatbot knowledge/notifications; Hiring Admin may mutate internships/jobs/applications/notifications; Super Admin may mutate all entities and settings. Inquiry mutation is therefore Super Admin only.

### Query parameters

| Endpoint | Parameters |
| --- | --- |
| `/insights` | `page`, `limit` (max 100), `category`, `tag`, `type`, `audience`, `search` |
| `/admin/insights` | `page`, `limit`, `status`, `type`, `category`, `authorship`, `audience`, `search` |
| `/admin/quotes` | `page` default 1, `limit` default 20, `search`, `sort` |
| `/admin/whatsapp/conversations` | `status`, `search` (display name, phone, summary) |
| webhook GET | `hub.mode`, `hub.verify_token`, `hub.challenge` |

### WhatsApp mutations

Message requires non-empty string `text`. Lead patch accepts `status`, `priority`, `notes`, `assignedTo`, `budget`, `timeline`, and `projectType`; it lacks a strict schema/enum check before Mongoose update. Conversation IDs are MongoDB ObjectIds.

### Quote upload

Use `multipart/form-data` with `file` (required PDF, maximum 10 MiB in the upload middleware) and metadata such as `title`, `clientName`, `companyName`, `quotationNumber`, `quotationDate`, `projectName`, `notes`, `linkedInquiryId`, `linkedLeadId`, and `tags`. Although the shared upload filter permits image/video types, the quote controller rejects non-PDF uploads. Listing returns `{items,pagination}` inside `data`.

### Insights writes and AI

Post creation requires `title` and `excerpt`; supported enums are documented in [models](../database/models.md). AI draft accepts `topic` plus type/audience/category/tone/key points/sources/instructions. Tech Brief accepts at least source text, headline, or URL. AI assist requires `text` and an action from `IMPROVE_WRITING`, `FIX_GRAMMAR`, `MAKE_CONCISE`, `EXPAND`, `GENERATE_EXAMPLE`, `SUGGEST_HEADING`, `IMPROVE_SEO`, `CREATE_EXCERPT`.

## Response and error reference

Canonical helper response:

```json
{ "success": true, "data": {}, "message": "optional" }
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid request data", "details": [] } }
```

Observed statuses include 200, 201, 400, 401, 403, 404, 409 (quote conflict paths), 422, 429, 500, 502 and 503. `details` is used for Zod issues. Legacy controllers return alternate success envelopes; clients must follow the endpoint-specific shape.

## Next.js BFF inventory (52 methods)

The BFF mirrors auth (9 methods), CMS (2), Insights (16), users (4), WhatsApp (9), quotes (8), ML/lead scoring (4), public chat/inquiry/Insights (4), and webhook (2). Most map mechanically to the Express operation shown above. Google initiation and callback are unique BFF routes: `GET /api/admin/auth/google` and `GET /api/admin/auth/google/callback`.

Two implemented BFF GET routes have no registered Express target and currently produce 404:

- `/api/admin/whatsapp/leads` → `/api/v1/admin/whatsapp/leads`
- `/api/admin/whatsapp/insights` → `/api/v1/admin/whatsapp/insights`

The controller functions exist but are not imported/registered in `src/routes/index.ts`. No BFF exists for many public Express content endpoints or CTA tracking; this is acceptable when unused, but means they must be called directly or proxied later.
