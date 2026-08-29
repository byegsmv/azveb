"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import {
  Sparkles,
  Award,
  ExternalLink,
  Share2,
  Camera,
  Code2,
  Palette,
  Layers,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import { scrollToSection } from "@/hooks/useScrollNav";
import { defaultSettings, PortfolioCategory, PortfolioItem } from "@/lib/siteSettings";

export default function SpatialProjectDeck() {
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("all");
  const [projects, setProjects] = useState<PortfolioItem[]>(defaultSettings.portfolio);
  const [activeProject, setActiveProject] = useState<PortfolioItem | null>(null);

  // Sync with live Admin Panel database settings
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.portfolio?.length > 0) {
          setProjects(res.data.portfolio);
        }
      })
      .catch((e) => console.log("Using cached portfolio items:", e));
  }, []);

  const categories: { id: PortfolioCategory; label: string; icon: any }[] = [
    { id: "all", label: "Bütün İşlər", icon: Layers },
    { id: "smm", label: "SMM & Targetinq", icon: Share2 },
    { id: "production", label: "Video & Foto Çəkiliş", icon: Camera },
    { id: "development", label: "Veb & Development", icon: Code2 },
    { id: "branding", label: "Brendinq & Dizayn", icon: Palette },
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden bg-[#030305] text-white">
      {/* Dynamic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md"
          >
            <Award className="w-4 h-4" />
            Seçilmiş İşlərimiz & Uğur Hekayələri
          </motion.div>

          <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white mb-4">
            Rəqəmlərlə <span className="gradient-text">Sübut Olunmuş Nəticələr</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            SMM, 4K Prodakşn və Ultra-Premium Development sahəsində həyata keçirdiyimiz real keyslər.
          </p>
        </div>

        {/* ─── CATEGORY FILTER TABS ─── */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-16">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 border-transparent text-white shadow-lg shadow-indigo-500/25 scale-105"
                    : "bg-[#090912] border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/[0.04]"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ─── 3D SPATIAL CARDS GRID ─── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => {
                  soundManager.playClick();
                  setActiveProject(project);
                }}
                className="group relative rounded-3xl border border-white/10 bg-[#080811]/90 backdrop-blur-xl overflow-hidden p-6 cursor-pointer shadow-2xl hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                {/* Image Container with Parallax Zoom */}
                <div>
                  <div className="relative h-60 rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                    {/* Top Category Badge */}
                    <span className="absolute top-4 left-4 text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30 uppercase">
                      {project.category}
                    </span>

                    {/* Bottom Result Badge */}
                    <span className="absolute bottom-4 left-4 text-xs font-bold text-accent px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-accent/40 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {project.stats}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/40">{project.client}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        {project.roas}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {project.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Interactive Link */}
                <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/60 group-hover:text-white">
                  <span>Layihəni İncələ</span>
                  <ExternalLink className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ─── BOTTOM CTA ─── */}
        <div className="mt-20 text-center">
          <button
            onClick={() => {
              soundManager.playClick();
              scrollToSection("contact");
            }}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:opacity-95 transition-all shadow-2xl shadow-indigo-500/30 hover:scale-105 cursor-pointer text-base"
          >
            <Sparkles className="w-5 h-5" />
            Öz Layihəniz Üçün Konsultasiya Alın
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── FULLSCREEN MODAL DETAILS (Lightbox) ─── */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-2xl p-4 sm:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full rounded-3xl border border-white/15 bg-[#090914] overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    {activeProject.category}
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    Nəticə: {activeProject.stats} ({activeProject.roas})
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {activeProject.title}
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {activeProject.desc}
                </p>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setActiveProject(null)}
                    className="px-6 py-2.5 rounded-xl border border-white/20 text-white/80 hover:text-white text-xs font-bold"
                  >
                    Bağla
                  </button>
                  <button
                    onClick={() => {
                      setActiveProject(null);
                      scrollToSection("contact");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-lg shadow-accent/30"
                  >
                    Bunun Kimi Bir Layihə Başlat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
