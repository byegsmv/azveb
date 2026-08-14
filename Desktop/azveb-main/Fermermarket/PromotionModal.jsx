// =================================================================
// FERMERMARKET.AZ - MAĞAZA VƏ MƏHSUL REKLAMI & ÖNƏ ÇIXARMA MODALI
// (Önə çıxar + Premium et + Canlı Bank/M10 məlumatları + Dekont Yükləmə)
// =================================================================
"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { apiFetch, getUser } from "@/lib/apiClient";
import { uploadFilesToBlob } from "@/lib/blobUpload";
import toast from "react-hot-toast";

const PROMOTION_TYPES = {
  PRODUCT_BOOST: {
    title: "Məhsulu Önə Çıxar",
    icon: "trendingUp",
    color: "from-emerald-600 to-teal-600",
    packages: [
      { id: "p_boost_7", days: 7, price: 5, label: "7 Günlük Önə Çıxarma (5 AZN)", desc: "Axtarış və kateqoriyada ən üst sıralarda görünür." },
      { id: "p_boost_15", days: 15, price: 10, label: "15 Günlük VIP Vitrin (10 AZN)", desc: "15 gün üst sıralarda + xüsusi vurğulanmış çərçivə." },
      { id: "p_boost_30", days: 30, price: 15, label: "30 Günlük Super Boost (15 AZN)", desc: "30 gün maksimum baxış və ən yüksək mövqe." },
    ],
  },
  STORE_PROMOTION: {
    title: "Mağazanı Önə Çıxar (Top 3 Vitrin)",
    icon: "store",
    color: "from-blue-600 to-indigo-600",
    packages: [
      { id: "s_promo_15", days: 15, price: 20, label: "15 Günlük Ana Səhifə Karuseli (20 AZN)", desc: "Ana səhifədəki 'Seçilmiş Mağazalar' karuselində ilk sıralarda." },
      { id: "s_promo_30", days: 30, price: 35, label: "30 Günlük VIP Mağaza Reklamı (35 AZN)", desc: "Ana səhifə karuseli + Mağazalar səhifəsində xüsusi vurğu." },
    ],
  },
  PREMIUM_BADGE: {
    title: "Məhsulu Premium Et",
    icon: "sparkles",
    color: "from-amber-500 to-orange-600",
    packages: [
      { id: "prem_30", days: 30, price: 10, label: "30 Günlük Premium Status (10 AZN)", desc: "Qızılı Premium çərçivə, güvən nişanı və xüsusi etiket." },
    ],
  },
};

export default function PromotionModal({ isOpen, onClose, targetType = "PRODUCT_BOOST", targetId, targetTitle }) {
  const [user, setUser] = useState(null);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const config = PROMOTION_TYPES[targetType] || PROMOTION_TYPES.PRODUCT_BOOST;

  useEffect(() => {
    if (!isOpen) return;
    setUser(getUser());
    setSelectedPackageId(config.packages[0]?.id || "");

    // Aktiv ödəniş rekvizitlərini gətir
    apiFetch("/api/admin/payment-accounts")
      .then((d) => {
        const accs = d.accounts?.filter((a) => a.isActive) || [];
        setPaymentAccounts(accs);
        if (accs.length > 0) setSelectedAccountId(accs[0].id);
      })
      .catch(() => {});
  }, [isOpen, targetType]);

  if (!isOpen) return null;

  const activePackage = config.packages.find((p) => p.id === selectedPackageId) || config.packages[0];
  const activeAccount = paymentAccounts.find((a) => a.id === selectedAccountId) || paymentAccounts[0];

  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReceipt(true);
    try {
      const data = await uploadFilesToBlob(file);
      const url = data?.images?.[0]?.url || data?.url;
      if (!url) throw new Error("Dekont yüklənmədi");
      setReceiptUrl(url);
      toast.success("Ödəniş qəbzi (dekont) yükləndi!");
    } catch (err) {
      toast.error(err.message || "Dekont şəkli yüklənərkən xəta baş verdi");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmitPromotion = async (e) => {
    e.preventDefault();
    if (!receiptUrl) {
      toast.error("Zəhmət olmasa bank ödəniş qəbzini (dekont) əlavə edin.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          type: targetType === "STORE_PROMOTION" ? "STORE_PROMOTION" : "SPONSORED_PRODUCT",
          title: `${config.title} - ${targetTitle || targetId}`,
          targetId,
          days: activePackage.days,
          price: activePackage.price,
          receiptUrl,
          paymentAccountTitle: activeAccount?.title,
        }),
      });

      toast.success("Reklam sorğunuz qəbul edildi! Admin təsdiqindən sonra aktivləşəcək.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Reklam sifarişində xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${config.color} text-white p-6 relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white text-lg font-bold">
            ✕
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-2">
            <Icon name={config.icon} size={14} /> Ödənişli Reklam & Vitrin
          </div>
          <h2 className="text-xl font-black">{config.title}</h2>
          {targetTitle && <p className="text-xs text-white/90 truncate mt-0.5">"{targetTitle}" üçün</p>}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Paket Seçimi */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Reklam Paketi Seçin
            </label>
            <div className="space-y-2.5">
              {config.packages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected ? "border-brand-600 bg-brand-50/40 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-gray-900 text-sm">{pkg.label}</h4>
                      <input type="radio" checked={isSelected} onChange={() => setSelectedPackageId(pkg.id)} className="text-brand-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{pkg.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Ödəniş Məlumatları (Bank / M10) */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Icon name="creditCard" size={16} className="text-amber-600" /> Ödəniş Üsulu
              </span>
              <span className="text-xs font-black text-amber-900 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                Məbləğ: {activePackage.price} AZN
              </span>
            </div>

            {paymentAccounts.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs font-bold text-gray-800 focus:outline-none"
                >
                  {paymentAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.bankName})
                    </option>
                  ))}
                </select>

                {activeAccount && (
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono font-bold text-gray-900 select-all">
                      <span>{activeAccount.accountNumber}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">{activeAccount.holderName} · {activeAccount.note}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Ödənişi M10 və ya Bank Kartı ilə həyata keçirə bilərsiniz.</p>
            )}
          </div>

          {/* Dekont Yükləmə */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Ödəniş Qəbzi / Dekont Şəkli *
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl transition">
                <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                <Icon name="upload" size={16} />
                {uploadingReceipt ? "Yüklənir..." : receiptUrl ? "Dekontu Dəyiş" : "Dekont Şəkli Seç"}
              </label>
              {receiptUrl && (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <Icon name="checkCircle" size={16} /> Qəbz hazırdır
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/50">
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-2xl">
            Ləğv et
          </button>
          <button
            onClick={handleSubmitPromotion}
            disabled={submitting || uploadingReceipt}
            className={`flex-1 py-3 bg-gradient-to-r ${config.color} text-white font-bold text-xs rounded-2xl shadow-lg transition active:scale-95 disabled:opacity-50`}
          >
            {submitting ? "Göndərilir..." : `Reklamı Sifariş Et (${activePackage.price} AZN)`}
          </button>
        </div>
      </div>
    </div>
  );
}
