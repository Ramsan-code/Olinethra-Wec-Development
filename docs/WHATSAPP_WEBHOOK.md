# WhatsApp Webhook Architecture & Integration

This document describes the webhook verification, payload parsing, idempotency, and security for the WhatsApp Cloud API integration.

---

## 1. Endpoints

- `GET /api/v1/webhooks/whatsapp`
- `POST /api/v1/webhooks/whatsapp`

---

## 2. GET Webhook Verification

Meta sends a GET request during webhook registration containing:
- `hub.mode` = `"subscribe"`
- `hub.verify_token` = matching `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `hub.challenge` = challenge string

The endpoint validates `hub.verify_token` and responds with the raw `hub.challenge` string and HTTP `200 OK`.

---

## 3. POST Webhook Processing & Idempotency

When incoming messages arrive:
1. Returns `HTTP 200 OK` immediately (`{ "status": "EVENT_RECEIVED" }`) to satisfy Meta SLA requirements.
2. Evaluates the incoming message ID (`wamid...`) against stored messages in MongoDB (`externalMessageId`).
3. Ignores duplicate retries.
4. Checks if `aiEnabled` is active for the conversation.
5. If `aiEnabled: true`, passes the message to `processWhatsAppMessage` and dispatches outbound response via Meta API.
