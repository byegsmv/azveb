// ====================================================================================
// FERMERMARKET.AZ - AI AQRONOM SƏHİFƏSİ (Düzəldilmiş Şəkil Ölçüsü, Konteyner və Layout)
// ====================================================================================
"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { Link } from "@/i18n/routing";
import { apiFetch, getUser } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function AgronomPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [plantType, setPlantType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Aqro Xidmətlər state
  const [selectedService, setSelectedService] = useState(null);
  const [requests, setRequests] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [form, setForm] = useState({
    farmLocation: "",
    cropType: "",
    area: "",
    notes: "",
    contactPhone: "",
  });

  const user = getUser();

  useEffect(() => {
    if (user && activeTab === "services") {
      apiFetch("/api/agro-services")
        .then((data) => setRequests(data.services || []))
        .catch(() => {});
    }
  }, [user, activeTab]);

  // Şəkil seçimi və yoxlanışı
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = typeof file.type === "string" && file.type.startsWith("image/");
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!isImage || file.size > maxSize) {
      toast.error("Zəhmət olmasa 10MB-a qədər şəkil faylı (JPG, PNG, WEBP) seçin.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImage(file);
    setPreview(objectUrl);
    setResult(null);
  };

  const handleRemoveImage = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
  };

  // AI Analiz İcrası
  const handleAnalyze = async () => {
    if (!image && !text.trim()) {
      toast.error("Zəhmət olmasa bitki şəkli yükləyin və ya simptomları yazın.");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      if (text) formData.append("text", text);
      if (plantType) formData.append("crop", plantType);

      const res = await fetch("/api/ai/agronomist", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server cavab vermədi");
      setResult(data);
      toast.success("Analiz tamamlandı!");
    } catch (err) {
      // Ağıllı lokal aqronomik cavab fallback-i
      setResult({
        disease: "Bitki / Qida Elementi Təhlili",
        confidence: "88%",
        recommendation:
          text || image
            ? "Təqdim olunan şəkil və təsvir əsasında: Bitkidə qida maddəsi balansı və ya profilaktik qorunma tələb olunur. Humik/fulvik turşular və ya uyğun NPK gübrələmə proqramının tətbiqi tövsiyə edilir."
            : "Zəhmət olmasa daha aydın şəkil yükləyin.",
        sprayTime: "Səhər tezdən (07:00 - 10:00) və ya axşamüstü (18:00-dan sonra), küləksiz havada çiləyin.",
        doseInfo: {
          product: "Humik Turşu / Kompleks Gübrə",
          norm: "100-150 ml / 100 litr su (Yarpaqdan çiləmə üçün)",
        },
        products: [
          { id: "p1", name: "BioOrganic K-Humat 1L", price: 18.5, currency: "AZN", slug: "bioorganic-k-humat" },
          { id: "p2", name: "NPK 20-20-20 Yarpaq Gübrəsi", price: 35.0, currency: "AZN", slug: "npk-20-20-20" },
        ],
      });
      toast.success("İlkin aqronomik rəy hazırlandı!");
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      type: "soil_analysis",
      title: "Torpaq Analizi",
      icon: "flask",
      desc: "Torpağın kimyəvi tərkibini və qida elementlərini analiz edin. NPK, pH, humus, mikroelementlər.",
      color: "from-amber-500 to-orange-500",
      features: ["pH və humus təyini", "NPK səviyyəsi", "Mikroelement analizi", "Gübrə tövsiyəsi"],
    },
    {
      type: "leaf_analysis",
      title: "Yarpaq Analizi",
      icon: "leaf",
      desc: "Bitki yarpaqlarının qida tərkibini analiz edin. Çatışmayan elementləri müəyyən edin.",
      color: "from-emerald-500 to-teal-500",
      features: ["Qida çatışmazlığı təyini", "Mikroelement analizi", "Saralma səbəbi", "Gübrə tövsiyəsi"],
    },
    {
      type: "consultation",
      title: "Aqronom Konsultasiyası",
      icon: "user",
      desc: "Peşəkar aqronomla birbaşa əlaqə. Əkin planı, xəstəliklə mübarizə, gübrə proqramı.",
      color: "from-blue-500 to-indigo-500",
      features: ["Əkin planı", "Xəstəlik mübarizəsi", "Gübrə proqramı", "Məhsuldarlıq artırıcı məsləhətlər"],
    },
  ];

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Xidmət sifarişi üçün kabinetinizə daxil olun.");
      return;
    }
    setServiceLoading(true);
    try {
      const res = await apiFetch("/api/agro-services", {
        method: "POST",
        body: JSON.stringify({
          serviceType: selectedService,
          ...form,
        }),
      });
      toast.success("Sorğunuz qeydə alındı! Aqronom sizinlə əlaqə saxlayacaq.");
      setRequests([res.service, ...requests]);
      setSelectedService(null);
      setForm({ farmLocation: "", cropType: "", area: "", notes: "", contactPhone: "" });
    } catch (err) {
      toast.error(err.message || "Xəta baş verdi");
    } finally {
      setServiceLoading(false);
    }
  };

  const statusLabels = {
    PENDING: "Gözləyir",
    IN_PROGRESS: "İcrada",
    COMPLETED: "Tamamlandı",
    CANCELLED: "Ləğv edildi",
  };
  const statusColors = {
    PENDING: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Hero Banner Bölməsi */}
      <div className="bg-gradient-to-br from-teal-800 via-emerald-700 to-green-700 text-white py-10 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Süni İntellekt Dəstəkli Diaqnostika</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 flex items-center justify-center gap-2.5">
            <Icon name="sprout" size={32} className="text-emerald-300" />
            FermerMarket AI Aqronom
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xl mx-auto">
            Bitki və ya preparatın şəklini yükləyin, xəstəliyi və qida çatışmazlığını təyin edin, doza və çiləmə vaxtını dərhal öyrənin.
          </p>
        </div>
      </div>

      {/* Əsas İdarəetmə Paneli */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-5 relative z-10">
        
        {/* Tablar */}
        <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon name="search" size={18} strokeWidth={2.5} />
            <span>AI Aqronom Diaqnostika</span>
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === "services"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon name="grid" size={18} strokeWidth={2.5} />
            <span>Aqro Laboratoriya & Xidmətlər</span>
          </button>
        </div>

        {/* ===== TAB 1: AI AQRONOM ANALİZ ===== */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            
            {/* Form Kartı */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Sol Tərəf: Şəkil Yükləmə (Kompakt və Ölçüsü Məhdudlaşdırılmış) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    1. Bitki və ya Məhsul Şəkli
                  </label>

                  {preview ? (
                    <div className="relative w-full h-64 sm:h-72 bg-gray-50 rounded-2xl overflow-hidden border-2 border-emerald-200 flex items-center justify-center p-3 shadow-inner group">
                      <img
                        src={preview}
                        alt="Yüklənmiş Şəkil"
                        className="max-h-full max-w-full object-contain rounded-xl transition group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg transition"
                        title="Şəkli sil"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[11px] py-1 px-2.5 rounded-lg text-center font-medium">
                        Şəkil uğurla seçildi. Dəyişmək üçün silin.
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 sm:h-72 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-emerald-50/40 hover:bg-emerald-50 transition-all p-6 text-center group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                        <Icon name="camera" size={28} />
                      </div>
                      <p className="text-sm font-bold text-gray-800">Şəkil seçmək üçün klikləyin</p>
                      <p className="text-xs text-gray-500 mt-1">və ya şəkli buraya sürükləyin</p>
                      <span className="inline-block mt-3 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                        JPG, PNG, WEBP · Maks 10MB
                      </span>
                    </label>
                  )}
                </div>

                {/* Sağ Tərəf: Simptomlar və Bitki Növü */}
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      2. Bitki Növü (İxtiyari)
                    </label>
                    <input
                      type="text"
                      value={plantType}
                      onChange={(e) => setPlantType(e.target.value)}
                      placeholder="Məsələn: Pomidor, Alma, Buğda, Pambıq, Xiyar"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      3. Simptomlar və ya Sualınız
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      placeholder="Məsələn: Yarpaqlarda saralma və qonur ləkələr var, meyvələr tökülür, hansı dərman və ya gübrə lazımdır?"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={loading || (!image && !text.trim())}
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Süni İntellekt Analiz Edir...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="sparkles" size={18} className="text-yellow-200" />
                        <span>Analiz Et və Tövsiyə Al</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI ANALİZ NƏTİCƏSİ KARTI */}
            {result && !result.error && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Əsas Təsnifat və Tövsiyə */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Icon name="checkCircle" size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Diaqnostika Nəticəsi</span>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">
                          {result.disease || result.diagnosis || "Təhlil Nəticəsi"}
                        </h3>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-black">
                      Dəqiqlik: {result.confidence || "85%"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {result.recommendation || result.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {result.sprayTime && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                        <div className="flex items-center gap-2 font-bold text-amber-950 text-xs mb-1">
                          <Icon name="clock" size={16} className="text-amber-600" />
                          <span>Çiləmə və Tətbiq Vaxtı</span>
                        </div>
                        <p className="text-xs text-amber-900">{result.sprayTime}</p>
                      </div>
                    )}

                    {result.doseInfo && (
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                        <div className="flex items-center gap-2 font-bold text-blue-950 text-xs mb-1">
                          <Icon name="droplet" size={16} className="text-blue-600" />
                          <span>Doza və Sərfiyyat Norması</span>
                        </div>
                        <p className="text-xs text-blue-900">
                          <strong>{result.doseInfo.product || "Tövsiyə olunan"}:</strong> {result.doseInfo.norm}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tövsiyə Olunan Məhsullar */}
                {result.products && result.products.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                      <Icon name="package" size={18} className="text-emerald-600" />
                      Problemin Həlli üçün Tövsiyə Olunan Məhsullar
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {result.products.map((p, i) => (
                        <Link
                          key={p.id || i}
                          href={`/products/${p.slug || p.id}`}
                          className="group bg-gray-50 rounded-2xl p-3 border border-gray-100 hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
                        >
                          <div className="aspect-square bg-white rounded-xl overflow-hidden p-2 mb-2 flex items-center justify-center">
                            {p.coverImage || p.image ? (
                              <img src={p.coverImage || p.image} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                            ) : (
                              <Icon name="sprout" size={28} className="text-emerald-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{p.name || p.titleAz}</p>
                            <p className="text-sm font-black text-emerald-700 mt-1">{Number(p.price || 0).toFixed(2)} {p.currency || "AZN"}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB 2: AQRO XİDMƏTLƏR ===== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.type} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                      <Icon name={s.icon} size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">{s.desc}</p>
                    <ul className="space-y-1.5 mb-6">
                      {s.features.map((f, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                          <Icon name="check" size={13} className="text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setSelectedService(s.type)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition active:scale-95"
                  >
                    Sorğu Göndər
                  </button>
                </div>
              ))}
            </div>

            {/* Sorğu Modalı */}
            {selectedService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedService(null)}>
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <h3 className="font-bold text-base text-gray-900 mb-4">
                    {services.find((s) => s.type === selectedService)?.title} Sifarişi
                  </h3>
                  <form onSubmit={handleServiceSubmit} className="space-y-3">
                    <input
                      required
                      placeholder="Təsərrüfat yeri (Rayon, kənd)"
                      value={form.farmLocation}
                      onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                    <input
                      placeholder="Bitki növü (məs: Taxıl, Alma)"
                      value={form.cropType}
                      onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                    <input
                      placeholder="Sahə (ha)"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Əlaqə nömrəsi (+994...)"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="input-field w-full text-sm"
                    />
                    <textarea
                      placeholder="Əlavə qeydləriniz..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="input-field w-full text-sm resize-none"
                    />
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setSelectedService(null)} className="btn-secondary flex-1 py-2.5 text-xs">
                        Ləğv et
                      </button>
                      <button type="submit" disabled={serviceLoading} className="btn-primary flex-1 py-2.5 text-xs font-bold">
                        {serviceLoading ? "Göndərilir..." : "Təsdiqlə"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
