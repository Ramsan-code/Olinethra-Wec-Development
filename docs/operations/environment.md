# Environment variables and secret management

Values below are names and classifications only. `.env.example` contains placeholders/defaults; do not copy credentials into documentation.

## Frontend/BFF

| Variable | Required | Exposure | Purpose |
| --- | :---: | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Optional | Public | Site URL and OAuth URI fallback |
| `API_URL` | Recommended | Secret/server | Express base URL for BFF |
| `NEXT_PUBLIC_API_URL` | Optional fallback | Public | Express base fallback; direct browser use possible |
| `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER` | Optional | Public | CTA destination |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | For maps | Public/restricted | Maps JS API key |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | Optional | Public | Map style ID |
| `NEXT_PUBLIC_ANALYTICS_ID` | Optional | Public | GA4 Measurement ID |
| `GOOGLE_CLIENT_ID` | For Google login | Server identifier | OAuth/OIDC client ID; backend must match |
| `GOOGLE_CLIENT_SECRET` | For Google login | Secret | OAuth code exchange |
| `GOOGLE_REDIRECT_URI` | Recommended | Server | Exact callback URI; defaults from app URL |
| `NODE_ENV` | Runtime | Server | production cookie/security behavior |

## Express

| Variable | Required | Exposure | Purpose |
| --- | :---: | --- | --- |
| `PORT` | No (4000) | Server | Listen port |
| `CLIENT_URL` | No (localhost) | Server | Comma-separated exact CORS origins |
| `MONGODB_URI` | Yes | Secret | MongoDB connection |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Yes | Secret | Token signing; minimum 16 chars in validation |
| `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES` | No | Server | Signing TTLs |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For quotes | Mixed/secret | Cloudinary account |
| `GEMINI_API_KEY` | For AI | Secret | Gemini REST API |
| `OPENAI_API_KEY` | No/unused | Secret | Declared but no implementation found |
| `RESEND_API_KEY` | For delivery | Secret | Resend REST API |
| `EMAIL_FROM`, `ADMIN_EMAIL` | No | Server | Sender/admin destination |
| `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | For seeding | Secret | Initial admin script |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `AUTH_RATE_LIMIT_MAX`, `CHAT_RATE_LIMIT_MAX` | No | Server | Configurable limits |
| `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET` | For WhatsApp | Secret | Meta account/API/signature |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Production explicit | Secret | Challenge token |
| `WHATSAPP_PHONE_NUMBER` | No | Server | Business number metadata |
| `GOOGLE_CLIENT_ID` | For Google login | Server identifier | ID-token audience |

## Python ML

`ML_MIN_TRAINING_SAMPLES`, `ML_MIN_POSITIVE_SAMPLES`, `ML_MIN_NEGATIVE_SAMPLES`, `ML_SCORE_LOW_THRESHOLD`, and `ML_SCORE_HIGH_THRESHOLD` are optional numeric overrides used by Python. The TypeScript status endpoint currently hard-codes readiness thresholds and can disagree with Python overrides.

Never place MongoDB/JWT/OAuth secret/Gemini/WhatsApp/Cloudinary/Resend credentials in `NEXT_PUBLIC_*`. Use separate frontend and backend environment stores in production.
