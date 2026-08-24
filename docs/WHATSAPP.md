# OLINETHRA — WhatsApp Business AI Agent Integration

This document outlines the architecture, integration flow, and setup guide for the official **WhatsApp Business AI Agent** on the Olinethra platform.

---

## 1. Overview

The Olinethra WhatsApp AI Agent is a focused sales, inquiry, FAQ, and lead qualification assistant. It connects visitors directly with Olinethra's software engineering services, portfolio, open careers/internships, and engineering team.

### Primary Capabilities:
- **Company FAQ Answering**: Explains studio capabilities, tech stack, and development process using published CMS data.
- **Service Recommendation**: Recommends tailored Olinethra engineering services based on client project descriptions.
- **Progressive Project Brief Generation**: Collects project goals, features, timeline, and budget, generating an `OLINETHRA PROJECT BRIEF`.
- **Careers & Internships Assistant**: Fetches live open developer roles and internship deadlines from the CMS.
- **Human Handoff**: Escalates complex queries or explicit requests ("talk to team") by pausing AI replies and notifying admins.

---

## 2. System Architecture

```text
Website / WhatsApp Visitor
          ↓
  WhatsApp Mobile / Web
          ↓
 Official Meta WhatsApp Cloud API
          ↓
   Express Webhook (/api/v1/webhooks/whatsapp)
          ↓
  ┌───────────────┼───────────────┐
  ↓               ↓               ↓
WhatsApp      MongoDB         Shared CMS
Agent Service (Lead/Conv)     Knowledge
  ↓               ↓
WhatsApp       Admin
Reply API     Dashboard
                  ↓
            Human Handoff
```

---

## 3. Quick Setup Guide

1. Configure environment variables in `olinethra-api/.env`:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
   WHATSAPP_ACCESS_TOKEN=your_meta_system_user_token
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=olinethra_whatsapp_verify_token
   WHATSAPP_APP_SECRET=your_meta_app_secret
   ```
2. Configure public WhatsApp phone in root `.env`:
   ```env
   NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER=+15550192834
   ```
3. Set your Meta App Webhook URL:
   - `https://your-domain.com/api/v1/webhooks/whatsapp`
   - Verify token: `olinethra_whatsapp_verify_token`
