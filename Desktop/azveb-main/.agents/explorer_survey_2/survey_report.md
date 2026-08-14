# Comprehensive Survey Report: Ad Creation, DB Schema, Receipt Upload, WhatsApp, Premium Ads & Admin Toggles

**Explorer Agent:** Explorer 2 (`teamwork_preview_explorer`)  
**Target Repository:** `c:\Users\Mcman\Desktop\azveb-main`  
**Date:** 2026-08-13  
**Status:** Completed Investigation  

---

## 1. Executive Summary

This report presents a thorough investigation of the ad creation, database schema/models (Prisma ORM), receipt upload (dekont), WhatsApp Business integration, premium features (tags/colors/store carousel), admin approval workflows, and feature toggle settings (`PREMIUM_ADS`, `STORE_PROMOTIONS`) in the `fermermarket` project (`azveb-main`).

---

## 2. Ad Creation & Management Logic

### 2.1 Current Implementation
- **Frontend Page**: `src/app/[locale]/elan-yerlesdir/page.js`
  - Handles ad posting for registered users (sellers/farmers/stores/admins) and guest users (`guestName`, `guestPhone`).
  - Supports AI-assisted description generation (`/api/ai/suggest-listing`), multi-level cascading category selection, unit selection (`ədəd`, `kg`, `ton`, `litr`, `qutu`, `bağlama`), corporate/wholesale options (`wholesalePrice`, `wholesaleMinQty`, `allowRetail`), image upload up to 5 images via Blob storage (`uploadFilesToBlob`), and hashtags/tags input.
  - Submits form payload to `POST /api/products`.
- **Backend API Routes**:
  - `POST /api/products` (`src/app/api/products/route.js:275-372`): Validates schema using Zod (`productCreateSchema`), assigns `slug`, associates seller ID or guest credentials, creates product with status `PENDING_REVIEW`, creates product images, and writes audit logs.
  - `GET /api/products` (`src/app/api/products/route.js:11-266`): Lists active products for public users, or pending/all products for admins/moderators (`status=PENDING_REVIEW` or `mine=1`).
  - `PATCH /api/products/[id]` (`src/app/api/products/[id]/route.js:51-191`): Handles product updates, status changes, and admin moderation approvals. Line 133 sets `expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)` when status becomes `ACTIVE`.
  - `POST /api/products/[id]/promote` (`src/app/api/products/[id]/promote/route.js:4-91`): Existing coin/balance deduction promotion route upserting a `Listing` record with tier `PREMIUM`.

### 2.2 Requirement Gaps
1. **Ad Duration Options**: Creation page (`elan-yerlesdir/page.js`) currently lacks duration selector options (1-day free, 15-day paid, 30-day paid).
2. **Hardcoded Expiry**: Activation logic in `PATCH /api/products/[id]/route.js` currently hardcodes a 24-hour expiration window regardless of chosen package.

---

## 3. Database Schema & ORM Models (`prisma/schema.prisma`)

### 3.1 Existing Models Analysis
- **`Product`** (`prisma/schema.prisma:503-613`):
  - Fields: `id`, `slug`, `titleAz/En/Ru`, `descriptionAz/En/Ru`, `price`, `currency`, `stock`, `status` (`DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `SOLD`, `EXPIRED`, `REJECTED`), `categoryId`, `sellerId`, `guestName`, `guestPhone`, `storeId`, `region`, `city`, `tags`, `isCorporate`, `minOrderQty`, `allowRetail`, `unit`, `viewCount`, `rejectionReason`, `publishedAt`, `expiresAt`.
- **`Listing`** (`prisma/schema.prisma:69-86`):
  - Fields: `id`, `productId`, `tier` (`STANDARD`, `FEATURED`, `PREMIUM`, `VIP`), `startDate`, `endDate`, `autoRenew`, `views`, `clicks`.
- **`Store`** (`prisma/schema.prisma:436-490`):
  - Fields: `id`, `ownerId`, `name`, `slug`, `description`, `logoUrl`, `coverUrl`, `isVerified`, `isActive`, `whatsapp`, `phone`, etc.
- **`Payment`** (`prisma/schema.prisma:218-233`) & **`PaymentStatus`** (`prisma/schema.prisma:157-162`):
  - `PaymentStatus` enum values: `PENDING`, `SUCCEEDED`, `FAILED`, `REFUNDED`. `Payment` model is currently scoped only to `Order`.
- **`Setting`** (`prisma/schema.prisma:1265-1271`) & **`DynamicBlock`** (`prisma/schema.prisma:1058-1070`):
  - Used for system configuration key-values and studio toggles.

### 3.2 Required Schema Changes
To fulfill all target requirements, the `Product` model (or `Listing` model) requires the following fields:

```prisma
// Proposed field additions to Product model in prisma/schema.prisma:
model Product {
  // ... existing fields ...
  durationDays  Int            @default(1) // 1 (free), 15 (paid), 30 (paid)
  paymentStatus PaymentStatus  @default(PENDING) // PENDING, SUCCEEDED, FAILED
  receiptUrl    String?        // URL of uploaded payment dekont image
  whatsappSent  Boolean        @default(false) // Whether receipt was forwarded to WhatsApp
}
```

For Store Carousel Promotion top 3 slots, add to `Store`:
```prisma
model Store {
  // ... existing fields ...
  isPromoted    Boolean        @default(false)
  promotedUntil DateTime?
  carouselOrder Int            @default(0)
}
```

---

## 4. Receipt Upload (Dekont) & WhatsApp Business Integration

### 4.1 Receipt Upload Flow
- When user chooses a paid option (15-day or 30-day), the frontend form in `elan-yerlesdir/page.js` displays a dekont upload input.
- File uploaded using `uploadFilesToBlob` (`src/lib/blobUpload.js`), returning `receiptUrl`.
- Payload sent to `POST /api/products` includes `durationDays`, `receiptUrl`, `paymentStatus: "PENDING"`.

### 4.2 WhatsApp Business Integration
- **Config**: Env variables in `env.example:24-27`:
  - `WHATSAPP_BUSINESS_ACCOUNT_ID`
  - `WHATSAPP_BUSINESS_PHONE_ID`
  - `WHATSAPP_BUSINESS_ACCESS_TOKEN`
- **Helper Module to Create (`src/lib/whatsapp.js`)**:
  - `sendWhatsAppReceiptNotification({ productTitle, durationDays, receiptUrl, sellerPhone, price })`
  - Sends message payload to Meta Graph API endpoint: `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_PHONE_ID}/messages`.
  - Sets `whatsappSent = true` upon successful HTTP 200 response from Meta.

---

## 5. Premium Ads & Store Carousel Promotion

### 5.1 Premium Ads (Tags & Styling)
- Tier options: `STANDARD`, `FEATURED`, `PREMIUM`, `VIP`.
- Visual presentation: Enriched `ProductCard.js` styling featuring:
  - Gold/amber glowing border and badge ("PREMIUM").
  - Special highlight colors and priority sorting on homepage and `/products` catalog listing.

### 5.2 Store Carousel Promotion (Top 3 Slots)
- Homepage `page.js` currently fetches default sections.
- Store Carousel component will query top 3 promoted stores:
  ```js
  prisma.store.findMany({
    where: { isActive: true, isPromoted: true, OR: [{ promotedUntil: null }, { promotedUntil: { gt: new Date() } }] },
    orderBy: [{ carouselOrder: 'asc' }, { updatedAt: 'desc' }],
    take: 3
  })
  ```
- Admin panel enables toggle/promotion for stores in top 3 carousel slots.

---

## 6. Admin Approval Workflows & Feature Toggles

### 6.1 Admin Approval Workflow
- In `src/components/dashboard/AdminPanel.js` (`PendingProducts` tab):
  - Displays pending listing queue with dekont preview thumbnail/modal.
  - Admin approves: sets `status = "ACTIVE"`, `paymentStatus = "SUCCEEDED"`, `publishedAt = now()`, `expiresAt = now() + (durationDays * 86400 * 1000)`.
  - Admin rejects: sets `status = "REJECTED"`, `paymentStatus = "FAILED"`, records `rejectionReason`.

### 6.2 Feature Toggle Settings (`PREMIUM_ADS`, `STORE_PROMOTIONS`)
- Stored via `DynamicBlock` (`page: "system", type: "admin_config"`) managed by `src/app/api/admin/studio/route.js` and rendered in `src/components/dashboard/NoCodeAdminStudio.js`.
- Add toggles to `DEFAULT_CONFIG` in `src/app/api/admin/studio/route.js`:
  ```js
  PREMIUM_ADS: true,
  STORE_PROMOTIONS: true
  ```
- Add controls under `FIELD_DEFS.commerce` or `FIELD_DEFS.content` in `NoCodeAdminStudio.js`.
- Public listing API checks these feature flags before returning premium badging or promoted store slots.

---

## 7. Actionable Implementation Checklist

| Task Item | Target File(s) | Action |
| --- | --- | --- |
| DB Schema Update | `prisma/schema.prisma` | Add `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent` to `Product`/`Listing`, add `isPromoted`, `promotedUntil`, `carouselOrder` to `Store`. Run `npx prisma db push` or `npx prisma migrate dev`. |
| Ad Posting UI | `src/app/[locale]/elan-yerlesdir/page.js` | Add duration selector (1-day free, 15-day paid, 30-day paid) and conditional dekont upload field. |
| Products API | `src/app/api/products/route.js` | Parse and persist `durationDays`, `receiptUrl`, `paymentStatus` on creation. |
| WhatsApp Helper | `src/lib/whatsapp.js` | Create helper sending dekont notification to WhatsApp Business API and updating `whatsappSent`. |
| Admin Approval | `src/app/api/products/[id]/route.js` & `src/components/dashboard/AdminPanel.js` | Include dekont preview in moderation modal; calculate dynamic `expiresAt` based on `durationDays`. |
| Store Carousel & Premium | `src/components/ProductCard.js`, `src/components/home/StoreCarousel.js` | Add premium badges/colors and top 3 store carousel rendering. |
| Admin Feature Toggles | `src/app/api/admin/studio/route.js` & `src/components/dashboard/NoCodeAdminStudio.js` | Add `PREMIUM_ADS` and `STORE_PROMOTIONS` toggles to studio settings. |
