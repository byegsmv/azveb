"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import ImageUploader from "@/components/ImageUploader";
import Icon from "@/components/ui/Icon";
import MessagingPanel from "@/components/chat/MessagingPanel";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import CatalogPanel from "@/components/dashboard/CatalogPanel";

const STATUS_LABELS = {
  DRAFT: "Qaralama",
  PENDING_REVIEW: "Təsdiq gözləyir",
  ACTIVE: "Aktiv",
  SOLD: "Satılıb",
  EXPIRED: "Vaxtı bitib",
  REJECTED: "Rədd edilib",
};

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING_REVIEW: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-brand-100 text-brand-800",
  SOLD: "bg-blue-100 text-blue-800",
  EXPIRED: "bg-gray-100 text-gray-500",
  REJECTED: "bg-red-100 text-red-700",
};

const ORDER_STATUS_LABELS = {
  PENDING: "Gözləyir",
  PAID: "Ödənilib",
  PROCESSING: "Hazırlanır",
  SHIPPED: "Göndərilib",
  DELIVERED: "Çatdırılıb",
  CANCELLED: "Ləğv edilib",
  REFUNDED: "Geri qaytarılıb",
};

const NEXT_STATUS = {
  PAID: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const DEFAULT_BRANDS = [
  { id: "brand_gilan", name: "Gilan Agro", country: "Azərbaycan" },
  { id: "brand_azersun", name: "Azersun Agro", country: "Azərbaycan" },
  { id: "brand_syngenta", name: "Syngenta", country: "İsveçrə" },
  { id: "brand_bayer", name: "Bayer CropScience", country: "Almaniya" },
  { id: "brand_basf", name: "BASF Agro", country: "Almaniya" },
  { id: "brand_sector", name: "Sector Tarım", country: "Türkiyə" },
  { id: "brand_bioorganic", name: "BioOrganic", country: "Azərbaycan" },
  { id: "brand_hektas", name: "Hektaş", country: "Türkiyə" },
  { id: "brand_yara", name: "Yara Gübrə", country: "Norveç" },
  { id: "brand_belarus", name: "Belarus Traktor (MTZ)", country: "Belarus" },
];

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pushStatus, setPushStatus] = useState("idle");

  async function handleSubscribePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("error");
      return;
    }
    setPushStatus("loading");
    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuB-5bsyNxYEuaYEQR74Gcw2bM",
        });
      }

      const res = await apiFetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("p256dh")))),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("auth")))),
          },
        }),
      });
      if (res.subscription) setPushStatus("success");
    } catch (err) {
      console.error(err);
      setPushStatus("error");
    }
  }

  useEffect(() => {
    apiFetch("/api/farmer/stats")
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse h-20 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) return <div className="card p-6 text-center text-gray-400">Statistika yüklənmədi</div>;

  const maxRevenue = Math.max(...(stats.monthlyRevenue || []).map((m) => m.revenue), 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand-700">₼{Number(stats.totalRevenue || 0).toLocaleString("az-AZ")}</p>
          <p className="caption mt-1">Pul Kisəsi Balansı</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.activeListings || 0}</p>
          <p className="caption mt-1">Aktiv Elan</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.monthlyOrderCount || 0}</p>
          <p className="caption mt-1">Bu Ay Sifariş</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{stats.avgRating || "—"}</p>
          <p className="caption mt-1">Ortalama Reytinq</p>
        </div>
      </div>

      {pushStatus !== "success" && (
        <div className="card p-4 bg-brand-50 border border-brand-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-brand-900">Yeni Sifariş və Mesaj Bildirişləri</h3>
            <p className="text-xs text-brand-700 mt-1">Tarayıcıda bildirişləri açaraq yeniliklərdən dərhal xəbərdar olun.</p>
          </div>
          <button
            onClick={handleSubscribePush}
            disabled={pushStatus === "loading"}
            className="btn-primary text-xs px-4 py-2 shrink-0 shadow-sm"
          >
            {pushStatus === "loading" ? "Gözləyin..." : pushStatus === "error" ? "Xəta oldu" : "Bildirişləri Aç"}
          </button>
        </div>
      )}

      {stats.monthlyRevenue?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4">Aylıq Gəlir (son 6 ay)</h3>
          <div className="space-y-2">
            {stats.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12 shrink-0">{m.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${Math.max((m.revenue / maxRevenue) * 100, m.revenue > 0 ? 5 : 0)}%` }}
                  >
                    {m.revenue > 0 && <span className="text-white text-[10px] font-bold">₼{Math.round(m.revenue)}</span>}
                  </div>
                </div>
                <span className="text-xs font-semibold w-16 text-right text-gray-600">{m.count} sif.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FarmerPanel Əsas Komponenti ──────────────────────────────────────────────
export default function FarmerPanel({ user }) {
  const [tab, setTab] = useState("products");
  
  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Məhsul formu (originalPrice və brand dəstəkli)
  const [form, setForm] = useState({
    titleAz: "",
    price: "",
    originalPrice: "",
    stock: 1,
    categoryId: "",
    brandId: "",
    region: "",
    city: "",
    descriptionAz: "",
    images: [],
    isCorporate: false,
    minOrderQty: "",
    tags: [],
    allowInstallment: false,
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Sifarişlər, Pul kisəsi, Bağlamalar
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [walletMsg, setWalletMsg] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [bundlesLoading, setBundlesLoading] = useState(false);
  const [bundlesError, setBundlesError] = useState("");
  const [bundlesMsg, setBundlesMsg] = useState("");
  const [bundleForm, setBundleForm] = useState({ title: "", description: "", discountType: "PERCENTAGE", discountValue: "", productIds: [] });
  const [bundleSubmitting, setBundleSubmitting] = useState(false);

  // 1-15-30 Günlük Tanıtım Modalı
  const [promoteModal, setPromoteModal] = useState(null);
  const [promoteLoading, setPromoteLoading] = useState(false);

  const _store = user?.store || user?.ownedStores?.[0];
  const [storeSettingsForm, setStoreSettingsForm] = useState({
    name: _store?.name || "",
    description: _store?.description || "",
    address: _store?.address || "",
    phone: _store?.phone || "",
    whatsapp: _store?.whatsapp || "",
    installmentEnabled: _store?.installmentEnabled || false,
    installmentWhatsapp: _store?.installmentWhatsapp || "",
    logoUrl: _store?.logoUrl || "",
  });
  const [storeSettingsLoading, setStoreSettingsLoading] = useState(false);
  const [storeSettingsMsg, setStoreSettingsMsg] = useState("");
  const [storeSettingsError, setStoreSettingsError] = useState("");

  useEffect(() => {
    // Kateqoriyalar
    apiFetch("/api/categories")
      .then((d) => {
        const flat = [];
        (d.categories || []).forEach((cat) => {
          if (cat.children && cat.children.length > 0) {
            cat.children.forEach((ch) => flat.push({ ...ch, name: `${cat.name} › ${ch.name}` }));
          } else {
            flat.push(cat);
          }
        });
        setCategories(flat);
      })
      .catch(() => {});

    // Brendlər
    apiFetch("/api/brands")
      .then((d) => {
        if (d.brands && d.brands.length > 0) {
          setBrands(d.brands);
        } else {
          setBrands(DEFAULT_BRANDS);
        }
      })
      .catch(() => {
        setBrands(DEFAULT_BRANDS);
      });

    loadMyProducts();
  }, []);

  useEffect(() => {
    if (tab === "orders") loadOrders();
    if (tab === "wallet") loadWallet();
    if (tab === "bundles") loadBundles();
  }, [tab]);

  function loadMyProducts() {
    apiFetch("/api/products?mine=1&pageSize=50")
      .then((d) => setMyProducts(d.products || []))
      .catch(() => {});
  }

  function loadOrders() {
    setOrdersLoading(true);
    setOrdersError("");
    apiFetch("/api/orders?view=selling")
      .then((d) => setOrders(d.orders || []))
      .catch((e) => setOrdersError(e.message))
      .finally(() => setOrdersLoading(false));
  }

  // AI ilə başlıqdan sürətli təsvir
  async function handleAiAssist() {
    if (!form.titleAz) {
      setError("Əvvəlcə məhsul adını yazın");
      return;
    }
    setAiLoading(true);
    setError("");
    try {
      const catName = categories.find((c) => c.id === form.categoryId)?.name || "";
      const data = await apiFetch("/api/ai/suggest-listing", {
        method: "POST",
        body: JSON.stringify({ title: form.titleAz, category: catName, price: form.price, region: form.region }),
      });
      setForm((f) => ({
        ...f,
        descriptionAz: data.descriptionAz || data.description || f.descriptionAz,
        tags: data.tags || f.tags || [],
      }));
      setMsg("AI təsviri hazırladı!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  // AI Modal göndərişi
  async function handleAiSubmit(e) {
    e.preventDefault();
    if (!aiDescription.trim()) {
      setAiError("Zəhmət olmasa, məhsulunuzu qısaca təsvir edin");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const data = await apiFetch("/api/ai/suggest-listing", {
        method: "POST",
        body: JSON.stringify({ description: aiDescription, category: aiCategory }),
      });
      setForm((f) => ({
        ...f,
        titleAz: data.titleAz || data.title || f.titleAz,
        descriptionAz: data.descriptionAz || data.description || f.descriptionAz,
        tags: data.tags || f.tags || [],
        price: data.suggestedPrice !== undefined ? String(data.suggestedPrice) : f.price,
        originalPrice: data.suggestedOriginalPrice !== undefined ? String(data.suggestedOriginalPrice) : f.originalPrice,
      }));
      setIsAiModalOpen(false);
      setAiDescription("");
      setAiCategory("");
      setMsg("AI elanı tərtib etdi!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        storeId: (_store?.id || user?.store?.id) || undefined,
        titleAz: form.titleAz,
        price: form.price ? Number(form.price) : 0,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: form.stock !== "" && form.stock !== null ? Number(form.stock) : 1,
        categoryId: form.categoryId,
        region: form.region || undefined,
        city: form.city || undefined,
        descriptionAz: form.descriptionAz || undefined,
        images: form.images || [],
        isCorporate: !!form.isCorporate,
        minOrderQty: form.isCorporate && form.minOrderQty ? parseInt(form.minOrderQty, 10) : null,
        brandId: form.brandId || undefined,
        tags: form.tags || [],
        allowInstallment: !!form.allowInstallment,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });
      await apiFetch("/api/products", { method: "POST", body: JSON.stringify(payload) });
      setMsg("Elan yaradıldı! Admin təsdiqindən sonra aktivləşəcək.");
      setForm({
        titleAz: "",
        price: "",
        originalPrice: "",
        stock: 1,
        categoryId: "",
        brandId: "",
        region: "",
        city: "",
        descriptionAz: "",
        images: [],
        isCorporate: false,
        minOrderQty: "",
        tags: [],
        allowInstallment: false,
      });
      loadMyProducts();
    } catch (err) {
      const details = err.details ? Object.values(err.details).flat().join(" · ") : "";
      setError(details || err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({
      titleAz: p.titleAz || p.title,
      price: p.price,
      originalPrice: p.originalPrice || "",
      stock: p.stock,
      region: p.region || "",
      city: p.city || "",
      images: p.images || (p.coverImage ? [{ url: p.coverImage }] : []),
      allowInstallment: p.allowInstallment || false,
    });
  }

  async function saveEdit(id) {
    setError("");
    try {
      const payload = {
        storeId: (_store?.id || user?.store?.id) || undefined,
        titleAz: editForm.titleAz,
        price: editForm.price ? Number(editForm.price) : 0,
        originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
        stock: editForm.stock !== "" && editForm.stock !== null ? Number(editForm.stock) : 1,
        region: editForm.region || undefined,
        city: editForm.city || undefined,
        images: editForm.images || [],
        allowInstallment: !!editForm.allowInstallment,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k];
      });
      await apiFetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setMsg("Elan yeniləndi.");
      setEditingId(null);
      loadMyProducts();
    } catch (err) {
      const details = err.details ? Object.values(err.details).flat().join(" · ") : "";
      setError(details || err.message);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Bu elanı silmək istədiyinizə əminsiniz?")) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: "DELETE" });
      setMyProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleProductStatus(id, status) {
    setError("");
    try {
      const { product } = await apiFetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMyProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: product.status } : p)));
    } catch (err) {
      setError(err.message);
    }
  }

  // 1-15-30 Günlük Tanıtım Seçimi
  async function promoteProduct(packageId) {
    setPromoteLoading(true);
    setError("");
    try {
      await apiFetch(`/api/products/${promoteModal}/promote`, {
        method: "POST",
        body: JSON.stringify({ packageId }),
      });
      setMsg("Elan uğurla Premium edildi!");
      setPromoteModal(null);
      setTimeout(() => setMsg(""), 3000);
      loadMyProducts();
      loadWallet();
    } catch (err) {
      setError(err.message);
    } finally {
      setPromoteLoading(false);
    }
  }

  function loadWallet() {
    setWalletLoading(true);
    setWalletError("");
    apiFetch("/api/wallet")
      .then((d) => setWallet(d.wallet))
      .catch((e) => setWalletError(e.message))
      .finally(() => setWalletLoading(false));
  }

  function loadBundles() {
    setBundlesLoading(true);
    setBundlesError("");
    apiFetch("/api/bundles?sellerId=" + user.id)
      .then((d) => setBundles(d.bundles || []))
      .catch((e) => setBundlesError(e.message))
      .finally(() => setBundlesLoading(false));
  }

  return (
    <div className="space-y-6">
      {/* Tab Naviqasiyası */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: "overview", label: "Ümumi Baxış" },
          { id: "products", label: "Elanlarım" },
          { id: "orders", label: "Sifarişlərim" },
          { id: "bundles", label: "Bağlamalar" },
          { id: "wallet", label: "Pul Kisəm" },
          { id: "messages", label: "Mesajlar" },
          { id: "analytics", label: "Analitika" },
          ...((user?.store || user?.ownedStores?.length > 0) ? [{ id: "catalog", label: "Məhsullarım" }] : []),
          ...((user?.store || user?.ownedStores?.length > 0) ? [{ id: "settings", label: "Mağazam" }] : []),
          ...((!user?.store && !user?.ownedStores?.length) ? [{ id: "create-store", label: "Mağaza Aç" }] : []),
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab user={user} />}
      {tab === "catalog" && <CatalogPanel user={user} />}

      {tab === "products" && (
        <div className="space-y-6">
          {/* Yeni Elan Yerləşdir Kartı */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2 text-gray-900">
                <Icon name="plus" size={20} /> Yeni Elan Yerləşdir
              </h2>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="btn-secondary !py-1.5 px-3 flex items-center gap-1.5 text-xs font-bold shrink-0 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl transition"
              >
                <Icon name="sparkles" size={15} className="text-amber-600" />
                AI ilə Doldur
              </button>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2.5 mb-3">{error}</p>}
            {msg && <p className="text-sm text-brand-700 bg-brand-50 rounded-lg p-2.5 mb-3">{msg}</p>}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex gap-2 items-center">
                <input
                  required
                  placeholder="Məhsul adı (məs: Gübrə NPK 20-20-20, Quba Alması)"
                  className="input-field flex-1"
                  value={form.titleAz}
                  onChange={(e) => setForm({ ...form, titleAz: e.target.value })}
                />
              </div>

              {/* Qiymət, Endirimsiz Qiymət və Stok */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Satış Qiyməti (AZN) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="input-field w-full font-bold text-emerald-700"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Əvvəlki Qiymət (Endirim üçün)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Məs: 50.00"
                    className="input-field w-full text-gray-500"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Mövcud Stok *</label>
                  <input
                    required
                    type="number"
                    placeholder="1"
                    className="input-field w-full"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              {/* Endirim Bildirişi */}
              {form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price) && (
                <div className="text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                  <Icon name="tag" size={14} className="text-amber-600" />
                  %{Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)} Endirim tətbiq olunacaq!
                </div>
              )}

              {/* Kateqoriya və Brend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  required
                  className="input-field"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  <option value="">Kateqoriya seçin *</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="input-field"
                  value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                >
                  <option value="">İstehsalçı / Brend (İxtiyari)</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.country ? `(${b.country})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Region / Rayon" className="input-field" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                <input placeholder="Şəhər / Kənd" className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>

              <ImageUploader value={form.images} onChange={(images) => setForm({ ...form, images })} />

              <div className="relative">
                <textarea
                  placeholder="Məhsul haqqında ətraflı təsvir..."
                  rows={3}
                  className="input-field"
                  value={form.descriptionAz}
                  onChange={(e) => setForm({ ...form, descriptionAz: e.target.value })}
                />
                <button
                  type="button"
                  onClick={handleAiAssist}
                  disabled={aiLoading}
                  className="text-xs text-brand-700 hover:text-brand-900 font-semibold mt-1 flex items-center gap-1"
                >
                  <Icon name="sparkles" size={13} className="text-amber-500" />
                  {aiLoading ? "AI yazır..." : "AI ilə avtomatik təsvir yaz"}
                </button>
              </div>

              <button disabled={loading} className="btn-primary w-full py-3 font-bold">
                {loading ? "Göndərilir..." : "Elanı Yerləşdir"}
              </button>
            </form>
          </div>

          {/* Mənim Elanlarım Siyahısı */}
          <div className="card p-5">
            <h2 className="font-bold mb-3">Mənim Elanlarım</h2>
            {myProducts.length === 0 ? (
              <p className="text-sm text-gray-400">Hələ elanınız yoxdur.</p>
            ) : (
              <div className="space-y-3">
                {myProducts.map((p) => (
                  <div key={p.id} className="border-b border-gray-100 pb-3">
                    {editingId === p.id ? (
                      <div className="space-y-2">
                        <input className="input-field" value={editForm.titleAz} onChange={(e) => setEditForm({ ...editForm, titleAz: e.target.value })} />
                        <div className="grid grid-cols-3 gap-2">
                          <input type="number" step="0.01" placeholder="Qiymət" className="input-field" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                          <input type="number" step="0.01" placeholder="Əvvəlki Qiymət" className="input-field" value={editForm.originalPrice} onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })} />
                          <input type="number" placeholder="Stok" className="input-field" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveEdit(p.id)} className="btn-primary text-sm px-3 py-1.5">Yadda saxla</button>
                          <button onClick={() => setEditingId(null)} className="btn-secondary text-sm px-3 py-1.5">Ləğv et</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.title || p.titleAz}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`tag-badge ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                              {STATUS_LABELS[p.status] || p.status}
                            </span>
                            <span className="text-xs text-gray-400">Stok: {p.stock}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-brand-700">{p.price} AZN</span>
                            <button onClick={() => startEdit(p)} className="text-xs font-semibold text-gray-600 hover:text-brand-700">Redaktə</button>
                            <button onClick={() => deleteProduct(p.id)} className="text-xs font-semibold text-red-600 hover:text-red-800">Sil</button>
                          </div>
                          {["ACTIVE", "SOLD", "EXPIRED"].includes(p.status) && (
                            <div className="flex items-center gap-2">
                              {p.status === "ACTIVE" && (
                                <button onClick={() => setPromoteModal(p.id)} className="text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                  ⭐ 1-15-30 Günlük Tanıt
                                </button>
                              )}
                              {p.status !== "SOLD" && (
                                <button onClick={() => toggleProductStatus(p.id, "SOLD")} className="text-[11px] font-semibold text-blue-700">Satıldı kimi qeyd et</button>
                              )}
                              {p.status !== "EXPIRED" && (
                                <button onClick={() => toggleProductStatus(p.id, "EXPIRED")} className="text-[11px] font-semibold text-gray-500">Deaktiv et</button>
                              )}
                              {p.status !== "ACTIVE" && (
                                <button onClick={() => toggleProductStatus(p.id, "ACTIVE")} className="text-[11px] font-semibold text-brand-700">Aktivləşdir</button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI İLƏ ELAN YAZ MODALI */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => {
                setIsAiModalOpen(false);
                setAiError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <Icon name="sparkles" size={18} className="text-amber-500" /> AI ilə Elan Yaz
            </h3>
            <p className="text-xs text-gray-500 mb-4">Məhsul haqqında danışın, AI başlığı, təsviri və qiyməti doldursun.</p>

            {aiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2 mb-3">{aiError}</p>}

            <form onSubmit={handleAiSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Məhsulun qısa təsviri</label>
                <textarea
                  required
                  rows={4}
                  className="input-field"
                  placeholder="Məs: Şəkidən təmiz kənd balı, 1 kq 25 AZN, çatdırılma pulsuz..."
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                />
              </div>
              <button type="submit" disabled={aiLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {aiLoading ? "AI təhlil edir..." : "Doldur və Tətbiq Et"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1 - 15 - 30 GÜNLÜK TANITIM MODALI */}
      {promoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setPromoteModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">
              &times;
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Icon name="sparkles" size={20} className="text-amber-500" />
              <span>Premium Tanıtım Paketləri</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">Elanınızın görünmə müddətini və dərəcəsini seçin:</p>

            <div className="space-y-3">
              {/* 1 Günlük */}
              <button
                disabled={promoteLoading}
                onClick={() => promoteProduct("1")}
                className="w-full text-left p-3.5 border border-gray-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-gray-900 text-sm">1 Günlük Sınaq Tanıtımı</p>
                  <p className="text-xs text-gray-500">100 Coin və ya 1 AZN</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Seç</span>
              </button>

              {/* 15 Günlük */}
              <button
                disabled={promoteLoading}
                onClick={() => promoteProduct("2")}
                className="w-full relative text-left p-3.5 border-2 border-amber-400 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 transition flex justify-between items-center"
              >
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">FÜRSƏT</div>
                <div>
                  <p className="font-bold text-amber-950 text-sm">15 Günlük Premium Tanıtım</p>
                  <p className="text-xs text-amber-800">500 Coin və ya 5 AZN</p>
                </div>
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">Seç</span>
              </button>

              {/* 30 Günlük */}
              <button
                disabled={promoteLoading}
                onClick={() => promoteProduct("3")}
                className="w-full relative text-left p-3.5 border-2 border-blue-500 rounded-2xl bg-blue-50/60 hover:bg-blue-100/80 transition flex justify-between items-center"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">VIP VİTRİN</div>
                <div>
                  <p className="font-bold text-blue-950 text-sm">30 Günlük VIP Vitrin</p>
                  <p className="text-xs text-blue-800">1000 Coin və ya 10 AZN</p>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">Seç</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
