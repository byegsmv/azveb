## 2026-08-13T07:46:33Z
<USER_REQUEST>
You are e2e_test_writer_tier2.
Your working directory is: c:\Users\Mcman\Desktop\azveb-main\.agents\e2e_test_writer_tier2
Your parent conversation ID is: 294eb12b-95d2-4890-ae46-9084e9dc8bff

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK:
Write the Tier 2 Boundary & Corner Cases E2E test suite in Jest at:
c:\Users\Mcman\Desktop\azveb-main\__tests__\e2e\tier2-boundary-corner.test.js

REQUIREMENTS:
1. You MUST read:
   - c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md
   - c:\Users\Mcman\Desktop\azveb-main\PROJECT.md
   - c:\Users\Mcman\Desktop\azveb-main\TEST_INFRA.md
2. Write at least 5 boundary/corner test cases per feature for ALL 18 features (Total: >= 90 test cases).
   - Boundary tests include: 0 duration days, negative duration days, max int duration days, empty image URLs, oversized dekont files, invalid file extensions (non-image dekont), empty WhatsApp phone numbers, expired ads past duration, invalid paymentStatus strings, missing setting keys, empty prompt titles for AI banner, invalid API keys, timeout edge cases (>2s handling), null/undefined props in SafeImage, zero stores in carousel, >3 store carousel overflow, concurrent admin toggle updates, and role permission boundary checks.
3. Ensure valid executable Jest test code (`describe`, `test` or `it`, `expect`).
4. Run `npx jest __tests__/e2e/tier2-boundary-corner.test.js` to verify execution.
5. Deliver handoff.md in your working directory summarizing test counts and verification results.
</USER_REQUEST>
