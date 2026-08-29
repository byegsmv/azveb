"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import {
  Cpu,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import { scrollToSection } from "@/hooks/useScrollNav";

export default function AiStrategyHologramTerminal() {
  const locale = useLocale();
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("ecommerce");
  const [goal, setGoal] = useState("scale_sales");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasResult, setHasResult] = useState(false);

  const industries = [
    { id: "ecommerce", label: { az: "E-Ticarət & Pərakəndə", tr: "E-Ticaret & Perakende", en: "E-Commerce & Retail" } },
    { id: "b2b_saas", label: { az: "B2B & Texnologiya / SaaS", tr: "B2B & Teknoloji / SaaS", en: "B2B & Tech / SaaS" } },
    { id: "services", label: { az: "Klinika & Restoran & Xidmət", tr: "Klinik & Restoran & Hizmet", en: "Clinics & Food & Services" } },
    { id: "real_estate", label: { az: "Daşınmaz Əmlak & Tikinti", tr: "Gayrimenkul & İnşaat", en: "Real Estate & Construction" } },
  ];

  const goals = [
    { id: "scale_sales", label: { az: "Satışları 3x-5x Artırmaq", tr: "Satışları 3x-5x Katlamak", en: "Scale Revenue 3x-5x" } },
    { id: "viral_reach", label: { az: "Viral Tanınma & Brend Gücü", tr: "Viral Bilinirlik & Marka Gücü", en: "Viral Reach & Brand Authority" } },
    { id: "lead_gen", label: { az: "Daimi Müştəri / Zəng Axını", tr: "Sürekli Müşteri / Talep Akışı", en: "High-Quality Lead Generation" } },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    soundManager.playClick();
    setIsScanning(true);
    setHasResult(false);
    setScanStep(0);

    const stepIntervals = [
      { step: 1, delay: 500 },
      { step: 2, delay: 1100 },
      { step: 3, delay: 1700 },
      { step: 4, delay: 2400 },
    ];

    stepIntervals.forEach(({ step, delay }) => {
      setTimeout(() => {
        setScanStep(step);
      }, delay);
    });

    setTimeout(() => {
      setIsScanning(false);
      setHasResult(true);
      soundManager.playClick();
    }, 2900);
  };

  const loc = (locale === "tr" || locale === "en" ? locale : "az") as "az" | "tr" | "en";

  return (
    <section id="ai-terminal" className="relative py-32 overflow-hidden">
      {/* Background Holographic Grid Ambience */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Terminal Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md"
          >
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            AI Canlı Böyümə Simulyatoru 2026
          </motion.div>

          <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
            Brendiniz Üçün <span className="gradient-text">AI Strategiya Hologramı</span>
          </h2>
          <p className="text-muted text-base sm:text-xl max-w-2xl mx-auto">
            {loc === "az" && "Şirkətinizin adını və hədəfinizi seçin, süni intellekt saniyələr içində fərdi yol xəritənizi qursun."}
            {loc === "tr" && "Şirketinizin adını ve hedefinizi seçin, yapay zeka saniyeler içinde özel büyüme yol haritanızı çıkarsın."}
            {loc === "en" && "Input your brand details and target to simulate your custom AI growth roadmap in seconds."}
          </p>
        </div>

        {/* Main Terminal Holo-Chamber */}
        <div className="relative rounded-3xl border border-indigo-500/20 bg-[#07070c]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse" />
              <span className="text-xs font-mono text-white/40 ml-2">AZVEB_AI_KERNEL_v4.2</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              SYSTEM_ONLINE
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Input Parameters */}
            <form onSubmit={handleGenerate} className="lg:col-span-6 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  {loc === "az" ? "1. Brend / Şirkət Adınız:" : loc === "tr" ? "1. Marka / Şirket Adınız:" : "1. Your Brand / Business Name:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Baku Luxury Moda"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-white/25 focus:border-indigo-400 focus:outline-none transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  {loc === "az" ? "2. Biznes Sahəniz:" : loc === "tr" ? "2. Faaliyet Sektörünüz:" : "2. Industry Category:"}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setIndustry(ind.id)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        industry === ind.id
                          ? "bg-indigo-600/25 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                          : "bg-white/[0.02] border-white/10 text-white/50 hover:border-white/25"
                      }`}
                    >
                      {ind.label[loc]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  {loc === "az" ? "3. Əsas Hədəfiniz:" : loc === "tr" ? "3. Öncelikli Hedefiniz:" : "3. Primary Objective:"}
                </label>
                <div className="space-y-2">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                        goal === g.id
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                          : "bg-white/[0.02] border-white/10 text-white/50 hover:border-white/25"
                      }`}
                    >
                      <span>{g.label[loc]}</span>
                      {goal === g.id && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    AI Skan Edilir...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {loc === "az" ? "Holoqrafik Strategiyanı Generasiya Et" : loc === "tr" ? "Stratejiyi Simüle Et" : "Generate AI Hologram"}
                  </>
                )}
              </button>
            </form>

            {/* Right: Holographic Projection Screen */}
            <div className="lg:col-span-6 relative min-h-[380px] rounded-2xl border border-indigo-500/30 bg-[#040408] p-6 flex flex-col justify-center items-center overflow-hidden">
              {/* Laser scanning beam */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#38bdf8] z-30"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>

              {!isScanning && !hasResult && (
                <div className="text-center p-6 text-white/40 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-indigo-400">
                    <Cpu className="w-8 h-8 opacity-40 animate-pulse" />
                  </div>
                  <p className="text-sm font-mono">
                    {loc === "az" && "Məlumatları daxil edin və süni intellektin canlı hesablama gücünü başladın."}
                    {loc === "tr" && "Bilgileri girin ve yapay zeka analiz motorunu çalıştırın."}
                    {loc === "en" && "Enter details to initialize real-time AI market forecasting."}
                  </p>
                </div>
              )}

              {isScanning && (
                <div className="w-full space-y-4 text-center">
                  <div className="text-xs font-mono text-cyan-400 animate-pulse tracking-widest uppercase">
                    {scanStep === 0 && ">> BAZAR RƏQABƏTİ TƏHLİL EDİLİR..."}
                    {scanStep === 1 && ">> HƏDƏF AUDİTORİYA SİMULYASİYASI..."}
                    {scanStep === 2 && ">> VİRAL KONTENT HOOKS HESABLANIR..."}
                    {scanStep === 3 && ">> ROAS VƏ SATIŞ MODELİ QURULUR..."}
                    {scanStep >= 4 && ">> STRATEGİYA ŞİFRƏLƏNİR..."}
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                      initial={{ width: "10%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.7, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}

              {hasResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-5 text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-mono text-white/50 uppercase">
                      HƏDƏF: <strong className="text-white">{brandName}</strong>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> 98.4% UYĞUNLUQ
                    </span>
                  </div>

                  {/* Projected Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="text-xs text-white/50 font-mono">Təxmini ROAS</div>
                      <div className="text-lg font-black text-indigo-300">5.8x - 8.2x</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="text-xs text-white/50 font-mono">Viral Baxış</div>
                      <div className="text-lg font-black text-cyan-300">500K+ / ay</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="text-xs text-white/50 font-mono">Satış Artımı</div>
                      <div className="text-lg font-black text-pink-300">+320%</div>
                    </div>
                  </div>

                  {/* AI Recommended Strategy Steps */}
                  <div className="space-y-2 text-xs text-white/80">
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">01.</span>
                      <span>Meta & TikTok Alqoritmik Targetinq və Pixel Konversiya Tuneli.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">02.</span>
                      <span>Həftəlik 10+ 4K Sinematik Reels və İnflyuenser PR Ssenarisi.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-pink-400 font-bold">03.</span>
                      <span>Google 1-ci Səhifə Dominasiyası və A/B Sürətli CRO Testləri.</span>
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToSection("contact")}
                    className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-accent hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/25 cursor-pointer text-sm"
                  >
                    Bu Planı Real Biznesə Tətbiq Edin
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
