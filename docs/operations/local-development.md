# Local development

## Prerequisites

- Node.js 20 or newer and npm (both projects use `package-lock.json`).
- MongoDB reachable locally or through Atlas.
- Python 3 plus `ml/requirements.txt` only when lead model operations are needed.
- Optional Google, Gemini, Meta, Cloudinary, Resend and Maps credentials for their features.

## Setup

```bash
npm install
cd olinethra-api && npm install
```

Create a root `.env.local` from `.env.example` with frontend/BFF values. Create `olinethra-api/.env` from its example with at minimum `MONGODB_URI`, `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. Do not share the same file blindly: the runtimes have different exposure rules.

Start in separate terminals:

```bash
cd olinethra-api && npm run dev
npm run dev
```

Verify `GET http://localhost:4000/api/v1/health`, open `http://localhost:3000`, then use `/admin/login`. Create a first local admin with `npm run admin:create` inside `olinethra-api`, or seed development content with `npm run seed`; inspect scripts before using them against any non-development database.

## MongoDB/Atlas

The API exits if connection fails. For Atlas, create a least-privilege database user, URL-encode password characters, permit the developer/host IP in the Atlas access list and use the correct database name in `MONGODB_URI`. Atlas cannot reveal an existing database password through application code; reset it securely if lost.

## Commands

| Application | Development | Build | Start | Lint/typecheck | Test |
| --- | --- | --- | --- | --- | --- |
| Next.js | `npm run dev` | `npm run build` | `npm start` | `npm run lint` | No test script |
| Express | `npm run dev` | `npm run build` | `npm start` | `npm run lint` or `npm run typecheck` | `npm test` |

The backend test script expects MongoDB on `127.0.0.1:27017/olinethra-test` and supplies test JWT secrets inline. It is not an isolated in-memory database.
