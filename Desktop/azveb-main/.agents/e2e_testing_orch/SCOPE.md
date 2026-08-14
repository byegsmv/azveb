# Scope: E2E Testing Track Orchestrator

## Mission
Design and create a comprehensive, requirement-driven opaque-box test suite for all 18 inventoried features in `PROJECT.md`. Publish `TEST_READY.md` upon completion.

## Test Methodology (4 Tiers)
- **Tier 1 — Feature Coverage (>=5 per feature)**: Self-contained happy-path verification for every feature in `PROJECT.md § Feature Inventory`.
- **Tier 2 — Boundary & Corner Cases (>=5 per feature)**: Limit checks, empty/invalid inputs, zero/negative values, domain extremes.
- **Tier 3 — Cross-Feature Combinations**: Pairwise feature interaction tests (e.g. Paid Ad + Premium Badge + Store Promotion).
- **Tier 4 — Real-World Application Scenarios**: End-to-end user workflows (e.g. Farmer creating paid listing -> Dekont upload -> WhatsApp alert -> Admin approval -> Premium badge display -> Expiry).

## Output Deliverables
1. `TEST_INFRA.md` at project root with methodology, runner commands, and coverage thresholds.
2. Executable test files in `src/tests/e2e/` or `__tests__/e2e/`.
3. `TEST_READY.md` at project root when test suite design is complete.

## Required Reading
- `c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\Mcman\Desktop\azveb-main\PROJECT.md`
