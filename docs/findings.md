# Audit findings and extension points

## Documentation gaps in the pre-audit repository

- Selected backend/WhatsApp documents existed, but no cross-application index or complete Express/BFF/page inventory.
- No OpenAPI/Swagger implementation was found.
- The root environment example combines frontend and backend names, which can encourage placing secrets in the wrong runtime.
- Role boundaries, response differences, ML requirements, local versus CMS ownership and report definitions were not centralized.
- No provider-specific deployment, backup/restore, log retention, incident response or data-retention procedure is recorded.

## Implementation gaps and risks

| Severity | Finding | Evidence/impact |
| --- | --- | --- |
| P1 | WhatsApp signature verification is not invoked | Helper exists, but route accepts parsed JSON without raw-body verification |
| P1 | Broad authenticated access to PII/powerful operations | Full CMS export, WhatsApp and ML use only `requireAuth` |
| P1 | ML export contradicts PII claim | retraining writes phone, email, company and notes to `ml/data/leads.json` |
| P1 | WhatsApp leads/insights dashboard is broken | BFF targets exist; Express registration is missing |
| P2 | Password reset delivery is incomplete | token is generated/stored but not emailed or returned |
| P2 | Media library is incomplete | UI/model/Cloudinary helper exist without registered CRUD routes |
| P2 | Public/CMS content has dual sources | most marketing/careers/project pages use repository data while admin edits MongoDB |
| P2 | Request validation is inconsistent | strict Zod for selected endpoints; loose admin mutation bodies elsewhere |
| P2 | Auth revocation is delayed | access JWT claims are trusted until expiry without active-user lookup |
| P2 | In-process jobs/local ML artifacts constrain deployment | unsuitable for ephemeral execution without redesign |
| P2 | Regex search can be expensive | unescaped patterns reach MongoDB in Insights/WhatsApp search |
| P3 | Response envelopes are inconsistent | helper, CMS, chat, inquiry and WhatsApp shapes differ |
| P3 | Analytics/privacy controls are minimal | GA4 is global; no consent, admin exclusion or custom events |
| P3 | No report exports, OpenAPI, frontend tests or full runbooks | maintenance/QA overhead |

## Recommended extension points

1. Add resource-specific, Zod-validated CMS routes while retaining the legacy action endpoint during migration.
2. Centralize permissions and apply them to API routes and role-aware navigation.
3. Make the API the public content source or document a static publishing/export pipeline.
4. Enforce raw-body webhook signatures, register missing routes and persist status updates/retries.
5. Move ML training to a restricted worker, minimize exports, define retention and unify thresholds.
6. Add OpenAPI only after response/validation contracts are standardized.
7. Add structured redacted logging, correlation IDs, retention and dedicated audit APIs.

These are recommendations, not implemented capabilities.
