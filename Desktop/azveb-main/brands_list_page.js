// =================================================================
// FERMERMARKET.AZ - BRENDLƏR SİYAHISI SƏHİFƏSİ
// =================================================================
"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { apiFetch } from "@/lib/apiClient";
import Icon from "@/components/ui/Icon";
import { useSiteTexts } from "@/lib/siteTexts";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useSiteTexts();

  useEffect(() => {
    apiFetch("/api/brands?withProducts=true")
      .then((data) => setBrands(data.brands || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-xl w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
          <Icon name="award" size={28} className="text-emerald-600" />
          {t("products.brandsTitle", "İstehsalçılar və Brendlər")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("products.brandsSubtitle", "Rəsmi aqrar distribütor brendləri və istehsalçı şirkətlər")}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col items-center text-center justify-between"
          >
            <div className="relative w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 group-hover:bg-emerald-50/50 p-2 overflow-hidden transition-colors">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-2xl font-black text-emerald-600">{brand.name?.[0]}</span>
              )}
            </div>

            <div className="w-full">
              <h3 className="font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors text-sm truncate">
                {brand.name}
              </h3>
              {brand.country && <p className="text-[11px] text-gray-400 mt-0.5">{brand.country}</p>}
            </div>

            {brand._count?.products > 0 ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-3">
                {brand._count.products} məhsul
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 mt-3">Kataloq</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
