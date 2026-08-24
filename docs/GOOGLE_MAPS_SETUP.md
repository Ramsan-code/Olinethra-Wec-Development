# Google Maps Platform Integration Guide — Olinethra

This document provides complete instructions for setting up Google Maps Platform keys, HTTP Referrer restrictions, Geocoding APIs, and budget alerts for the Olinethra platform.

---

## 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select your existing project: **Olinethra Production**.
3. Enable the required Google Maps APIs:
   - **Maps JavaScript API** (for interactive frontend map rendering)
   - **Places API** (for address search & location autocomplete in Admin Dashboard)
   - **Geocoding API** (optional server-side address-to-coordinate lookup)

---

## 2. API Key Management & Split Key Security Architecture

To maintain strict security and protect your Google Cloud billing quota, Olinethra utilizes a **split-key strategy**:

| Key Name | Location | Usage | Security Restriction |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | Frontend (`.env`) | Renders maps & place autocomplete in browser | **HTTP Referrers** (restricted to allowed domain names) |
| `GOOGLE_MAPS_SERVER_KEY` | Backend (`olinethra-api/.env`) | Server-side geocoding & API calls | **IP Addresses / Server IPs** |

---

## 3. Configuring HTTP Referrer Restrictions (Browser Key)

1. Navigate to **APIs & Services > Credentials** in Google Cloud Console.
2. Select your Browser API Key (`NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`).
3. Under **Application restrictions**, select **Websites**.
4. Add Website Restrictions:
   - `https://olinethra.com/*`
   - `https://*.olinethra.com/*`
   - `http://localhost:3000/*` (for local development)
5. Under **API restrictions**, select **Restrict key** and choose:
   - Maps JavaScript API
   - Places API
6. Save key settings.

---

## 4. Environment Variables Configuration

Add the following keys to your frontend `.env` or deployment platform (e.g. Vercel / Netlify):

```env
# Frontend (.env)
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=AIzaSy...your-restricted-browser-key
NEXT_PUBLIC_GOOGLE_MAP_ID=your-google-map-id-optional
```

Add the following to your backend `olinethra-api/.env`:

```env
# Backend (olinethra-api/.env)
GOOGLE_MAPS_SERVER_KEY=AIzaSy...your-server-ip-restricted-key
```

---

## 5. Budget Alerts & Quotas

1. Go to **Billing > Budgets & alerts** in Google Cloud Console.
2. Create a budget alert for **$50.00 / month** (or your preferred threshold).
3. Set alert notifications at 50%, 80%, and 100% of spending.
4. Under **Google Maps Platform > Quotas**, cap daily requests to prevent unexpected traffic spikes.

---

## 6. Admin Location Management Workflow

1. Log into the Olinethra Admin Dashboard at `/admin/settings`.
2. Navigate to **Section 05. Company Location & Google Maps**.
3. Use the address search box or drag the map pin to adjust latitude & longitude coordinates.
4. Toggle visibility settings (`Show Map Component`, `Show Text Address`, `Show Directions Button`).
5. Click **Save Settings**. The public website (`/contact` & footer) and AI assistants (Web Chatbot & WhatsApp Agent) will immediately reflect the updated location!
