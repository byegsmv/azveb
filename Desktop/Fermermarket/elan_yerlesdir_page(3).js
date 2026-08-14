// =================================================================
// FERMERMARKET.AZ - ELAN YERLƏŞDİRMƏ SƏHİFƏSİ (Brend & Endirim Dəstəkli)
// =================================================================
"use client";
import Icon from "@/components/ui/Icon";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { apiFetch, getUser } from "@/lib/apiClient";
import { uploadFilesToBlob } from "@/lib/blobUpload";
import toast from "react-hot-toast";

export default function PostListingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    titleAz: "",
    categoryId: "",
    brandId: "",
    price: "",
    originalPrice: "", // Endirimsiz əvvəlki qiymət
    stock: 1,
    region: "",
    city: "",
    descriptionAz: "",
    images: [],
    guestName: "",
    guestPhone: "",
    tags: [],
    unit: "ədəd",
    isCorporate: false,
    wholesalePrice: "",
    wholesaleMinQty: "",
    allowRetail: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setUser(getUser());

    // 1. Kateqoriyaları gətir
    apiFetch("/api/categories")
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});

    // 2. Aktiv Brendləri gətir
    apiFetch("/api/brands")
      .then((d) => setBrands(d.brands || []))
      .catch(() => {});
  }, []);

  // AI ilə başlıqdan avtomatik təsvir yazılması
  const handleTitleBlur = async () => {
    if (!form.titleAz.trim()) return;
    setAiLoading(true);
    try {
      const selectedCategoryName = categories.find((c) => c.id === form.categoryId)?.name || "";
      const res = await fetch("/api/ai/suggest-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.titleAz + " " + (form.descriptionAz || ""),
          category: selectedCategoryName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          descriptionAz: data.descriptionAz || data.description || prev.descriptionAz,
          tags: Array.from(new Set([...(prev.tags || []), ...(data.tags || [])])).slice(0, 10),
        }));
        toast.success("AI tərəfindən təsvir təklif edildi!");
      }
    } catch (e) {
      console.warn("AI təsvir xətası:", e.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Şəkil yükləmə
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (form.images.length + files.length > 5) {
      setError("Maksimum 5 şəkil əlavə edə bilərsiniz");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const data = await uploadFilesToBlob(files);
      const newImages = [...form.images, ...data.images].slice(0, 5);
      setForm((prev) => ({ ...prev, images: newImages }));
      toast.success("Şəkillər yükləndi");
    } catch (err) {
      setError(err.message || "Şəkil yüklənmədi");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, "");
      if (trimmed && !form.tags.includes(trimmed)) {
        if (form.tags.length >= 10) {
          setError("Maksimum 10 teq əlavə edə bilərsiniz");
          return;
        }
        setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
        setTagInput("");
      }
    }
  };

  const removeTag = (idx) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        titleAz: form.titleAz,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock) || 1,
        categoryId: form.categoryId,
        brandId: form.brandId || undefined,
        region: form.region || undefined,
        city: form.city || undefined,
        descriptionAz: form.descriptionAz || undefined,
        images: form.images,
        tags: form.tags,
        unit: form.unit,
        isCorporate: form.isCorporate,
        allowRetail: form.isCorporate ? form.allowRetail : true,
        wholesalePrice: form.isCorporate && form.wholesalePrice ? Number(form.wholesalePrice) : undefined,
        wholesaleMinQty: form.isCorporate && form.wholesaleMinQty ? Number(form.wholesaleMinQty) : undefined,
        guestName: !user ? form.guestName : undefined,
        guestPhone: !user ? form.guestPhone : undefined,
      };

      const res = await apiFetch("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Elanınız uğurla yerləşdirildi!");
      router.push(`/products/${res.product?.slug || ""}`);
    } catch (err) {
      setError(err.message || "Elan yerləşdirilərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Icon name="tag" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Yeni Elan Yerləşdir</h1>
            <p className="text-xs text-gray-500 mt-0.5">Kənd təsərrüfatı məhsul və avadanlığınızı satın</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlıq */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Elan Başlığı *
            </label>
            <input
              type="text"
              required
              value={form.titleAz}
              onChange={(e) => setForm({ ...form, titleAz: e.target.value })}
              onBlur={handleTitleBlur}
              placeholder="Məsələn: Pomidor toxumu F1 və ya Belarus 82.1 Traktor"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
            {aiLoading && <p className="text-xs text-brand-600 mt-1 animate-pulse">AI təsvir hazırlayır...</p>}
          </div>

          {/* Kateqoriya və Brend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Kateqoriya *
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              >
                <option value="">Kateqoriya seçin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAz || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                İstehsalçı / Brend (İxtiyari)
              </label>
              <select
                value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              >
                <option value="">Brend seçin (Seçilməyib)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.country ? `(${b.country})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Qiymət və Endirimli Qiymət */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Satış Qiyməti (AZN) *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Endirimsiz Əvvəlki Qiymət (AZN)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="Məs: 50.00"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-500 focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Ölçü Vahidi
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              >
                <option value="ədəd">ədəd</option>
                <option value="kq">kq</option>
                <option value="ton">ton</option>
                <option value="litr">litr</option>
                <option value="hektar">hektar</option>
                <option value="bağlama">bağlama</option>
              </select>
            </div>
          </div>

          {/* Təsvir */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Ətraflı Məlumat / Təsvir
            </label>
            <textarea
              rows={4}
              value={form.descriptionAz}
              onChange={(e) => setForm({ ...form, descriptionAz: e.target.value })}
              placeholder="Məhsulun keyfiyyəti, saxlanma şəraiti və çatdırılma haqqında məlumat..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          {/* Şəkillər */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Məhsul Şəkilləri (Maks 5)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {form.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-200 hover:border-brand-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition bg-gray-50 hover:bg-emerald-50">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <Icon name="camera" size={24} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 mt-1">{uploading ? "Yüklənir..." : "Əlavə et"}</span>
                </label>
              )}
            </div>
          </div>

          {/* Region və Şəhər */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Region</label>
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                placeholder="Məs: Şəki, Quba, Gəncə"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Şəhər / Kənd</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Məs: Mərkəz, Baş Layısqı"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg transition active:scale-98 disabled:opacity-50"
          >
            {loading ? "Yerləşdirilir..." : "Elanı Dərhal Yerləşdir"}
          </button>
        </form>
      </div>
    </div>
  );
}
