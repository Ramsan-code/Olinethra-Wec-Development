# Database

MongoDB is accessed through one reusable Mongoose connection. Collections are users, projects, teammembers, services, faqs, internships, jobs, applications, inquiries, media, notifications, activitylogs, chatbotknowledges, and sitesettings.

`legacyId` preserves the existing frontend `id`. Projects use indexes for slug/publication, category, featured state, and display order. Team, services and FAQs index publication/status and order. Jobs and internships index status/deadline so expiry and public reads remain bounded. Applications and inquiries index status, email and creation/date fields. Notifications index unread/date. Unique identifiers and admin emails are indexed.

Applications and inquiries contain private personal information and are available only through authenticated admin APIs. Media stores provider identifiers and metadata; project/team records reference media by URL to preserve the frontend contract. Activity logs reference users/resources by stable IDs without storing secrets. Expired open jobs/internships transition to closed idempotently.

