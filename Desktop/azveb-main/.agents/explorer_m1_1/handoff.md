# Explorer Investigation Report: FermerMarket Panel UI & Backend Modules Survey

## 1. Observation

### Codebase Structure & File Paths Inspected
- **Super Admin & Admin Panel Component**: `src/components/dashboard/AdminPanel.js` (2012 lines)
- **Moderator Panel Component**: `src/components/dashboard/ModeratorPanel.js` (141 lines)
- **Buyer Panel Component**: `src/components/dashboard/BuyerPanel.js` (694 lines)
- **Farmer Panel Component**: `src/components/dashboard/FarmerPanel.js` (1424 lines)
- **Store Dashboard Component**: `src/components/dashboard/store/StoreDashboard.js` (841 lines)
- **Delivery Partner Panel Component**: `src/components/dashboard/DeliveryPanel.js` (172 lines)
- **Sub-components & Utilities**:
  - `src/components/dashboard/store/StoreSettings.js` (719 lines)
  - `src/components/dashboard/store/ProductGrid.js`
  - `src/components/dashboard/store/ProductFilters.js`
  - `src/components/dashboard/store/StoreSidebar.js`
  - `src/components/dashboard/store/StoreProfileHeader.js`
  - `src/components/dashboard/store/StoreAnalytics.js`
  - `src/components/dashboard/AISettingsManager.js`
  - `src/components/dashboard/SiteTextsManager.js`
  - `src/components/dashboard/BrandsManager.js`
  - `src/components/dashboard/EmailManager.js`
  - `src/components/dashboard/AnalyticsPanel.js`
  - `src/components/dashboard/CatalogPanel.js`
  - `src/components/admin/ModuleToggleSystem.js`
  - `src/components/admin/PageBuilder.js`
- **Page Routes Inspected**:
  - `src/app/[locale]/admin/page.js`
  - `src/app/[locale]/dashboard/page.js`
  - `src/app/api/products/[id]/route.js`
  - `src/lib/validators.js`

### Verbatim Tool Command Results
- Execution of `npm test`:
  ```
  Test Suites: 3 passed, 3 total
  Tests:       198 passed, 198 total
  Snapshots:   0 total
  Time:        8.093 s
  Ran all test suites.
  ```
  *(Note: Tests in `__tests__/e2e/` pass, but dedicated component/unit test coverage for panel components is currently absent).*

### Specific Discovered Code Errors & Mismatches
1. **Unbound ReferenceError in `FarmerPanel.js`**:
   - Location: `src/components/dashboard/FarmerPanel.js`, lines 531–567 and 1107–1152.
   - Code snippet:
     ```js
     function toggleBundleProduct(productId) {
       setBundleForm((f) => {
         const has = f.productIds.includes(productId);
         return { ...f, productIds: has ? f.productIds.filter((id) => id !== productId) : [...f.productIds, productId] };
       });
     }
     ```
   - Verbatim Observation: `bundleForm`, `setBundleForm`, `bundleSubmitting`, and `setBundleSubmitting` are invoked in functions `toggleBundleProduct` and `submitBundle`, but `const [bundleForm, setBundleForm]` and `const [bundleSubmitting, setBundleSubmitting]` were never declared in `FarmerPanel`'s `useState` declarations (lines 226–272).
   - Consequence: Attempting to create or modify bundles in `FarmerPanel` throws a runtime `ReferenceError: setBundleForm is not defined`.

2. **Rejection Reason Field Name Mismatch in `ModeratorPanel.js`**:
   - Location: `src/components/dashboard/ModeratorPanel.js`, line 33.
   - Code snippet:
     ```js
     const body = action === "ACTIVE"
       ? { status: "ACTIVE" }
       : { status: "REJECTED", adminNote: rejectReason[productId] || "Rədd edildi" };
     ```
   - Location in Schema: `src/lib/validators.js`, line 207:
     ```js
     export const productUpdateSchema = productRawSchema.partial().extend({
       status: z.enum(["DRAFT", "PENDING_REVIEW", "ACTIVE", "SOLD", "EXPIRED", "REJECTED"]).optional(),
       rejectionReason: z.string().max(500).optional().nullable(),
     });
     ```
   - Verbatim Observation: `ModeratorPanel.js` sends payload key `adminNote`, whereas `productUpdateSchema` and `/api/products/[id]/route.js` expect `rejectionReason`. Zod strips `adminNote` during `safeParse`.
   - Consequence: Rejection notes typed by moderators are dropped during request validation and never saved to the database.

3. **Hardcoded Store Flag in `DashboardPage`**:
   - Location: `src/app/[locale]/dashboard/page.js`, line 63:
     ```js
     const hasStore = true;
     ```
   - Verbatim Observation: `hasStore` is hardcoded to `true` for all logged-in users regardless of whether `user.store` or `user.ownedStores` exists.
   - Consequence: `StoreDashboard` mounts for non-store buyer accounts, attempting an API fetch to `/api/stores/me` which fails, resulting in duplicate store creation forms rendering on the buyer dashboard.

4. **Hardcoded Mock VAPID Key in `FarmerPanel.js`**:
   - Location: `src/components/dashboard/FarmerPanel.js`, line 60:
     ```js
     applicationServerKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuB-5bsyNxYEuaYEQR74Gcw2bM"
     ```
   - Consequence: Web Push subscription fails in real environments due to public VAPID key mismatch with server credentials.

5. **Unsafe Object Traversal in `AdminPanel.js` (`WalletWithdrawalsManager`)**:
   - Location: `src/components/dashboard/AdminPanel.js`, lines 819, 823–824:
     ```js
     {r.wallet?.user?.fullName?.[0]||"?"}
     <p className="caption">{r.wallet?.user?.email}</p>
     ```
   - Consequence: If a withdrawal record lacks an associated user object (`r.wallet.user === null`), component rendering throws `TypeError: Cannot read properties of null`.

---

## 2. Logic Chain

1. **Premise 1**: A complete exploration of all panel UI modules requires inspecting the entry routes (`/admin`, `/dashboard`), the main panel components (`AdminPanel`, `ModeratorPanel`, `BuyerPanel`, `FarmerPanel`, `StoreDashboard`, `DeliveryPanel`), and their API route integration handlers.
2. **Premise 2**: Tracing state declarations and API payload structures in `FarmerPanel.js` revealed that functions `toggleBundleProduct` and `submitBundle` attempt to mutate `bundleForm` state. Because `bundleForm` was omitted from `useState` initializations on lines 226–272, runtime execution guaranteed an unhandled `ReferenceError`.
3. **Premise 3**: Tracing the payload execution path from `ModeratorPanel.js` to `/api/products/[id]/route.js` showed that the moderator panel posts `{ adminNote }`. Because the backend validator `productUpdateSchema` strictly accepts `{ rejectionReason }`, Zod filters out `adminNote`. Thus, rejection reason persistence fails.
4. **Premise 4**: In `DashboardPage` (`src/app/[locale]/dashboard/page.js`), `hasStore` is set to `true` unconditionally. This forces `StoreDashboard` to execute for pure Buyer accounts, triggering unauthenticated `/api/stores/me` calls and rendering redundant UI elements.
5. **Premise 5**: Resolving these identified defects and establishing comprehensive unit and integration tests across Super Admin, Admin, Moderator, and User panels will fulfill Milestone 1 requirements and achieve 100% test pass rate.

---

## 3. Caveats

- **Uninvestigated Areas**: Production push notification delivery with live VAPID keys was not executed against a live browser notification service (mock key observation only).
- **Assumptions**: Existing E2E test suites in `__tests__/e2e/` pass against mock database fixtures, but component unit tests in React environment (`@testing-library/react`) for dashboard components need to be expanded.
- **Alternative Interpretations**: `hasStore` hardcoding might have been a temporary developer shortcut to preview `StoreDashboard`, but it violates multi-role UI boundary isolation.

---

## 4. Conclusion

All panel UI and backend modules in FermerMarket have been located, inspected, and cataloged. Five concrete bugs/inconsistencies were discovered:
1. `FarmerPanel.js`: Missing `bundleForm` and `bundleSubmitting` `useState` initializations causing runtime `ReferenceError`.
2. `ModeratorPanel.js`: Payload key `adminNote` instead of `rejectionReason` causing lost rejection reasons.
3. `DashboardPage`: Hardcoded `hasStore = true` forcing `StoreDashboard` onto Buyer accounts.
4. `FarmerPanel.js`: Hardcoded mock VAPID key.
5. `AdminPanel.js`: Missing optional chaining on `r.wallet?.user` in withdrawal manager.

---

## 5. Verification Method & Worker Repair Strategy

### Independent Verification Commands
```bash
# 1. Run full Jest test suite
npm test

# 2. Run Next.js compilation check
npx next build
```

### Step-by-Step Worker Repair Strategy
1. **Source Code Fixes**:
   - Update `src/components/dashboard/FarmerPanel.js`:
     - Add `const [bundleForm, setBundleForm] = useState({ title: "", description: "", discountType: "PERCENTAGE", discountValue: "", productIds: [] });`
     - Add `const [bundleSubmitting, setBundleSubmitting] = useState(false);`
     - Update VAPID key reference to use environment variable fallback.
   - Update `src/components/dashboard/ModeratorPanel.js`:
     - Change payload in `handleAction`: `{ status: "REJECTED", rejectionReason: rejectReason[productId] || "Rədd edildi" }`.
   - Update `src/app/[locale]/dashboard/page.js`:
     - Compute `const hasStore = !!(user?.store || user?.ownedStores?.length > 0);`.
   - Update `src/components/dashboard/AdminPanel.js`:
     - Add safe optional chaining `r.wallet?.user?.email` and `r.wallet?.user?.phone`.

2. **Automated Unit & Integration Test Suites**:
   - Create unit tests covering Super Admin, Admin, Moderator, and User panels:
     - `__tests__/panel-admin.test.js`: Super Admin & Admin module toggles, role changes, user status updates, category CRUD, ad slot configuration, slider reordering.
     - `__tests__/panel-moderator.test.js`: Moderator queue fetching, approval, and rejection with `rejectionReason`.
     - `__tests__/panel-user.test.js`: Buyer panel order history & favorites, Farmer panel product & bundle creation, Store settings save, Delivery panel order completion.

3. **Final Gate Verification**:
   - Execute `npm test` and verify 100% pass rate.
   - Confirm clean lint/build status.
