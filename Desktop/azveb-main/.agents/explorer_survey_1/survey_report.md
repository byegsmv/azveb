# Codebase Survey Report — FermerMarket (azveb-main)

**Date**: 2026-08-13  
**Explorer**: Explorer 1 (`teamwork_preview_explorer`)  
**Target Repository**: `c:\Users\Mcman\Desktop\azveb-main`  

---

## Executive Summary
This survey report presents a comprehensive mapping of the **FermerMarket** codebase. The project is an enterprise agricultural marketplace and portal built with Next.js (App Router with i18n support), Tailwind CSS, PostgreSQL, and Prisma ORM.

The investigation mapped:
1. **Tech Stack, Framework, Scripts & Test Setup**: Next.js 16.3.0, Prisma 5.22.0, Next-intl 4.13.4, JWT auth, Tailwind CSS, Jest test runner.
2. **Panel Architecture**: Analyzed implementations for Super Admin, Admin, Moderator, and User (Buyer, Farmer/Seller, Store, Delivery Partner) panels.
3. **Test Status & Gaps**: Found **0 existing test files** (`.test.js`/`.spec.js`), missing `jest.config.js`, and failing default `npm test`.
4. **Routes, Components & Backend APIs**: Mapped 64 frontend pages, 120 API routes, 86 UI components, and 45 database models.

---

## 1. Codebase Structure & Tech Stack

### 1.1 Technology Stack & Architecture
- **Framework**: Next.js `^16.3.0` (React `^18.3.0`) with App Router and `[locale]` dynamic internationalization.
- **Language / Runtime**: JavaScript (Node.js ES6+ modules).
- **Internationalization**: `next-intl` (`^4.13.4`) supporting `az` (Azerbaijani, default), `en` (English), and `ru` (Russian) via `src/i18n/routing.js` and `messages/*.json`.
- **Database & ORM**: PostgreSQL via Prisma ORM (`^5.22.0`). Schema located at `prisma/schema.prisma` containing 45 models and 14 enums.
- **Authentication**: JWT-based authentication using custom tokens (`jsonwebtoken`, `bcryptjs`, edge token verification in `src/lib/jwtEdge.js`), NextAuth (`^4.24.15`), and route guard middleware (`src/middleware.js`).
- **State & Data Fetching**: Client-side `swr` (`^2.4.2`) and custom wrapper `apiFetch` in `src/lib/apiClient.js`.
- **UI Components & Styling**: Tailwind CSS (`^3.4.19`), Lucide icons (`lucide-react`), Recharts, Swiper, custom `<Icon name="..." />` component.
- **File Storage**: `@vercel/blob` (`^2.6.0`) with helper in `src/lib/blobUpload.js`.
- **Realtime / Push / Email**: Socket.io (`socket.io`), Web Push (`web-push`), Resend (`resend`), Sentry (`@sentry/nextjs`).

### 1.2 Package.json Scripts
- `dev`: `next dev` — Starts Next.js development server.
- `build`: `prisma generate && (prisma migrate deploy || ...) && next build` — Runs Prisma migrations and builds Next.js production app.
- `start`: `next start` — Starts production server.
- `test`: `jest` — Runs Jest test runner.
- `prisma:migrate`: `prisma migrate dev` — Executes Prisma dev migration.
- `prisma:generate`: `prisma generate` — Generates Prisma client.
- `prisma:seed`: `node prisma/seed.js` — Seeds initial database records.
- `monitor`: `node server/monitor.js` — Runs system monitoring script.

### 1.3 Linting & Test Setup Diagnosis
- **Linting Config**: `.eslintrc.json` contains `{"extends": "next/core-web-vitals"}`.
- **Test Dependencies**: `jest` (`^30.4.2`), `@testing-library/react` (`^16.3.2`), `@testing-library/jest-dom` (`^7.0.0`), `jest-environment-jsdom` (`^30.4.1`).
- **Test Suite Status**:
  - **Existing Test Files**: **0 test files** exist in the repository (no `*.test.js`, `*.spec.js`, or `__tests__/` directory).
  - **Jest Configuration**: Missing `jest.config.js` or `jest.config.ts`. Path alias resolution (`@/*`) is not configured for Jest.
  - **`npm test` Execution**: Fails with `No tests found` exit code / process hang because no test specs exist to execute.

---

## 2. Panel Implementations Analysis

### 2.1 Super Admin Panel (`UserRole.SUPER_ADMIN`)
- **Access Route**: `/admin` (`src/app/[locale]/admin/page.js`)
- **Component**: `src/components/dashboard/AdminPanel.js` (2,012 lines)
- **Key Modules**:
  - Real-time KPI Dashboard & Financial Stats (`/api/admin/stats`)
  - Platform Activity Audit Logs & Rollbacks (`/api/admin/stats`)
  - Detailed Analytics & Charts (`AnalyticsPanel.js`)
  - Product & Listing Moderation Queue (`/api/products?status=PENDING_REVIEW`)
  - Corporate & Bulk Listings Management (`/api/products?corporate=1`)
  - Categories Tree Manager (`/api/categories`)
  - Store Verification & Management (`/api/stores`, `isVerified` toggle)
  - Brand & Manufacturer Manager (`BrandsManager.js`, `/api/brands`)
  - Orders & Commission Tracking (`/api/orders`)
  - Wallet & Withdrawal Approval System (`/api/admin/wallet-withdrawals`)
  - Coupon Code Manager (`/api/coupons`)
  - User & Role Management (`/api/admin/users`, ban/unban, role assign)
  - User Module Granter (`/api/admin/user-modules`, `/api/admin/users/[id]/modules`)
  - Review Approval System (`/api/admin/reviews`)
  - Bundle Offer Manager (`/api/bundles`)
  - Blog & News Manager (`/api/blog`)
  - Campaign & Banner Manager (`/api/campaigns`)
  - Ad Slot Placement Manager (`/api/ad-slots`)
  - Broadcast Push Notification Manager (`/api/admin/push/broadcast`)
  - Homepage Hero Slider Manager (`/api/homepage-slides`)
  - Site Texts & Localized Strings (`SiteTextsManager.js`, `/api/admin/site-texts`)
  - AI Assistant & Model Config (`AISettingsManager.js`, `/api/admin/ai-settings`)
  - System Email Inbox & Webhooks (`EmailManager.js`, `/api/admin/emails`)
  - Visual No-Code Studio Block Builder (`NoCodeAdminStudio.js`, `/api/admin/studio`)
  - Support Tickets & Internal Messaging (`AdminSupport.js`, `MessagingPanel.js`)

### 2.2 Admin Panel (`UserRole.ADMIN`)
- **Access Route**: `/admin` (`src/app/[locale]/admin/page.js`)
- **Component**: `src/components/dashboard/AdminPanel.js`
- **Permissions**: Shares the main administrative panel interface with Super Admin. Super-admin specific operations (such as granting root user modules or audit log diff rollbacks) enforce `role === 'SUPER_ADMIN'`.

### 2.3 Moderator Panel (`UserRole.MODERATOR`)
- **Access Route**: `/admin` (via `AdminPanel.js` pending moderation tabs) and standalone component `src/components/dashboard/ModeratorPanel.js`.
- **Capabilities**:
  - Listing Moderation: Reviews pending products (`PENDING_REVIEW`), approves to `ACTIVE` or rejects with mandatory rejection note to `REJECTED`.
  - Review Moderation: Approves or rejects customer product reviews.
  - Viewing approved vs rejected product listings.

### 2.4 User Panel (`BUYER`, `FARMER`, `STORE`, `DELIVERY_PARTNER`, `AGRONOMIST`)
- **Access Route**: `/dashboard` (`src/app/[locale]/dashboard/page.js`) and sub-routes (`/dashboard/delivery`, `/dashboard/products`, `/dashboard/seller/products/new`, `/dashboard/studio`).
- **Core Components**:
  - `BuyerPanel.js`: Order history, status timeline, item thumbnails, favorites list, wallet balance, messaging, agro service request tracking, profile settings, credit request modal.
  - `FarmerPanel.js` / `StoreDashboard.js`: Product creation form with AI description generator (`/api/ai/suggest-listing`), multi-image upload, hashtags, corporate bulk options, installment eligibility toggle, ad promotion (VIP/Featured/Premium), selling orders processing, wallet withdrawal request, bundle builder, store profile settings.
  - `DeliveryPanel.js`: Assigned orders list, buyer contact details & delivery address, click-to-mark delivered button, daily delivery statistics.

---

## 3. Route, Component & Backend API Inventory

### 3.1 Frontend Pages (64 Routes)
- **Admin**: `/admin`, `/admin/users`, `/admin/products`, `/admin/orders`, `/admin/categories`, `/admin/campaigns`, `/admin/modules`, `/admin/live`, `/admin/active-ingredients`, `/admin/crops`, `/admin/diseases`, `/admin/pests`, `/admin/pages`, `/admin/settings`, `/admin/translations`, `/admin/products/[id]/edit`
- **Dashboard / User**: `/dashboard`, `/dashboard/delivery`, `/dashboard/products`, `/dashboard/products/[id]/edit`, `/dashboard/products/[id]/promote`, `/dashboard/seller/products/new`, `/dashboard/studio`
- **Marketplace & Public**: `/`, `/about`, `/active-ingredients`, `/active-ingredients/[id]`, `/agro-services`, `/agronom`, `/blog`, `/blog/[slug]`, `/brands`, `/brands/[slug]`, `/bundles`, `/calculator`, `/campaigns`, `/cart`, `/categories`, `/categories/[slug]`, `/checkout`, `/compare`, `/contact`, `/crops`, `/crops/[slug]`, `/diseases`, `/diseases/[slug]`, `/elan-yerlesdir`, `/farmer-club`, `/favorites`, `/forgot-password`, `/leaderboard`, `/login`, `/messages`, `/messages/[id]`, `/pests`, `/pests/[slug]`, `/privacy`, `/products`, `/products/[slug]`, `/register`, `/reset-password`, `/search`, `/seller`, `/shipping`, `/stores`, `/stores/[slug]`, `/terms`

### 3.2 Dashboard & Admin Components
- `AdminPanel.js`, `ModernAdminDashboard.js`, `ModeratorPanel.js`, `NoCodeAdminStudio.js`, `BuyerPanel.js`, `FarmerPanel.js`, `DeliveryPanel.js`, `CatalogPanel.js`, `AnalyticsPanel.js`, `EmailManager.js`, `BrandsManager.js`, `AISettingsManager.js`, `SiteTextsManager.js`, `AdminProfile.js`, `AdminSupport.js`, `AdminSidebarNav.js`, `ModuleToggleSystem.js`, `PageBuilder.js`, `StoreDashboard.js`, `StoreAnalytics.js`, `StoreSettings.js`, `StoreSidebar.js`.

### 3.3 Backend API Endpoints (120 Routes)
- **Admin Endpoints**: `/api/admin/stats`, `/api/admin/users`, `/api/admin/users/[id]`, `/api/admin/users/[id]/modules`, `/api/admin/user-modules`, `/api/admin/reviews`, `/api/admin/wallet-withdrawals`, `/api/admin/wallet-withdrawals/[id]`, `/api/admin/site-texts`, `/api/admin/ai-settings`, `/api/admin/emails`, `/api/admin/emails/[id]`, `/api/admin/emails/[id]/reply`, `/api/admin/emails/stats`, `/api/admin/studio`, `/api/admin/push/broadcast`, `/api/admin/export/orders`, `/api/admin/active-ingredients`, `/api/admin/crops`, `/api/admin/diseases`, `/api/admin/pests`, `/api/admin/search-logs`, `/api/admin/calculator-logs`, `/api/admin/translate`, `/api/admin/translations`.
- **Products & Marketplace Endpoints**: `/api/products`, `/api/products/[id]`, `/api/products/[id]/promote`, `/api/categories`, `/api/categories/[id]`, `/api/brands`, `/api/brands/[id]`, `/api/orders`, `/api/orders/[id]`, `/api/stores`, `/api/stores/[id]`, `/api/bundles`, `/api/bundles/[id]`, `/api/campaigns`, `/api/ad-slots`, `/api/homepage-slides`.
- **User & Wallet Endpoints**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/refresh`, `/api/users/me`, `/api/wallet`, `/api/wallet/withdraw`, `/api/favorites`, `/api/conversations`, `/api/messages`, `/api/notifications`, `/api/push/subscribe`.
- **Agro & AI Endpoints**: `/api/ai/suggest-listing`, `/api/ai/agronomist`, `/api/ai/price-index`, `/api/agro-services`, `/api/calculator`, `/api/active-ingredients`, `/api/crops`, `/api/diseases`, `/api/pests`.

---

## 4. Identified Gaps Against Requirements

Based on `ORIGINAL_REQUEST.md`, the following gaps exist in the current codebase:
1. **Automated Unit & Integration Test Suite**: Currently **0 test files** exist. All 4 panels require unit and integration tests covering CRUD, access controls, and data flow to achieve 100% pass rate.
2. **Ad Posting Options (1-day free, 15-day paid, 30-day paid)**:
   - Need Prisma schema updates (`durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent`).
   - Need receipt upload UI + WhatsApp Business notification dispatch.
   - Need Admin payment approval workflow prior to listing activation.
   - Need automated expiration cron check for ended durations.
3. **Premium & Store Promotion Features**:
   - UI styling/badges for Premium listings.
   - Store carousel for top 3 featured slots.
   - Admin control panel toggles (`PREMIUM_ADS`, `STORE_PROMOTIONS`).
4. **Automatic Logo Fallback**:
   - Automatic replacement of missing product, profile, or store images with the `fermermarket` fallback logo.
5. **AI Banner Generation API**:
   - Implementation of `POST /api/banner/generate` with `AI_BANNER_API_KEY`, placeholder image fallback, and instant admin API key update support.

---
*End of Survey Report*
