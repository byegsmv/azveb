# Execution Plan — Fermermarket Enhancements & Panel Repair

## Phase 0: Survey & Scope Mapping (Current)
- Dispatch 3 parallel Explorers / Spec Miners to analyze codebase structure, existing tests, framework, DB schema, panel routes, and payment setup.
- Aggregate findings into `PROJECT.md` at project root.

## Phase 1: Milestone Decomposition & Interface Contracts
- Formulate concrete Milestones (3-5 milestones).
- Create `PROJECT.md` with Feature Inventory, Milestone mapping, Interface Contracts, and Code Layout.
- Spawn E2E Testing Orchestrator / Track in parallel.

## Phase 2: Dual-Track Execution
- **Implementation Track**:
  - Milestone 1: Panel Test & Repair (Super Admin, Admin, Moderator, User panels). Fix failing modules to 100% test pass rate.
  - Milestone 2: Ad Posting Module (1d free, 15d/30d paid, Stripe checkout integration, DB schema update for duration & payment status, expiration auto-disable logic).
  - Milestone 3: Premium Ad & Store Promotion (Styling/badge for premium ads, carousel/top listing for promoted stores, admin control panel toggles).
- **E2E Testing Track**:
  - Build comprehensive opaque-box test suite (Tiers 1-4).
  - Publish `TEST_READY.md`.

## Phase 3: Verification & Hardening
- Final Milestone: Pass 100% of E2E test suite.
- Phase 2 Hardening: Tier 5 Adversarial Coverage Hardening via Challenger -> Worker -> Reviewer loop.
- Forensic Integrity Audit (`teamwork_preview_auditor`).

## Phase 4: Final Reporting
- Verify all acceptance criteria.
- Present human report with summary, changes, test results, and verification evidence.
