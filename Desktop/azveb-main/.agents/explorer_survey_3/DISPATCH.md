## 2026-08-13T10:25:00Z
You are Explorer 3 (teamwork_preview_explorer).
Your working directory for metadata is c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_3.
You MUST read c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md before starting.

Task Scope:
1. Inspect image handling across the codebase in c:\Users\Mcman\Desktop\azveb-main (product images, profile photos, store logos) and locate default logo assets (`fermermarket` logo).
2. Inspect the AI Banner Generation module specifications and endpoints:
   - `POST /api/banner/generate` API route setup.
   - `AI_BANNER_API_KEY` configuration and dynamic live rotation mechanism (re-reading without restart).
   - Standard 300x250 banner and responsive 100% x 150px side banner generation logic and placeholder fallback.
3. Inspect current test coverage setup, lint configuration (`npm run lint`), unit test frameworks (Jest/Vitest/PyTest/etc.), and code coverage tools.

Output:
Write a comprehensive survey report to c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_3\survey_report.md and a handoff report at c:\Users\Mcman\Desktop\azveb-main\.agents\explorer_survey_3\handoff.md.
Send a message back to parent when complete referencing your report paths.
