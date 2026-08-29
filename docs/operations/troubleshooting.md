# Troubleshooting

## API does not start / health shows disconnected

Check `MONGODB_URI`, URL encoding, database user permissions, Atlas IP access and cluster availability. Confirm required JWT secrets pass the 16-character validation. The listener starts only after MongoDB connects.

## Admin gets 401 or a login loop

Check both frontend and API use HTTPS consistently in production, cookie forwarding through the BFF/proxy, cookie domain/path, access expiry and clock skew. A new login may replace the prior session's refresh JTI. `/api/admin/auth/me` should proxy `/auth/me` with the cookie.

## Admin gets 403

Confirm MongoDB status is `ACTIVE`, role matches the [RBAC matrix](../security/authentication-and-rbac.md), and Google email/subject match the authorized User. Some admin navigation is visible even when the role is not permitted.

## Google redirect fails

Check client ID/secret, exact `GOOGLE_REDIRECT_URI`, frontend origin, provider callback registration, PKCE/state cookie survival and matching backend `GOOGLE_CLIENT_ID`. The callback is `/api/admin/auth/google/callback`.

## WhatsApp webhook or dashboard fails

Check public HTTPS reachability, verify token, Meta subscription, phone-number ID/token and Graph API response. The audited admin leads/insights BFF calls fail because Express routes are unregistered. Also repair signature verification; merely setting `WHATSAPP_APP_SECRET` does not activate the unused helper.

## Gemini/chat fails

Set `GEMINI_API_KEY`, verify provider access/model availability and inspect API logs. Website chat should fall back; Insights generation returns configuration/provider/parse errors. Provider requests have no explicit timeout.

## Quote upload/view fails

Confirm all Cloudinary variables, a PDF below 10 MiB, and Super/Content role. The BFF must be able to stream the remote PDF. Cloudinary deletion/view failures should be checked in API logs.

## Map or analytics does not load

For maps, check browser key restrictions, Maps JS API enablement, map ID and location flags/coordinates. For analytics, the ID must match `G-*`; restart/redeploy after env changes. No consent UI or custom event instrumentation is implemented.

## ML training does not activate

Check Python and `ml/requirements.txt`, writable `ml/data`/`ml/artifacts`, 30-second child-process timeout, and at least 100 labeled outcomes including 25 WON and 25 LOST by TypeScript defaults. Python env overrides can diverge from the status UI.
