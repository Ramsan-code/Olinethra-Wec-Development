# Deployment

No Vercel, Docker, container, process-manager or provider manifest was found, so hosting providers are unknown. Deploy the Next.js and Express applications as separate Node 20+ services unless colocating them deliberately.

## Next.js

Install with `npm ci`, build with `npm run build`, and start with `npm start`. Set `API_URL` to the public/private Express `/api/v1` base. Configure the public site URL, OAuth variables and desired browser integrations. Environment changes require a rebuild/redeployment for `NEXT_PUBLIC_*` values.

## Express

Inside `olinethra-api`, install with `npm ci`, compile with `npm run build`, and run `npm start`. Configure `PORT`, MongoDB, JWT secrets, exact comma-separated frontend origins and integration credentials. The host must support a continuously running process for the hourly expiry timer. If ML is enabled, install Python dependencies and preserve/secure `ml/artifacts` and writable `ml/data`; serverless functions are a poor match for retraining.

## Production coordination

- Add exact Next.js origins to `CLIENT_URL`; credentials require non-wildcard CORS.
- Register Google callback as `/api/admin/auth/google/callback` on the real frontend origin and use the identical client ID in both runtimes.
- Make Meta webhook HTTPS-public at `/api/v1/webhooks/whatsapp` or `/api/webhooks/whatsapp`; wire signature validation before launch.
- Allow the API host in MongoDB Atlas network access.
- Restrict browser Maps keys by frontend referrer and API; restrict server/provider keys separately.
- Configure GA4/consent according to applicable privacy requirements.
- Use a secret manager, TLS, backups, monitoring and log retention; none are supplied by this repository.
