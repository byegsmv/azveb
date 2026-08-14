# Handoff Report — Codebase Architecture & UI Panels Investigation

**Agent**: `teamwork_preview_explorer_m0_1`  
**Working Directory**: `c:\Users\Mcman\Desktop\azveb-main\.agents\teamwork_preview_explorer_m0_1`  
**Target Repository**: `c:\Users\Mcman\Desktop\azveb-main`  
**Date**: 2026-08-13  

---

## 1. Observation

### 1.1 Tech Stack & Framework Version
- **Framework**: Next.js `^16.3.0` with App Router (`src/app/[locale]/...`).
- **React Version**: `^18.3.0` (with `react-dom` `^18.3.0`).
- **Styling**: Tailwind CSS `^3.4.19`, `autoprefixer`, `postcss`, `tailwindcss-animate`, `clsx`.
- **UI Components & Icons**: `lucide-react` (`^1.26.0`) wrapped in `src/components/ui/Icon.js`, `swiper` (`^14.0.7`), `recharts` (`^3.10.1`), `react-hot-toast` (`^2.6.0`).
- **ORM & Database**: Prisma ORM `^5.22.0` with PostgreSQL (`prisma/schema.prisma`).
- **Authentication**: NextAuth `^4.24.15`, JWT edge helpers (`src/lib/jwtEdge.js`), `bcryptjs` (`^2.4.3`), `jsonwebtoken`.
- **i18n**: `next-intl` (`^4.13.4`) configured in `next.config.js` with `src/i18n/request.js`, supporting AZ (Azerbaijani - default), EN, and RU.
- **File Storage**: `@vercel/blob` (`^2.6.0`) with upload wrapper `src/lib/blobUpload.js`.
- **AI Integration**: `src/lib/gemini.js` wrapping Google Gemini REST API (`gemini-2.5-flash`) with dynamic DB setting fallback (`geminiApiKey` key in `Setting` table) and offline local simulation.
- **Testing Framework**: Jest `^30.4.2`, `jest-environment-jsdom`, `@testing-library/react` (`^16.3.2`), `@testing-library/jest-dom` (`^7.0.0`). *Note: Zero test files (`*.test.js`) or `jest.config.js` currently exist in the repository.*

### 1.2 Directory Structure & Key Entry Points
```
c:\Users\Mcman\Desktop\azveb-main
├── package.json               # Dependencies, build & test scripts
├── next.config.js             # withNextIntl wrapper, image domain security, CSP headers
├── tailwind.config.js         # Theme colors (brand, etc.), animations
├── prisma/
│   └── schema.prisma          # Database schema (User, Product, Store, Listing, Campaign, AdSlot, etc.)
├── public/
│   ├── logo.png               # Primary FermerMarket logo asset (140 KB)
│   ├── placeholder.svg        # Standard SVG fallback asset
│   ├── favicon.ico, manifest.json, sw.js
│   └── uploads/               # Product image uploads
└── src/
    ├── app/
    │   ├── [locale]/
    │   │   ├── admin/         # Admin & Super Admin panel route (page.js -> AdminPanel)
    │   │   ├── dashboard/     # User / Store / Delivery Partner dashboard
    │   │   ├── elan-yerlesdir/ # Post Ad / Listing page
    │   │   └── api/           # App Router API Handlers (120+ route.js files)
    ├── components/
    │   ├── SafeImage.js       # Image component with fallback logic
    │   ├── AdBanner.js        # Internal & External Ad Banner renderer
    │   ├── Banners/SideBanner.js # Left & Right sticky sidebar banners
    │   ├── admin/             # ModuleToggleSystem.js, PageBuilder.js
    │   ├── dashboard/         # AdminPanel.js, ModeratorPanel.js, BuyerPanel.js, FarmerPanel.js
    │   └── ui/                # Icon.js, Modal.js, Toast.js, StatCard.js, Skeleton.js
    └── lib/                   # apiClient.js, prisma.js, gemini.js, adSlots.js, validators.js
```

### 1.3 Map of 4 UI Panels
1. **Super Admin Panel**:
   - **Route**: `src/app/[locale]/admin/page.js` (verifies user role against `["ADMIN", "SUPER_ADMIN", "MODERATOR"]`).
   - **Primary Component**: `src/components/dashboard/AdminPanel.js` (124 KB, tab-based navigation).
   - **Super Admin Specific Modules**:
     - `src/app/[locale]/admin/users/page.js` — Role management (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, etc.), user ban/unban, wallet adjustments.
     - `src/app/[locale]/admin/modules/page.js` & `src/components/admin/ModuleToggleSystem.js` — Assigning `UserModule` keys (`WALLET`, `BLOG`, `BUNDLES`, `CORPORATE_LISTINGS`, `CAMPAIGNS`, etc.) to users.
     - `src/app/[locale]/admin/studio/page.js` & `src/components/dashboard/NoCodeAdminStudio.js` — Dynamic block manager for homepage (`DynamicBlock`).
     - `src/app/[locale]/admin/settings/page.js` & `src/components/dashboard/AISettingsManager.js` — System configuration & AI API key management.

2. **Admin Panel**:
   - **Route**: `src/app/[locale]/admin/page.js` -> `src/components/dashboard/AdminPanel.js`.
   - **Core Sub-Panels / Tabs**:
     - `pending`: Moderation queue for product listings awaiting approval.
     - `all-listings`: Full product catalog management.
     - `categories`, `stores`, `brands`, `orders`, `coupons`, `users`, `reviews`, `bundles`, `blog`.
     - `campaigns`: Store & homepage promotional campaigns (`Campaign` model).
     - `adslots`: Ad placement configuration (`AdSlot` model key e.g. `HOMEPAGE_TOP`, `SIDEBAR_LEFT`, `SIDEBAR_RIGHT`).
     - `site-texts`, `emails` (`EmailManager.js`).

3. **Moderator Panel**:
   - **Route**: `src/app/[locale]/admin/page.js` (loads `AdminPanel.js` with restricted view) and dedicated `src/components/dashboard/ModeratorPanel.js`.
   - **Core Functions**:
     - Tabbed list of `PENDING_REVIEW`, `ACTIVE`, and `REJECTED` products (`src/components/dashboard/ModeratorPanel.js:43-135`).
     - Moderation action handlers calling `PATCH /api/products/[id]` to set `status: "ACTIVE"` or `status: "REJECTED"` with an optional rejection note (`adminNote`).

4. **User Panel (Farmer / Store / Buyer / Delivery Partner)**:
   - **Route**: `src/app/[locale]/dashboard/page.js`.
   - **Key Component Composition**:
     - `src/components/dashboard/BuyerPanel.js` — Personal info, buyer orders, favorites, wallet balance, FermerCoin count.
     - `src/components/dashboard/FarmerPanel.js` — Farmer profile (farm area, crops, soil analysis requests).
     - `src/components/dashboard/store/StoreDashboard.js` — Store profile management, product grid, sales analytics, store settings.
     - `src/components/dashboard/DeliveryPanel.js` — Partner delivery order dispatch & status updates.
   - **Ad & Product Sub-Routes**:
     - `src/app/[locale]/elan-yerlesdir/page.js` — Create listing (classified ad).
     - `src/app/[locale]/dashboard/products/[id]/edit/page.js` — Edit product.
     - `src/app/[locale]/dashboard/products/[id]/promote/page.js` — Promote product tier (`FEATURED`, `PREMIUM`, `VIP`).

### 1.4 Ad, Premium, Store & Banner Components Inventory
- **Ad Posting Component**: `src/app/[locale]/elan-yerlesdir/page.js`
  - *Current capability*: Standard classified ads & corporate bulk listings with custom images (`uploadFilesToBlob`) and AI auto-description (`handleTitleBlur`).
  - *Missing requirements*: Duration selection (1-day free, 15-day paid, 30-day paid), payment receipt upload (`receiptUrl`), WhatsApp notification trigger (`whatsappSent`), and receipt approval status (`paymentStatus`).
- **Premium Ad Component**: `src/app/[locale]/dashboard/products/[id]/promote/page.js`
  - *Current capability*: Tier selection (`FEATURED`, `PREMIUM`, `VIP`) and duration selection (7, 15, 30 days) with simulated wallet deduction.
  - *Missing requirements*: Integration with admin approval workflow, receipt submission for non-wallet payments, visual premium tags on product cards.
- **Store Promotion Component**: `src/components/dashboard/store/StoreDashboard.js` & `Campaign` model in Prisma.
  - *Current capability*: Store profile verification & product management.
  - *Missing requirements*: Homepage store carousel promotion slot (first 3 positions) governed by `STORE_PROMOTIONS` toggle in Admin settings.
- **Banner Components**:
  - `src/components/AdBanner.js` — Renders internal campaign banners or external AdSense tags.
  - `src/components/Banners/SideBanner.js` — Sticky left & right 160x600px desktop side banners.
  - *Missing requirements*: Dedicated AI Banner endpoint (`POST /api/banner/generate`) consuming `AI_BANNER_API_KEY`, generating 300x250 and responsive mobile banners (100% width x 150px height), with placeholder fallback.

### 1.5 Static Assets & Logo Locations
- **Main Logo File**: `public/logo.png` (140.6 KB PNG image).
- **Secondary Assets**: `public/placeholder.svg`, `public/favicon.ico`, `public/icons/icon-192.png`, `public/icons/icon-512.png`.
- **Image Fallback Behavior**:
  - `src/components/SafeImage.js` currently renders an inline sprout Icon when `src` is missing or empty.
  - *Requirement Gap*: Must update `SafeImage.js` (or relevant fallback props) to auto-fill `/logo.png` whenever product, store logo, or profile picture is missing.

---

## 2. Logic Chain

1. **Architecture Verification**:
   - Examination of `package.json` and `src/app` confirms Next.js `16.3.0` with App Router (`[locale]`) and `next-intl` internationalization. All routing follows standard App Router structure (`page.js`, `layout.js`, `route.js`).

2. **Panel Mapping**:
   - Navigation and access control stem from `apiFetch("/api/users/me")` checking `user.role`.
   - `ADMIN`, `SUPER_ADMIN`, and `MODERATOR` are routed to `/admin` (`AdminPanel.js`), while `BUYER`, `FARMER`, `STORE`, and `DELIVERY_PARTNER` are routed to `/dashboard` (`BuyerPanel.js`, `StoreDashboard.js`, `DeliveryPanel.js`).

3. **Requirement Gap Identification**:
   - **R1 (Panel Test & Repair)**: The project currently lacks automated Jest tests (`0` test files found). Test infrastructure must be set up with `jest.config.js` and test suites written for all 4 panels.
   - **R2 (Ad Posting Options & Receipt Flow)**: `elan-yerlesdir/page.js` lacks `durationDays` (1, 15, 30), `receiptUrl`, `paymentStatus`, and WhatsApp notification dispatch. `prisma/schema.prisma` requires fields on `Product`/`Listing` for payment/receipt tracking.
   - **R3 (Premium & Store Features)**: Premium badge rendering and top-3 store carousel promotion require explicit admin toggles (`PREMIUM_ADS`, `STORE_PROMOTIONS`) in `Setting` / `ModuleKey` tables.
   - **R4 (Logo Fallback)**: `public/logo.png` exists, but `SafeImage.js` falls back to an SVG icon rather than `/logo.png`.
   - **R5 (AI Banner Generation)**: `src/lib/gemini.js` exists for Gemini API calls with local offline fallbacks, but no `POST /api/banner/generate` route handler exists yet.

---

## 3. Caveats

- **Database State**: Local execution depends on PostgreSQL connection configured via `DATABASE_URL` in `.env`.
- **API Keys**: AI Banner functionality relies on `AI_BANNER_API_KEY` (or `geminiApiKey` in `Setting` table). System will use `offlineGenerate` fallback when key is not present.
- **WhatsApp Integration**: WhatsApp notification trigger should format a deep link (`https://wa.me/...`) or call external WhatsApp API gracefully without failing if non-configured.

---

## 4. Conclusion

The codebase is a well-structured Next.js 16 App Router application powered by Prisma ORM and Tailwind CSS. The 4 user panels (Super Admin, Admin, Moderator, User) are clearly mapped to `/admin` and `/dashboard` routes.
To fulfill the requirements outlined in `ORIGINAL_REQUEST.md`, subsequent implementation agents will need to:
1. Initialize Jest testing configuration and write unit/integration tests for all 4 panels.
2. Update Prisma schema to support ad duration, payment receipt, and WhatsApp metadata.
3. Update `elan-yerlesdir/page.js` to support 1-day (free), 15-day, and 30-day options with dekont upload and WhatsApp notification.
4. Implement `POST /api/banner/generate` endpoint and responsive banner UI with API key dynamic reload & placeholder fallback.
5. Update `SafeImage.js` to automatically fall back to `/logo.png` for missing images.
6. Add admin toggle controls for `PREMIUM_ADS` and `STORE_PROMOTIONS`.

---

## 5. Verification Method

To verify the findings of this exploration:
1. **Framework & Dependencies**:
   ```bash
   node -v
   npm list next react prisma jest
   ```
2. **Directory & File Audit**:
   ```bash
   # Check page and route distribution
   npx find src/app -name "page.js"
   npx find src/app/api -name "route.js"
   ```
3. **Static Logo Asset Audit**:
   Inspect `public/logo.png` and verify component imports in `src/components/SafeImage.js`.
