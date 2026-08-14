# E2E Test Infra: FermerMarket Enhancements

## Test Philosophy
- Opaque-box, requirement-driven end-to-end testing for FermerMarket Enhancements.
- Independent of internal implementation details; derived strictly from `ORIGINAL_REQUEST.md` and `PROJECT.md`.
- Systematic 4-tier coverage methodology: Category-Partition (Tier 1), Boundary Value Analysis & Edge Cases (Tier 2), Pairwise Combinatorial Interaction (Tier 3), and Real-World Workload Scenarios (Tier 4).

## Feature Inventory & Tier Target Matrix
| # | Feature | Source | Tier 1 (Target >=5) | Tier 2 (Target >=5) | Tier 3 (Pairwise) | Tier 4 (Workload) |
|---|---------|--------|:-------------------:|:-------------------:|:-----------------:|:-----------------:|
| 1 | Super Admin Panel Repair | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 2 | Admin Panel Repair | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 3 | Moderator Panel Repair | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 4 | User Panel Repair | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| 5 | Ad Posting Options (1d/15d/30d) | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 6 | Dekont Upload & WhatsApp Alert | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 7 | Ad Approval Workflow | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 8 | Ad Database Schema Fields | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| 9 | Premium Ad Badge & Highlight | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 10 | Store Promotion Carousel | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 11 | Admin Panel Feature Toggles | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 12 | Multi-Role Premium Approval | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| 13 | Automatic Logo Fallback | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| 14 | AI Banner Endpoint | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 15 | Responsive Banner Layout | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 16 | Dynamic API Key Management | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 17 | Placeholder Fallback Banner | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| 18 | Quality & Test Coverage | ORIGINAL_REQUEST R6 | 5 | 5 | ✓ | ✓ |

## Test Architecture & Suite Layout
- Test Location: `__tests__/e2e/`
- Test Runner: Jest / Node test runner (`npm test` or `npx jest __tests__/e2e`)
- Output Format: Standard JUnit / JSON report and console pass summary
- Tier Breakdown Files:
  - `__tests__/e2e/tier1-feature-coverage.test.js`: Tier 1 (90 tests across 18 features)
  - `__tests__/e2e/tier2-boundary-corner.test.js`: Tier 2 (90 boundary & edge case tests)
  - `__tests__/e2e/tier3-pairwise-combinations.test.js`: Tier 3 (18 pairwise feature interaction tests)
  - `__tests__/e2e/tier4-realworld-scenarios.test.js`: Tier 4 (9 application-level workload scenarios)

## Real-World Application Scenarios (Tier 4)
| Scenario ID | Scenario Description | Features Exercised | Target Complexity |
|-------------|----------------------|--------------------|-------------------|
| E2E-SC-01 | Free Ad Lifecycle (Create 1-day free listing -> auto expiry verification) | F4, F5, F8, F13 | Medium |
| E2E-SC-02 | Paid Ad Dekont & Approval Flow (Create 15-day listing -> Upload dekont -> WhatsApp notification -> Admin approval -> Active listing) | F4, F5, F6, F7, F8 | High |
| E2E-SC-03 | Premium Ad Workflow (Request 30-day premium -> Moderation/Admin approval -> Premium badge & color display in UI) | F3, F7, F9, F11, F12 | High |
| E2E-SC-04 | Store Promotion Carousel (Store owner promotes store -> Admin approval -> Verification of top 3 slot occupancy on home/store pages) | F4, F10, F11, F12 | High |
| E2E-SC-05 | Image Fallback Guarantee (Listing/Store/User profile with missing image -> SafeImage automatic rendering of `/logo.png`) | F1, F2, F3, F4, F13 | Low |
| E2E-SC-06 | AI Banner Generation & Dynamic API Key Reload (Invoke `/api/banner/generate` -> Update `AI_BANNER_API_KEY` setting via Admin -> Instant new key usage) | F1, F14, F15, F16 | High |
| E2E-SC-07 | AI Banner Fallback Execution (Missing/Expired API key -> Sub-2s branded placeholder SVG banner response) | F14, F15, F17 | Medium |
| E2E-SC-08 | Multi-Role Panel Audit (Super Admin, Admin, Moderator, User CRUD & Access Control verification) | F1, F2, F3, F4 | High |
| E2E-SC-09 | Comprehensive Full-Cycle Integration (User ad posting + Dekont + Premium + AI Banner + Admin Toggle + Fallbacks + Expiry) | F1-F18 | High |

## Coverage Goals & Acceptance Thresholds
- Tier 1: 90 test cases (5 per feature x 18 features)
- Tier 2: 90 test cases (5 per feature x 18 features)
- Tier 3: 18 pairwise interaction test cases
- Tier 4: 9 real-world end-to-end scenarios
- Total Target: 207 E2E Test Cases
- Minimum Pass Rate required for `TEST_READY.md`: 100%
