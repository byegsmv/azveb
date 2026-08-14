// =================================================================
// FERMERMARKET.AZ - INTERACTIVE MAP COMPONENT (Leaflet & OpenStreetMap)
// =================================================================
// No paid Google Maps API key required; OpenStreetMap works out-of-the-box!
import { useEffect, useState } from "react";

export default function InteractiveMap({ salesPoints = [], onSelectPoint }) {
  const [points, setPoints] = useState(salesPoints);

  useEffect(() => {
    // Fetch sales points from API if not provided in props
    if (salesPoints.length === 0) {
      fetch("/api/sales-points")
        .then((res) => res.json())
        .then((data) => {
          if (data.salesPoints) setPoints(data.salesPoints);
        })
        .catch((err) => console.error("Map fetch error:", err));
    }
  }, [salesPoints]);

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">📍 İnteraktiv Satış Nöqtələri və Mağazalar Xəritəsi</h3>
      <p className="text-sm text-gray-500 mb-4">
        Azərbaycan üzrə fermer mağazaları, toxum və gübrə satış nöqtələrinin ünvanları.
      </p>

      {/* Leaflet / OpenStreetMap Container */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        <iframe
          title="FermerMarket Satış Nöqtələri Xəritəsi"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=44.8,38.8,51.0,41.9&layer=mapnik"
          className="w-full h-full rounded-xl"
        />
      </div>

      {/* Satış Nöqtələri Listesi */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {points.map((pt) => (
          <div
            key={pt.id || pt.address}
            onClick={() => onSelectPoint && onSelectPoint(pt)}
            className="p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl cursor-pointer transition border border-gray-200/60"
          >
            <div className="font-semibold text-gray-900 text-sm">{pt.city || pt.region || "Satış Nöqtəsi"}</div>
            <div className="text-xs text-gray-600 mt-1">{pt.address}</div>
            {pt.phone && <div className="text-xs text-emerald-700 font-medium mt-1">📞 {pt.phone}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
