// =================================================================
// FERMERMARKET.AZ - BREND DETAL SƏHİFƏSİ (Loqo Ölçüsü & Layout Fix)
// =================================================================
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/ProductCard";
import { useSiteTexts } from "@/lib/siteTexts";

export default function BrandDetailPage() {
  const params = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useSiteTexts();

  useEffect(() => {
    if (!params.slug) return;
    apiFetch("/api/brands")
      .then(async (data) => {
        const found = (data.brands || []).find((b) => b.slug === params.slug);
        if (found) {
          const detail = await apiFetch(`/api/brands/${found.id}`);
          setBrand(detail.brand);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">{t("products.loading", "Yüklənir...")}</div>;
  }

  if (!brand) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Icon name="tag" size={48} strokeWidth={1} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{t("products.brandNotFound", "Brend tapılmadı")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-green-50 rounded-3xl p-6 md:p-8 mb-8 border border-emerald-100/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Loqo Qutusu - Düzəldilmiş Relative Ölçü */}
          <div className="relative w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center p-2.5 flex-shrink-0 overflow-hidden">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-3xl font-black text-emerald-600">{brand.name?.[0]}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">{brand.name}</h1>
              {brand.country && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100/70 text-emerald-800 px-3 py-1 rounded-full">
                  <Icon name="mapPin" size={12} /> {brand.country}
                </span>
              )}
            </div>

            {brand.description && (
              <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">{brand.description}</p>
            )}

            {brand.website && (
              <a
                href={brand.website.startsWith("http") ? brand.website : `https://${brand.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 text-xs font-bold hover:underline mt-3 inline-flex items-center gap-1"
              >
                <Icon name="globe" size={14} /> {brand.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Məhsullar Bölməsi */}
      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <Icon name="package" size={22} className="text-emerald-600" />
        {brand.name} {t("products.brandProductsSuffix", "məhsulları")}
      </h2>

      {brand.products?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {brand.products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                ...p,
                title: p.titleAz || p.title,
                coverImage: p.images?.[0]?.url || p.coverImage,
                currency: p.currency || "AZN",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
          <Icon name="package" size={48} strokeWidth={1} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium">{t("products.noProductsForBrand", "Bu brendə aid məhsul tapılmadı")}</p>
        </div>
      )}
    </div>
  );
}
