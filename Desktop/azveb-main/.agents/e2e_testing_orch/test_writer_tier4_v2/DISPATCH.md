## 2026-08-13T09:16:54Z
Objective: Construct `c:\Users\Mcman\Desktop\azveb-main\__tests__\e2e\tier4-realworld-scenarios.test.js` implementing the 9 real-world end-to-end application workload scenarios (E2E-SC-01 through E2E-SC-09) defined in `TEST_INFRA.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Read:
- `c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\Mcman\Desktop\azveb-main\PROJECT.md`
- `c:\Users\Mcman\Desktop\azveb-main\TEST_INFRA.md`

Scenarios to write in `__tests__/e2e/tier4-realworld-scenarios.test.js`:
- E2E-SC-01: Free Ad Lifecycle (Create 1-day free listing -> auto expiry verification)
- E2E-SC-02: Paid Ad Dekont & Approval Flow (15-day -> Dekont upload -> WhatsApp -> Admin approval)
- E2E-SC-03: Premium Ad Workflow (30-day premium -> Moderation/Admin approval -> Premium badge & color)
- E2E-SC-04: Store Promotion Carousel (Promote store -> Admin approval -> Top 3 carousel slots)
- E2E-SC-05: Image Fallback Guarantee (Missing image -> SafeImage automatic `/logo.png` render)
- E2E-SC-06: AI Banner Generation & Dynamic Key Reload (`/api/banner/generate` -> key update -> new key use)
- E2E-SC-07: AI Banner Fallback Execution (Missing key -> sub-2s placeholder SVG banner)
- E2E-SC-08: Multi-Role Panel Audit (Super Admin, Admin, Moderator, User CRUD & Access Control)
- E2E-SC-09: Full-Cycle End-to-End Integration (Complete combined user flow)

Run `npx jest __tests__/e2e` to verify all test suites pass.

Metadata Working Directory: `c:\Users\Mcman\Desktop\azveb-main\.agents\e2e_testing_orch\test_writer_tier4_v2`

Output: Write `handoff.md` in `c:\Users\Mcman\Desktop\azveb-main\.agents\e2e_testing_orch\test_writer_tier4_v2\handoff.md` detailing the test suite created, count of tests, execution command, and pass status. Report back via send_message when done.
