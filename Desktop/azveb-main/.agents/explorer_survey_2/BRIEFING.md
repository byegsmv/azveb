# BRIEFING — 2026-08-13T06:45:00Z

## Mission
Investigate and survey ad creation, database schema/models (Ads, Stores, Payments, Admin Approval, Settings), receipt upload, WhatsApp integration, premium ads, store carousel promotion, and feature toggles in azveb-main.

## 🔒 My Identity
- Archetype: teamwork_preview_explorer
- Roles: Read-only investigator / Explorer 2
- Working directory: c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2
- Original parent: deb07c47-7cf2-43db-8e6a-379e1e3da19e
- Milestone: Explorer 2 Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement code changes in project source code
- Produce survey_report.md and handoff.md in c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2
- Report back to parent agent via send_message

## Current Parent
- Conversation ID: deb07c47-7cf2-43db-8e6a-379e1e3da19e
- Updated: 2026-08-13T06:45:00Z

## Investigation State
- **Explored paths**:
  - `prisma/schema.prisma` (Product, Listing, Store, Payment, Setting, DynamicBlock)
  - `src/app/[locale]/elan-yerlesdir/page.js` (Ad creation frontend)
  - `src/app/api/products/route.js` & `[id]/route.js` & `[id]/promote/route.js`
  - `src/lib/sms.js`, `notify.js`, `blobUpload.js`, `auth.js`
  - `src/components/dashboard/AdminPanel.js`, `NoCodeAdminStudio.js`
  - `src/app/api/admin/studio/route.js` (Feature toggles)
  - `src/app/[locale]/page.js` & `src/app/[locale]/dashboard/products/[id]/promote/page.js`
  - `env.example`
- **Key findings**:
  - `Product` model needs `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent`.
  - `Store` model needs `isPromoted`, `promotedUntil`, `carouselOrder` for top 3 carousel promotion.
  - `elan-yerlesdir/page.js` needs 1-day free / 15-day paid / 30-day paid selection and dekont upload.
  - `src/lib/whatsapp.js` client needs to be created for sending WhatsApp Business dekont notifications.
  - `AdminPanel.js` moderation tab needs dekont preview modal & dynamic expiry set on approval.
  - Feature toggles `PREMIUM_ADS` and `STORE_PROMOTIONS` need to be added to `admin/studio/route.js` and `NoCodeAdminStudio.js`.
- **Unexplored areas**: None (Scope fully covered).

## Key Decisions Made
- Initialized briefing and dispatch tracking.
- Completed comprehensive codebase survey and mapped schema/logic requirements.
- Generated `survey_report.md` and `handoff.md`.

## Artifact Index
- `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2\DISPATCH.md` — Dispatch log
- `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2\BRIEFING.md` — Persistent memory briefing
- `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2\survey_report.md` — Comprehensive survey report
- `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2\handoff.md` — 5-component handoff report
