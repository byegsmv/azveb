## 2026-08-13T05:43:57Z
You are the Project Orchestrator (teamwork_preview_orchestrator).
Your working directory for coordination metadata is c:\Users\Mcman\Desktop\azveb-main\.agents\orchestrator_2.
The original user request and full requirements are stored at c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md.

Summary of Comprehensive Requirements:
1. Panel Test & Repair: Automatically test all UI and backend modules in Super Admin, Admin, Moderator, and User panels. If any module fails or has errors, fix the source code (JS/TS/Python) so that 100% of tests pass.
2. Ad Posting & Duration Module:
   - Ad options: 1-day (free), 15-day (paid), 30-day (paid).
   - Paid options (15d/30d) require receipt image upload (dekont).
   - Automatically send receipt to WhatsApp Business number.
   - Admin Approval required before ad goes live; ad remains hidden/inactive until approved.
   - Database schema fields: durationDays, paymentStatus, receiptUrl, whatsappSent.
3. Premium & Store Promotion:
   - Premium ad tags/colors & Store Carousel (top 3 slots).
   - Requires admin approval for premium options.
   - Admin control panel toggles (PREMIUM_ADS, STORE_PROMOTIONS).
4. Automatic Logo / Image Fallback:
   - If product image, profile photo, or store logo is missing, automatically insert default fermermarket logo.
5. AI Banner Generation Module:
   - POST /api/banner/generate using AI_BANNER_API_KEY.
   - Accepts title, product name, logo, contact info, and generates standard 300x250 banner and responsive 100% width x 150px height side banners.
   - Supports live API key rotation without restart; fallback to placeholder banner if key is missing/invalid or generation fails.
6. Acceptance Criteria:
   - npm run lint and existing tests pass.
   - New unit tests achieve 90%+ code coverage for new features.

Please read c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md carefully, create your BRIEFING.md and plan.md in c:\Users\Mcman\Desktop\azveb-main\.agents\orchestrator_2\, decompose tasks into milestones (PROJECT.md), dispatch workers, monitor execution, and deliver 100% completed project.
