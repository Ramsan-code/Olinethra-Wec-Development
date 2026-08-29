# Database models

Mongoose uses default pluralized collection names; no explicit collection overrides are present. All schemas except embedded location use timestamps. `legacyId` is the public/admin identifier for many CMS records; WhatsApp records primarily use MongoDB ObjectIds.

## Identity and operations

### User

Stores administrators. Required: unique/indexed `legacyId`, name, unique/lowercase/indexed email, and role (`Super Admin`, `Content Admin`, `Hiring Admin`). Status is `ACTIVE`, `INVITED`, or `DISABLED`; provider is `LOCAL` or `GOOGLE`. Optional sensitive fields are `passwordHash`, invite/reset tokens and expiries, `googleSubjectId`, and `refreshTokenHash`; most are `select:false`. Also stores activity timestamps, last login and creator ID.

### ActivityLog

Required unique/indexed legacy ID, user display string, action and entity; optional resource ID and mixed metadata. `date` and entity are indexed, plus descending creation time. It is an audit/activity aid, not an immutable ledger.

### Notification

Required legacy ID, type (`inquiry`, `application`, `status`, `expiry`), title and message. Stores indexed date/read plus optional admin link. The latest 100 are returned in the admin CMS export. There are no dedicated notification APIs.

## Public CMS

### Project

Required legacy ID, title, description, thumbnail and category. Optional unique sparse slug, media/gallery/video, technologies, client/links, case-study sections and label/value metrics. Status is `Published|Draft`; featured/display order support presentation. Compound indexes support status/order and slug/status.

### TeamMember

Required legacy ID, name, role and photo URL; department/bio/skills/social links/email/order/status/published are optional/defaulted. Status is `Active|Inactive`. Public controllers remove email.

### Service

Required legacy ID, title, short/full descriptions. Icon, features, deliverables and display order are defaulted. Status is `Active|Inactive`.

### FAQ

Required legacy ID, question and answer. Category enum: `General`, `Services`, `Pricing`, `Development`, `Internships`, `Hiring`, `Technology`, `Projects`. Display order defaults to zero; published defaults true.

### SiteSettings

Singleton-like unique `key` (normally `default`) plus required hero/about/contact/footer strings and social URLs. Embedded location holds address components, country, coordinates, place ID/URL, zoom, display flags and note. Service-level validation constrains latitude, longitude and zoom on settings updates.

### ChatbotKnowledge

Required legacy ID, topic, question and answer; category defaults to General and `lastUpdated` is a string. Used before Gemini fallback.

## Careers and CRM

### Internship

Required legacy ID, title and description. Arrays contain responsibilities, requirements and skills. Work type is `Remote|Hybrid|On-site`; status `Open|Closed|Draft`. Duration/location/deadline/vacancies/application link/featured are stored. Status/deadline is indexed and expired open records are closed automatically.

### Job

Required legacy ID, title and description. Employment type is `Full-time|Part-time|Contract`; work type `Remote|Hybrid|On-site`; status `Open|Paused|Closed`. Stores department/location/salary, responsibilities/requirements/skills, deadline, application URL and featured flag.

### Application

Required legacy ID, applicant name/email, opportunity title/type (`Internship|Job`) and resume URL. Phone and cover note are optional/defaulted. Status lifecycle: `New`, `Reviewing`, `Shortlisted`, `Rejected`, `Accepted`. Email, date and status are indexed. Applicant PII and resume URL are sensitive.

### Inquiry

Required legacy ID, name/email/message. Company/project type, budget and date are stored. Priority is `HIGH|MEDIUM|LOW`; lifecycle is `New`, `Contacted`, `Discussion`, `Proposal`, `Won`, `Lost`. Contact details and project message are sensitive.

### Lead

Required unique legacy ID and name. Stores optional phone/email/company, source, project type/summary/features/budget/timeline, assignment and notes. Status is `NEW`, `QUALIFYING`, `QUALIFIED`, `HUMAN_HANDOFF`, `CONTACTED`, `DISCUSSION`, `PROPOSAL`, `WON`, `LOST`; priority is `LOW|MEDIUM|HIGH`. References Conversation. Embedded `ml` stores system status, probability, completeness, band, version/algorithm/confidence, timestamp/notice and signal explanations. Source/status/creation has a compound index. PII, free text and ML decisions are sensitive.

## WhatsApp

### Conversation

Unique/indexed WhatsApp user ID, required phone, display name, Lead-status enum, AI-enabled flag, optional Lead reference, assignee, indexed last-message time, summary and unread count. Phone, identity, summary and linkage are sensitive.

### Message

Required indexed Conversation reference, direction (`INBOUND|OUTBOUND`), sender (`USER|AI|ADMIN`) and text. Optional unique sparse external message ID provides idempotency. Types: `text|image|document|interactive|unsupported`; statuses: `sent|delivered|read|failed|received`. Media and mixed metadata are optional. Compound index orders messages per conversation.

## Insights

### InsightCategory

Required unique legacy ID/name/slug; slug is lowercase. Description, display order and default flag support seeded categories.

### InsightPost

Required legacy ID, title, unique/indexed slug, excerpt, Category reference and creator. Type is `ARTICLE|TECH_BRIEF`; authorship `HUMAN|AI|HUMAN_AI`; audience `CLIENTS|DEVELOPERS|BOTH`; status `DRAFT|REVIEW|PUBLISHED|ARCHIVED`. Stores Markdown content, author profile, AI provenance summary, category name, tags, cover asset, featured, reading time, views, CTA clicks, source analysis, SEO and publish timestamp. Compound indexes cover status/date, category/status and tags/status.

## Media and quotes

### Media

Required legacy ID, URL and filename. Type `image|video|document`; optional Cloudinary public ID, folder, MIME, size/dimensions/duration, alt and creator. Model is implemented but no registered CRUD API persists Media records.

### Quote

Required legacy ID/title, embedded Cloudinary file URL/public ID/original name/format, and uploader. Optional client/company/quotation/date/project/notes/link IDs/tags. Text and recency indexes support archive search. Quote contents and client metadata are sensitive.

## Relationships

Conversation ↔ Lead is bidirectionally linked by ObjectId fields. Message belongs to Conversation. InsightPost references InsightCategory. Quote links to inquiry/lead using string IDs rather than Mongoose refs. Applications identify opportunities by copied title/type, not an ObjectId; deletion/rename does not preserve a formal relationship.
