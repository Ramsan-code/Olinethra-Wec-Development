# Security

Helmet, environment-based CORS allowlisting, JSON size limits, HTTP-only cookies, bcrypt, JWT verification, Zod validation, file type/size validation, and separate general/auth/form/chat rate limits are enabled. Public CMS output excludes applications, inquiries, notifications, activity logs, unpublished content and team email addresses.

Keep MongoDB, JWT, Cloudinary, AI and email credentials server-only. Rotate credentials after suspected exposure. Run the API behind TLS, set `NODE_ENV=production`, use distinct access/refresh secrets, restrict database network access, and configure only trusted `CLIENT_URL` origins. Logs intentionally omit bodies, cookies, authorization headers and connection strings.

