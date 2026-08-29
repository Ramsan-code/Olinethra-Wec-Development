# Security controls and review

| Control | Status | Location/notes |
| --- | --- | --- |
| Google OAuth state, nonce, PKCE | Implemented | Next.js flow cookie and callback checks |
| Google ID token/audience/email verification | Implemented | `auth.service.ts` |
| JWT access + refresh rotation | Implemented | hashed current refresh JTI; no reuse-family detection |
| HTTP-only/SameSite/Secure cookies | Implemented | Secure only in production |
| RBAC | Partial | strong on users/Insights/CMS mutations; broad auth-only access elsewhere |
| CORS allowlist | Implemented | comma-separated exact `CLIENT_URL`, credentials enabled |
| Security headers | Implemented | Helmet defaults |
| Rate limiting | Implemented | global and category limits; default IP keying |
| Input validation | Partial | strong Zod on core public/auth inputs; manual/ODM-only on several admin paths |
| NoSQL injection protection | Not found | no sanitizer; CMS field allowlists reduce one surface |
| XSS sanitization/CSP | Partial/not found | React escaping and Helmet; no stored HTML/Markdown sanitizer or explicit CSP found |
| Upload controls | Implemented/partial | memory upload, 10 MiB, MIME allowlist; quote requires PDF; no magic-byte scan |
| Webhook challenge | Implemented | verify token comparison |
| Webhook signature | Partial | helper exists, live handler never calls it; raw request body not retained |
| Audit logging | Partial | Mongo activity records; incomplete event coverage/retention/access separation |
| Secret validation | Implemented/partial | backend Zod schema; several integrations optional and webhook verify token has unsafe default |

## Rate limits

All use express-rate-limit standard headers and default client-IP keying behind one trusted proxy. Defaults: global 100, auth 10, chat 30, and forms 20 per `RATE_LIMIT_WINDOW_MS` (default 900,000 ms). AI generation is fixed at 30 per 15 minutes. Category limiters are additive to the global limiter. Values can be changed for global/auth/chat; form/AI limits are hard-coded.

## Highest-priority findings

- **P1:** WhatsApp POST events are accepted without invoking `verifyWhatsAppSignature`; configure-and-forget is not sufficient because the helper is unreachable.
- **P1:** Any authenticated role can retrieve the full CMS export, including applicant/inquiry PII and recent activity, and can operate WhatsApp and ML endpoints. Confirm whether this is intended.
- **P1:** ML retraining exports phone, email, company and notes into a local JSON file despite UI claims that raw PII is never ingested; the Python feature extractor may omit direct identifiers, but the exported training artifact still contains them.
- **P2:** Admin page gating is client-side. Express protects data, but unauthorized users can render the page shell before redirect.
- **P2:** Webhook verify token has a committed non-secret default. Production should require an explicit strong value.
- **P2:** Regex search uses unescaped user input in Insights and WhatsApp queries, enabling expensive patterns; rate limits reduce but do not remove the risk.
- **P2:** Several admin mutation bodies lack strict validation and the lead patch can set arbitrary values until Mongoose validation behavior intervenes.
- **P3:** No CSP, CSRF token mechanism, centralized redaction, audit retention policy, or automated dependency/security scan script was found.

Do not expose MongoDB credentials, JWT secrets, OAuth client secret, Gemini/WhatsApp/Cloudinary/Resend keys, session cookies or applicant data in documentation or client bundles.
