# External integrations

| Integration | Purpose | Runtime | Variables | Status |
| --- | --- | --- | --- | --- |
| Google OAuth/OIDC | Admin identity | Next.js + Express | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Configuration required |
| Gemini 2.0 Flash | Chat, Insights, WhatsApp agent | Express | `GEMINI_API_KEY` | Configuration required; deterministic fallbacks vary by feature |
| Meta WhatsApp Cloud API | Inbound/outbound messaging | Express/BFF | `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_PHONE_NUMBER` | Partial/configuration required |
| Cloudinary | Quote PDF/media helper | Express | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Quote flow implemented; generic media API absent |
| Resend | Plain-text transactional email | Express | `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL` | Configuration required |
| Google Maps JS API | Company map/location picker | Browser | `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`, `NEXT_PUBLIC_GOOGLE_MAP_ID`; `GOOGLE_MAPS_SERVER_KEY` is only referenced in examples | Browser implementation; server geocoding not found |
| GA4 | Global page measurement | Browser | `NEXT_PUBLIC_ANALYTICS_ID` | Enabled only for valid `G-*`; no consent layer/custom events |
| MongoDB | Operational persistence | Express | `MONGODB_URI` | Required |
| Python/scikit-learn | Lead scoring/training | Express child process | `ML_MIN_TRAINING_SAMPLES`, `ML_MIN_POSITIVE_SAMPLES`, `ML_MIN_NEGATIVE_SAMPLES`, `ML_SCORE_LOW_THRESHOLD`, `ML_SCORE_HIGH_THRESHOLD` | Local configuration/artifacts required |

`OPENAI_API_KEY` exists in backend environment validation/example but no OpenAI integration call was found.

## Gemini controls

All Gemini calls use `gemini-2.0-flash:generateContent`. Insights prompts require JSON, outputs are parsed and key fields checked; errors become 502/500 and publishing remains separate. Website chat sends a filtered live CMS snapshot and falls back to a fixed response. WhatsApp uses a qualification agent and can be disabled per conversation. The code does not apply content moderation, output schema APIs, token budgets or explicit provider timeouts on Gemini calls.

## WhatsApp lifecycle

Webhook verification compares mode/token/challenge. Incoming external IDs are unique/sparse for deduplication. Unsupported/media messages are stored as a descriptive placeholder. If AI is enabled the agent updates conversation/lead state, sends a Graph API text response and stores delivery intent. Admin reply disables AI and sets both conversation/lead handoff status. Status webhook events are logged but do not update Message status.

Production must expose HTTPS `GET` and `POST /api/v1/webhooks/whatsapp` (or the Next BFF equivalent), configure the exact verify token and app secret, and repair live signature enforcement before relying on origin authenticity.

## Cloudinary/media

The quote service uploads PDF bytes to an Olinethra folder and stores URL/public ID. View/download streams the remote PDF through the API/BFF with private no-store headers. Deletion attempts Cloudinary cleanup. Generic upload supports image/video/raw, but no routes use it for the Media model or Insight covers in the audited router.

## Email

Emails are plain text. Implemented use cases are inquiry confirmation, application confirmation and selected application-status updates. When the key is absent, development logs metadata and returns a synthetic success; outside development it also returns success without delivery. Forgot-password/reset delivery is not connected to email.

## Maps and analytics

Map coordinates/settings are database-capable, while public pages may use repository data depending on composition. Restrict browser keys by HTTP referrer and API; never use server keys in `NEXT_PUBLIC_*`. GA4 loads globally after interaction whenever the ID matches `G-[A-Z0-9]+`. Admin traffic is not excluded, no custom event calls were found, and consent/privacy gating is not implemented.
