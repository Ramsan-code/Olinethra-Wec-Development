# Olinethra API

Production Express/TypeScript/Mongoose API for the existing Olinethra Next.js 16 and React 19 site and Admin Dashboard.

## Local setup

1. Use Node 20+, copy `.env.example` to `.env`, and provide MongoDB/JWT values.
2. Run `npm install`, optionally `npm run seed`, then `npm run dev`.
3. In the frontend, configure `API_URL=http://localhost:4000/api/v1` and run `npm run dev`.

Commands: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

The API includes versioned public CMS reads, secure admin sessions, MongoDB persistence, legacy dashboard compatibility, validation, rate limits, security headers, Cloudinary helpers, grounded chatbot responses, non-blocking email, notifications, activity logs, expiry automation, health checks and graceful shutdown.

Detailed references: [architecture](docs/ARCHITECTURE.md), [API](docs/API.md), [database](docs/DATABASE.md), [authentication](docs/AUTHENTICATION.md), [security](docs/SECURITY.md), and [deployment](docs/DEPLOYMENT.md).
