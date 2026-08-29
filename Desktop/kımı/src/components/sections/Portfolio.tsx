"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useInView } from "@/hooks/useInView";
import { scrollToSection } from "@/hooks/useScrollNav";
import TextReveal from "@/components/effects/TextReveal";
import { ArrowUpRight, TrendingUp, Users, Eye } from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import SectionProceduralCanvas from "@/components/effects/SectionProceduralCanvas";

const caseStudiesData = [
  {
    id: 1,
    title: {
      az: "E-Ticarət Brendinin Satış Transformasiyası",
      tr: "E-Ticaret Marka Dönüşüm & Satış Kampanyası",
      en: "E-Commerce Brand Scale & Transformation",
    },
    client: "ModaX Baku",
    industry: {
      az: "E-Ticarət & Moda",
      tr: "E-Ticaret & Moda",
      en: "E-Commerce & Fashion",
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    stats: [
      {
        icon: TrendingUp,
        value: "340%",
        label: { az: "Trafik Artımı", tr: "Trafik Artışı", en: "Traffic Surge" },
      },
      {
        icon: Users,
        value: "2.5x",
        label: { az: "Konversiya Dərəcəsi", tr: "Dönüşüm Oranı", en: "Conversion Rate" },
      },
    ],
    tags: ["Targeting", "Video Production", "SEO"],
    color: "#ff6b35",
  },
  {
    id: 2,
    title: {
      az: "SaaS Startapının Qlobal Bazara Çıxışı",
      tr: "SaaS Girişiminin Global Lansman Stratejisi",
      en: "SaaS Startup Global Launch Campaign",
    },
    client: "CloudSync Pro",
    industry: {
      az: "Texnologiya & SaaS",
      tr: "Teknoloji & SaaS",
      en: "Tech & SaaS",
    },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    stats: [
      {
        icon: Users,
        value: "10K+",
        label: { az: "Yeni Qeydiyyat", tr: "Kayıtlı Kullanıcı", en: "New Signups" },
      },
      {
        icon: TrendingUp,
        value: "$2M+",
        label: { az: "6 Aylıq ARR", tr: "6 Aylık ARR", en: "ARR in 6mo" },
      },
    ],
    tags: ["Performance Ads", "Viral Content", "360° Branding"],
    color: "#6366f1",
  },
  {
    id: 3,
    title: {
      az: "Premium Restoran Şəbəkəsinin Viral İnkişafı",
      tr: "Restoran Zincirinin Sosyal Medya Büyümesi",
      en: "Restaurant Chain Viral Social Explosion",
    },
    client: "Lezzet Gourmet",
    industry: {
      az: "Qida & Restoran",
      tr: "Yeme & İçme",
      en: "Food & Beverage",
    },
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    stats: [
      {
        icon: Eye,
        value: "500K+",
        label: { az: "Reels Baxışı", tr: "Reels İzlenmesi", en: "Reels Views" },
      },
      {
        icon: TrendingUp,
        value: "4x",
        label: { az: "Müştəri Axını", tr: "Müşteri Etkileşimi", en: "Engagement" },
      },
    ],
    tags: ["Reels & TikTok", "Influencer PR", "Targeting"],
    color: "#10b981",
  },
];

export default function Portfolio() {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const loc = (locale === "tr" ? "tr" : locale === "en" ? "en" : "az") as "az" | "tr" | "en";
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      {/* 3D Cyber Hypercube Procedural Virtual Frame Engine */}
      <SectionProceduralCanvas theme="cyber-hypercube" />

      {/* Dynamic Ambient Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Portfolio
          </motion.span>
          <TextReveal as="h2" className="text-display-lg font-bold mb-6 tracking-tight" delay={0.1}>
            {t("title")}
          </TextReveal>
          <p className="text-muted text-xl max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Case Studies Grid */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {caseStudiesData.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => {
                soundManager.playHover();
                setHoveredId(study.id);
              }}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative rounded-3xl overflow-hidden bg-surface/80 border border-white/10 hover:border-accent/40 transition-all shadow-xl backdrop-blur-sm flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={study.image}
                  alt={study.title[loc]}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredId === study.id ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

                {/* Industry Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-semibold text-white shadow-md backdrop-blur-md"
                    style={{ backgroundColor: study.color }}
                  >
                    {study.industry[loc]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-accent text-xs font-bold tracking-wider uppercase mb-1.5">
                    {study.client}
                  </p>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-accent transition-colors leading-snug">
                    {study.title[loc]}
                  </h3>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    {study.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <stat.icon className="w-4 h-4 text-accent shrink-0" />
                        <div>
                          <p className="font-extrabold text-sm text-white">{stat.value}</p>
                          <p className="text-muted text-[11px] leading-tight">{stat.label[loc]}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-white/[0.04] text-white/70 border border-white/10 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    scrollToSection("contact");
                  }}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-sm font-semibold text-accent hover:text-accent-hover transition-all cursor-pointer group/btn"
                >
                  <span>{t("view_case")}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
