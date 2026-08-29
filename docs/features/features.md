# Public features

## Studio website and portfolio

The public audience can browse company information, services, technologies, team, pricing, FAQ and project case studies. These screens are mostly repository-backed, so CMS edits do not automatically update every public page. Projects detail reads the local CMS JSON snapshot and only renders `Published` entries. `/portfolio` and `/work/[slug]` are aliases.

## Contact and inquiry

The contact UI submits through the same-origin inquiry BFF. Express strictly validates the body, assigns a simple priority heuristic, persists an Inquiry, creates a notification/activity record and sends a best-effort confirmation through Resend or a development stub. There is no CAPTCHA or dedicated spam classifier; form and global IP limits apply.

## Insights

The list supports page, category, tag, type, audience and search filtering. Details increment views and return up to three related published posts. Metadata uses post SEO fields. If Express is unavailable, the frontend deliberately renders bundled fallback posts; this can mask an outage and means displayed view counts/content may not be database-backed.

## Careers

The careers page presents repository-defined jobs/internships. The API separately exposes MongoDB opportunities and application submission with open/deadline checks, notifications and email. A public resume-upload service or application form was not found; callers must supply a hosted resume URL. This feature is therefore partial end-to-end.

## Website assistant

The global Chatbot uses deterministic intent rules for common service, location and career questions, exact-ish CMS knowledge matching, then Gemini when configured, and finally a contact fallback. Context contains filtered CMS content. Messages are limited to 20 × 4,000 characters. Conversation history is not persisted, but each question creates a summarized ActivityLog entry.

## Playground

Code Breaker, Bug Hunt and Logic Puzzle are isolated client-side games using bundled data/state and do not require Express. No server leaderboard, account, export or verified analytics events were found. Treat scores as local entertainment state.

## WhatsApp CTA and maps

A global floating CTA builds a `wa.me` URL from `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER`. CompanyMap loads Google Maps in the browser only when key and location settings permit; otherwise presentation falls back. AdminLocationPicker supports coordinates/place selection. See [integrations](../integrations/integrations.md).

## Stakeholder summary

Implemented business capabilities include a studio/portfolio presence, inbound project inquiries, an editorial Insights channel, controlled admin content operations, quote archiving, AI-assisted visitor/editor/WhatsApp conversations and lead intelligence. Careers application and media-library experiences are incomplete as public-to-admin workflows, and reporting is limited to operational dashboards.

## Technical feature matrix

| Feature | Public UI | Admin UI | API | Database | External service |
| --- | :---: | :---: | :---: | :---: | --- |
| Portfolio/services/team/FAQ | Yes | Yes | Yes | Yes | — |
| Inquiries | Yes | Yes | Yes | Yes | Resend optional |
| Careers/applications | Partial | Yes | Yes | Yes | Resend optional |
| Insights | Yes | Yes | Yes | Yes | Gemini optional |
| Website chat | Yes | Knowledge UI | Yes | CMS/activity | Gemini optional |
| WhatsApp CRM | CTA | Yes | Partial | Yes | Meta + Gemini |
| Quote archive | No | Yes | Yes | Yes | Cloudinary |
| Media library | No | Partial | Not found | Model only | Cloudinary helper |
| Lead ML | No | Yes | Yes | Lead.ml | local Python |
| Playground | Yes | No | No | No | — |
