# WhatsApp Security, Privacy & Compliance

## 1. Secret Management

- Access tokens (`WHATSAPP_ACCESS_TOKEN`), App Secrets, and Webhook verification tokens reside strictly on the server side (`olinethra-api/.env`).
- Never prefix WhatsApp secret keys with `NEXT_PUBLIC_`.
- Public website code only receives `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER` for generating prefilled WhatsApp chat URLs.

---

## 2. Access Control & Authorization

- All admin WhatsApp management endpoints (`/api/v1/admin/whatsapp/...`) require JWT authentication (`requireAuth`).
- Webhook endpoint validates Meta HMAC-SHA256 signature when `WHATSAPP_APP_SECRET` is configured.

---

## 3. Privacy & Data Retention

- Stores only essential lead attributes, conversation text, and contact identifiers required for client servicing.
- Does not expose conversations publicly.
- Respects opt-out requests and explicit user intent.
