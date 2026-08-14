# Project: FermerMarket Enhancements

## Architecture
- **Framework**: Next.js 16.3.0 App Router (`src/app/[locale]`), React 18.3.0, Tailwind CSS 3.4.19, `next-intl` (AZ default, EN, RU).
- **Database & ORM**: PostgreSQL via Prisma ORM 5.22.0 (`prisma/schema.prisma`).
- **File Storage**: `@vercel/blob` storage (`src/lib/blobUpload.js`, `src/app/api/upload/route.js`).
- **Panels**: Super Admin (`/admin`), Admin (`/admin`), Moderator (`/admin`), User (`/dashboard`, `/elan-yerlesdir`).
- **Integrations**: Meta WhatsApp Business Cloud API (`src/lib/whatsapp.js`), Google Gemini REST API / SVG Banner Generator (`src/lib/gemini.js`, `/api/banner/generate`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Super Admin Panel Repair | Automated tests & fixes for role management, module key toggles, studio, AI settings | M1 | ORIGINAL_REQUEST R1 |
| 2 | Admin Panel Repair | Automated tests & fixes for moderation queue, catalog, stores, categories, adslots, site-texts | M1 | ORIGINAL_REQUEST R1 |
| 3 | Moderator Panel Repair | Automated tests & fixes for pending review products, approve/reject handlers | M1 | ORIGINAL_REQUEST R1 |
| 4 | User Panel Repair | Automated tests & fixes for Buyer, Farmer, Store, and Delivery dashboards | M1 | ORIGINAL_REQUEST R1 |
| 5 | Ad Posting Options (1d/15d/30d) | 1-day (free), 15-day (paid), and 30-day (paid) ad duration selection | M2 | ORIGINAL_REQUEST R2 |
| 6 | Dekont Upload & WhatsApp Alert | Upload receipt image, store `receiptUrl`, trigger WhatsApp notification to admin | M2 | ORIGINAL_REQUEST R2 |
| 7 | Ad Approval Workflow | Paid ads set `paymentStatus="PENDING_VERIFICATION"`, require Admin approval before becoming visible | M2 | ORIGINAL_REQUEST R2 |
| 8 | Ad Database Schema Fields | `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent` added to Product/Listing model | M2 | ORIGINAL_REQUEST R2 |
| 9 | Premium Ad Badge & Highlight | Distinct visual badge, highlight border/color for premium ads (`ProductCard.js`) | M3 | ORIGINAL_REQUEST R3 |
| 10 | Store Promotion Carousel | Store promotion carousel occupying top 3 slots on home/store pages | M3 | ORIGINAL_REQUEST R3 |
| 11 | Admin Panel Feature Toggles | System settings toggles for `PREMIUM_ADS` and `STORE_PROMOTIONS` | M3 | ORIGINAL_REQUEST R3 |
| 12 | Multi-Role Premium Approval | Admin / Super Admin / Moderator approval workflow required for all premium operations | M3 | ORIGINAL_REQUEST R3 |
| 13 | Automatic Logo Fallback | Automatic fallback to `public/logo.png` whenever ad image, profile picture, or store logo is missing (`SafeImage.js`) | M4 | ORIGINAL_REQUEST R4 |
| 14 | AI Banner Endpoint | `POST /api/banner/generate` accepting title, product name, logo, contact -> producing 300x250 banner | M5 | ORIGINAL_REQUEST R5 |
| 15 | Responsive Banner Layout | 300x250 desktop side banners, mobile 100% width x 150px height responsive placement | M5 | ORIGINAL_REQUEST R5 |
| 16 | Dynamic API Key Management | Admin dynamic update for `AI_BANNER_API_KEY` (`aiBannerApiKey` setting) without server restart | M5 | ORIGINAL_REQUEST R5 |
| 17 | Placeholder Fallback Banner | Branded placeholder banner (<2s) when API key is missing/invalid/expired or service fails | M5 | ORIGINAL_REQUEST R5 |
| 18 | Quality & Test Coverage | Clean `npm run lint` pass and >90% code coverage on new features across Jest test suites | M6 | ORIGINAL_REQUEST R6 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Panel Test & Repair | Super Admin, Admin, Moderator, User panels automated test setup & repair | None | IN_PROGRESS |
| M2 | Ad Posting & Receipt/WhatsApp | 1d/15d/30d durations, dekont upload, WhatsApp trigger, approval workflow | M1 | PLANNED |
| M3 | Premium & Store Promotions | Premium badge/color, store carousel top 3, admin toggles, approval workflow | M1, M2 | PLANNED |
| M4 | Automatic Logo Fallback | SafeImage fallback to `/logo.png` for ad images, profiles, store logos | M1 | PLANNED |
| M5 | AI Banner Generation | `POST /api/banner/generate`, dynamic key reload, responsive banners, fallback | M1 | PLANNED |
| M6 | QA & Coverage Hardening | Lint clean pass, >90% coverage verification, forensic audit gate | M1-M5 | PLANNED |

## Interface Contracts

### 1. Database Schema Delta (`prisma/schema.prisma`)
- `Product`:
  - `durationDays Int @default(1)`
  - `paymentStatus String @default("FREE")` // "FREE" | "PENDING_VERIFICATION" | "PAID" | "REJECTED"
  - `receiptUrl String?`
  - `whatsappSent Boolean @default(false)`
  - `isPremium Boolean @default(false)`
  - `isPromoted Boolean @default(false)`
- `Setting` keys:
  - `PREMIUM_ADS`: `"true"` | `"false"`
  - `STORE_PROMOTIONS`: `"true"` | `"false"`
  - `aiBannerApiKey`: string

### 2. WhatsApp Notification Helper (`src/lib/whatsapp.js`)
- `sendWhatsAppReceiptNotification({ adTitle, durationDays, receiptUrl, userPhone })`
- Dispatches notification to configured WhatsApp Business number or logs wa.me fallback link.

### 3. AI Banner Endpoint Contract (`POST /api/banner/generate`)
- Body: `{ title: string, productName: string, logoUrl?: string, contactInfo?: string, targetUrl?: string }`
- Output: `{ success: true, bannerUrl?: string, svgMarkup?: string, fallbackUsed: boolean }`
- Response time: < 2.0s (95th percentile).

### 4. Image Fallback Contract (`src/components/SafeImage.js`)
- Fallback src: `/logo.png` if `src` is missing, empty, or triggers error.

## Code Layout & Module Ownership
- **Panels**: `src/components/dashboard/` (`AdminPanel.js`, `ModeratorPanel.js`, `BuyerPanel.js`, `FarmerPanel.js`, `store/StoreDashboard.js`)
- **Ad Creation**: `src/app/[locale]/elan-yerlesdir/page.js`
- **Banner System**: `src/app/api/banner/generate/route.js`, `src/components/AdBanner.js`, `src/components/Banners/SideBanner.js`
- **Image Fallback**: `src/components/SafeImage.js`
- **WhatsApp Integration**: `src/lib/whatsapp.js`
- **Tests**: `src/tests/` or `__tests__/` (`panel-admin.test.js`, `panel-moderator.test.js`, `panel-user.test.js`, `ad-posting.test.js`, `premium-store.test.js`, `ai-banner.test.js`)
