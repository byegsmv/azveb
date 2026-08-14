// =================================================================
// FERMERMARKET.AZ - ADMİN DİNAMİK XİDMƏT VƏ REKLAM QİYMƏTLƏRİ PANELİ
// =================================================================
"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { apiFetch } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function PricingManager() {
  const [pricing, setPricing] = useState({
    ad_1d_price: 0,
    ad_15d_price: 7,
    ad_30d_price: 10,
    boost_7d_price: 5,
    boost_15d_price: 10,
    boost_30d_price: 15,
    store_promo_15d_price: 20,
    store_promo_30d_price: 35,
    premium_badge_30d_price: 10,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/pricing");
      if (data.pricing) {
        setPricing(data.pricing);
      }
    } catch (err) {
      toast.error("Qiymətlər yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setPricing((prev) => ({
      ...prev,
      [key]: Number(value) >= 0 ? Number(value) : 0,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/api/admin/pricing", {
        method: "POST",
        body: JSON.stringify({ pricing }),
      });
      toast.success("Bütün xidmət və reklam qiymətləri uğurla yeniləndi!");
    } catch (err) {
      toast.error("Qiymətlər yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Icon name="tag" size={24} className="text-brand-600" />
            Reklam və Xidmət Qiymətləri İdarəsi
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Saytdakı bütün elan, məhsul önə çıxarma və mağaza reklam paketlərinin qiymətlərini istədiyiniz vaxt buradan dəyişə bilərsiniz.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="btn-primary text-xs flex items-center gap-2 py-3 px-6 rounded-2xl font-bold shadow-md"
        >
          <Icon name="save" size={16} />
          {saving ? "Yadda saxlanılır..." : "Qiymətləri Yadda Saxla"}
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 bg-white rounded-3xl border border-gray-100">
          Yüklənir...
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Elan Paketləri */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                📦
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Elan Paketləri</h3>
                <p className="text-[11px] text-gray-500">Müddətə görə qiymətlər</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">1 Günlük Elan (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.ad_1d_price}
                onChange={(e) => handleChange("ad_1d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Tövsiyə: 0 AZN (Pulsuz)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">15 Günlük Standart (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.ad_15d_price}
                onChange={(e) => handleChange("ad_15d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">30 Günlük Premium (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.ad_30d_price}
                onChange={(e) => handleChange("ad_30d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* 2. Məhsul Önə Çıxarma */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                🚀
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Məhsulu Önə Çıxarma (Boost)</h3>
                <p className="text-[11px] text-gray-500">Axtarışda ilk sıralar</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">7 Günlük Önə Çıxarma (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.boost_7d_price}
                onChange={(e) => handleChange("boost_7d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">15 Günlük VIP Vitrin (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.boost_15d_price}
                onChange={(e) => handleChange("boost_15d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">30 Günlük Super Boost (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.boost_30d_price}
                onChange={(e) => handleChange("boost_30d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* 3. Mağaza Reklamı və Premium */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                ⭐
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Mağaza Reklamı & Status</h3>
                <p className="text-[11px] text-gray-500">Ana səhifə karuseli və nişanlar</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">15 Günlük Mağaza Karuseli (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.store_promo_15d_price}
                onChange={(e) => handleChange("store_promo_15d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">30 Günlük VIP Mağaza Reklamı (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.store_promo_30d_price}
                onChange={(e) => handleChange("store_promo_30d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">30 Günlük Premium Status (AZN)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricing.premium_badge_30d_price}
                onChange={(e) => handleChange("premium_badge_30d_price", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
