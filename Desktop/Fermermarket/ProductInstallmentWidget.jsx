// =================================================================
// FERMERMARKET.AZ - BİRKART / TAMKART HİSSƏLİ ÖDƏNİŞ BİLƏŞƏNİ
// =================================================================
"use client";
import React, { useState } from "react";
import Icon from "@/components/ui/Icon";

export const INSTALLMENT_CARDS = [
  {
    id: "birkart",
    name: "BirKart (Kapital Bank)",
    color: "bg-red-600 text-white",
    badge: "18 ayadək",
    icon: "💳",
  },
  {
    id: "tamkart",
    name: "TamKart (ABB)",
    color: "bg-blue-700 text-white",
    badge: "18 ayadək",
    icon: "💳",
  },
  {
    id: "bolkart",
    name: "BolKart (Bank of Baku)",
    color: "bg-amber-600 text-white",
    badge: "12 ayadək",
    icon: "💳",
  },
  {
    id: "albalikart",
    name: "AlbalıKart (Unibank)",
    color: "bg-orange-600 text-white",
    badge: "12 ayadək",
    icon: "💳",
  },
];

export default function ProductInstallmentWidget({
  price = 0,
  allowInstallment = false,
  availableMonths = [3, 6, 12, 18],
  supportedCards = ["birkart", "tamkart", "bolkart"],
}) {
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0] || 6);

  if (!allowInstallment || !price || price <= 0) return null;

  const numPrice = Number(price);
  const monthlyPayment = (numPrice / selectedMonth).toFixed(2);

  return (
    <div className="w-full bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 rounded-2xl p-5 border border-emerald-200/80 shadow-sm my-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-600/20">
            %0
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
              Faizsiz Hissəli Ödəniş (Taksit)
            </h4>
            <p className="text-[11px] text-gray-500">BirKart, TamKart və BolKart ilə komissiyasız</p>
          </div>
        </div>

        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
          Ayda cəmi ₼{monthlyPayment}
        </span>
      </div>

      {/* Kart Seçimləri */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-100/60">
        <span className="text-xs text-gray-500 font-semibold mr-1">Dəstəklənən kartlar:</span>
        {INSTALLMENT_CARDS.filter((c) => supportedCards.includes(c.id)).map((card) => (
          <span
            key={card.id}
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm ${card.color}`}
          >
            {card.icon} {card.name.split(" ")[0]}
          </span>
        ))}
      </div>

      {/* Ay Seçimləri (Radio Pills) */}
      <div className="grid grid-cols-4 gap-2">
        {availableMonths.map((m) => {
          const isSelected = selectedMonth === m;
          const monthly = (numPrice / m).toFixed(2);
          return (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMonth(m)}
              className={`p-2.5 rounded-xl border text-center transition-all duration-200 ${
                isSelected
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-md font-bold scale-[1.02]"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/50"
              }`}
            >
              <div className="text-xs font-black">{m} Ay</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? "text-emerald-100" : "text-gray-500"}`}>
                ₼{monthly}/ay
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-white/80 p-2 rounded-xl border border-gray-100">
        <Icon name="info" size={14} className="text-emerald-600 shrink-0" />
        <span>İlkin ödənişsiz, 0% faiz və komissiyasız rəsmiləşdirilir.</span>
      </div>
    </div>
  );
}
