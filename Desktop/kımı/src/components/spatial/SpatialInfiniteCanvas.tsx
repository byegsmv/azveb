"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Layers,
  Sparkles,
  Award,
  Cpu,
  Calculator,
  Phone,
  Maximize2,
  Minimize2,
  Crosshair,
  TrendingUp,
  Share2,
  Camera,
  Code2,
  Palette,
  CheckCircle2,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import MasterHeroCosmos from "@/components/3d/MasterHeroCosmos";
import InteractiveFluidRefraction from "@/components/effects/InteractiveFluidRefraction";

// Coordinate stations in the Infinite Spatial Universe
const spatialNodes = [
  {
    id: "core",
    name: "00 // NÜVƏ",
    title: "Azveb Media HQ",
    subtitle: "Rəqəmsal Dünyanın Mərkəzi",
    x: 0,
    y: 0,
    color: "#818cf8",
    icon: Sparkles,
  },
  {
    id: "services",
    name: "01 // XİDMƏTLƏR",
    title: "Böyümə Alətləri",
    subtitle: "SMM, Targetinq, 4K Prodakşn & SEO",
    x: -580,
    y: -340,
    color: "#38bdf8",
    icon: Layers,
  },
  {
    id: "portfolio",
    name: "02 // PORTFEL",
    title: "Uğur Hekayələri",
    subtitle: "Sübut Olunmuş Nəticələr & ROAS",
    x: 580,
    y: -320,
    color: "#ec4899",
    icon: Award,
  },
  {
    id: "ai_lab",
    name: "03 // AI SİMULYATOR",
    title: "Holoqrafik Terminal",
    subtitle: "Real-Vaxt Bazar & Satış Təhlili",
    x: -520,
    y: 380,
    color: "#a855f7",
    icon: Cpu,
  },
  {
    id: "calculator",
    name: "04 // BÜDCƏ HESABLA",
    title: "Böyümə Simulyatoru",
    subtitle: "Büdcə, Satış & Müştəri Proqnozu",
    x: 540,
    y: 380,
    color: "#f59e0b",
    icon: Calculator,
  },
  {
    id: "contact",
    name: "05 // ƏLAQƏ",
    title: "Bizimlə Əlaqə",
    subtitle: "Bakı HQ • Layihəni Başlat",
    x: 0,
    y: 650,
    color: "#10b981",
    icon: Phone,
  },
];

export default function SpatialInfiniteCanvas() {
  // Canvas viewport translation & zoom
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [activeStation, setActiveStation] = useState<string>("core");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Focus directly on a node
  const flyToNode = (id: string) => {
    soundManager.playClick();
    const node = spatialNodes.find((n) => n.id === id);
    if (!node) return;

    setActiveStation(id);
    setCamera({
      x: -node.x,
      y: -node.y,
      zoom: id === "core" ? 1 : 1.1,
    });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".interactive-panel")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - camera.x, y: e.clientY - camera.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCamera((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.min(Math.max(camera.zoom - e.deltaY * 0.001, 0.55), 1.6);
    setCamera((prev) => ({ ...prev, zoom: newZoom }));
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#020204] text-white select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* ─── WebGL Ambient Fluid Background ─── */}
      <InteractiveFluidRefraction />

      {/* ─── TOP HUD OPERATING BAR ─── */}
      <header className="absolute top-6 inset-x-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div
            onClick={() => flyToNode("core")}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] cursor-pointer shadow-lg shadow-indigo-500/30"
          >
            <div className="w-full h-full bg-[#07070e] rounded-2xl flex items-center justify-center font-black text-xl text-white">
              A
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase">
              Azveb <span className="text-cyan-400">Spatial Canvas</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40">FƏZA İDARƏETMƏ REJİMİ 2026</p>
          </div>
        </div>

        {/* Top Mini Station Teleporter */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#080812]/80 backdrop-blur-2xl border border-white/10 pointer-events-auto shadow-2xl">
          {spatialNodes.map((n) => (
            <button
              key={n.id}
              onClick={() => flyToNode(n.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStation === n.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <n.icon className="w-3.5 h-3.5" />
              {n.name}
            </button>
          ))}
        </div>

        {/* Reset & Admin buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setCamera({ x: 0, y: 0, zoom: 1 });
              setActiveStation("core");
            }}
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white/80 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            Mərkəzə Qayıt
          </button>
          <a
            href="/admin/login"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-bold text-indigo-300 transition-all"
          >
            Admin Panel
          </a>
        </div>
      </header>

      {/* ─── HUD MINI MAP RADAR (Bottom Left) ─── */}
      <div className="absolute bottom-6 left-6 z-50 p-4 rounded-3xl bg-[#07070f]/90 border border-white/10 backdrop-blur-2xl hidden sm:block pointer-events-auto shadow-2xl">
        <div className="text-[10px] font-mono uppercase text-white/40 mb-3 flex items-center justify-between">
          <span>SPATIAL RADAR</span>
          <span className="text-cyan-400">ZOOM: {Math.round(camera.zoom * 100)}%</span>
        </div>
        <div className="relative w-36 h-28 border border-white/10 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center">
          {/* Radar sweep */}
          <div className="absolute inset-0 cyber-grid opacity-30" />
          {spatialNodes.map((n) => (
            <div
              key={n.id}
              onClick={() => flyToNode(n.id)}
              className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                activeStation === n.id ? "scale-150 ring-2 ring-cyan-400" : "opacity-60"
              }`}
              style={{
                left: `${50 + (n.x / 1400) * 80}%`,
                top: `${50 + (n.y / 1400) * 80}%`,
                backgroundColor: n.color,
              }}
            />
          ))}
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping pointer-events-none" />
        </div>
        <p className="text-[9px] font-mono text-white/30 mt-2 text-center">Fəzada hərəkət üçün ekrandan dartın</p>
      </div>

      {/* ─── 360° INFINITE SPATIAL WORLD CANVAS ─── */}
      <motion.div
        animate={{
          x: camera.x,
          y: camera.y,
          scale: camera.zoom,
        }}
        transition={{ type: "spring", damping: 28, stiffness: 180 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[3000px] pointer-events-none"
      >
        {/* Infinite Matrix Grid Lines */}
        <div className="absolute inset-0 cyber-grid opacity-25" />

        {/* Dynamic Energy Constellation Lines Connecting Nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="1500" y1="1500" x2={1500 - 580} y2={1500 - 340} stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="1500" y1="1500" x2={1500 + 580} y2={1500 - 320} stroke="rgba(236, 72, 153, 0.25)" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="1500" y1="1500" x2={1500 - 520} y2={1500 + 380} stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="1500" y1="1500" x2={1500 + 540} y2={1500 + 380} stroke="rgba(245, 158, 11, 0.25)" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="1500" y1="1500" x2="1500" y2={1500 + 650} stroke="rgba(16, 185, 129, 0.25)" strokeWidth="2" strokeDasharray="6 6" />
        </svg>

        {/* ─── STATION 00: CORE HEADQUARTERS (Center: 0,0) ─── */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-panel"
          style={{ left: 1500, top: 1500 }}
        >
          <div className="relative w-[520px] p-10 rounded-3xl border border-indigo-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-[0_0_80px_rgba(99,102,241,0.25)] text-center space-y-6">
            <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
              <MasterHeroCosmos />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Azərbaycanın İlk Spatial Agentliyi
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-3 text-white">
                Rəqəmsal Dünyada <span className="gradient-text">Zirvəyə Yüksəlin</span>
              </h2>
              <p className="text-sm text-white/60 mt-3 leading-relaxed">
                Şablon saytlar erası bitdi. Brendinizi böyüdən alqoritmik SMM, 4K Prodakşn və High-Tech Veb həlləri.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => flyToNode("services")}
                className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-lg shadow-accent/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Layers className="w-4 h-4" /> Xidmətləri Kəşf Et
              </button>
              <button
                onClick={() => flyToNode("portfolio")}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-cyan-400" /> Portfelə Bax
              </button>
            </div>
          </div>
        </div>

        {/* ─── STATION 01: SERVICES POD (-580, -340) ─── */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-panel"
          style={{ left: 1500 - 580, top: 1500 - 340 }}
        >
          <div className="w-[460px] p-8 rounded-3xl border border-cyan-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-[0_0_60px_rgba(56,189,248,0.2)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-400">01 // XİDMƏTLƏRİMİZ</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold">6 Aktiv Xidmət</span>
            </div>

            <h3 className="text-2xl font-black text-white">Böyümə Mühərrikləri</h3>
            
            <div className="space-y-2.5">
              {[
                { title: "SMM & Viral Reels", desc: "Milyonlarla baxış və alqoritmik idarəetmə.", tag: "Viral" },
                { title: "Dəqiq Hədəfli Reklam", desc: "Meta, TikTok və Google-da 4x-8x ROAS satışı.", tag: "Targetinq" },
                { title: "4K Video & Foto Prodakşn", desc: "Dron, studiya və kinematoqrafik çəkilişlər.", tag: "Prodakşn" },
                { title: "Ultra-Premium 3D Vebsaytlar", desc: "Dünya səviyyəli Next.js və Spatial mühəndislik.", tag: "Veb" },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>{s.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{s.tag}</span>
                  </div>
                  <p className="text-xs text-white/50 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => flyToNode("contact")}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Bu Xidmətlərlə Satışları Artır <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── STATION 02: PORTFOLIO POD (580, -320) ─── */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-panel"
          style={{ left: 1500 + 580, top: 1500 - 320 }}
        >
          <div className="w-[480px] p-8 rounded-3xl border border-pink-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-[0_0_60px_rgba(236,72,153,0.2)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-pink-400">02 // PORTFEL VƏ KEYS-LƏR</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Ortalama 7.4x ROAS</span>
            </div>

            <h3 className="text-2xl font-black text-white">Sübut Olunmuş Nəticələr</h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "ModaX Fashion", stat: "+340% Satış", cat: "SMM", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
                { title: "Grand Residence", stat: "$2.4M Satış", cat: "Çəkiliş", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
                { title: "CloudSync Global", stat: "15K İstifadəçi", cat: "Veb", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" },
                { title: "Bella Vista", stat: "1.2M Baxış", cat: "Viral", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" },
              ].map((p, i) => (
                <div key={i} className="relative h-28 rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                    <span className="text-xs font-bold text-white">{p.title}</span>
                    <span className="text-[10px] text-pink-400 font-bold">{p.stat}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => flyToNode("contact")}
              className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20"
            >
              Sizin Brend Üçün Nəticə Yaradaq <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── STATION 03: AI SIMULATOR POD (-520, 380) ─── */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-panel"
          style={{ left: 1500 - 520, top: 1500 + 380 }}
        >
          <div className="w-[450px] p-8 rounded-3xl border border-purple-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-[0_0_60px_rgba(168,85,247,0.2)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-purple-400">03 // AI STRATEGİYA</span>
              <span className="text-xs font-mono text-emerald-400 animate-pulse">● ONLINE</span>
            </div>

            <h3 className="text-2xl font-black text-white">Canlı AI Bazar Təhlili</h3>
            <p className="text-xs text-white/60">
              Brendinizi daxil edin, süni intellekt saniyələr içində bazar potensialınızı və təxmini ROAS-ı simulyasiya etsin.
            </p>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <input
                type="text"
                placeholder="Şirkət / Brend Adınız..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs"
              />
              <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                <span>Təxmini ROAS: <strong className="text-purple-300">6.5x - 9.0x</strong></span>
                <span>Baxış: <strong className="text-cyan-300">500K+</strong></span>
              </div>
            </div>

            <button
              onClick={() => flyToNode("contact")}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20"
            >
              Fərdi Yol Xəritəsini Təsdiqləyin
            </button>
          </div>
        </div>

        {/* ─── STATION 04: CALCULATOR POD (540, 380) ─── */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-panel"
          style={{ left: 1500 + 540, top: 1500 + 380 }}
        >
          <div className="w-[450px] p-8 rounded-3xl border border-amber-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-amber-400">04 // BÜDCƏ SİMULYATORU</span>
              <span className="text-xs font-mono text-white/40">2026 Model</span>
            </div>

            <h3 className="text-2xl font-black text-white">Böyümə Simulyatoru</h3>

            <div className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Aylıq Reklam Büdcəsi:</span>
                <span className="font-bold text-amber-400">2,500 ₼</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="w-2/3 h-full bg-amber-400 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="p-2 rounded-lg bg-white/5">
                  <div className="text-[10px] text-white/40">Gözlənilən Satış</div>
                  <div className="text-sm font-bold text-white">18,500 ₼</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <div className="text-[10px] text-white/40">Yeni Müştərilər</div>
                  <div className="text-sm font-bold text-emerald-400">120+ Müştəri</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => flyToNode("contact")}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Bu Büdcə ilə Kampaniyaya Başla
            </button>
          </div>
        </div>

        {/* ─── STATION 05: CONTACT HQ POD (0, 650) ─── */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto interactive-panel"
          style={{ left: 1500, top: 1500 + 650 }}
        >
          <div className="w-[500px] p-8 rounded-3xl border border-emerald-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-[0_0_70px_rgba(16,185,129,0.25)] text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
              <Phone className="w-3.5 h-3.5" /> 05 // ƏLAQƏ VƏ KONSULTASİYA
            </div>

            <h3 className="text-3xl font-black text-white">Layihənizi Birgə Quraq</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              Bakı, Azure Business Center • info@azveb.com • +994 50 123 45 67
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="https://wa.me/994501234567"
                target="_blank"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                WhatsApp ilə Yazın
              </a>
              <button
                onClick={() => flyToNode("core")}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold"
              >
                Mərkəzə Qayıt
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
