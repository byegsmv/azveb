# Handoff Report: Backend, API Routes, Auth/RBAC, & Test Infrastructure Investigation

**Agent ID**: teamwork_preview_explorer_m0_2  
**Working Directory**: `c:\Users\Mcman\Desktop\azveb-main\.agents\teamwork_preview_explorer_m0_2`  
**Timestamp**: 2026-08-13T14:23:45Z  

---

## 1. Observation

### 1.1 Backend Architecture & Technology Stack
- **Framework**: Next.js 16.3.0 App Router with `next-intl` (4.13.4) supporting `AZ` (default), `EN`, and `RU` locales located in `src/app/[locale]`.
- **Database & ORM**: PostgreSQL database operated via Prisma ORM 5.22.0 (`prisma/schema.prisma`).
- **File Storage**: `@vercel/blob` storage (`src/lib/blobUpload.js`, `src/app/api/upload/route.js`).
- **Authentication**: JWT token-based auth with `bcryptjs` and `jsonwebtoken` (`src/lib/auth.js`, `src/lib/jwtEdge.js`).
- **Integrations**: Resend (`src/lib/email.js`), Meta WhatsApp Cloud API (`src/lib/whatsapp.js`), Google Gemini REST API (`src/lib/gemini.js`), Socket.io (`socket.io`), Web-Push (`web-push`).

### 1.2 Comprehensive API Route Map (`src/app/api/...`)
The application exposes 115+ API endpoints structured into the following domains:

1. **Authentication & Authorization (`/api/auth/*`)**:
   - `POST /api/auth/login` — User login & JWT issuance
   - `POST /api/auth/logout` — Cookie/session invalidation
   - `POST /api/auth/refresh` — Access token refresh
   - `POST /api/auth/register` — User registration

2. **Super Admin & Admin Operations (`/api/admin/*`)**:
   - `GET|POST|DELETE /api/admin/user-modules` — Super Admin bulk/single user module permissions
   - `POST /api/admin/users/[id]/modules` — Single user module assignment (`grantedBy` required)
   - `GET|PUT /api/admin/ai-settings` — AI provider configuration & key management
   - `GET|POST /api/admin/studio` — Visual No-Code Admin Studio page config
   - `GET /api/admin/users`, `GET|PATCH /api/admin/users/[id]`, `POST /api/admin/users/[id]/wallet`
   - `GET /api/admin/stats`, `GET /api/admin/search-logs`, `GET /api/admin/calculator-logs`
   - `GET|POST /api/admin/active-ingredients`, `GET|POST /api/admin/crops`, `GET|POST /api/admin/diseases`, `GET|POST /api/admin/pests`
   - `GET|POST|PATCH /api/admin/site-texts`, `GET|POST /api/admin/translations`, `POST /api/admin/translate`
   - `GET|POST /api/admin/emails`, `GET /api/admin/emails/stats`, `GET /api/admin/emails/[id]`, `POST /api/admin/emails/[id]/reply`
   - `GET /api/admin/export/orders`, `POST /api/admin/push/broadcast`, `GET /api/admin/reviews`
   - `GET /api/admin/wallet-withdrawals`, `PATCH /api/admin/wallet-withdrawals/[id]`

3. **Products & Catalog (`/api/products/*`, `/api/listings/*`)**:
   - `GET|POST /api/products`, `POST /api/products/bulk`, `POST /api/products/bulk-import`
   - `GET /api/products/compare`, `GET /api/products/same-ingredient`
   - `GET|PATCH|DELETE /api/products/[id]`, `GET /api/products/[id]/download`, `POST /api/products/[id]/promote`, `GET|POST /api/products/[id]/reviews`
   - `GET|POST /api/listings`, `GET|PATCH /api/listings/[productId]`

4. **Stores & Marketplace (`/api/stores/*`)**:
   - `GET|POST /api/stores`, `GET|PATCH /api/stores/me`, `GET /api/stores/me/stats`
   - `GET|PATCH /api/stores/[id]`, `POST /api/stores/[id]/follow`, `GET /api/stores/[id]/stats`

5. **Orders & Checkout (`/api/orders/*`)**:
   - `GET|POST /api/orders`, `GET|PATCH /api/orders/[id]`
   - `POST /api/orders/[id]/assign-delivery`, `POST /api/orders/[id]/pay`

6. **Wallet & Financials (`/api/wallet/*`)**:
   - `GET /api/wallet`, `POST /api/wallet/withdraw`
   - `POST /api/wallet/withdraw/approve`, `POST /api/wallet/withdraw/reject`

7. **User Profile & Notifications (`/api/users/*`, `/api/notifications/*`, `/api/push/*`)**:
   - `GET /api/users`, `GET|PATCH /api/users/me`
   - `POST /api/users/password-reset/request`, `POST /api/users/password-reset/confirm`
   - `GET /api/notifications`, `PATCH /api/notifications/[id]`
   - `POST /api/push/subscribe`

8. **Agro Services, AI & Utilities**:
   - `POST /api/ai/agronomist`, `GET /api/ai/price-index`, `POST /api/ai/suggest-listing`
   - `GET|POST /api/active-ingredients`, `GET|POST /api/crops`, `GET|POST /api/diseases`, `GET|POST /api/pests`
   - `GET /api/agro-services`, `POST /api/b2b-quote`, `GET /api/blocks`, `GET /api/blog`
   - `GET /api/brands`, `POST /api/brands/seed`, `GET /api/bundles`, `POST /api/calculator`
   - `GET /api/campaigns`, `GET /api/catalog`, `POST /api/contact`, `GET /api/coupons`, `GET /api/cron/expire-listings`
   - `GET /api/farmer/stats`, `GET /api/farmer-profile`, `GET /api/favorites`, `GET /api/leaderboard/farmers`
   - `GET /api/reports/sales`, `GET /api/sales-points`, `GET /api/search/autocomplete`, `GET /api/search/suggest`
   - `GET /api/slides`, `POST /api/upload`, `GET /api/weather`, `POST /api/webhooks/payment`
   - *Planned / Unimplemented Endpoint*: `POST /api/banner/generate` (M5 milestone requirement from `PROJECT.md`).

### 1.3 Authentication & Authorization (RBAC) Implementation
- **User Roles (`UserRole` in `prisma/schema.prisma:18`)**: `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `FARMER`, `STORE`, `AGRONOMIST`, `BUYER`, `DELIVERY_PARTNER`.
- **Edge Middleware (`src/middleware.js:28-60`)**:
  - Protects non-API routes (`/admin`, `/dashboard`, `/messages`, `/checkout`).
  - Extracts JWT tokens from `Authorization: Bearer <token>` or cookies (`fmk_access_token`, `accessToken`, `token`).
  - Uses `verifyAccessTokenEdge` (`src/lib/jwtEdge.js`) for lightweight Edge-compatible token payload parsing.
  - Redirects unauthenticated users to `/{locale}/login?callbackUrl={pathname}`.
  - Enforces `['ADMIN', 'SUPER_ADMIN', 'MODERATOR']` role restrictions on `/admin` routes (redirecting unauthorized users to `/dashboard`).
  - `/elan-yerlesdir` is intentionally unprotected to allow guest classified postings.
- **Server API Handler Security (`src/lib/auth.js:86-164`)**:
  - `getAuthUser(request)` verifies token, then performs a dynamic Prisma DB lookup (`prisma.user.findUnique`) to check real-time `user.role`, `status`, and `isBanned`. Immediately denies banned or suspended users regardless of valid JWTs.
  - `requireRole(authUser, allowedRoles)` returns standard HTTP 401 Unauthorized or HTTP 403 Forbidden JSON responses.
- **Granular Enterprise RBAC (`UserModule` model & `/api/admin/user-modules`)**:
  - Super Admins can grant/revoke 24+ individual feature keys per user (`WALLET`, `BLOG`, `BUNDLES`, `CORPORATE_LISTINGS`, `AI_AGRONOM`, `ANALYTICS`, `CAMPAIGNS`, `BULK_CSV`, `DELIVERY`, `LEADERBOARD`, `WEATHER_WIDGET`, `AGRONOMIST_AI`, `AD_SLOTS`, etc.).

### 1.4 Test Infrastructure & Suite Inventory
- **Runner & Setup**: Jest 30.4.2 + `jest-environment-jsdom` + `@testing-library/react` (16.3.2) + `@testing-library/jest-dom` (7.0.0).
- **Global Setup (`jest.setup.js`)**: Polyfills `TextEncoder`, `TextDecoder`, `Headers`, `Request`, and `Response` for Next.js App Router unit & E2E API mock testing.
- **Test Suites (`__tests__/`)**:
  1. `__tests__/panels/super-admin.test.js`: Super Admin user module API routes, AI settings, `ModuleToggleSystem` & `NoCodeAdminStudio` UI components.
  2. `__tests__/panels/admin.test.js`: Admin moderation queue, catalog management, store approvals, ad slots, and site texts.
  3. `__tests__/panels/moderator.test.js`: Moderator review queue, approve/reject handlers, product keyword extraction.
  4. `__tests__/panels/user.test.js`: Buyer, Farmer, Store, and Delivery dashboards, product ordering, review submission.
  5. `__tests__/e2e/tier1-feature-coverage.test.js`: 90 Category-Partition requirement test cases across 18 feature targets.
  6. `__tests__/e2e/tier2-boundary-corner.test.js`: 90 Boundary value & edge case test cases.
  7. `__tests__/e2e/tier3-pairwise-combinations.test.js`: 18 Pairwise feature interaction test cases.
  8. `__tests__/e2e/tier4-realworld-scenarios.test.js`: 9 Real-world application workload scenario test cases.

### 1.5 Test Execution & Lint Findings
- **`npm test` Output**:
  ```
  Test Suites: 8 passed, 8 total
  Tests:       228 passed, 228 total
  Snapshots:   0 total
  Time:        3.655 s
  Ran all test suites.
  ```
- **Console Warnings / Errors Handled in Mock Environment**:
  - `src/lib/notify.js:13:13`: `console.error: createNotification failed: Cannot read properties of undefined (reading 'create')` during `__tests__/panels/user.test.js` due to partial `prisma.notification` mock setup.
  - `src/lib/keywords.js:37:13`: `console.error: Failed to extract keywords: TypeError: Cannot read properties of undefined (reading 'upsert')` during `__tests__/panels/moderator.test.js` due to partial `prisma.siteText` mock setup.
  - `src/lib/email.js:13:13`: `console.warn: [email] RESEND_API_KEY not set — skipping email...` (expected fallback behavior).
- **Static Analysis & Lint Failures**:
  - `package.json` line 10 specifies: `"lint": "next lint || echo 'Zero linting errors'"`. The `|| echo ...` clause hides linting errors.
  - Running `npx eslint .` fails with:
    `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/next/dist/compiled/@next/eslint-plugin-next/index.js' imported from .../eslint.config.mjs`. `@next/eslint-plugin-next` is missing from `node_modules`.
  - Running `npx next lint` exits with code 1: `Invalid project directory provided, no such directory: ...\lint`.

---

## 2. Logic Chain

1. **Backend & Route Topology**:
   - By scanning `src/app/api` and `src/lib`, we confirmed Next.js 16 App Router standard layout.
   - Every API handler exports standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
   - Comparing current route files against `PROJECT.md` shows that core panel routes exist, but `/api/banner/generate` (Milestone M5) is not yet implemented.

2. **Security & Auth Mechanics**:
   - Middleware handles top-level page routing, while API handlers enforce fine-grained access control via `getAuthUser` and `requireRole`.
   - The dynamic DB check in `getAuthUser` protects against token tampering and role desynchronization.
   - Super Admin controls user feature flags via `UserModule` records with obligatory `grantedBy` auditing.

3. **Test Infrastructure Analysis**:
   - `npm test` executes Jest across 8 test files in `__tests__/` with 228 individual tests covering panels and E2E scenarios.
   - All 228 tests currently PASS.
   - The observed console errors during `npm test` are non-fatal runtime catches in `notify.js` and `keywords.js` caused by mock object boundaries in Jest tests.

4. **Linting Defect Analysis**:
   - The project `package.json` script `"lint"` uses `|| echo 'Zero linting errors'` which masks underlying setup failures.
   - Direct execution of `eslint` reveals a missing module (`@next/eslint-plugin-next` missing from `node_modules/@next`).
   - Fixing ESLint configuration requires updating `eslint.config.mjs` or installing `@next/eslint-plugin-next`.

---

## 3. Caveats

- **Unimplemented Endpoints**: `/api/banner/generate` does not exist in `src/app/api/banner/` (planned for Milestone M5).
- **Mock Scope in Unit Tests**: Mock Prisma objects in Jest unit tests omit `.notification.create` and `.siteText.upsert`, triggering `console.error` logs during `npm test`, though tests complete successfully.
- **Database Connection in Test**: `DATABASE_URL` in `jest.setup.js` is set to a dummy URL (`postgresql://test:test@localhost:5432/testdb`), as Jest unit tests mock `@/lib/prisma`.

---

## 4. Conclusion

- **Backend Architecture**: Fully structured Next.js 16 App Router backend with Prisma ORM 5.22, handling 115+ REST endpoints across Auth, Admin, Product, Store, Order, Wallet, and AI services.
- **Auth & RBAC**: Double-layer authorization system: Next.js Edge Middleware for page redirects (`/admin`, `/dashboard`, `/messages`, `/checkout`) and API handler-level DB-backed RBAC (`getAuthUser` + `requireRole`) supporting 8 user roles and 24+ granular module toggles.
- **Test Infrastructure**: Fully functional Jest test environment with 8 test suites and 228 passing tests.
- **Lint Defect**: `npm run lint` conceals static analysis failures due to `|| echo 'Zero linting errors'` in `package.json` and a broken import in `eslint.config.mjs` referencing missing `@next/eslint-plugin-next`.

---

## 5. Verification Method

1. **Verify API Routes & Backend Files**:
   - View `src/middleware.js`, `src/lib/auth.js`, `src/lib/jwtEdge.js`, `prisma/schema.prisma`.
2. **Verify Automated Test Suite Execution**:
   - Run `npm test` in `c:\Users\Mcman\Desktop\azveb-main`. Observe 8 test suites passed, 228 tests passed.
3. **Verify Lint Issue Reproduction**:
   - Run `npx eslint .` to observe module resolution error (`@next/eslint-plugin-next`).
   - Inspect `package.json` line 10 for `"lint": "next lint || echo 'Zero linting errors'"`.
