// ====================================================================================
// FERMERMARKET.AZ - ELAN YERLƏŞDİRMƏ SƏHİFƏSİ (AI, Brend, Endirim & 1-15-30 Gün Dəstəkli)
// ====================================================================================
"use client";
import Icon from "@/components/ui/Icon";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { apiFetch, getUser } from "@/lib/apiClient";
import { uploadFilesToBlob } from "@/lib/blobUpload";
import toast from "react-hot-toast";

// Standart kənd təsərrüfatı brendləri (Baza boş olduqda fallback kimi)
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
  { id: "brand_other", name: "Digər / Fərdi İstehsal", country: "" },
];

export default function PostListingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Əsas Form State
  const [form, setForm] = useState({
    titleAz: "",
    categoryId: "",
    brandId: "",
    price: "",
    originalPrice: "", // Endirimsiz əvvəlki qiymət (Endirim modulu)
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
    listingDuration: "30", // 1, 15, 30 günlük elan paketi
    promotionPackage: "standard", // standard, popular_15, vip_30
  });

  // AI Modal və köməkçi vəziyyətlər
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCategorySelect, setAiCategorySelect] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setUser(getUser());

    // 1. Kateqoriyaları yüklə
    apiFetch("/api/categories")
      .then((d) => {
        const flat = [];
        (d.categories || []).forEach((cat) => {
          if (cat.children && cat.children.length > 0) {
            cat.children.forEach((ch) => flat.push({ ...ch, nameAz: `${cat.nameAz || cat.name} › ${ch.nameAz || ch.name}` }));
          } else {
            flat.push(cat);
          }
        });
        setCategories(flat);
      })
      .catch(() => {});

    // 2. Brendləri yüklə (Boş olarsa DEFAULT_BRANDS istifadə et)
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
  }, []);

  // Endirim faizinin dinamik hesablanması
  const discountPercent =
    form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price)
      ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
      : null;

  // AI Modal vasitəsilə tam elan generasiyası
  const handleAiGenerateListing = async (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) {
      setAiError("Zəhmət olmasa, məhsul haqqında qısa məlumat yazın.");
      return;
    }
    setAiLoading(true);
    setAiError("");

    try {
      const res = await fetch("/api/ai/suggest-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: aiPrompt,
          category: aiCategorySelect,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI generasiya xətası baş verdi.");

      setForm((prev) => ({
        ...prev,
        titleAz: data.titleAz || data.title || prev.titleAz,
        descriptionAz: data.descriptionAz || data.description || prev.descriptionAz,
        tags: Array.from(new Set([...(prev.tags || []), ...(data.tags || [])])).slice(0, 10),
        price: data.suggestedPrice ? String(data.suggestedPrice) : prev.price,
        originalPrice: data.suggestedOriginalPrice ? String(data.suggestedOriginalPrice) : prev.originalPrice,
        unit: data.unit || prev.unit,
        categoryId: data.suggestedCategoryId || prev.categoryId,
        brandId: data.suggestedBrandId || prev.brandId,
      }));

      setIsAiModalOpen(false);
      setAiPrompt("");
      toast.success("AI elan məlumatlarını uğurla hazırladı!");
    } catch (err) {
      setAiError(err.message || "AI xidməti ilə əlaqə yaradıla bilmədi.");
    } finally {
      setAiLoading(false);
    }
  };

  // Başlıqdan avtomatik sürətli AI təsvir
  const handleQuickAiDesc = async () => {
    if (!form.titleAz.trim()) {
      toast.error("Əvvəlcə elan başlığını daxil edin.");
      return;
    }
    setAiLoading(true);
    try {
      const selectedCategoryName = categories.find((c) => c.id === form.categoryId)?.nameAz || "";
      const res = await fetch("/api/ai/suggest-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.titleAz,
          description: form.titleAz + " " + (form.descriptionAz || ""),
          category: selectedCategoryName,
          price: form.price,
          region: form.region,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          descriptionAz: data.descriptionAz || data.description || prev.descriptionAz,
          tags: Array.from(new Set([...(prev.tags || []), ...(data.tags || [])])).slice(0, 10),
        }));
        toast.success("AI təsvir və etiketlər yeniləndi!");
      }
    } catch (e) {
      toast.error("AI təsvir xətası baş verdi.");
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
          setError("Maksimum 10 etiket əlavə edə bilərsiniz");
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
        durationDays: Number(form.listingDuration) || 30,
        promotionPackage: form.promotionPackage,
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
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
        
        {/* Üst Başlıq & AI Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="tag" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Yeni Elan Yerləşdir</h1>
              <p className="text-xs text-gray-500 mt-0.5">Kənd təsərrüfatı məhsullarınızı və aqrotexnikanızı satın</p>
            </div>
          </div>

          {/* AI İlə Elan Yaz Düyməsi */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition active:scale-95 text-sm"
          >
            <Icon name="sparkles" size={18} className="text-yellow-200" />
            <span>AI ilə Elan Yaz</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-medium border border-red-100 flex items-center gap-2">
            <Icon name="alert-circle" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Başlıq və AI Təsvir Köməkçisi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Elan Başlığı <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleQuickAiDesc}
                disabled={aiLoading || !form.titleAz}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 transition disabled:opacity-50"
              >
                <Icon name="sparkles" size={13} className="text-amber-500" />
                {aiLoading ? "AI Hazırlayır..." : "AI ilə Təsvir Yarat"}
              </button>
            </div>
            <input
              type="text"
              required
              value={form.titleAz}
              onChange={(e) => setForm({ ...form, titleAz: e.target.value })}
              placeholder="Məsələn: Gədəbəy Təbii Kartofu, Belarus 82.1 Traktor və ya Azoksistrobin 250 SC"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          {/* Kateqoriya və Brend Bölməsi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Kateqoriya <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white transition"
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
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>İstehsalçı / Brend</span>
                <span className="text-[10px] text-gray-400 normal-case font-normal">(İxtiyari)</span>
              </label>
              <select
                value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-500 focus:bg-white transition"
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

          {/* Qiymət, Endirimli Qiymət və Ölçü Vahidi Modulu */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="dollar-sign" size={15} className="text-emerald-600" />
              Qiymət və Endirim Parametrləri
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Satış Qiyməti (AZN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Məs: 45.00"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-700 focus:outline-none focus:border-brand-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Əvvəlki Qiymət (AZN)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Endirim üçün</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="Məs: 60.00"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 line-through focus:outline-none focus:border-brand-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ölçü Vahidi
                </label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand-500 transition"
                >
                  <option value="ədəd">ədəd</option>
                  <option value="kq">kq</option>
                  <option value="ton">ton</option>
                  <option value="litr">litr</option>
                  <option value="hektar">hektar</option>
                  <option value="bağlama">bağlama</option>
                  <option value="kisə">kisə</option>
                </select>
              </div>
            </div>

            {/* Endirim Bildiriş Nişanı */}
            {discountPercent && discountPercent > 0 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-2 rounded-xl border border-amber-200">
                <Icon name="tag" size={14} className="text-amber-600" />
                <span>Bu elanda <strong>%{discountPercent} Endirim</strong> tətbiq olunacaq (Alıcıya {Number(form.originalPrice) - Number(form.price)} AZN qənaət göstərilir).</span>
              </div>
            ) : null}
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
              placeholder="Məhsulun xüsusiyyətləri, istifadə qaydası, saxlanma şəraiti və çatdırılma haqqında ətraflı qeyd edin..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          {/* Şəkillər */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Məhsul Şəkilləri (Maksimum 5 şəkil)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {form.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-200 hover:border-brand-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition bg-gray-50 hover:bg-emerald-50">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <Icon name="camera" size={24} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 mt-1 font-medium">{uploading ? "Yüklənir..." : "+ Şəkil əlavə et"}</span>
                </label>
              )}
            </div>
          </div>

          {/* Region və Şəhər */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Region / Rayon</label>
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                placeholder="Məs: Şəki, Quba, Qazax, Lənkəran"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Şəhər / Kənd / Ünvan</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Məs: Mərkəz, Baş Layısqı kəndi"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Etiketlər (Hashtags) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Açar Sözlər və Etiketlər
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                  #{tag}
                  <button type="button" onClick={() => removeTag(i)} className="text-emerald-500 hover:text-red-600 font-bold ml-0.5">✕</button>
                </span>
              ))}
            </div>
            <input
              placeholder="Etiket daxil edin və Enter basın (məs: gübrə, traktor, orqanik)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>

          {/* ==================================================================== */}
          {/* 1 - 15 - 30 GÜNLÜK ELAN VƏ TANITIM PAKETLƏRİ MODULU                   */}
          {/* ==================================================================== */}
          <div className="pt-4 border-t border-gray-200">
            <div className="mb-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Icon name="calendar" size={18} className="text-brand-600" />
                Elan Müddəti və Tanıtım Paketləri (1 - 15 - 30 Gün)
              </h3>
              <p className="text-xs text-gray-500 mt-1">Elanınızın saytda qalma müddətini və görünmə dərəcəsini seçin:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* 1 Günlük Paket */}
              <label className={`relative p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                form.listingDuration === "1"
                  ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}>
                <input
                  type="radio"
                  name="listingDuration"
                  value="1"
                  checked={form.listingDuration === "1"}
                  onChange={() => setForm({ ...form, listingDuration: "1", promotionPackage: "standard_1" })}
                  className="hidden"
                />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 text-sm">1 Günlük Elan</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Sınaq</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Standart axtarış və kateqoriya nəticələrində 24 saat aktiv yerləşdirmə.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">1 AZN / Pulsuz</span>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.listingDuration === "1" ? "border-emerald-600 bg-emerald-600" : "border-gray-300"}`}>
                    {form.listingDuration === "1" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>
              </label>

              {/* 15 Günlük Paket */}
              <label className={`relative p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between overflow-hidden ${
                form.listingDuration === "15"
                  ? "border-amber-500 bg-amber-50/50 shadow-md"
                  : "border-gray-200 hover:border-amber-300 bg-white"
              }`}>
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg tracking-wider">
                  FÜRSƏT
                </div>
                <input
                  type="radio"
                  name="listingDuration"
                  value="15"
                  checked={form.listingDuration === "15"}
                  onChange={() => setForm({ ...form, listingDuration: "15", promotionPackage: "popular_15" })}
                  className="hidden"
                />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-950 text-sm">15 Günlük Premium</span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Ana səhifədə "Fürsətlər" bölməsi + 5x daha çox alıcı baxışı.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800">5 AZN (500 Coin)</span>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.listingDuration === "15" ? "border-amber-600 bg-amber-600" : "border-gray-300"}`}>
                    {form.listingDuration === "15" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>
              </label>

              {/* 30 Günlük VIP Paket */}
              <label className={`relative p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between overflow-hidden ${
                form.listingDuration === "30"
                  ? "border-blue-600 bg-blue-50/50 shadow-md"
                  : "border-gray-200 hover:border-blue-300 bg-white"
              }`}>
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg tracking-wider">
                  ƏN ÇOX SEÇİLƏN
                </div>
                <input
                  type="radio"
                  name="listingDuration"
                  value="30"
                  checked={form.listingDuration === "30"}
                  onChange={() => setForm({ ...form, listingDuration: "30", promotionPackage: "vip_30" })}
                  className="hidden"
                />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-950 text-sm">30 Günlük VIP Vitrin</span>
                  </div>
                  <p className="text-xs text-blue-900/80 leading-relaxed">
                    1 ay tam aktivlik, axtarışlarda 1-ci sırada görünmə və sosial media önə çıxarılması.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between">
                  <span className="text-xs font-black text-blue-800">10 AZN (1000 Coin)</span>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.listingDuration === "30" ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                    {form.listingDuration === "30" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>
              </label>

            </div>
          </div>

          {/* Qonaq İstifadəçi Əlaqə Məlumatları (Əgər giriş etməyibsə) */}
          {!user && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-3">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="user" size={15} className="text-amber-700" />
                Əlaqə Məlumatlarınız (Qonaq İstifadəçi)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Adınız və Soyadınız *"
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Əlaqə / WhatsApp Nömrəniz (+994...) *"
                  value={form.guestPhone}
                  onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Göndər Düyməsi */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-4 rounded-2xl shadow-xl transition active:scale-98 disabled:opacity-50 text-base tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>Yerləşdirilir...</span>
              </>
            ) : (
              <>
                <Icon name="check-circle" size={20} />
                <span>Elanı Dərhal Yerləşdir</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ==================================================================== */}
      {/* AI İLƏ ELAN YAZ - MODAL PƏNCƏRƏSİ                                    */}
      {/* ==================================================================== */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsAiModalOpen(false);
                setAiError("");
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Icon name="sparkles" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">AI ilə Elan Yaz</h3>
                <p className="text-xs text-gray-500">Məhsulunuzu sadə sözlərlə təsvir edin, süni intellekt elanı hazırlasın.</p>
              </div>
            </div>

            {aiError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                {aiError}
              </div>
            )}

            <form onSubmit={handleAiGenerateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Məhsul Haqqında Qısa Məlumat (Azərbaycan dilində)
                </label>
                <textarea
                  required
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Məsələn: Qubadan təbii alma satıram, sort Palmet, şirindir, 5 tondur, 1 kq qiyməti 1.20 AZN, əvvəl 1.50 AZN idi. Topdan da verilir."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Məqsədli Kateqoriya (İxtiyari)
                </label>
                <select
                  value={aiCategorySelect}
                  onChange={(e) => setAiCategorySelect(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
                >
                  <option value="">Kateqoriyanı AI özü müəyyən etsin</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.nameAz || c.name}>
                      {c.nameAz || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl shadow-lg transition active:scale-98 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>AI Elanı Təhlil Edir...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkles" size={16} />
                      <span>Elanı Avtomatik Doldur</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
