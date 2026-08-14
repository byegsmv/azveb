# Scope: Milestone 1 — Panel Test & Repair

## Mission
Automated testing and repair of all UI and backend modules across Super Admin, Admin, Moderator, and User panels in FermerMarket. Any failing or broken modules must have their code fixed until tests pass 100%.

## Deliverables
1. Jest testing configuration (`jest.config.js`, `babel.config.js` or Next.js Jest setup in `package.json`).
2. Comprehensive unit & integration test suites for:
   - Super Admin Panel (`src/components/dashboard/AdminPanel.js`, `/admin/users`, `/admin/modules`, `/admin/settings`)
   - Admin Panel (`src/components/dashboard/AdminPanel.js`, catalog, stores, categories, adslots, site-texts)
   - Moderator Panel (`src/components/dashboard/ModeratorPanel.js`, pending review queue, approve/reject handlers `/api/products/[id]`)
   - User Panel (`BuyerPanel.js`, `FarmerPanel.js`, `StoreDashboard.js`, `DeliveryPanel.js`)
3. Source code repairs for any failing components, API route handlers, or permission checks.
4. Clean test execution report with 100% pass rate.

## Required Reading
- `c:\Users\Mcman\Desktop\azveb-main\.agents\ORIGINAL_REQUEST.md`
- `c:\Users\Mcman\Desktop\azveb-main\PROJECT.md`
