"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Cpu,
  Phone,
  ArrowRight,
  TrendingUp,
  Share2,
  Camera,
  Code2,
  Palette,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import MasterHeroCosmos from "@/components/3d/MasterHeroCosmos";
import InteractiveFluidRefraction from "@/components/effects/InteractiveFluidRefraction";
import { defaultSettings, PortfolioCategory, PortfolioItem } from "@/lib/siteSettings";

export default function CinemaStoryExperience() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [portfolio, setProjects] = useState<PortfolioItem[]>(defaultSettings.portfolio);
  const [selectedCat, setSelectedCat] = useState<PortfolioCategory>("all");
  const [isScrolling, setIsScrolling] = useState(false);

  // Sync with Admin Panel database
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.portfolio?.length > 0) {
          setProjects(res.data.portfolio);
        }
      })
      .catch((e) => console.log("Cached portfolio:", e));
  }, []);

  const chapters = [
    { id: "intro", num: "01", title: "NÜVƏ", name: "Rəqəmsal Zirvə" },
    { id: "services", num: "02", title: "XİDMƏTLƏR", name: "Böyümə Mühərrikləri" },
    { id: "portfolio", num: "03", title: "PORTFEL", name: "Sübut Olunmuş Nəticələr" },
    { id: "ai_lab", num: "04", title: "AI STRATEGİYA", name: "Holoqrafik Terminal" },
    { id: "contact", num: "05", title: "ƏLAQƏ", name: "Layihəyə Başla" },
  ];

  // Natural Wheel Scroll Transition Handler (Snapping)
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling) return;

    if (e.deltaY > 30 && currentChapter < chapters.length - 1) {
      goToChapter(currentChapter + 1);
    } else if (e.deltaY < -30 && currentChapter > 0) {
      goToChapter(currentChapter - 1);
    }
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (currentChapter < chapters.length - 1) goToChapter(currentChapter + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (currentChapter > 0) goToChapter(currentChapter - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapter]);

  const goToChapter = (index: number) => {
    if (isScrolling || index === currentChapter) return;
    soundManager.playClick();
    setIsScrolling(true);
    setCurrentChapter(index);
    setTimeout(() => setIsScrolling(false), 800);
  };

  const filteredPortfolio =
    selectedCat === "all" ? portfolio : portfolio.filter((p) => p.category === selectedCat);

  return (
    <div
      onWheel={handleWheel}
      className="relative w-screen h-screen overflow-hidden bg-[#030306] text-white select-none flex flex-col justify-between"
    >
      {/* ─── Ambient WebGL Light Refraction ─── */}
      <InteractiveFluidRefraction />

      {/* ─── CINEMA TOP HEADER ─── */}
      <header className="h-24 px-8 sm:px-12 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-4">
          <div
            onClick={() => goToChapter(0)}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <div className="w-full h-full bg-[#080812] rounded-2xl flex items-center justify-center font-black text-lg text-white">
              A
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase">
              AZVEB <span className="text-cyan-400">MEDIA</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40 tracking-wider">
              CINEMA EXPERIENCE 2026
            </p>
          </div>
        </div>

        {/* Chapter Progress Indicators */}
        <div className="flex items-center gap-3">
          {chapters.map((chap, idx) => (
            <button
              key={chap.id}
              onClick={() => goToChapter(idx)}
              className={`group flex items-center gap-2 transition-all cursor-pointer ${
                currentChapter === idx ? "opacity-100" : "opacity-35 hover:opacity-75"
              }`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentChapter === idx
                    ? "w-10 bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-md shadow-cyan-500/40"
                    : "w-2.5 bg-white/40 group-hover:bg-white"
                }`}
              />
              <span className="text-[11px] font-mono font-bold hidden md:inline">
                {chap.num}
              </span>
            </button>
          ))}
        </div>

        {/* Direct Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToChapter(4)}
            className="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-lg shadow-accent/25 hover:scale-105 transition-all cursor-pointer"
          >
            Layihə Başlat
          </button>
          <a
            href="/admin/login"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white/60 hover:text-white transition-all"
          >
            Admin
          </a>
        </div>
      </header>

      {/* ─── MAIN FULLSCREEN CHAPTER CONTENT CONTAINER ─── */}
      <main className="flex-1 relative w-full h-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-center z-30">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────
              CHAPTER 01: CINEMATIC HERO (NÜVƏ)
          ───────────────────────────────────────────────────────────── */}
          {currentChapter === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Rəqəmsal Liderlik Agentliyi
                </div>

                <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.08]">
                  Rəqəmsal Dünyada <br />
                  <span className="gradient-text">Zirvəyə Yüksəlin.</span>
                </h1>

                <p className="text-white/60 text-base sm:text-xl max-w-xl leading-relaxed">
                  Standart şablonlar deyil; brendinizi bazarda lider edən alqoritmik SMM, 4K Prodakşn və High-End Veb mühəndisliyi.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    onClick={() => goToChapter(1)}
                    className="px-8 py-4 rounded-2xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-2xl shadow-accent/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all"
                  >
                    Xidmətləri Kəşf Et
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToChapter(2)}
                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Award className="w-4 h-4 text-cyan-400" /> Portfelə Bax
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] flex items-center justify-center">
                <MasterHeroCosmos />
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CHAPTER 02: SERVICES (XİDMƏTLƏRİMİZ)
          ───────────────────────────────────────────────────────────── */}
          {currentChapter === 1 && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                    CHAPTER 02 // BÖYÜMƏ ALƏTLƏRİ
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">
                    Bazar Liderliyi Üçün <span className="gradient-text">6 Əsas Güc</span>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-white/50 max-w-xs">
                  Hər xidmət brendinizin satış və nüfuzunu qatlamaq üçün xüsusi modelləşdirilib.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { title: "Sosial Media & SMM", desc: "Alqoritmləri fəth edən məzmun, icma idarəsi və böyümə.", tag: "SMM", icon: Share2 },
                  { title: "Dəqiq Hədəfli Reklam", desc: "Meta, TikTok və Google-da A/B testləri ilə 4x-8x ROAS satışı.", tag: "Targetinq", icon: TrendingUp },
                  { title: "4K Video & Foto Prodakşn", desc: "Studiya və məkan çəkilişləri, kinematoqrafik kadrlar.", tag: "Prodakşn", icon: Camera },
                  { title: "Viral Reels & TikTok", desc: "Trend ssenarilər və milyonlarla baxış toplayan videolar.", tag: "Viral", icon: Sparkles },
                  { title: "Google SEO Dominasiyası", desc: "Axtarış sistemlərində 1-ci səhifə və davamlı üzvi trafik.", tag: "SEO", icon: Code2 },
                  { title: "3D Spatial Vebsaytlar", desc: "Dünya səviyyəli Next.js mühəndisliyi və yüksək sürət.", tag: "Veb", icon: Palette },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-[#080814]/80 border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-cyan-300 border border-white/10">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CHAPTER 03: PORTFOLIO & CASE STUDIES (PORTFEL)
          ───────────────────────────────────────────────────────────── */}
          {currentChapter === 2 && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-pink-400 font-bold uppercase tracking-widest">
                    CHAPTER 03 // UĞUR HEKAYƏLƏRİ
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">
                    Rəqəmlərlə <span className="gradient-text">Sübut Olunmuş Keyslər</span>
                  </h2>
                </div>

                {/* Category tabs */}
                <div className="flex items-center gap-2">
                  {[
                    { id: "all", label: "Hamısı" },
                    { id: "smm", label: "SMM" },
                    { id: "production", label: "Çəkiliş" },
                    { id: "development", label: "Veb" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCat === cat.id
                          ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                          : "bg-white/5 text-white/50 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPortfolio.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    className="group relative rounded-3xl border border-white/10 bg-[#080812] overflow-hidden p-5 shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-white/10">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/70 text-pink-300 border border-pink-500/30 uppercase">
                          {proj.category}
                        </span>
                        <span className="absolute bottom-3 left-3 text-xs font-bold text-accent px-2.5 py-1 rounded-md bg-black/70 border border-accent/30">
                          {proj.stats}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/40">{proj.client}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{proj.roas}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 line-clamp-2">{proj.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CHAPTER 04: AI HOLOGRAM TERMINAL
          ───────────────────────────────────────────────────────────── */}
          {currentChapter === 3 && (
            <motion.div
              key="ai_lab"
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">
                  CHAPTER 04 // REAL-TIME SIMULATION
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">
                  Canlı AI <span className="gradient-text">Strategiya Hologramı</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto">
                  Brendinizi daxil edin, süni intellekt bazar təhlilini və böyümə proqnozunu saniyələr içində qursun.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-purple-500/30 bg-[#070712]/90 backdrop-blur-3xl shadow-2xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-white/60 mb-2">Şirkət Adınız</label>
                    <input
                      type="text"
                      placeholder="Məs: Baku Luxury Group"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-sm outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-white/60 mb-2">Fəaliyyət Sahəsi</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[#0b0b18] border border-white/15 text-white text-sm outline-none focus:border-purple-400">
                      <option>E-Ticarət & Pərakəndə</option>
                      <option>Restoran & Qonaqpərvərlik</option>
                      <option>Daşınmaz Əmlak & Tikinti</option>
                      <option>B2B & Texnologiya / SaaS</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-around text-center">
                  <div>
                    <div className="text-xs text-white/40">Təxmini ROAS</div>
                    <div className="text-xl font-black text-purple-300">5.8x - 8.4x</div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10" />
                  <div>
                    <div className="text-xs text-white/40">Viral Baxış</div>
                    <div className="text-xl font-black text-cyan-300">500K+ / ay</div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10" />
                  <div>
                    <div className="text-xs text-white/40">Satış Artımı</div>
                    <div className="text-xl font-black text-pink-300">+340%</div>
                  </div>
                </div>

                <button
                  onClick={() => goToChapter(4)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Bu Strategiyanı Real Biznesə Tətbiq Edin
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CHAPTER 05: CONTACT & ACTION (ƏLAQƏ)
          ───────────────────────────────────────────────────────────── */}
          {currentChapter === 4 && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl space-y-8 text-center"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  CHAPTER 05 // FINAL & ACTION
                </span>
                <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
                  Brendinizi Bazar Liderinə <br />
                  <span className="gradient-text">Birlikdə Çevirək.</span>
                </h2>
                <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto">
                  Bakı HQ • Azure Business Center • info@azveb.com • +994 50 123 45 67
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="https://wa.me/994501234567"
                  target="_blank"
                  className="px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm shadow-2xl shadow-emerald-500/30 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                >
                  WhatsApp ilə Birbaşa Başla
                </a>
                <button
                  onClick={() => goToChapter(0)}
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold transition-all cursor-pointer"
                >
                  Əvvələ Qayıt (Chapter 01)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── BOTTOM NAVIGATION CONTROLS BAR ─── */}
      <footer className="h-24 px-8 sm:px-12 flex items-center justify-between z-40 relative border-t border-white/5">
        <div className="text-xs font-mono text-white/40">
          FƏSİL: <strong className="text-white">{chapters[currentChapter].num}</strong> // {chapters[currentChapter].name}
        </div>

        {/* Prev / Next Cinematic Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToChapter(currentChapter - 1)}
            disabled={currentChapter === 0}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono text-cyan-400 font-bold px-2">
            {currentChapter + 1} / {chapters.length}
          </span>

          <button
            onClick={() => goToChapter(currentChapter + 1)}
            disabled={currentChapter === chapters.length - 1}
            className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-95 disabled:opacity-20 disabled:pointer-events-none text-white transition-all cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] font-mono text-white/30 hidden sm:block">
          Skroll və ya Klaviatura Oxları (← →) ilə keçin
        </div>
      </footer>
    </div>
  );
}
