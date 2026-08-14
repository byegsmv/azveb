# Handoff Report — Explorer 2 (Ad Creation, DB Schema, Receipt Upload, WhatsApp & Admin Features)

**Agent Name:** Explorer 2 (`teamwork_preview_explorer`)  
**Working Directory:** `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2`  
**Date:** 2026-08-13  
**Status:** Hard Handoff (Investigation Complete)  

---

## 1. Observation

Direct observations from examining the codebase in `c:\Users\Mcman\Desktop\azveb-main`:

1. **Ad Creation & API Routes**:
   - `src/app/[locale]/elan-yerlesdir/page.js`: Form allows posting ads with images, category tree, title, price, region/city, corporate wholesale pricing, and hashtags (lines 147-186). Does NOT contain options for 1-day (free), 15-day (paid), or 30-day (paid) ad duration selection, nor dekont image upload.
   - `src/app/api/products/route.js:275-372`: `POST` endpoint handles product creation, setting `status: "PENDING_REVIEW"`.
   - `src/app/api/products/[id]/route.js:133`: Hardcoded 24-hour expiry set upon activation (`finalData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)`).
   - `src/app/api/products/[id]/promote/route.js:24-88`: Existing coin/AZN wallet promotion route for `PREMIUM` tier listing upsert.

2. **Database Schema (`prisma/schema.prisma`)**:
   - `Product` model (lines 503-613) contains status (`DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `SOLD`, `EXPIRED`, `REJECTED`), `rejectionReason`, `publishedAt`, `expiresAt`. Lacks `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent`.
   - `Listing` model (lines 69-86) contains `tier` (`STANDARD`, `FEATURED`, `PREMIUM`, `VIP`), `startDate`, `endDate`.
   - `PaymentStatus` enum (lines 157-162) contains `PENDING`, `SUCCEEDED`, `FAILED`, `REFUNDED`. `Payment` model (lines 218-233) is tied to `Order`.
   - `Store` model (lines 436-490) lacks `isPromoted`, `promotedUntil`, `carouselOrder` fields for top 3 carousel promotion.

3. **WhatsApp Integration & Config**:
   - `env.example:24-27` includes `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_BUSINESS_PHONE_ID`, and `WHATSAPP_BUSINESS_ACCESS_TOKEN`.
   - `src/lib/` contains `sms.js`, `notify.js`, `email.js`, but no `whatsapp.js` client integration exists.

4. **Admin Approval & Feature Toggles**:
   - `src/components/dashboard/AdminPanel.js:201-362`: `PendingProducts` moderation tab handles product approvals/rejections but currently has no UI for viewing uploaded payment dekonts.
   - `src/app/api/admin/studio/route.js:5-24`: `DEFAULT_CONFIG` manages feature toggles in `DynamicBlock`. `PREMIUM_ADS` and `STORE_PROMOTIONS` are not present in `DEFAULT_CONFIG` or `NoCodeAdminStudio.js` field definitions.

---

## 2. Logic Chain

1. **Ad Duration & Receipt Upload**:
   - Observation #1 shows `elan-yerlesdir/page.js` and `POST /api/products` do not handle ad duration or receipt uploading.
   - Observation #2 confirms `prisma/schema.prisma` is missing `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent` on `Product`.
   - Therefore, the DB schema must be extended, `elan-yerlesdir/page.js` must present duration options (1-day free, 15-day paid, 30-day paid) and dekont upload for paid options, and `POST /api/products` must accept and store these fields.

2. **WhatsApp Business Sending**:
   - Observation #3 shows WhatsApp env variables exist in `env.example` but no send logic is implemented in `src/lib/`.
   - Therefore, a dedicated helper `src/lib/whatsapp.js` calling the Meta Graph API (`POST https://graph.facebook.com/v18.0/${PHONE_ID}/messages`) must be implemented to notify admins of uploaded dekonts and update `whatsappSent = true`.

3. **Premium Ads & Store Carousel**:
   - Observation #1 & #2 show `ListingTier.PREMIUM` exists in schema, but store carousel top 3 slots lack store-level promotion flags (`isPromoted`, `promotedUntil`, `carouselOrder`).
   - Therefore, extending `Store` schema and updating public store fetching logic will enable pinning top 3 promoted stores in the carousel.

4. **Admin Approval & Studio Toggles**:
   - Observation #4 shows `AdminPanel.js` moderation tab lacks dekont inspection, and `admin/studio/route.js` lacks `PREMIUM_ADS` and `STORE_PROMOTIONS` toggle flags.
   - Therefore, adding dekont preview to `AdminPanel.js`, calculating dynamic `expiresAt = now() + durationDays * 24h` on approval, and registering feature toggles in `DEFAULT_CONFIG` completes the admin workflow.

---

## 3. Caveats

- **Prisma Migration**: A database migration (`npx prisma db push` or `npx prisma migrate dev`) must be executed after modifying `prisma/schema.prisma`.
- **Meta API Credentials**: Real WhatsApp API delivery requires valid `WHATSAPP_BUSINESS_PHONE_ID` and `WHATSAPP_BUSINESS_ACCESS_TOKEN` in `.env`. In dev mode, missing credentials will log a console warning gracefully.

---

## 4. Conclusion

The repository has strong foundations for products, listings, stores, and admin moderation, but lacks:
1. `durationDays`, `paymentStatus`, `receiptUrl`, and `whatsappSent` fields in the schema.
2. Ad duration options (1-day free, 15/30-day paid) and receipt upload UI in `elan-yerlesdir/page.js`.
3. WhatsApp notification helper `src/lib/whatsapp.js`.
4. Store promotion fields in `Store` model for top 3 carousel promotion.
5. `PREMIUM_ADS` and `STORE_PROMOTIONS` feature toggles in `src/app/api/admin/studio/route.js` and `NoCodeAdminStudio.js`.

Detailed implementation plans and code changes can proceed directly using the findings in `survey_report.md`.

---

## 5. Verification Method

1. **Schema Verification**:
   - Inspect `prisma/schema.prisma` for `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent` under `Product`, and `isPromoted`, `promotedUntil`, `carouselOrder` under `Store`.
2. **File Check**:
   - Verify presence of `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2\survey_report.md`.
   - Verify presence of `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_2\handoff.md`.
3. **Execution Test** (Post-implementation):
   - Run `npx prisma validate` to confirm schema integrity.
   - Test `POST /api/products` payload validation.
