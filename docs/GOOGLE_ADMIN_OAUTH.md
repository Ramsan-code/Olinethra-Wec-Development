# Google Admin OAuth

Olinethra uses Google only to verify identity. MongoDB remains the admin allowlist and role source; a successful Google login never creates an administrator.

## Google Cloud configuration

Create an OAuth 2.0 Client ID with application type **Web application**.

Development configuration:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/admin/auth/google/callback`

For production, add the real HTTPS frontend origin and the same callback path on that origin. Do not invent or use a placeholder production domain. The redirect URI must exactly match `GOOGLE_REDIRECT_URI`.

Configure the OAuth consent screen for the intended Google accounts. The application requests only `openid`, `email`, and `profile`.

## Environment

Frontend/BFF `.env.local`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/auth/google/callback
```

Backend `olinethra-api/.env`:

```env
GOOGLE_CLIENT_ID=
```

The client ID must be identical in both files. `GOOGLE_CLIENT_SECRET` is server-only and must never use a `NEXT_PUBLIC_` prefix.

## Authorizing administrators

Only a Super Admin can add administrators in **Admin → Admin Users**. The approved email must exactly match the verified Google email. No public registration exists.

The first Super Admin can be provisioned server-side without a Google password:

```bash
cd olinethra-api
npm run admin:create -- --email=admin@example.com --name="Olinethra Admin" --role="Super Admin" --provider=google
```

On the first successful login, Olinethra binds Google's stable subject identifier to that existing record. It never silently rebinds a different Google identity.

## Recovery and migration

Legacy password API endpoints are retained temporarily for recovery while Google OAuth is being verified. There is no hidden bypass. Before disabling legacy authentication, verify the production client ID, secret, redirect URI, Super Admin record, first-login binding, JWT cookies, refresh, logout, and protected Admin routes.
