# Admin portal

Every admin content screen wraps itself in `AdminLayout`, which calls `/api/admin/auth/me`, renders shared navigation and redirects on 401. The backend remains the authorization boundary. Navigation is identical for all roles.

## Dashboard

The dashboard derives all cards in the browser from the full CMS export. Metrics are active/total team, open/total internships, open/total jobs, published/total projects, active/total services, FAQ count, chatbot knowledge count, and new/total inquiries. It also shows the first five inquiries and first eight activity records. There is no date filter, chart, aggregation endpoint, export or automatic refresh.

## CMS managers

Projects, team, services, internships, jobs, FAQs and chatbot knowledge use the generic `POST /admin/cms` action contract for create/update/delete. Applications update status; status changes to Shortlisted/Accepted/Rejected attempt an email. Inquiries update status/priority. Settings updates global content and location. Field allowlists reduce mass-assignment exposure; model validation runs on updates.

## Insights

Admins can list/filter, write, edit, publish, unpublish, archive and delete articles/Tech Briefs, manage categories, generate Gemini drafts and use section-level AI assistance. Generated text is returned to the editor and is not automatically published. Authorship/provenance fields can record human, AI or mixed creation.

## WhatsApp/CRM

The UI lists/searches conversations, reads messages, sends responses, takes over/resumes AI and edits lead details. Its leads and insights panels call missing Express registrations and therefore cannot load in the audited state. Role restriction beyond authentication is absent.

## Quotation archive

Super and Content Admins can upload, list/search/sort, view/download PDF, and update metadata. Only Super Admin can delete. Deletion removes the Cloudinary object after record lookup. This is document archiving, not quote generation.

## Lead intelligence

The ML control center shows readiness counts/thresholds, model metadata and evaluation metrics. Authenticated users can batch-score and trigger training. It does not offer report export. Readiness UI text hard-codes defaults in places while Python thresholds are configurable, creating possible display/runtime drift.

## Users, notifications, logs and media

Super Admin manages active status and roles with last-Super-Admin safeguards. The creation form authorizes Google accounts immediately. Notifications and ActivityLog appear through CMS data but lack dedicated management/report routes. Media has an admin UI and model/integration helper, but no registered media API, so it is partial.

## Destructive operations

CMS entity delete, Insight delete and quote delete are immediate. There is no soft-delete/recycle bin or confirmation enforced by API. UI confirmation exists for selected flows. Quote deletion is Super Admin only; Insights deletion is allowed to Content Admin.
