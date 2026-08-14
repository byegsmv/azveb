## 2026-08-13T09:59:35Z
You are teamwork_preview_explorer_m0_3, a read-only exploration agent.
Your working directory is: c:\Users\Mcman\Desktop\azveb-main\.agents\teamwork_preview_explorer_m0_3

MANDATORY FIRST STEP: Read the original request at:
c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md

YOUR MISSION:
Investigate data models, storage/media handling, WhatsApp Business integration, and AI banner service configuration at c:\Users\Mcman\Desktop\azveb-main.
Specifically:
1. Identify database/ORM setup (Prisma, Mongoose, MongoDB, PostgreSQL, SQLite, etc.) and inspect current schemas for Ads, Stores, Users, Admin settings.
2. Check how image uploads are currently handled (local storage, S3, Cloudinary, Multer, etc.) and dekont/receipt handling.
3. Check for existing WhatsApp Business integration, notification services, or webhook/API helper functions.
4. Check environment variable management (e.g. `.env`, `.env.local`), configuration files, dynamic admin API key reloading mechanisms, and existing AI/banner endpoints.

OUTPUT REQUIREMENTS:
Write a comprehensive handoff report to:
c:\Users\Mcman\Desktop\azveb-main\.agents\teamwork_preview_explorer_m0_3\handoff.md

Your handoff report MUST include:
- Database & Data Schema Overview
- File & Image Upload System Architecture
- WhatsApp Business & Notification Infrastructure
- AI Banner Service & Configuration / Env System
- Required Schema Modifications (`durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent`, `PREMIUM_ADS`, `STORE_PROMOTIONS`, `AI_BANNER_API_KEY`)

When finished, write your handoff report to handoff.md in your working directory and notify the orchestrator via send_message.
