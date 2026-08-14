// =================================================================
// FERMERMARKET.AZ - MODAL Z-INDEX & HEADER OVERLAY FIX
// =================================================================

// 1. Header.jsx Fix (z-index'i z-30 olarak ayarlayın)
// src/components/Header.jsx
export function HeaderFixSnippet() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      {/* Header İçeriği */}
    </header>
  );
}

// 2. Modal / AgroServiceModal.jsx Fix (z-index'i z-[9999] yapın)
// src/components/AgroServiceModal.jsx (veya ilgili Modal bileşeni)
export function ModalFixSnippet({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop Koyu Arka Plan Gölgesi */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Pencere Kutusu */}
      <div className="relative z-[10000] w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 my-8 max-h-[85vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-gray-900">Sorğu Gönder</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
