# Codebase Survey Report: Image Handling, AI Banner Generation & Test Infrastructure

**Agent**: Explorer 3 (`teamwork_preview_explorer`)  
**Working Directory**: `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_3`  
**Date**: 2026-08-13  
**Target Codebase**: `c:\Users\Mcman\Desktop\azveb-main`  

---

## 1. Executive Summary

This survey report provides a detailed read-only investigation of the `fermermarket` codebase at `c:\Users\Mcman\Desktop\azveb-main`, focusing on three core scopes:
1. **Image Handling & Default Assets**: Review of product image, user avatar, and store logo rendering components (`SafeImage.js`, `ProductCard.js`, `StoreProfilePublic.js`) and asset availability (`public/logo.png`, `public/placeholder.svg`).
2. **AI Banner Generation Module**: Review of specifications for `POST /api/banner/generate`, dynamic API key rotation via `prisma.setting` (`aiBannerApiKey`/`geminiApiKey`), 300x250 standard and responsive 100%x150px layout specifications, and branded SVG fallback mechanisms (<2.0s SLA).
3. **Test Infrastructure & Code Quality**: Assessment of test runner (Jest 30.4.2), test suites (`__tests__/e2e/`), coverage tooling, and lint configuration (`.eslintrc.json` vs `package.json` missing script).

---

## 2. Scope 1: Image Handling & Default Logo Assets

### 2.1 Current Implementation & Component Analysis
- **Primary Image Component**: `src/components/SafeImage.js`
  - Function: Serves as a wrapper around Next.js `<Image>` to prevent crashes when `src` is `null`, `undefined`, or empty string (`""`).
  - Current Behavior (`SafeImage.js:24-36`):
    - If `!src`, returns a placeholder `div` with a green sprout icon (`<Icon name="sprout" size={30|25} />`) and `bg-gray-100`.
    - Handles unoptimized hosts (`placehold.co`, `via.placeholder.com`) using plain HTML `<img>` elements (`SafeImage.js:38-55`).
    - Uses Next.js `<Image>` for standard URLs (`SafeImage.js:57-69`).
  - **Gap Identified**: Requirement R4 (`Automatic Logo Fallback`) specifies that missing ad images, user profiles, or store logos MUST fall back automatically to `/logo.png`. `SafeImage.js` does not currently fallback to `/logo.png` on `!src` or on image loading error (`onError`).

- **Product Card Image Rendering**: `src/components/ProductCard.js` (lines 157-167)
  - Checks `if (product.coverImage)`. If present, renders `<SafeImage src={product.coverImage} ... />`.
  - If absent, renders `<div className="..."><Icon name="sprout" size={42} /></div>`.

- **Store Profile Image Rendering**: `src/components/StoreProfilePublic.js`
  - Cover Image (lines 180-189): Renders `<SafeImage src={store.coverUrl} ... />` inside relative container.
  - Store Logo (lines 200-211): If `store?.logoUrl` exists, renders `<SafeImage src={store.logoUrl} ... />`. Otherwise renders `<div className="bg-brand-50..."><Icon name="store" size={36} /></div>`.

### 2.2 Default Assets Inventory
- `public/logo.png`: Verified present (FermerMarket primary brand logo asset).
- `public/placeholder.svg`: Verified present in `public/`.
- `public/uploads/products/`: Contains sample uploaded product images (e.g. `1785179553395-l5ml0bu.png`).

---

## 3. Scope 2: AI Banner Generation Module

### 3.1 Endpoint Status & Specification (`POST /api/banner/generate`)
- **Current File Status**: The API route file `src/app/api/banner/generate/route.js` is **currently absent/not yet created** in the repository.
- **Contract Specification** (from `PROJECT.md` & `ORIGINAL_REQUEST.md`):
  - **HTTP Method & Route**: `POST /api/banner/generate`
  - **Input Payload**: `{ title: string, productName: string, logoUrl?: string, contactInfo?: string, targetUrl?: string }`
  - **Output Response**: `{ success: true, bannerUrl?: string, svgMarkup?: string, fallbackUsed: boolean }`
  - **SLA Threshold**: 95% of requests must respond in under **2.0 seconds**.

### 3.2 Dynamic Key Management & Live Rotation
- **Configuration Keys**: `AI_BANNER_API_KEY` (env variable) and `aiBannerApiKey` or `geminiApiKey` (database setting in `Setting` model).
- **Rotation Mechanism**:
  - `src/lib/gemini.js` maintains an in-memory key cache (`cachedKey`, `cacheExpiry`).
  - `getApiKey()` checks `prisma.setting.findUnique({ where: { key: "geminiApiKey" } })` or `aiBannerApiKey`, falling back to `process.env.AI_BANNER_API_KEY` / `process.env.GEMINI_API_KEY`.
  - `clearGeminiKeyCache()` function in `src/lib/gemini.js` invalidates key cache instantly on admin updates (`PUT /api/admin/ai-settings`), enabling hot key rotation without server restarts.

### 3.3 Sizing & Responsive Banner Components
- **Standard Desktop Banner**: Width 300px x Height 250px.
- **Mobile Responsive Side Banner**: 100% width x 150px height on viewports < 768px (`SideBanner.js` / `AdBanner.js`).
- **Existing Components**:
  - `src/components/AdBanner.js`: Renders campaign banners and external ad embeds with tracking endpoints (`/api/campaigns/[id]/track`).
  - `src/components/Banners/SideBanner.js`: Renders sidebar ad slots (`SIDEBAR_LEFT`, `SIDEBAR_RIGHT`) with default responsive fallback markup.

### 3.4 Fallback SVG Generator
- When API key is missing, invalid, or expired, or when external AI API fails, the endpoint MUST fallback to a branded SVG banner.
- Branded SVG banner response MUST be generated locally in <100ms with `fallbackUsed: true`.

---

## 4. Scope 3: Test Infrastructure & Code Quality

### 4.1 Test Framework & Runner Setup
- **Test Framework**: Jest `30.4.2` (`jest-environment-jsdom` 30.4.1).
- **Test Configuration**: `jest.config.js`:
  ```js
  module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    verbose: true,
  };
  ```
- **Execution Script**: `npm test` runs `jest`.

### 4.2 Test Suite Audit
- Executed `npm test` successfully: **3 Test Suites passed, 198 tests passed (0 failed)**.
- **Suite Files**:
  1. `__tests__/e2e/tier1-feature-coverage.test.js`: 90 tests covering Features 1-18.
  2. `__tests__/e2e/tier2-boundary-corner.test.js`: 90 boundary & edge-case tests across Features 1-18.
  3. `__tests__/e2e/tier3-pairwise-combinations.test.js`: 18 pairwise interaction tests.
- **Missing Suite File**: `TEST_INFRA.md` specifies `__tests__/e2e/tier4-realworld-scenarios.test.js` (9 real-world scenarios), which is planned but not currently present in `__tests__/e2e/`.

### 4.3 Lint Configuration & Defect
- **ESLint Config File**: `.eslintrc.json` contains:
  ```json
  {
    "extends": "next/core-web-vitals"
  }
  ```
- **Lint Defect**: `package.json` **lacks a `"lint"` script**. Running `npm run lint` currently yields `npm ERR! Missing script: "lint"`.
- **Fix Required**: Add `"lint": "next lint"` to `package.json` scripts block.

### 4.4 Code Coverage Tooling
- Jest code coverage executed via `npx jest --coverage`.
- Standard coverage reporters (text, lcov, json) output to `/coverage` directory.

---

## 5. Summary of Recommended Action Items for Implementation Phase

| Area | Component / File | Findings & Required Action |
|------|------------------|----------------------------|
| **Image Fallback** | `src/components/SafeImage.js` | Update `SafeImage` to use `/logo.png` as fallback for `!src` and `onError` image load failures. |
| **AI Banner Route** | `src/app/api/banner/generate/route.js` | Create `POST /api/banner/generate` endpoint supporting 300x250 desktop / 100%x150px mobile sizing, key rotation, and <2s SVG placeholder fallback. |
| **Lint Script** | `package.json` | Add `"lint": "next lint"` to `"scripts"` object in `package.json`. |
| **Tier 4 Tests** | `__tests__/e2e/tier4-realworld-scenarios.test.js` | Implement Tier 4 real-world integration scenarios per `TEST_INFRA.md`. |

---
*Report compiled by Explorer 3 (`teamwork_preview_explorer`)*
