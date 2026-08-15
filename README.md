# Olinethra — Full-Stack Web Platform

An engineering-first web studio platform built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

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

## Admin Portal & Credentials

Access the internal admin portal at `/admin/login`:
- **Default Email**: `admin@olinethra.com`
- **Default Password**: `admin123`

## Production Deployment on Vercel

Configure environment variables in **Vercel → Project Settings → Environment Variables**:
- `NEXT_PUBLIC_APP_URL`
- `AUTH_SECRET`
- `GEMINI_API_KEY` (Optional for AI Chatbot)
- `RESEND_API_KEY` (Optional for transactional emails)
