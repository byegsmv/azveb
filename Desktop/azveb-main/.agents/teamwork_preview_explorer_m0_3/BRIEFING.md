# BRIEFING — 2026-08-13T10:32:15Z

## Mission
Investigate data models, storage/media handling, WhatsApp Business integration, and AI banner service configuration at azveb-main to prepare schema recommendations and technical specifications.

## 🔒 My Identity
- Archetype: Teamwork explorer
- Roles: Read-only exploration agent
- Working directory: c:\Users\Mcman\Desktop\azveb-main\.agents\teamwork_preview_explorer_m0_3
- Original parent: 294eb12b-95d2-4890-ae46-9084e9dc8bff
- Milestone: m0_3

## 🔒 Key Constraints
- Read-only investigation — do NOT implement source code changes
- Write reports/analysis only to own directory `.agents/teamwork_preview_explorer_m0_3/`

## Current Parent
- Conversation ID: 294eb12b-95d2-4890-ae46-9084e9dc8bff
- Updated: 2026-08-13T10:32:15Z

## Investigation State
- **Explored paths**:
  - `prisma/schema.prisma` (Prisma models: Product, Listing, Store, User, Campaign, AdSlot, Setting, AiSettings)
  - `package.json` & `env.example`
  - `src/app/api/upload/route.js` & `src/lib/blobUpload.js`
  - `src/lib/gemini.js` & `src/app/api/admin/ai-settings/route.js`
  - `src/lib/sms.js`, `src/lib/email.js`, `src/lib/notify.js`, `src/components/WhatsAppButton.js`
  - `src/app/api/products/route.js` & `src/app/api/products/[id]/route.js`
  - `src/components/SafeImage.js`, `src/components/AdBanner.js`, `src/components/Banners/SideBanner.js`
  - `public/logo.png`
- **Key findings**:
  - Database: PostgreSQL via Prisma ORM (`prisma/schema.prisma`).
  - Image Uploads: Vercel Blob (`@vercel/blob` put) with client-side canvas compression in `blobUpload.js`. Missing images fallback to `/logo.png`.
  - Missing schema fields: `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent` on `Product` / `Listing` model.
  - Missing WhatsApp Cloud API helper: Requires `src/lib/whatsapp.js` with Meta Graph API integration.
  - AI Banner Service: Endpoint `POST /api/banner/generate` and DB key `aiBannerApiKey` in `Setting` table are missing.
- **Unexplored areas**: None (all requested areas thoroughly investigated).

## Key Decisions Made
- Provided complete Prisma schema migration diff and technical specification in `handoff.md`.

## Artifact Index
- `.agents/teamwork_preview_explorer_m0_3/DISPATCH.md` — Initial dispatch prompt
- `.agents/teamwork_preview_explorer_m0_3/BRIEFING.md` — Agent briefing & state
- `.agents/teamwork_preview_explorer_m0_3/progress.md` — Liveness heartbeat
- `.agents/teamwork_preview_explorer_m0_3/handoff.md` — Comprehensive handoff report
