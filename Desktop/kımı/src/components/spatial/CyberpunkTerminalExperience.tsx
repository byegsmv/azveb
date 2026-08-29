"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  Zap,
  Shield,
  Activity,
  Code2,
  Database,
  Radio,
  Wifi,
  Layers,
  Sparkles,
  TrendingUp,
  Share2,
  Camera,
  Award,
  Phone,
  Send,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import { defaultSettings, PortfolioCategory, PortfolioItem } from "@/lib/siteSettings";

export default function CyberpunkTerminalExperience() {
  const [activeTab, setActiveTab] = useState<"terminal" | "services" | "targets" | "intel" | "uplink">("terminal");
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM_INIT] Azveb Cybernetic Kernel v5.0 loaded.",
    "[NETWORK] Connected to Baku Neural Node (Latency: 0.8ms).",
    "[SECURITY] Quantum encryption protocol active.",
    "[STATUS] AI Marketing Engine ready for execution.",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(defaultSettings.portfolio);
  const [selectedCat, setSelectedCat] = useState<PortfolioCategory>("all");
  const [systemLoad, setSystemLoad] = useState(68);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Live system metric jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((prev) => Math.min(Math.max(prev + (Math.floor(Math.random() * 7) - 3), 55), 94));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    soundManager.playClick();
    const cmd = terminalInput.trim().toLowerCase();
    const newLog = `> ${terminalInput}`;

    let response = "";
    if (cmd === "help") {
      response = "[SYSTEM] Əmrlər: 'services', 'portfolio', 'scan <brend>', 'contact', 'clear'";
    } else if (cmd === "services") {
      setActiveTab("services");
      response = "[ACTION] Xidmətlər modulu ekrana gətirildi.";
    } else if (cmd === "portfolio" || cmd === "targets") {
      setActiveTab("targets");
      response = "[ACTION] Portfel və keys-lər bazası açıldı.";
    } else if (cmd.startsWith("scan")) {
      const target = cmd.replace("scan", "").trim() || "Target";
      setActiveTab("intel");
      response = `[AI_SCAN] '${target}' brendi üçün alqoritmik bazar təhlili başladıldı. Təxmini ROAS: 6.8x.`;
    } else if (cmd === "contact" || cmd === "uplink") {
      setActiveTab("uplink");
      response = "[ACTION] Təhlükəsiz rabitə kanalı açıldı.";
    } else if (cmd === "clear") {
      setLogs([]);
      setTerminalInput("");
      return;
    } else {
      response = `[ERROR] Naməlum əmr: '${cmd}'. Kömək üçün 'help' yazın.`;
    }

    setLogs((prev) => [...prev, newLog, response]);
    setTerminalInput("");
  };

  const filteredPortfolio =
    selectedCat === "all" ? portfolio : portfolio.filter((p) => p.category === selectedCat);

  return (
    <div className="min-h-screen w-full bg-[#020205] text-[#00ffcc] font-mono select-none overflow-x-hidden relative flex flex-col justify-between">
      {/* ─── MATRIX CODE RAIN / SCANLINE OVERLAY ─── */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none -z-10" />

      {/* ─── TOP CYBERNETIC HUD STATUS BAR ─── */}
      <header className="h-16 border-b border-[#00ffcc]/20 bg-[#05050c]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00ffcc] animate-ping rounded-sm" />
            <span className="font-black text-sm sm:text-base tracking-widest text-white">
              AZVEB<span className="text-[#00ffcc]">_MAINFRAME</span>
            </span>
          </div>
          <span className="hidden md:inline text-xs px-2.5 py-0.5 rounded border border-[#00ffcc]/30 bg-[#00ffcc]/10 text-[#00ffcc]">
            NODE: AZ_BAKU_01
          </span>
        </div>

        {/* HUD Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {[
            { id: "terminal", label: "TERMINAL", icon: Terminal },
            { id: "services", label: "XİDMƏTLƏR", icon: Cpu },
            { id: "targets", label: "PORTFEL", icon: Database },
            { id: "intel", label: "AI_SKAN", icon: Activity },
            { id: "uplink", label: "ƏLAQƏ", icon: Radio },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#00ffcc] text-black border-[#00ffcc] shadow-[0_0_15px_#00ffcc]"
                  : "bg-black/40 text-[#00ffcc]/70 border-[#00ffcc]/20 hover:border-[#00ffcc] hover:text-[#00ffcc]"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-white/50">
            <Activity className="w-3.5 h-3.5 text-[#00ffcc]" />
            <span>CPU: <strong className="text-white">{systemLoad}%</strong></span>
          </div>
          <a
            href="/admin/login"
            target="_blank"
            className="px-3 py-1 text-xs border border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20 font-bold"
          >
            ROOT_ACCESS
          </a>
        </div>
      </header>

      {/* ─── MAIN DYNAMIC CYBER WORKSPACE ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 z-20 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────
              VIEW 1: MASTER COMMAND TERMINAL & CORE
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "terminal" && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left: Cyber Mission Briefing */}
              <div className="lg:col-span-6 p-6 sm:p-8 border border-[#00ffcc]/30 bg-[#04040a]/90 backdrop-blur-xl relative shadow-[0_0_30px_rgba(0,255,204,0.1)] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#00ffcc]/20 pb-3">
                    <span className="text-xs text-[#00ffcc]/70">DIRECTIVE // 2026</span>
                    <span className="text-xs text-emerald-400">● STATUS: OPERATIONAL</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    RƏQƏMSAL BAZARI <br />
                    <span className="text-[#00ffcc] drop-shadow-[0_0_20px_#00ffcc]">ALQORİTMLƏ HÖKM ET.</span>
                  </h1>

                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                    Standart agentliklər reklam büdcənizi yandırır. Biz isə Meta, TikTok və Google platformalarını dərindən hədəfləyən, 4K video prodakşn və yüksək konversiyalı kodlaşdırma ilə satışlarınızı 3x-8x qatlayırıq.
                  </p>
                </div>

                {/* Cyber Quick Access Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#00ffcc]/20">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("services");
                    }}
                    className="p-3 bg-[#00ffcc]/10 border border-[#00ffcc] hover:bg-[#00ffcc] hover:text-black font-bold text-xs text-[#00ffcc] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,255,204,0.2)]"
                  >
                    <Zap className="w-4 h-4" /> [01] XİDMƏTLƏR
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("intel");
                    }}
                    className="p-3 bg-purple-500/10 border border-purple-400 hover:bg-purple-500 hover:text-white font-bold text-xs text-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  >
                    <Activity className="w-4 h-4" /> [02] AI SKAN
                  </button>
                </div>
              </div>

              {/* Right: Live Interactive Hacker Terminal */}
              <div className="lg:col-span-6 p-6 border border-[#00ffcc]/30 bg-black/95 relative shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[380px]">
                <div className="flex items-center justify-between border-b border-[#00ffcc]/20 pb-3 mb-4">
                  <span className="text-xs text-white/50 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#00ffcc]" />
                    AZVEB_BASH_SHELL
                  </span>
                  <span className="text-[10px] text-[#00ffcc]/50">TYPE 'help' FOR COMMANDS</span>
                </div>

                {/* Log Stream */}
                <div className="flex-1 overflow-y-auto space-y-2 text-xs max-h-[260px] pr-2 font-mono">
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith(">")
                          ? "text-yellow-400 font-bold"
                          : log.startsWith("[ERROR]")
                          ? "text-red-400"
                          : log.startsWith("[ACTION]") || log.startsWith("[AI_SCAN]")
                          ? "text-[#00ffcc] font-bold"
                          : "text-white/70"
                      }
                    >
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>

                {/* Terminal Input Line */}
                <form onSubmit={handleCommandSubmit} className="mt-4 pt-3 border-t border-[#00ffcc]/20 flex items-center gap-2">
                  <span className="text-[#00ffcc] font-bold">root@azveb:~$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="help, services, scan <ad>..."
                    className="flex-1 bg-transparent border-none text-[#00ffcc] focus:outline-none text-xs font-mono"
                    autoFocus
                  />
                  <button type="submit" className="text-[#00ffcc] hover:text-white">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 2: CYBER SERVICES ARSENAL
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#00ffcc]/20 pb-4">
                <div>
                  <span className="text-xs text-[#00ffcc] font-bold uppercase tracking-widest">[ARSENAL_02]</span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">BÖYÜMƏ MÜHƏRRİKLƏRİ</h2>
                </div>
                <button
                  onClick={() => setActiveTab("uplink")}
                  className="px-4 py-2 bg-[#00ffcc] text-black font-extrabold text-xs shadow-[0_0_15px_#00ffcc] cursor-pointer"
                >
                  XİDMƏT TƏLƏB ET →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "01", title: "SMM & VIRAL REELS", desc: "Alqoritmik məzmun mühəndisliyi, trend idarəetmə və milyonlarla baxış.", tag: "VIRAL_FLOW", stat: "1.2M+ VIEW" },
                  { id: "02", title: "PERFORMANCE TARGETING", desc: "Meta, TikTok və Google-da A/B testləri və pixel optimizasiyası ilə satış.", tag: "ROAS_MAX", stat: "7.4x ROAS" },
                  { id: "03", title: "4K CINEMA PRODUCTION", desc: "Dron, studio və premium məhsul çəkilişləri, kinematoqrafik montaj.", tag: "4K_PROD", stat: "100% CINEMA" },
                  { id: "04", title: "GOOGLE SEO DOMINANCE", desc: "Axtarış sistemlərində 1-ci səhifə, texniki SEO və daimi üzvi trafik.", tag: "SEO_DOM", stat: "#1 RANK" },
                  { id: "05", title: "HIGH-TECH 3D WEBSITES", desc: "Next.js və Three.js ilə hazırlanmış dünya səviyyəli rəqəmsal platformalar.", tag: "DEV_CORE", stat: "0ms LAG" },
                  { id: "06", title: "INFLUENCER & PR NETWORK", desc: "Sektor liderləri ilə strateji brend əməkdaşlığı və ictimai nüfuz.", tag: "PR_GRID", stat: "TOP REACH" },
                ].map((s) => (
                  <div
                    key={s.id}
                    className="p-6 border border-[#00ffcc]/20 bg-[#060610] hover:border-[#00ffcc] hover:bg-[#00ffcc]/5 transition-all space-y-3 group relative"
                  >
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className="font-bold text-[#00ffcc]">ID: {s.id}</span>
                      <span className="px-2 py-0.5 border border-[#00ffcc]/30 text-[#00ffcc] bg-[#00ffcc]/10">
                        {s.stat}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00ffcc] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 3: TARGETS DATABASE & PORTFOLIO
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "targets" && (
            <motion.div
              key="targets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00ffcc]/20 pb-4">
                <div>
                  <span className="text-xs text-[#00ffcc] font-bold uppercase tracking-widest">[DATABASE_03]</span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white">PORTFEL VƏ SÜBUT OLUNMUŞ KEYSLƏR</h2>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: "all", label: "HAMISI" },
                    { id: "smm", label: "SMM" },
                    { id: "production", label: "ÇƏKİLİŞ" },
                    { id: "development", label: "DEV" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id as any)}
                      className={`px-3 py-1 text-xs font-bold border transition-all cursor-pointer ${
                        selectedCat === cat.id
                          ? "bg-[#00ffcc] text-black border-[#00ffcc]"
                          : "border-[#00ffcc]/20 text-white/60 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPortfolio.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-[#00ffcc]/30 bg-[#05050f] p-4 space-y-4 hover:border-[#00ffcc] transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden border border-white/10">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-[#00ffcc]/40 text-[#00ffcc] text-[10px]">
                        {proj.category.toUpperCase()}
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-emerald-400 text-emerald-400 text-xs font-bold">
                        {proj.stats}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                        <span>CLIENT: {proj.client}</span>
                        <span className="text-[#00ffcc] font-bold">{proj.roas}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#00ffcc] transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">{proj.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 4: AI INTELLIGENCE SCANNER
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "intel" && (
            <motion.div
              key="intel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto border border-[#00ffcc]/30 bg-[#05050f] p-8 space-y-6 shadow-[0_0_40px_rgba(0,255,204,0.15)]"
            >
              <div className="border-b border-[#00ffcc]/20 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-purple-400 font-bold uppercase">[AI_KERNEL_04]</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">CANLI AI BAZAR TƏHLİLİ</h2>
                </div>
                <Activity className="w-5 h-5 text-[#00ffcc] animate-pulse" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/60 mb-2">HƏDƏF BREND / BİZNES ADI:</label>
                  <input
                    type="text"
                    placeholder="Məs: Baku Premium Fashion"
                    className="w-full p-3 bg-black/60 border border-[#00ffcc]/30 text-[#00ffcc] text-sm focus:border-[#00ffcc] outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 bg-black/80 border border-white/10 text-center">
                  <div>
                    <div className="text-[10px] text-white/40">PROQNOZ ROAS</div>
                    <div className="text-lg font-black text-[#00ffcc]">6.2x - 8.5x</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40">AYLIQ VİRAL BAXIŞ</div>
                    <div className="text-lg font-black text-purple-300">500,000+</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40">SATIŞ ARTIMI</div>
                    <div className="text-lg font-black text-emerald-400">+340%</div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("uplink")}
                  className="w-full py-4 bg-gradient-to-r from-[#00ffcc] to-purple-600 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,204,0.3)] cursor-pointer hover:opacity-95"
                >
                  BU STRATEGİYANI BİZNESƏ İNTEQRASİYA ET →
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 5: SECURE UPLINK / CONTACT
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "uplink" && (
            <motion.div
              key="uplink"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto border border-[#00ffcc]/30 bg-[#05050f] p-8 text-center space-y-6 shadow-[0_0_40px_rgba(0,255,204,0.2)]"
            >
              <div className="space-y-2">
                <span className="text-xs text-emerald-400 font-bold tracking-widest">[UPLINK_05 // ONLINE]</span>
                <h2 className="text-3xl sm:text-5xl font-black text-white">TƏHLÜKƏSİZ ƏLAQƏ KANALI</h2>
                <p className="text-xs text-white/60">
                  Bakı HQ • Azure Business Center • info@azveb.com • +994 50 123 45 67
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href="https://wa.me/994501234567"
                  target="_blank"
                  className="px-8 py-4 bg-[#00ffcc] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_25px_#00ffcc] hover:scale-105 transition-transform"
                >
                  WHATSAPP İLƏ ƏLAQƏ QUR
                </a>
                <button
                  onClick={() => setActiveTab("terminal")}
                  className="px-8 py-4 border border-white/20 text-white font-bold text-xs hover:border-white transition-colors"
                >
                  TERMINALA QAYIT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── BOTTOM CYBERNETIC METRICS DOCK ─── */}
      <footer className="h-12 border-t border-[#00ffcc]/20 bg-[#05050c]/90 px-6 flex items-center justify-between text-[11px] text-white/40 z-30">
        <div className="flex items-center gap-4">
          <span>SEC: <strong className="text-[#00ffcc]">AES-256</strong></span>
          <span className="hidden sm:inline">PROTOCOL: <strong className="text-white">AZVEB_AI_5.0</strong></span>
        </div>
        <div className="text-[#00ffcc] animate-pulse">
          ● MAINFRAME ACTIVE
        </div>
      </footer>
    </div>
  );
}
