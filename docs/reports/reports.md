# Reports and analytics

## Implemented inventory

| Report/analytics feature | Status | Data source | Filters | Export |
| --- | --- | --- | --- | --- |
| Admin overview cards | Implemented | full CMS export | None | None |
| Recent inquiry panel | Implemented | Inquiry array, first 5 | None | None |
| Recent activity panel | Implemented | ActivityLog array, first 8 | None | None |
| Insight views/CTA counters | Implemented as stored metrics | InsightPost | post/list filters | None |
| ML readiness/model metrics | Implemented | Lead counts + local artifact JSON | None | None |
| WhatsApp operational counts | Controller exists, route missing | Conversation/Lead/Message counts | None | None |
| WhatsApp topic breakdown | Not a real report | Formula-derived estimates | None | None |

## Dashboard metric definitions

- Active team: TeamMember status `Active`; total is all team records.
- Active internships/open jobs: status `Open`; the CMS export runs expiry automation first.
- Published projects: Project status `Published`.
- Active services: Service status `Active`.
- FAQ/chatbot counts: all records, regardless of FAQ published state.
- Project inquiries: status `New`; total is all Inquiry records.
- ML labeled outcomes: Leads with status `WON` plus `LOST`; readiness also requires at least 100 total, 25 won and 25 lost in the TypeScript service. Python thresholds can be changed by environment variables.
- Insight views: incremented whenever the public detail service successfully reads a post. CTA clicks increment only if a caller uses the public tracking endpoint; the audited frontend did not call it.

The WhatsApp `getInsights` controller computes total conversations, WhatsApp leads, handoffs, AI-active conversations and messages. Its topic breakdown multiplies totals by fixed percentages and is not derived from classified records; it must not be presented as measured analytics. The route is not registered.

## Recommended future reports — not currently implemented

- Lead conversion funnel with time range/source and auditable status history.
- Inquiry source/project-type/budget report.
- Application pipeline and time-in-stage report.
- Insight views/CTA trend with bot filtering.
- WhatsApp response time, handoff rate and intent distribution from stored events.
- CSV/XLSX export with role checks and PII minimization.

No CSV, XLSX or report-PDF generator was found. Quotation PDF download is an archive operation, not analytics export.
