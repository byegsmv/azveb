# Orchestrator Plan — fermermarket Enhancements

## High-Level Execution Strategy

1. **Phase 0: Initial Codebase & Requirements Survey**
   - Spawn 3 parallel `teamwork_preview_explorer` agents to map the codebase structure, tech stack, current tests, and panel modules.
   - Explorer 1: Inspect Super Admin, Admin, Moderator, User panels, routes, models, database setup.
   - Explorer 2: Inspect ad creation flows, upload pipelines, WhatsApp integration, premium features, store promotion structure.
   - Explorer 3: Inspect image fallback setup, AI banner API structure (`/api/banner/generate`), env config/key rotation mechanisms, existing test suite & lint setup (`npm run test`, `npm run lint`).

2. **Phase 1: Feature Inventory & Milestone Decomposition (`PROJECT.md`)**
   - Synthesize survey reports into `PROJECT.md`.
   - Formulate 3-7 clean, module-bounded milestones:
     - M1: Codebase Audit, Test & Repair of Panels (Super Admin, Admin, Moderator, User).
     - M2: Ad Posting & Duration Options (1d/15d/30d) + Receipt Upload + WhatsApp Integration + Admin Approval Workflow.
     - M3: Premium Ads & Store Promotion (Carousel top 3, UI Badges, Admin Toggles `PREMIUM_ADS`, `STORE_PROMOTIONS`, Admin Approval).
     - M4: Automatic Logo & Image Fallbacks (`fermermarket` default logo across missing images/stores/profiles).
     - M5: AI Banner Generation Module (`POST /api/banner/generate`, key rotation, responsiveness, fallback).
   - Establish Interface Contracts and Code Layout boundaries.

3. **Phase 2: Dual-Track Execution**
   - Track A: E2E Testing Orchestrator (requirement-driven test suite Tiers 1-4).
   - Track B: Implementation Track (dispatching Sub-Orchestrators per milestone).

4. **Phase 3: Final Verification & Hardening**
   - Phase 1: 100% E2E test suite execution across Tiers 1-4.
   - Phase 2: Tier 5 Adversarial Coverage Hardening (Challenger loop).
   - Forensic Integrity Audit (`teamwork_preview_auditor`).
   - Final Delivery Report to User.
