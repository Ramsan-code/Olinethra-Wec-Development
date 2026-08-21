# Authentication

Admins are MongoDB `User` documents with bcrypt hashes and one of the existing dashboard roles: Super Admin, Content Admin, or Hiring Admin. Login issues a 15-minute signed access token and a seven-day refresh token in HTTP-only cookies. The browser talks through the Next.js BFF, so tokens are not stored in local storage or exposed to client code.

Create the first administrator with the optional `SEED_ADMIN_*` variables and `npm run seed`; never commit the real password. Authorization is always enforced in Express. The compatibility CMS route currently requires an authenticated admin; its service can apply entity permissions as the dashboard is split into dedicated REST writes.

