"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Layers,
  Cpu,
  Sliders,
  Briefcase,
  Save,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Plus,
  Trash2,
  Eye,
  Camera,
  Code2,
  Share2,
  Palette,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { defaultSettings, SiteSettings, PortfolioItem, PortfolioCategory } from "@/lib/siteSettings";
import { soundManager } from "@/components/effects/SoundToggle";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "features" | "services" | "portfolio">("portfolio");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New portfolio item modal state
  const [newProject, setNewProject] = useState<PortfolioItem>({
    id: String(Date.now()),
    title: "",
    category: "smm",
    client: "",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    stats: "+250% Satış Artımı",
    roas: "6.5x ROAS",
    desc: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch((err) => console.error("Could not fetch settings:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    soundManager.playClick();

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      alert("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) {
      alert("Zəhmət olmasa layihə başlığını daxil edin.");
      return;
    }

    soundManager.playClick();
    const itemToAdd: PortfolioItem = {
      ...newProject,
      id: String(Date.now()),
    };

    setSettings((prev) => ({
      ...prev,
      portfolio: [itemToAdd, ...prev.portfolio],
    }));

    setIsAddingNew(false);
    setNewProject({
      id: String(Date.now()),
      title: "",
      category: "smm",
      client: "",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      stats: "+250% Satış Artımı",
      roas: "6.5x ROAS",
      desc: "",
    });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Bu layihəni silmək istədiyinizə əminsiniz?")) {
      soundManager.playClick();
      setSettings((prev) => ({
        ...prev,
        portfolio: prev.portfolio.filter((p) => p.id !== id),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col">
      {/* ─── TOP NAVBAR ─── */}
      <header className="h-20 border-b border-white/10 bg-[#07070e]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold">
              Azveb <span className="gradient-text">İnfrastruktur Paneli</span>
            </h1>
            <p className="text-xs font-mono text-white/40">SMM, Çəkiliş & Development İdarəsi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/az"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-xs font-bold transition-all text-white/80"
          >
            <Eye className="w-3.5 h-3.5" /> Saytı Canlı İzlə
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-lg shadow-accent/30 hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveSuccess ? "Yadda Saxlanıldı!" : "Dəyişiklikləri Tətbiq Et"}
          </button>

          <button
            onClick={() => router.push("/admin/login")}
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
            title="Çıxış"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-3 space-y-2 sticky top-28">
          {[
            { id: "portfolio", label: "Portfel & Əl İşləri", icon: Briefcase, desc: "SMM, Çəkiliş & Dev yükləmə" },
            { id: "services", label: "Xidmətlər Qalereyası", icon: Sliders, desc: "Bento xidmət kartları" },
            { id: "features", label: "Efektlər & Mühərriklər", icon: Cpu, desc: "3D, WebGL və səs açarları" },
            { id: "hero", label: "Hero & Başlıqlar", icon: Layers, desc: "Əsas şüar və düymələr" },
            { id: "general", label: "Ümumi Məlumatlar", icon: Globe, desc: "Əlaqə, ünvan & sosial" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600/20 border-indigo-400 text-white shadow-lg shadow-indigo-600/10"
                  : "bg-[#07070e] border-white/5 text-white/50 hover:text-white hover:border-white/15"
              }`}
            >
              <tab.icon className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? "text-indigo-400" : "text-white/40"}`} />
              <div>
                <div className="text-sm font-bold">{tab.label}</div>
                <div className="text-xs text-white/40">{tab.desc}</div>
              </div>
            </button>
          ))}
        </aside>

        {/* Tab Panels */}
        <main className="md:col-span-9 rounded-3xl border border-white/10 bg-[#07070e] p-8 shadow-2xl">
          {/* ─────────────────────────────────────────────────────────────
              TAB: PORTFOLIO MANAGEMENT (SMM, Prodakşn, Development)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Portfel & Əl İşləri İdarəetməsi</h2>
                  <p className="text-xs text-white/40 mt-1">İstənilən sayda SMM, Video/Foto Çəkiliş və Veb layihələrinizi dərhal əlavə edin və kateqoriyalara bölün.</p>
                </div>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Yeni Layihə Əlavə Et
                </button>
              </div>

              {/* ─── ADD NEW PROJECT FORM MODAL ─── */}
              {isAddingNew && (
                <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Yeni Əl İşi Formu
                    </span>
                    <button
                      onClick={() => setIsAddingNew(false)}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      Ləğv et
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5">Layihənin Adı</label>
                      <input
                        type="text"
                        placeholder="Məs: Baku City Fashion Reels & SMM"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5">Kateqoriya</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm"
                      >
                        <option value="smm">📱 SMM & Targetinq</option>
                        <option value="production">🎬 Video & Foto Çəkiliş</option>
                        <option value="development">💻 Veb & Development</option>
                        <option value="branding">🎨 Brendinq & Dizayn</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5">Müştəri / Brend Adı</label>
                      <input
                        type="text"
                        placeholder="Məs: Baku City Group"
                        value={newProject.client}
                        onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5">Nəticə Göstəricisi</label>
                      <input
                        type="text"
                        placeholder="Məs: +450% Satış Artımı / 2M Baxış"
                        value={newProject.stats}
                        onChange={(e) => setNewProject({ ...newProject, stats: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-white/60 mb-1.5">Şəkil URL-i (Və ya Birbaşa Link)</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newProject.image}
                        onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-white/60 mb-1.5">Layihə Haqqında Qısa İzah</label>
                      <textarea
                        rows={2}
                        placeholder="Görülən işlər, çəkiliş detalları və qazanılan uğur..."
                        value={newProject.desc}
                        onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleAddProject}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      Portfelə Əlavə Et
                    </button>
                  </div>
                </div>
              )}

              {/* ─── EXISTING PROJECTS LIST ─── */}
              <div className="space-y-4">
                {settings.portfolio.map((proj, idx) => (
                  <div key={proj.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                          #{idx + 1} // {proj.category}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                          {proj.client || "Müştəri"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                        title="Layihəni Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Layihə Başlığı</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...settings.portfolio];
                            updated[idx].title = e.target.value;
                            setSettings({ ...settings, portfolio: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Kateqoriya</label>
                        <select
                          value={proj.category}
                          onChange={(e) => {
                            const updated = [...settings.portfolio];
                            updated[idx].category = e.target.value as any;
                            setSettings({ ...settings, portfolio: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold"
                        >
                          <option value="smm">SMM & Targetinq</option>
                          <option value="production">Video & Foto Çəkiliş</option>
                          <option value="development">Veb & Development</option>
                          <option value="branding">Brendinq & Dizayn</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Nəticə Göstəricisi</label>
                        <input
                          type="text"
                          value={proj.stats}
                          onChange={(e) => {
                            const updated = [...settings.portfolio];
                            updated[idx].stats = e.target.value;
                            setSettings({ ...settings, portfolio: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-accent font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Şəkil URL-i</label>
                        <input
                          type="text"
                          value={proj.image}
                          onChange={(e) => {
                            const updated = [...settings.portfolio];
                            updated[idx].image = e.target.value;
                            setSettings({ ...settings, portfolio: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-white/40 mb-1">Təsvir</label>
                      <textarea
                        rows={2}
                        value={proj.desc}
                        onChange={(e) => {
                          const updated = [...settings.portfolio];
                          updated[idx].desc = e.target.value;
                          setSettings({ ...settings, portfolio: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB: SERVICES
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold">Xidmətlər Siyahısı</h2>
                <p className="text-xs text-white/40 mt-1">Saytda nümayiş olunan bütün rəqəmsal marketinq və prodakşn xidmətlərini idarə edin.</p>
              </div>

              <div className="space-y-4">
                {settings.services.map((serv, idx) => (
                  <div key={serv.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Xidmət #{idx + 1}</span>
                      <input
                        type="text"
                        value={serv.tag}
                        placeholder="Tag (məs: 4x Satış)"
                        onChange={(e) => {
                          const updated = [...settings.services];
                          updated[idx].tag = e.target.value;
                          setSettings({ ...settings, services: updated });
                        }}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-accent font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      value={serv.title}
                      onChange={(e) => {
                        const updated = [...settings.services];
                        updated[idx].title = e.target.value;
                        setSettings({ ...settings, services: updated });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-sm"
                    />
                    <textarea
                      rows={2}
                      value={serv.desc}
                      onChange={(e) => {
                        const updated = [...settings.services];
                        updated[idx].desc = e.target.value;
                        setSettings({ ...settings, services: updated });
                      }}
                      className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB: FEATURES & ENGINES
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "features" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold">Mühərriklər & Qrafik Efektlərin İdarəsi</h2>
                <p className="text-xs text-white/40 mt-1">İstənilən vizual modulu (3D kadrlar, WebGL şüşə dalğalanması, AI terminal) bir kliklə aktivləşdirin və ya söndürün.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "enableFluidDistortion", label: "WebGL Maye Şüşə Refraksiyası", desc: "Siçanın arxasınca dalğalanan optik şüşə" },
                  { id: "enableHologramTerminal", label: "AI Canlı Strategiya Terminalı", desc: "Real-vaxtda holoqrafik bazar simulyatoru" },
                  { id: "enable3DSequence", label: "180 Kadrlıq 3D Skroll Mühərriki", desc: "Apple üslubunda fırlanan kadr skrollu" },
                  { id: "enableSoundFx", label: "Web Audio İnteraktiv Səs Sintezi", desc: "Mikro-akustik hover & click reaksiyaları" },
                  { id: "enableParticles", label: "Daimi Axan Kiber Qravitasiya Şəbəkəsi", desc: "Bütün bölmələrdə fırlanan 3D şəbəkələr" },
                ].map((item) => {
                  const isEnabled = settings.features[item.id as keyof SiteSettings["features"]];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSettings({
                          ...settings,
                          features: {
                            ...settings.features,
                            [item.id as keyof SiteSettings["features"]]: !isEnabled,
                          },
                        });
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isEnabled
                          ? "bg-indigo-600/15 border-indigo-400 shadow-md shadow-indigo-500/10"
                          : "bg-white/[0.02] border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{item.label}</div>
                        <div className="text-xs text-white/40">{item.desc}</div>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isEnabled ? "bg-indigo-500" : "bg-white/10"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? "translate-x-6" : "translate-x-0"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB: HERO HEADLINES
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold">Ana Səhifə (Hero) Başlıqları</h2>
                <p className="text-xs text-white/40 mt-1">Ziyarətçilərin sayta daxil olduqda gördüyü ilk şüar və düymə mətnləri.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Yuxarı Nişan (Badge)</label>
                  <input
                    type="text"
                    value={settings.hero.badge}
                    onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, badge: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Əsas Başlıq</label>
                    <input
                      type="text"
                      value={settings.hero.title}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Rəngli Vurğu (Highlight)</label>
                    <input
                      type="text"
                      value={settings.hero.titleHighlight}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, titleHighlight: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Alt İzah Mətni</label>
                  <textarea
                    rows={3}
                    value={settings.hero.subtitle}
                    onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB: GENERAL
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold">Ümumi Sayt Məlumatları & Əlaqə</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Agentlik Adı</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Telefon</label>
                  <input
                    type="text"
                    value={settings.general.phone}
                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, phone: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
