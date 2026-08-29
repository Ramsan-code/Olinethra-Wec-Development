# Olinethra — Full-Stack Web Platform

An engineering-first web studio platform built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

See the [complete technical documentation](docs/README.md) for architecture, API inventory, models, security, operations, reports and audited implementation gaps.

## Environment Setup

Copy `.env.example` to `.env.local` and configure the required environment variables before starting the application:

```bash
cp .env.example .env.local
```

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Express API and admin portal

The production API lives in [`olinethra-api`](./olinethra-api). Configure and run it first, set `API_URL` in `.env.local`, then access the admin portal at `/admin/login`. There are no built-in credentials; create the initial bcrypt-hashed administrator using the backend's environment-driven seed command.

## Production Deployment on Vercel

Configure `NEXT_PUBLIC_APP_URL`, `API_URL`, and `NEXT_PUBLIC_API_URL` in the frontend host. Configure database, JWT, Cloudinary, AI, and email secrets only on the backend host using [`olinethra-api/.env.example`](./olinethra-api/.env.example).
