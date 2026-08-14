# Handoff Report: Explorer Survey 3

**Agent**: Explorer 3 (`teamwork_preview_explorer`)  
**Working Directory**: `c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_3`  
**Date**: 2026-08-13  
**Status**: Hard Handoff (Investigation Complete)  

---

## 1. Observation

1. **Image Handling & Logo Fallback**:
   - `src/components/SafeImage.js`: Lines 24-36 handle `!src` by returning a gray `div` containing an `<Icon name="sprout" />`. It does not fallback to `/logo.png` nor handle `onError` load failures.
   - `src/components/ProductCard.js`: Lines 157-167 check `product.coverImage` and render `<Icon name="sprout" />` when missing.
   - `src/components/StoreProfilePublic.js`: Lines 200-211 render `<Icon name="store" />` when `store.logoUrl` is missing.
   - `public/logo.png`: File exists at `c:\Users\Mcman\Desktop\azveb-main\public\logo.png` (size 14.2 KB).
   - `public/placeholder.svg`: File exists at `c:\Users\Mcman\Desktop\azveb-main\public\placeholder.svg`.

2. **AI Banner Generation Module**:
   - Route path `src/app/api/banner/generate/route.js`: File does NOT exist in repository (`open src/app/api/banner/generate/route.js` returned path specified not found).
   - `src/lib/gemini.js`: Lines 8-35 implement `getApiKey()` and `clearGeminiKeyCache()`. `getApiKey()` checks `prisma.setting.findUnique({ where: { key: "geminiApiKey" } })` or `aiBannerApiKey`, and env vars `GEMINI_API_KEY`/`AI_BANNER_API_KEY`.
   - `src/app/api/admin/ai-settings/route.js`: Lines 160-202 handle updating `geminiApiKey`/provider keys and invoke `clearGeminiKeyCache()` on updates.
   - `src/components/AdBanner.js` & `src/components/Banners/SideBanner.js`: Existing ad placement components for internal/external ad slots.

3. **Test Infrastructure & Lint Configuration**:
   - `package.json`: Contains `"test": "jest"` under `"scripts"`, but NO `"lint"` script (`npm run lint` fails with `Missing script: "lint"`).
   - `.eslintrc.json`: File contains `{"extends": "next/core-web-vitals"}`.
   - `jest.config.js`: Set to `testEnvironment: 'node'` and `testMatch: ['**/__tests__/**/*.test.js']`.
   - Test execution (`npm test`): 3 test suites passed (`tier1-feature-coverage.test.js`, `tier2-boundary-corner.test.js`, `tier3-pairwise-combinations.test.js`), 198 tests passed in 4.083s.
   - Coverage execution (`npx jest --coverage`): Successfully executes coverage instrumentation.

---

## 2. Logic Chain

1. **Scope 1 (Images)**:
   - Observation 1 shows `SafeImage.js` returns a sprout icon when `src` is missing instead of loading `/logo.png`.
   - Requirement R4 in `ORIGINAL_REQUEST.md` and Feature 13 in `PROJECT.md` state that missing or broken images (ads, store logos, avatars) must automatically fallback to `public/logo.png`.
   - Therefore, `SafeImage.js` must be updated to set fallback src to `/logo.png` on missing `src` or `onError` trigger.

2. **Scope 2 (AI Banner)**:
   - Observation 2 confirms `src/app/api/banner/generate/route.js` is missing.
   - `PROJECT.md` specifies `POST /api/banner/generate` accepting `{ title, productName, logoUrl, contactInfo, targetUrl }` and producing a 300x250 banner or responsive 100%x150px layout.
   - `src/lib/gemini.js` already provides `getApiKey()` and `clearGeminiKeyCache()`, which allows dynamic hot key reloading without server restart when `AI_BANNER_API_KEY` or `aiBannerApiKey` is updated via `PUT /api/admin/ai-settings`.
   - When the API key is unconfigured, expired, or invalid, or if the external request fails, a branded SVG placeholder MUST be returned in <2.0s.

3. **Scope 3 (Testing & Lint)**:
   - Observation 3 shows `package.json` missing `"lint": "next lint"`. Adding this script resolves `npm run lint`.
   - Jest test runner currently runs 198 tests across 3 suites and all 198 pass.
   - `TEST_INFRA.md` describes Tier 4 tests (`tier4-realworld-scenarios.test.js`), which should be added to achieve complete 207-test coverage.

---

## 3. Caveats

- **Read-Only Scope**: Per instructions, Explorer 3 performed read-only analysis and did not modify any source code outside `.agents/explorer_survey_3/`.
- **API Key Live Test**: External calls to Google Gemini API during testing were simulated/mocked via Jest unit tests; actual network live key verification depends on a valid `GEMINI_API_KEY` or `AI_BANNER_API_KEY`.

---

## 4. Conclusion

The codebase analysis for Explorer Survey 3 is complete:
1. Default logo asset `public/logo.png` is present. `SafeImage.js` needs modification to fallback to `/logo.png` for missing/broken images.
2. The AI Banner endpoint `POST /api/banner/generate` needs to be created in `src/app/api/banner/generate/route.js` leveraging `src/lib/gemini.js` for key management and cache clearing.
3. Test suite is functional (198/198 passed via Jest). `package.json` requires `"lint": "next lint"` to restore `npm run lint`.

---

## 5. Verification Method

To independently verify all findings:

1. **Verify Default Assets & Image Component**:
   - Check file existence: `ls public/logo.png`
   - Inspect `SafeImage.js`: `view_file` at `src/components/SafeImage.js` (lines 24-36)

2. **Verify AI Banner Endpoint Absence & Gemini Key Handler**:
   - Confirm route absence: check `src/app/api/banner/generate/route.js`
   - Inspect key rotation in `src/lib/gemini.js` and `src/app/api/admin/ai-settings/route.js`

3. **Verify Test Runner & Lint Status**:
   - Run tests: `npm test` (Expect 3 suites, 198 tests passing)
   - Inspect `package.json` scripts block to verify missing `"lint"` script
