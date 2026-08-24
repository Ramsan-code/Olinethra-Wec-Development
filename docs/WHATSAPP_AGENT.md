# WhatsApp AI Agent Specification & Anti-Hallucination Rules

## 1. Intent Recognition System

The agent handles 10 primary intents deterministically and dynamically:
1. `GREETING`: Welcome experience menu.
2. `SERVICES`: Dynamic summary of active services.
3. `PORTFOLIO`: Featured published projects with links.
4. `INTERNSHIP`: Open internship roles and deadlines.
5. `JOB`: Open full-time engineering positions.
6. `PROJECT_INQUIRY`: Lead qualification and project brief generator.
7. `HUMAN_REQUEST`: Triggers human takeover (`aiEnabled: false`).
8. `FAQ`: Direct answer matching against published FAQs.
9. `AI_GENERATED`: Complex queries answered using Gemini AI with live CMS context.
10. `UNKNOWN`: Safe fallback asking to connect with team.

---

## 2. Anti-Hallucination & Knowledge Rules

- The agent reuses the single source of truth via `saveCmsSnapshot()`.
- Does NOT invent employee names, pricing quotes, or fake client testimonials.
- If pricing or exact quote is requested: "Project investment depends on scope and features. I can gather your project details for our engineering team."
- Open positions and internships reflect live CMS status (`Open` / `Closed`).
