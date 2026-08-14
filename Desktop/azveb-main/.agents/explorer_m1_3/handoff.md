# Handoff Report — Explorer M1.3 (Panels, Authorization & API Edge Cases)

## 1. Observation

Direct inspection of panel components, API routes, authentication helpers, and Prisma schema revealed the following structural details and verbatim code behaviors:

### A. Authentication & RBAC Core (`src/lib/auth.js`)
- `getAuthUser(request)` extracts JWT bearer token or cookie (`fmk_access_token`), verifies signature, and queries Prisma `prisma.user.findUnique` to check live DB status:
  - Lines 133-137: `if (user.status === "BANNED" || user.status === "SUSPENDED" || user.isBanned) return null;`
- `requireRole(authUser, allowedRoles)` helper (lines 156-164):
  - Returns HTTP 401 `{ error: "Unauthorized" }` if `!authUser`.
  - Returns HTTP 403 `{ error: "Forbidden" }` if `allowedRoles` does not include `authUser.role`.

### B. User Role Definition (`prisma/schema.prisma:18-27`)
- Enums: `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `FARMER`, `STORE`, `AGRONOMIST`, `BUYER`, `DELIVERY_PARTNER`.

### C. Specific Panel API Route Code Audits

1. **Admin Wallet Adjustment Route (`src/app/api/admin/users/[id]/wallet/route.js:7`, `line 44`)**:
   - Verbatim code:
     ```javascript
     if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
       return Response.json({ error: "Unauthorized" }, { status: 401 });
     }
     ```
   - **Flaw**: Non-admin users (e.g. `BUYER` or `MODERATOR`) calling this endpoint receive HTTP 401 instead of HTTP 403.

2. **User Module Assignment Inconsistency**:
   - `src/app/api/admin/user-modules/route.js:9`:
     ```javascript
     if (!authUser || authUser.role !== "SUPER_ADMIN") {
       return Response.json({ error: "Forbidden" }, { status: 403 });
     }
     ```
   - `src/app/api/admin/users/[id]/modules/route.js:7`:
     ```javascript
     if (!authUser || !["ADMIN","SUPER_ADMIN"].includes(authUser.role)) {
       return Response.json({ error: "Forbidden" }, { status: 403 });
     }
     ```
   - **Flaw**: Single user module assignment allows `ADMIN`, whereas bulk module management requires `SUPER_ADMIN`.

3. **Product State Machine & Anti-Bait-and-Switch Logic (`src/app/api/products/[id]/route.js:107-128`)**:
   - If an owner edits content fields (`titleAz`, `price`, `descriptionAz`, etc.), status is forcibly set to `PENDING_REVIEW` to prevent bait-and-switch.
   - If an owner performs a status-only toggle, status can only move between `OWNER_SELF_TOGGLE_STATUSES` = `["ACTIVE", "SOLD", "EXPIRED"]`.
   - When status becomes `ACTIVE`, `publishedAt` is set to `new Date()` and `expiresAt` is set to `Date.now() + 24 * 60 * 60 * 1000`.

4. **Product & User Deletion Safety**:
   - `src/app/api/products/[id]/route.js:230-235`: `DELETE /api/products/[id]` explicitly deletes `OrderItem` records referencing the product before calling `prisma.product.delete`.
   - `src/app/api/admin/users/[id]/route.js:109-139`: `DELETE /api/admin/users/[id]` executes a 5-step transaction clearing `orderItem` sales history, nulling `deliveryPartnerId`, deleting buyer orders, deleting seller products, and deleting user.

5. **Store Auto-Activation Rules (`src/app/api/stores/route.js:102-108`)**:
   - First store created by a user gets `isActive = true`.
   - Subsequent stores get `isActive = false` (requiring admin approval).
   - Extra fields sent by non-staff to `PATCH /api/stores/[id]` (`isVerified`, `isActive`) are ignored (`src/app/api/stores/[id]/route.js:77-80`).

---

## 2. Logic Chain

1. **Authorization & Access Control Logic**:
   - `requireRole` is consistently used across most `/api/admin/*` routes. However, inline role checks in `/api/admin/users/[id]/wallet` misuse HTTP 401 instead of 403.
   - When a user's status is set to `BANNED` or `SUSPENDED` in `PATCH /api/admin/users/[id]`, all active `RefreshToken`s for that user are revoked in DB (`src/app/api/admin/users/[id]/route.js:58-61`).
   - On the next API call, `getAuthUser` performs a DB lookup on `user.status` and `user.isBanned`, ensuring banned users are blocked immediately even if their access token has not expired.

2. **Panel State Machine & Operations**:
   - **Super Admin Panel**: Controls system settings (`Setting` table), AI keys (`geminiApiKey`), user modules (`UserModule` table), role elevations (`SUPER_ADMIN` / `ADMIN`), and super admin user deletions.
   - **Admin Panel**: Manages moderation queue (`status=PENDING_REVIEW`), stores, categories, adslots, site-texts, user status (`ACTIVE`, `SUSPENDED`, `BANNED`), and wallet balance adjustments.
   - **Moderator Panel**: Views pending products, approves (`ACTIVE`) or rejects (`REJECTED` with `rejectionReason`), views pending reviews, approves (`isApproved: true` with notification) or deletes reviews.
   - **User Panel (Buyer / Farmer / Store / Delivery)**: Manages own listings (`mine=1`), store creation/profile (`stores/me`), order processing (`orders`), favorites, wallet withdrawals (`wallet/withdraw`), and profile settings (`users/me`).

3. **Gaps in Automated Test Suite**:
   - Existing tests (`__tests__/panels/super-admin.test.js`, `admin.test.js`, `moderator.test.js`, `user.test.js`) cover basic happy paths but lack explicit coverage for:
     - 403 Permission Denial responses on every admin endpoint when accessed by non-admin roles.
     - Role elevation restrictions (Admin attempting to elevate to Super Admin).
     - Product status anti-bait-and-switch transition (content edit resetting to `PENDING_REVIEW`).
     - Banned user immediate API blocking via live DB lookup.
     - Guest classified listing posting (`POST /api/products` without token).
     - Multiple store creation (1st active vs 2nd inactive).

---

## 3. Caveats

- **No Source Code Changes Made**: In accordance with the explorer role guidelines, no application source files were modified during this investigation.
- **Mock Service Dependencies**: External services (Meta WhatsApp Business API, Google Gemini API, Vercel Blob Storage) rely on environment variables (`WA_PHONE_NUMBER_ID`, `AI_BANNER_API_KEY`, `BLOB_READ_WRITE_TOKEN`). Tests must mock these external network calls.
- **Database Transaction Overhead**: Transactional deletion of users and products involves multi-table cascades. Unit test mocks must simulate `$transaction` callback and array modes correctly.

---

## 4. Conclusion & Actionable Requirements for Worker

### A. Mandatory Source Code Repairs for Worker
1. **Fix HTTP Status Code in Wallet Admin API**:
   - File: `src/app/api/admin/users/[id]/wallet/route.js` (lines 6-8 and 43-45)
   - Change HTTP status from `401` to `403` when `authUser` exists but is neither `ADMIN` nor `SUPER_ADMIN`:
     ```javascript
     if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });
     if (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN") {
       return Response.json({ error: "Forbidden" }, { status: 403 });
     }
     ```
2. **Harmonize User Module RBAC**:
   - File: `src/app/api/admin/users/[id]/modules/route.js` (line 7) and `src/app/api/admin/user-modules/route.js` (line 9).
   - Ensure role check is consistent (`SUPER_ADMIN` only or `["ADMIN", "SUPER_ADMIN"]` across both endpoints).

### B. Required Test Suite Expansion (Concrete Test List for Worker)

Worker must implement/verify the following test cases across `__tests__/panels/`:

1. **Super Admin & Admin Panel Suite (`__tests__/panels/admin.test.js` & `super-admin.test.js`)**:
   - `TC-ADM-01`: `GET /api/admin/users` pagination, role filtering (`FARMER`, `BUYER`, `STORE`), status filtering (`ACTIVE`, `BANNED`).
   - `TC-ADM-02`: Non-superadmin `ADMIN` attempting `PATCH /api/admin/users/[id]` with `role: "SUPER_ADMIN"` returns 403.
   - `TC-ADM-03`: `SUPER_ADMIN` promoting user to `ADMIN` or `SUPER_ADMIN` revokes user's active refresh tokens.
   - `TC-ADM-04`: `DELETE /api/admin/users/[id]` targeting self returns 400.
   - `TC-ADM-05`: Non-superadmin `ADMIN` attempting `DELETE /api/admin/users/[id]` targeting a `SUPER_ADMIN` user returns 403.
   - `TC-ADM-06`: `DELETE /api/admin/users/[id]` executes 5-step transaction deleting order items, nulling delivery partner, deleting buyer orders, deleting seller products, and deleting user.
   - `TC-ADM-07`: `PATCH /api/admin/users/[id]/wallet` by Admin updates balance/coins and creates `WalletTransaction` adjustment entry.
   - `TC-ADM-08`: Non-admin role calling `/api/admin/users/[id]/wallet` receives HTTP 403 Forbidden.
   - `TC-ADM-09`: `PUT /api/admin/ai-settings` updates `geminiApiKey` in `Setting` table.
   - `TC-ADM-10`: `POST /api/admin/site-texts` creates/updates `SiteText` entry.

2. **Moderator Panel Suite (`__tests__/panels/moderator.test.js`)**:
   - `TC-MOD-01`: `GET /api/products?status=PENDING_REVIEW` returns list of unapproved products.
   - `TC-MOD-02`: Moderator approving product `PATCH /api/products/[id]` with `status: "ACTIVE"` sets `publishedAt` and `expiresAt` (24h expiry).
   - `TC-MOD-03`: Moderator rejecting product `PATCH /api/products/[id]` with `status: "REJECTED"` and `rejectionReason` updates status and sends email notification.
   - `TC-MOD-04`: Moderator fetching review queue `GET /api/admin/reviews?filter=pending` returns pending reviews.
   - `TC-MOD-05`: Moderator approving review `PATCH /api/reviews/[id]` sets `isApproved: true` and triggers in-app notification to author.
   - `TC-MOD-06`: Moderator deleting abusive review `DELETE /api/reviews/[id]` removes review record.
   - `TC-MOD-07`: Moderator attempting admin-only user promotion or system settings modification receives 403 Forbidden.

3. **User, Farmer, Store & Buyer Suite (`__tests__/panels/user.test.js`)**:
   - `TC-USR-01`: `PATCH /api/users/me` updates `fullName`, `phone`, `region`, `city`, `avatarUrl`, `bio`.
   - `TC-USR-02`: `PATCH /api/users/me` with valid `oldPassword` updates `passwordHash`; invalid `oldPassword` returns 400.
   - `TC-USR-03`: `POST /api/products` by seller creates product with `status: "PENDING_REVIEW"`.
   - `TC-USR-04`: `PATCH /api/products/[id]` with content changes by owner forces status reset to `PENDING_REVIEW`.
   - `TC-USR-05`: `PATCH /api/products/[id]` status toggle by owner between `ACTIVE`, `SOLD`, `EXPIRED` succeeds without resetting to pending review.
   - `TC-USR-06`: User attempting `PATCH /api/products/[other-user-product-id]` receives 403 Forbidden.
   - `TC-USR-07`: User creating 1st store `POST /api/stores` gets `isActive: true`; 2nd store gets `isActive: false`.
   - `TC-USR-08`: Non-admin updating store `PATCH /api/stores/[id]` with `isVerified: true` has extra fields ignored.
   - `TC-USR-09`: Buyer order listing `GET /api/orders` returns buyer's placed orders.
   - `TC-USR-10`: Seller order listing `GET /api/orders?view=selling` returns orders containing seller's products.
   - `TC-USR-11`: Banned user with valid token calling `GET /api/users/me` receives null/401 due to DB status verification.
   - `TC-USR-12`: Guest posting classified ad `POST /api/products` without auth token succeeds when `guestName` and `guestPhone` are provided.

---

## 5. Verification Method

To independently verify this analysis:

1. **Inspect Target Files**:
   - `view_file` on `src/app/api/admin/users/[id]/wallet/route.js` lines 5-10 and 42-47 to verify the HTTP 401 vs 403 bug.
   - `view_file` on `src/app/api/admin/user-modules/route.js` line 9 vs `src/app/api/admin/users/[id]/modules/route.js` line 7 to verify role check inconsistency.
   - `view_file` on `src/app/api/products/[id]/route.js` lines 104-128 to verify product status state machine and anti-bait-and-switch behavior.

2. **Run Test Suites**:
   - Run `npx jest __tests__/panels/` to verify current test execution status.
