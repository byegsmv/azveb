// =================================================================
// FERMERMARKET.AZ - ADMİN BANK KARTI VƏ M10 İDARƏETMƏ PANELİ
// =================================================================
"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { apiFetch } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function PaymentAccountsManager() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAccount, setNewAccount] = useState({
    type: "CARD",
    title: "Bank Kartı",
    accountNumber: "",
    holderName: "",
    bankName: "",
    note: "",
    isActive: true,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/payment-accounts");
      setAccounts(data.accounts || []);
    } catch (err) {
      toast.error("Ödəniş rekvizitləri yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = (id) => {
    const updated = accounts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    setAccounts(updated);
    saveAccounts(updated);
  };

  const handleDelete = (id) => {
    if (!confirm("Bu ödəniş rekvizitini silmək istədiyinizdən əminsiniz?")) return;
    const updated = accounts.filter((a) => a.id !== id);
    setAccounts(updated);
    saveAccounts(updated);
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!newAccount.accountNumber || !newAccount.title) {
      toast.error("Başlıq və hesab/kart nömrəsi tələb olunur");
      return;
    }

    const created = {
      ...newAccount,
      id: `acc_${Date.now()}`,
    };

    const updated = [...accounts, created];
    setAccounts(updated);
    saveAccounts(updated);
    setShowAddModal(false);
    setNewAccount({
      type: "CARD",
      title: "Bank Kartı",
      accountNumber: "",
      holderName: "",
      bankName: "",
      note: "",
      isActive: true,
    });
  };

  const saveAccounts = async (listToSave) => {
    setSaving(true);
    try {
      await apiFetch("/api/admin/payment-accounts", {
        method: "POST",
        body: JSON.stringify({ accounts: listToSave }),
      });
      toast.success("Ödəniş rekvizitləri uğurla yadda saxlanıldı!");
    } catch (err) {
      toast.error("Yadda saxlanılarkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Icon name="creditCard" size={24} className="text-brand-600" />
            Ödəniş və Bank Rekvizitləri İdarəsi
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            İstifadəçilərin elan, mağaza və məhsul reklamı ödənişləri üçün gördükləri Bank Kartı və M10 hesablarını idarə edin.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs flex items-center gap-2 py-2.5 px-4 rounded-2xl"
        >
          <Icon name="plus" size={16} /> Yeni Hesab / Kart Əlavə Et
        </button>
      </div>

      {/* Siyahı */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 bg-white rounded-3xl border border-gray-100">
          Yüklənir...
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 bg-white rounded-3xl border border-gray-100">
          Heç bir ödəniş hesabı əlavə edilməyib.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-6 rounded-3xl border-2 transition-all relative bg-white shadow-sm flex flex-col justify-between ${
                acc.isActive ? "border-brand-500/70" : "border-gray-200 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-50 text-brand-700">
                    {acc.type === "CARD" ? "💳 Bank Kartı" : acc.type === "M10" ? "📱 M10 Cüzdan" : "🏦 Bank Hesabı"}
                  </span>

                  <button
                    onClick={() => handleToggleActive(acc.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl transition ${
                      acc.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {acc.isActive ? "Aktiv" : "Deaktiv"}
                  </button>
                </div>

                <h3 className="font-extrabold text-gray-900 text-base mb-1">{acc.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{acc.bankName} {acc.holderName ? `· ${acc.holderName}` : ""}</p>

                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 font-mono text-sm font-bold text-gray-800 tracking-wider mb-3 select-all">
                  {acc.accountNumber}
                </div>

                {acc.note && <p className="text-[11px] text-gray-500 italic mb-4">{acc.note}</p>}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-xl transition"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Əlavə Et Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="font-black text-gray-900 text-lg">Yeni Ödəniş Rekviziti Əlavə Et</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Növ</label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-brand-500"
                >
                  <option value="CARD">Bank Kartı (C2C)</option>
                  <option value="M10">M10 Hesabı</option>
                  <option value="TERMINAL">Terminal / Digər</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Başlıq</label>
                <input
                  type="text"
                  required
                  value={newAccount.title}
                  onChange={(e) => setNewAccount({ ...newAccount, title: e.target.value })}
                  placeholder="Məs: Kapital Bank (BirBank)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kart / Hesab / M10 Nömrəsi</label>
                <input
                  type="text"
                  required
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  placeholder="4169 7388 0000 0000 və ya 050 000 00 00"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bank Adı</label>
                  <input
                    type="text"
                    value={newAccount.bankName}
                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                    placeholder="Məs: Kapital Bank"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hesab Sahibi</label>
                  <input
                    type="text"
                    value={newAccount.holderName}
                    onChange={(e) => setNewAccount({ ...newAccount, holderName: e.target.value })}
                    placeholder="Məs: FermerMarket MMC"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Qeyd (İstifadəçiyə görünən)</label>
                <input
                  type="text"
                  value={newAccount.note}
                  onChange={(e) => setNewAccount({ ...newAccount, note: e.target.value })}
                  placeholder="Məs: Komissiyasız köçürmə"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl text-sm"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 btn-primary text-sm font-bold rounded-2xl"
                >
                  {saving ? "Saxlanılır..." : "Əlavə Et"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
