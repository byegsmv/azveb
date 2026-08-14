# Handoff Report — Data Models, Media, WhatsApp & AI Banner Exploration

**Agent Name**: `teamwork_preview_explorer_m0_3`  
**Working Directory**: `c:\Users\Mcman\Desktop\azveb-main\.agents\teamwork_preview_explorer_m0_3`  
**Date/Time**: 2026-08-13T10:32:15Z  

---

## 1. Observation

### 1.1 Database & Data Schema Architecture
- **ORM & Database Engine**: PostgreSQL via Prisma ORM version `5.22.0` (`package.json:18,32`, `prisma/schema.prisma:12`).
- **Core Models inspected in `prisma/schema.prisma`**:
  - `User` (`prisma/schema.prisma:296-350`): Roles include `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `FARMER`, `STORE`, `AGRONOMIST`, `BUYER`, `DELIVERY_PARTNER`.
  - `Product` (`prisma/schema.prisma:503-613`): Marketplace item model containing `status` (`ProductStatus`: `DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `SOLD`, `EXPIRED`, `REJECTED`), `price`, `stock`, `categoryId`, `sellerId`, `storeId`, guest fields (`guestName`, `guestPhone`), relations to `ProductImage` and `Listing`.
  - `Listing` (`prisma/schema.prisma:69-86`): Linked 1-to-1 with `Product`. Fields: `tier` (`ListingTier`: `STANDARD`, `FEATURED`, `PREMIUM`, `VIP`), `startDate`, `endDate`, `autoRenew`, `views`, `clicks`.
  - `Store` (`prisma/schema.prisma:436-490`): Multi-vendor stores with `ownerId`, `name`, `logoUrl`, `coverUrl`, `isVerified`, `isActive`, `installmentEnabled`.
  - `Campaign` (`prisma/schema.prisma:111-145`): Promotional banners with `type` (`HOMEPAGE_BANNER`, `CATEGORY_BANNER`, `STORE_PROMOTION`, etc.) and `status` (`DRAFT`, `SCHEDULED`, `ACTIVE`, etc.).
  - `AdSlot` (`prisma/schema.prisma:814-824`): Ad slot placements (`HOMEPAGE_TOP`, `PRODUCT_LIST_TOP`, `SIDEBAR_LEFT`, `SIDEBAR_RIGHT`, etc.) with `mode` (`internal`, `external`, `off`).
  - `Setting` (`prisma/schema.prisma:1265-1272`): Key-value configuration model (`key` `@unique`, `value` `@db.Text`, `category`, `updatedAt`).
  - `AiSettings` (`prisma/schema.prisma:1175-1181`): Stores AI defaults (`modelName`, `systemPrompt`, `temperature`).

### 1.2 File & Image Upload System Architecture
- **Storage Provider**: Vercel Blob storage using `@vercel/blob` version `2.6.0` (`package.json:21`).
- **Upload Route**: `src/app/api/upload/route.js` handles server-side multipart file uploads using `put(pathname, file, { access: "public" })`. Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/heic`, `image/heif` up to 8MB pre-compression limit (`src/app/api/upload/route.js:4-5`).
- **Client-Side Compression**: `src/lib/blobUpload.js` resizes images using HTML5 Canvas (`MAX_DIMENSION = 1920`, `JPEG_QUALITY = 0.82`) before dispatching to `/api/upload` to stay within Vercel's 4.5MB payload limit.
- **Fallback Logo Handling**:
  - Image component guard `src/components/SafeImage.js:24-35` renders a placeholder when `src` is missing.
  - Fallback logo asset exists at `public/logo.png` (140,628 bytes) and `public/placeholder.svg` (294 bytes).

### 1.3 WhatsApp Business & Notification Infrastructure
- **Current State**:
  - `src/components/WhatsAppButton.js`: Renders client-side `wa.me` deep links for buyer-to-seller click-to-chat.
  - `src/lib/sms.js`: HTTP SMS gateway utility using `SMS_API_URL`, `SMS_API_KEY`, `SMS_SENDER`.
  - `src/lib/email.js`: Transactional email service using `Resend` (`resend: ^6.17.1`).
  - `src/lib/notify.js`: In-app database notification handler using `prisma.notification`.
- **Missing Integration**: Server-side Meta WhatsApp Business Cloud API helper is **not yet implemented**. `env.example:25-27` documents reserved env vars: `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_BUSINESS_PHONE_ID`, `WHATSAPP_BUSINESS_ACCESS_TOKEN`.

### 1.4 AI Banner Service & Configuration / Env System
- **Current AI Key Pattern**: `src/lib/gemini.js` dynamically reads API keys from `prisma.setting` (`key: "geminiApiKey"`) with cache invalidation (`clearGeminiKeyCache()`) and fallback to `process.env.GEMINI_API_KEY`.
- **AI Settings Manager**: `src/app/api/admin/ai-settings/route.js` allows admins to update API keys dynamically without restarting the application.
- **Missing Service**: `POST /api/banner/generate` endpoint does not exist. `AI_BANNER_API_KEY` is not present in `env.example` or in `prisma.setting`.

---

## 2. Logic Chain

1. **Ad Posting Requirements vs Database Schema**:
   - The user request requires 3 ad duration tiers: 1-day (free), 15-day (paid with receipt upload), and 30-day (paid with receipt upload).
   - Currently, `Product` status defaults to `PENDING_REVIEW` (`src/app/api/products/route.js:340`), and approval sets hardcoded 24h expiry: `expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)` (`src/app/api/products/[id]/route.js:135`).
   - *Deduction*: We must extend `Listing` / `Product` with `durationDays` (`1`, `15`, `30`), `paymentStatus` (`FREE`, `PENDING_VERIFICATION`, `PAID`, `REJECTED`), `receiptUrl` (string), and `whatsappSent` (boolean).

2. **Receipt Upload & Approval Flow**:
   - When a user submits a 15-day or 30-day ad, they upload a dekont/receipt image via `/api/upload`, which saves the file to Vercel Blob and returns a public URL.
   - The backend attaches `receiptUrl` to the `Product`/`Listing` record, sets `paymentStatus = "PENDING_VERIFICATION"`, and triggers a WhatsApp notification to the admin.
   - Admin moderates the item via `PATCH /api/products/[id]` or `/api/admin/products`. Upon approval, `paymentStatus` becomes `"PAID"`, `status` becomes `"ACTIVE"`, and `expiresAt` is set to `now + durationDays * 24h`.

3. **Premium & Store Promotions Control**:
   - `PREMIUM_ADS` toggle enables/disables premium badge styling in `ProductCard.js` and custom filters.
   - `STORE_PROMOTIONS` toggle controls the display of promoted stores in the homepage store carousel (top 3 slots).
   - *Deduction*: These system toggles must be registered in the `Setting` model (`PREMIUM_ADS_ENABLED`, `STORE_PROMOTIONS_ENABLED`) and manageable via `ModuleToggleSystem.js` and `AdminPanel.js`.

4. **AI Banner Generation Service Architecture**:
   - `POST /api/banner/generate` receives `{ title, productName, logoUrl, contactInfo, targetUrl }`.
   - Reads `AI_BANNER_API_KEY` from `prisma.setting` (key `aiBannerApiKey`) with fallback to `process.env.AI_BANNER_API_KEY`.
   - Generates responsive banners (300×250 desktop sidebar, 100% width × 150px height mobile).
   - If `AI_BANNER_API_KEY` is missing/invalid or AI times out, it falls back within < 2s to generating a branded placeholder SVG/Canvas banner featuring `/logo.png`.

---

## 3. Caveats

- **Network Restrictions**: Investigation was conducted in read-only offline mode; live API calls to external services (Meta WhatsApp, Vercel Blob, Gemini REST API) were simulated or verified from code.
- **Database Engine**: The project uses PostgreSQL via Prisma. Schema migrations must be applied using `npx prisma migrate dev`.
- **Next.js Version**: Project runs Next.js `16.3.0` App Router with `next-intl` internationalization. Route handlers in `src/app/api/...` must adhere to Next.js 16 conventions.

---

## 4. Conclusion & Required Schema / Architecture Specifications

### 4.1 Required Schema Modifications (`prisma/schema.prisma`)

```prisma
// Update Listing model in prisma/schema.prisma
model Listing {
  id           String      @id @default(cuid())
  productId    String      @unique
  product      Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  tier         ListingTier @default(STANDARD)
  durationDays Int         @default(1) // 1 = Free, 15 = Paid, 30 = Paid
  paymentStatus PaymentStatus @default(PENDING) // PENDING, PAID, FREE_APPROVED, REJECTED
  receiptUrl   String?     // Dekont / receipt upload image URL from Vercel Blob
  whatsappSent Boolean     @default(false) // Flag if notification was sent to WhatsApp Business
  startDate    DateTime    @default(now())
  endDate      DateTime?
  autoRenew    Boolean     @default(false)

  views  Int @default(0)
  clicks Int @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tier])
  @@index([paymentStatus])
  @@index([endDate])
}
```

Alternatively, add direct columns on `Product` model for flat access:
- `durationDays Int @default(1)`
- `paymentStatus String @default("FREE")` // "FREE" | "PENDING_VERIFICATION" | "PAID" | "REJECTED"
- `receiptUrl String?`
- `whatsappSent Boolean @default(false)`
- `isPremium Boolean @default(false)`
- `isPromoted Boolean @default(false)`

### 4.2 System Settings Table Entries (`prisma.setting`)
Keys to add:
- `PREMIUM_ADS_ENABLED`: `"true"` | `"false"`
- `STORE_PROMOTIONS_ENABLED`: `"true"` | `"false"`
- `aiBannerApiKey`: Dynamic string value for AI Banner service.

### 4.3 WhatsApp Business Notification Service Specification (`src/lib/whatsapp.js`)
- Export `sendWhatsAppReceiptNotification({ phone, adTitle, durationDays, receiptUrl })`:
  - POST to `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_BUSINESS_PHONE_ID}/messages`
  - Bearer token: `process.env.WHATSAPP_BUSINESS_ACCESS_TOKEN`
  - Payload: Template message or text containing ad details and `receiptUrl`.
  - Fallback: If credentials unconfigured, logs warning and returns `{ skipped: true, waLink: "https://wa.me/..." }`.

### 4.4 AI Banner Generation Endpoint Specification (`POST /api/banner/generate`)
- Endpoint: `src/app/api/banner/generate/route.js`
- Accepts: `{ title, productName, logoUrl, contactInfo, targetUrl, size }` (e.g. `300x250` or `responsive`).
- Reads API key via `getAiBannerKey()` (checks DB `Setting` table key `aiBannerApiKey`, falls back to `AI_BANNER_API_KEY`).
- Timeout limit: 1800ms abort controller.
- On fallback/error: Returns placeholder banner JSON containing standard SVG markup or `/logo.png` fallback.

---

## 5. Verification Method

1. **Schema & Migration Verification**:
   - Run `npx prisma validate` to confirm schema validity.
   - Run `npx prisma generate` to update Prisma Client types.
2. **API Endpoint Verification**:
   - Test free ad creation (1-day duration, `paymentStatus = "FREE"`, `status = "PENDING_REVIEW"`).
   - Test paid ad creation (15-day / 30-day duration, `receiptUrl` set, `paymentStatus = "PENDING_VERIFICATION"`).
   - Verify admin approval updates `status = "ACTIVE"`, `paymentStatus = "PAID"`, and calculates `expiresAt` correctly.
3. **Logo & Media Fallback Verification**:
   - Pass `null` or missing image URLs to `<SafeImage />` and verify fallback to `/logo.png`.
4. **AI Banner & Dynamic Key Reloading**:
   - Execute `POST /api/banner/generate` without API key to verify placeholder fallback response (< 2s).
   - Update `aiBannerApiKey` in admin settings and verify cache reload without server restart.
