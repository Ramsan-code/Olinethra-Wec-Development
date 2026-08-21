# Deployment

Use Node 20+, MongoDB Atlas (or compatible MongoDB), and any persistent Node host such as Render, Railway, Fly.io or a VPS. Build with `npm ci && npm run build`, start with `npm start`, and configure the health probe as `/api/v1/health`. Set all variables from `.env.example`; set `CLIENT_URL` to comma-separated trusted frontend origins.

Deploy the Next.js frontend separately and set its server-only `API_URL` plus browser-visible `NEXT_PUBLIC_API_URL`. The BFF uses `API_URL`. Configure Cloudinary, Gemini and Resend only if those integrations are required; the service degrades safely when optional providers are absent. Run `npm run seed` once for initial CMS/admin data. Multiple API instances may run the idempotent expiry update safely.

