# Handoff Report: Milestone 1 — Moderator & User Panel Investigation

## 1. Observation

### A. Moderator Panel & Products API
1. **Rejection Reason Field Name Mismatch**:
   - **`src/components/dashboard/ModeratorPanel.js` (lines 33, 112-114, 126-130)**:
     ```javascript
     const body = action === "ACTIVE"
       ? { status: "ACTIVE" }
       : { status: "REJECTED", adminNote: rejectReason[productId] || "Rədd edildi" };
     await apiFetch(`/api/products/${productId}`, { method: "PATCH", body: JSON.stringify(body) });
     ```
   - **`src/lib/validators.js` (lines 203-208)**:
     ```javascript
     export const productUpdateSchema = productRawSchema.partial().extend({
       status: z.enum(["DRAFT", "PENDING_REVIEW", "ACTIVE", "SOLD", "EXPIRED", "REJECTED"]).optional(),
       rejectionReason: z.string().max(500).optional().nullable(),
     });
     ```
   - **`prisma/schema.prisma` (line 562)**:
     ```prisma
     rejectionReason String?
     ```
   - **Finding**: `ModeratorPanel.js` transmits `{ status: "REJECTED", adminNote: "..." }`. Because `productUpdateSchema` defines `rejectionReason` instead of `adminNote`, Zod strips the `adminNote` property during validation. `PATCH /api/products/[id]` does not write any rejection note to `rejectionReason` in PostgreSQL, discarding the moderator's note.

2. **Query Parameter Name Mismatch for Pagination**:
   - **`src/components/dashboard/ModeratorPanel.js` (line 19)**:
     ```javascript
     const data = await apiFetch(`/api/products?status=${status}&limit=50`);
     ```
   - **`src/app/api/products/route.js` (line 25)**:
     ```javascript
     const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
     ```
   - **Finding**: `ModeratorPanel.js` passes query parameter `limit=50`, but `/api/products` only reads `pageSize`. The API ignores `limit=50` and falls back to `pageSize = 20`.

---

### B. User Panels & Dashboard Page
3. **Hardcoded State & UI Over-Rendering in Dashboard Page**:
   - **`src/app/[locale]/dashboard/page.js` (lines 63, 93-97)**:
     ```javascript
     const hasStore = true;
     ...
     {hasStore && (
        <StoreDashboard user={user} />
     )}
     <BuyerPanel user={user} />
     ```
   - **Finding**: `hasStore` is hardcoded to `true`. Every user visiting `/dashboard` renders `StoreDashboard` (which renders `CreateStoreForm` if the user has no store), and then renders `BuyerPanel` below it.
   - Furthermore, `FarmerPanel.js` (`src/components/dashboard/FarmerPanel.js`) is never imported or rendered in `DashboardPage`, hiding all farmer-specific tools (such as AI product generator modal, wallet withdrawal, bundle creation, and sales statistics).

4. **Missing API Route in Delivery Dashboard (404 Error)**:
   - **`src/app/[locale]/dashboard/delivery/page.js` (line 37)**:
     ```javascript
     await apiFetch(`/api/admin/orders/${id}`, {
       method: "PATCH",
       body: JSON.stringify({ status: newStatus })
     });
     ```
   - **Finding**: Directory `src/app/api/admin/orders` DOES NOT EXIST in the codebase. When a delivery partner or admin clicks "Yola Çıxdı İşarələ" or "Çatdırıldı İşarələ" in `DeliveryDashboard`, `apiFetch` fails with a 404 Not Found error. The valid endpoint is `/api/orders/${id}` (`src/app/api/orders/[id]/route.js`).

---

### C. Database Schema Mismatches in Dashboard API Routes
5. **Prisma Runtime Crash in Store Stats API (`/api/stores/me/stats`)**:
   - **`src/app/api/stores/me/stats/route.js` (lines 26, 34, 54)**:
     ```javascript
     select: { id: true, status: true, totalAmount: true, createdAt: true }
     ...
     const totalRevenue = deliveredOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
     ```
   - **`prisma/schema.prisma` (line 173)**:
     ```prisma
     model Order {
       ...
       total Decimal @db.Decimal(12, 2)
       ...
     }
     ```
   - **Finding**: `Order` model field in Prisma schema is `total`, NOT `totalAmount`. When `GET /api/stores/me/stats` is called, Prisma throws `Unknown field totalAmount for select statement on model Order` and crashes with an HTTP 500 error.

6. **Prisma Runtime Crash in Farmer Stats API (`/api/farmer/stats`)**:
   - **`src/app/api/farmer/stats/route.js` (lines 31, 54, 78)**:
     ```javascript
     // Line 31:
     totalAmount: true,
     // Line 54:
     user: { select: { fullName: true } },
     // Line 78:
     const revenue = monthDelivered.reduce((s, o) => s + Number(o.totalAmount), 0);
     ```
   - **`prisma/schema.prisma` (lines 173, 630-631)**:
     ```prisma
     model Review {
       ...
       authorId String
       author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
     }
     ```
   - **Finding**:
     1. Field `totalAmount` on `Order` does not exist (`total` is the field name).
     2. Relation on `Review` is `author`, NOT `user`.
     Executing `GET /api/farmer/stats` throws `Unknown field user on model Review` and returns HTTP 500.

7. **Foreign Key Violation on Guest Product Checkout (`/api/orders`)**:
   - **`src/app/api/orders/route.js` (line 158)**:
     ```javascript
     sellerId: product.sellerId || "guest",
     ```
   - **`prisma/schema.prisma` (lines 207-208)**:
     ```prisma
     model OrderItem {
       ...
       sellerId String
       seller   User @relation("SellerOrderItems", fields: [sellerId], references: [id])
     }
     ```
   - **Finding**: `OrderItem.sellerId` has a foreign key constraint to `User.id`. For guest listings (where `product.sellerId` is `null`), `POST /api/orders` inserts string `"guest"`, causing PostgreSQL foreign key constraint violation `P2003` and failing checkout.

8. **Foreign Key Constraint Risk in Bulk Product Delete (`/api/products/bulk`)**:
   - **`src/app/api/products/bulk/route.js` (line 43)**:
     ```javascript
     result = await prisma.product.deleteMany({ where: { id: { in: targetIds } } });
     ```
   - **Finding**: Unlike `DELETE /api/products/[id]` which deletes dependent `OrderItem` rows first in a transaction, `deleteMany` in `bulk/route.js` will crash with error `P2003` if any selected product has existing order items.

---

## 2. Logic Chain

1. **Moderator Panel Logic**:
   - Observation: Moderator panel inputs rejection notes in state `rejectReason[product.id]` and posts payload `{ status: "REJECTED", adminNote: ... }`.
   - Deduction: Zod schema `productUpdateSchema` strips unknown keys, leaving `rejectionReason` undefined. The database update never receives the note.
   - Action needed: Update `ModeratorPanel.js` to send `rejectionReason` (or update `productUpdateSchema` / route handler to accept `adminNote` and map it to `rejectionReason`).

2. **Delivery Route Logic**:
   - Observation: `DeliveryDashboard` (`src/app/[locale]/dashboard/delivery/page.js`) makes PATCH requests to `/api/admin/orders/${id}`.
   - Deduction: `/api/admin/orders` does not exist in `src/app/api/admin`. Any status update attempt from DeliveryDashboard results in HTTP 404.
   - Action needed: Change the URL in `DeliveryDashboard` to `/api/orders/${id}`.

3. **Dashboard UI Structure Logic**:
   - Observation: `DashboardPage` has `const hasStore = true;` and unconditionally renders `StoreDashboard` and `BuyerPanel`.
   - Deduction: The page ignores user role and actual store existence, rendering duplicate/irrelevant UI panels and omitting `FarmerPanel`.
   - Action needed: Dynamically set `hasStore = !!(user?.store || user?.ownedStores?.length > 0)` and render `FarmerPanel` for users with role `"FARMER"`.

4. **API Route Schema Mismatches**:
   - Observation: `/api/stores/me/stats` and `/api/farmer/stats` query `totalAmount` on `Order` and `user` on `Review`.
   - Deduction: Prisma schema defines `total` on `Order` and `author` on `Review`. Prisma strict type validation throws runtime exceptions.
   - Action needed: Update field names in queries: `totalAmount` -> `total`, `user` -> `author`.

5. **Guest Order Foreign Key Logic**:
   - Observation: `/api/orders` falls back to `sellerId: "guest"` when `product.sellerId` is null.
   - Deduction: `OrderItem.sellerId` requires a valid `User.id` foreign key. String `"guest"` breaks database constraints.
   - Action needed: Ensure guest products handle order creation or seller attribution without violating FK constraints (e.g. referencing a system guest user or making `sellerId` nullable in schema / handling guest items).

---

## 3. Caveats

- **Uninvestigated Areas**: None within M1 Explorer 2 scope. M2 (Ad posting options), M3 (Premium features), M4 (Logo fallback), and M5 (AI Banner) were not evaluated as per milestone boundaries.
- **Assumptions**: The Prisma schema in `prisma/schema.prisma` is the source of truth for database model fields.

---

## 4. Conclusion

The Moderator and User panels contain several critical runtime bugs, schema mismatches, and broken references that prevent full functionality:
1. **Moderator Panel**: Rejection reason notes are lost due to payload key mismatch (`adminNote` vs `rejectionReason`); `limit` parameter is ignored.
2. **Delivery Panel**: Status updates fail with HTTP 404 due to pointing to a non-existent `/api/admin/orders/${id}` endpoint.
3. **Dashboard Page**: Hardcoded `hasStore` variable causes layout duplication and omits `FarmerPanel`.
4. **Dashboard APIs**: `/api/stores/me/stats`, `/api/farmer/stats`, and `/api/orders` crash on Prisma runtime execution due to invalid field names (`totalAmount`, `user`) and invalid foreign key values (`"guest"`).

Addressing these specific points during M1 repair will ensure 100% test pass rate and full panel stability.

---

## 5. Verification Method

To independently verify all findings:

1. **Verify Rejection Note Loss**:
   - Inspect `src/components/dashboard/ModeratorPanel.js` line 33 vs `src/lib/validators.js` line 207 vs `prisma/schema.prisma` line 562.
2. **Verify Delivery 404 Route**:
   - Check line 37 in `src/app/[locale]/dashboard/delivery/page.js` (`/api/admin/orders/${id}`) and verify that `src/app/api/admin/orders` directory does not exist.
3. **Verify Prisma Schema Crashes**:
   - Check `src/app/api/stores/me/stats/route.js` lines 26, 34, 54 (`totalAmount`) vs `prisma/schema.prisma` line 173 (`total`).
   - Check `src/app/api/farmer/stats/route.js` line 54 (`user`) vs `prisma/schema.prisma` line 630 (`author`).
4. **Verify Guest Checkout FK Violation**:
   - Check `src/app/api/orders/route.js` line 158 (`sellerId: "guest"`) vs `prisma/schema.prisma` lines 207-208 (`sellerId` references `User.id`).
