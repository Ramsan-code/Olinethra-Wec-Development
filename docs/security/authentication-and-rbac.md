# Authentication and RBAC

## Authentication

Olinethra supports two real paths:

1. Local password authentication remains implemented. Password hashes use bcrypt cost 12.
2. Google OpenID Connect is implemented through a Next.js authorization-code + PKCE flow. Google proves identity; it does not grant application access. Express accepts only an active MongoDB `User` with a valid Olinethra role and binds the verified Google subject.

Access JWTs contain `sub`, name, email and role. Refresh JWTs contain `sub` and a random `jti`; only the SHA-256 hash of the current JTI is stored. Successful refresh replaces it, providing single-session rotation. Cookies are HTTP-only, `SameSite=Lax`, `Secure` in production, and path `/`. Logout removes the stored hash when possible and always clears both cookies.

Important limitation: `requireAuth` trusts the signed access-token claims until expiry and does not re-query user active status/role on each request. Disabling or changing a user does not invalidate an already-issued 15-minute access token, and issuing a new login overwrites the stored refresh JTI for the prior session.

The invitation naming is stale: `POST /users/invite` creates an active Google-authorized admin without generating/sending an invitation token. Token activation code still exists for legacy records. Forgot-password generates a reset token but does not email or return it, so the end-to-end reset delivery flow is incomplete.

## Role permission matrix

| Capability | Super Admin | Content Admin | Hiring Admin |
| --- | :---: | :---: | :---: |
| Admin users | Yes | No | No |
| Projects/team/services/FAQs/chatbot | Yes | Yes | No |
| Insights CRUD/publish/AI | Yes | Yes | No |
| Jobs/internships/applications | Yes | No | Yes |
| Settings | Yes | No | No |
| Inquiries | Yes | No | No |
| Quotes read/write | Yes | Yes | No |
| Quote delete | Yes | No | No |
| Full CMS export/dashboard | Yes | Yes | Yes |
| WhatsApp operations | Yes | Yes | Yes |
| ML status/scoring/retraining | Yes | Yes | Yes |
| Media API | Not found | Not found | Not found |

The first seven rows are enforced through `requireRole`, `handleLegacyCmsAction`, or quote controller checks. The broad authenticated rows are actual current behavior and should not be mistaken for least-privilege design.

## Relevant source

`app/api/admin/auth/google/**`, `lib/google-oauth.ts`, `olinethra-api/src/services/auth.service.ts`, `olinethra-api/src/middleware/auth.middleware.ts`, `role.middleware.ts`, and `cms.service.ts`.
