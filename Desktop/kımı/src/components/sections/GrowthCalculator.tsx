"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { scrollToSection } from "@/hooks/useScrollNav";
import { soundManager } from "@/components/effects/SoundToggle";

interface ServiceOption {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  basePrice: number;
  expectedRoi: Record<string, string>;
}

const servicesList: ServiceOption[] = [
  {
    id: "social",
    name: {
      az: "Sosial Media İdarəetməsi & SMM",
      tr: "Sosyal Medya Yönetimi & SMM",
      en: "Social Media Management & SMM",
    },
    desc: {
      az: "Aylıq 20+ kreativ video, influencer idarəetməsi və icma böyütməsi",
      tr: "Aylık 20+ kreatif video, influencer yönetimi ve topluluk büyütme",
      en: "20+ monthly creative videos, influencer management & community growth",
    },
    basePrice: 850,
    expectedRoi: {
      az: "3.5x - 5x İzləyici Artımı",
      tr: "3.5x - 5x Takipçi Artışı",
      en: "3.5x - 5x Follower Growth",
    },
  },
  {
    id: "targeting",
    name: {
      az: "Hədəfli Reklam & Targeting (Meta / TikTok)",
      tr: "Hedefli Reklam & Targeting (Meta / TikTok)",
      en: "Targeted Ads & Performance (Meta / TikTok)",
    },
    desc: {
      az: "ROAS yönümlü dəqiq hədəfləmə, pixel optimizasiyası və A/B testləri",
      tr: "ROAS odaklı veri hedefleme, piksel optimizasyonu ve A/B testleri",
      en: "ROAS-driven audience targeting, pixel optimization & A/B testing",
    },
    basePrice: 1200,
    expectedRoi: {
      az: "4x - 8x Satış Dövrüyyəsi",
      tr: "4x - 8x Satış Cirosu",
      en: "4x - 8x Revenue Return",
    },
  },
  {
    id: "production",
    name: {
      az: "Peşəkar Foto & Video Çəkilişlər",
      tr: "Profesyonel Fotoğraf & Video Çekimleri",
      en: "Professional Photo & Video Production",
    },
    desc: {
      az: "Studio və məkan çəkilişləri, 4K keyfiyyətli məhsul və məkan videoları",
      tr: "Stüdyo ve dış çekimler, 4K ürün ve mekan tanıtımları",
      en: "Studio & on-location 4K cinematic product and commercial videos",
    },
    basePrice: 900,
    expectedRoi: {
      az: "100% Sinematik Keyfiyyət",
      tr: "100% Sinematik Kalite",
      en: "100% Cinematic Quality",
    },
  },
  {
    id: "seo",
    name: {
      az: "SEO & Google 1-ci Səhifə Dominasiyası",
      tr: "SEO & Google 1. Sayfa Dominasyonu",
      en: "SEO & Google 1st Page Domination",
    },
    desc: {
      az: "Texniki SEO, açar söz təhlili və organik trafikin sürətli yüksəlişi",
      tr: "Teknik SEO, anahtar kelime analizi ve organik trafik yükselişi",
      en: "Technical SEO, keyword strategy, and organic high-intent traffic",
    },
    basePrice: 950,
    expectedRoi: {
      az: "250%+ Pulsuz Trafik",
      tr: "250%+ Organik Ziyaretçi",
      en: "250%+ Organic Traffic",
    },
  },
  {
    id: "web",
    name: {
      az: "Ultra-Premium 3D / Web Vebsayt",
      tr: "Ultra-Premium 3D / Web Sitesi",
      en: "Ultra-Premium 3D / Web Experience",
    },
    desc: {
      az: "Next.js 16, heyrətamiz animasiyalar, maksimum sürət və satış tuneli",
      tr: "Next.js 16, akıcı animasyonlar, maksimum hız ve dönüşüm hunisi",
      en: "Next.js 16, fluid animations, peak speed and conversion funnel",
    },
    basePrice: 1800,
    expectedRoi: {
      az: "Yüksək Brend Nüfuzu",
      tr: "Yüksek Marka Prestiji",
      en: "Top-Tier Brand Prestige",
    },
  },
];

export default function GrowthCalculator() {
  const locale = useLocale();
  const [selectedServices, setSelectedServices] = useState<string[]>(["social", "targeting"]);
  const [businessScale, setBusinessScale] = useState<number>(2);

  const toggleService = (id: string) => {
    soundManager.playClick();
    setSelectedServices((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const scaleMultiplier = businessScale === 1 ? 0.8 : businessScale === 2 ? 1 : 1.4;

  const totalBudget = Math.round(
    selectedServices.reduce((sum, id) => {
      const s = servicesList.find((item) => item.id === id);
      return sum + (s ? s.basePrice : 0);
    }, 0) * scaleMultiplier
  );

  const loc = (locale === "tr" ? "tr" : locale === "en" ? "en" : "az") as "az" | "tr" | "en";

  const labels = {
    badge: {
      az: "İnteraktiv İnkişaf Kalkulyatoru",
      tr: "İnteraktif Büyüme Hesaplayıcı",
      en: "Interactive Growth Calculator",
    },
    title1: {
      az: "Biznesiniz üçün Dəqiq",
      tr: "İşletmeniz için Kusursuz",
      en: "Data-Driven Strategy for",
    },
    title2: {
      az: "Böyümə Strategiyası",
      tr: "Büyüme Stratejisi",
      en: "Your Business Growth",
    },
    subtitle: {
      az: "Ehtiyacınız olan xidmətləri və biznes miqyasınızı seçin, saniyələr içində təxmini büdcə və gözlənilən nəticəni görün.",
      tr: "İhtiyacınız olan hizmetleri ve ölçeğinizi seçin, anında tahmini bütçe ve getiri projeksiyonunu görün.",
      en: "Select your desired services and scale to instantly simulate your budget and expected ROI.",
    },
    step1: {
      az: "1. Xidmətləri Seçin (Çoxseçimli)",
      tr: "1. Hizmetleri Seçin (Çoklu Seçim)",
      en: "1. Select Services (Multi-select)",
    },
    step2: {
      az: "2. Şirkətinizin Hazırkı Miqyası",
      tr: "2. Şirketinizin Mevcut Ölçeği",
      en: "2. Your Business Scale",
    },
    scales: [
      {
        scale: 1,
        label: { az: "Startap / Kiçik", tr: "Girişim / Başlangıç", en: "Startup / Small" },
        desc: { az: "Sürətli başlanğıc", tr: "Hızlı başlangıç", en: "Fast takeoff" },
      },
      {
        scale: 2,
        label: { az: "Böyüyən Şirkət", tr: "Büyüyen İşletme", en: "Growing Business" },
        desc: { az: "Genişlənmə mərhələsi", tr: "Genişleme evresi", en: "Scaling phase" },
      },
      {
        scale: 3,
        label: { az: "Bazar Lideri / Korporativ", tr: "Pazar Lideri / Kurumsal", en: "Market Leader / Enterprise" },
        desc: { az: "Maksimum dominasiya", tr: "Maksimum pazar payı", en: "Full domination" },
      },
    ],
    cardTitle: {
      az: "Təxmini Aylıq İnvestisiya",
      tr: "Tahmini Aylık Yatırım",
      en: "Estimated Monthly Investment",
    },
    perMonth: { az: "/ ay", tr: "/ ay", en: "/ month" },
    note: {
      az: "* Layihənizin dəqiq auditindən sonra fərdi paket hazırlana bilər.",
      tr: "* Projenizin detaylı analizinden sonra özel paket oluşturulabilir.",
      en: "* Tailored packages available upon full audit.",
    },
    includes: {
      az: "Paketə Daxildir:",
      tr: "Pakete Dahildir:",
      en: "Package Includes:",
    },
    features: {
      az: [
        "Fərdi Hesab Meneceri & Həftəlik Canlı Hesabat",
        "Dönüşüm (Conversion Rate) Optimizasiyası",
        "A/B Testlər & Dərin Rəqib Təhlili",
        "24/7 VIP Texniki və Strategiya Dəstəyi",
      ],
      tr: [
        "Özel Hesap Yöneticisi & Haftalık Canlı Raporlama",
        "Dönüşüm Oranı (CRO) Optimizasyonu",
        "A/B Testleri & Derin Rakip Analizi",
        "7/24 VIP Teknik ve Strateji Desteği",
      ],
      en: [
        "Dedicated Account Manager & Weekly Live Reports",
        "Conversion Rate Optimization (CRO)",
        "A/B Testing & Deep Competitor Benchmarking",
        "24/7 VIP Technical & Strategy Advisory",
      ],
    },
    cta: {
      az: "Bu Strategiyanı Başlat",
      tr: "Bu Stratejiyi Başlat",
      en: "Launch This Strategy",
    },
  };

  return (
    <section id="calculator" className="relative py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold uppercase tracking-widest mb-4"
          >
            <Calculator className="w-4 h-4" />
            {labels.badge[loc]}
          </motion.div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {labels.title1[loc]} <span className="gradient-text">{labels.title2[loc]}</span>
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto">
            {labels.subtitle[loc]}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">
              {labels.step1[loc]}
            </h3>
            {servicesList.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleService(service.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-accent/10 border-accent shadow-[0_0_20px_rgba(255,107,53,0.2)]"
                      : "bg-surface border-border hover:border-accent/40 shadow-sm"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                          isSelected
                            ? "bg-accent border-accent text-white"
                            : "border-muted text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <h4 className="font-bold text-foreground text-base sm:text-lg">
                        {service.name[loc]}
                      </h4>
                    </div>
                    <p className="text-sm text-muted pl-7">{service.desc[loc]}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {service.expectedRoi[loc]}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            <div className="pt-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-3">
                {labels.step2[loc]}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {labels.scales.map((item) => (
                  <button
                    key={item.scale}
                    onClick={() => {
                      soundManager.playClick();
                      setBusinessScale(item.scale);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      businessScale === item.scale
                        ? "bg-accent/15 border-accent text-accent font-bold shadow-md shadow-accent/10"
                        : "bg-surface border-border text-foreground/80 hover:text-foreground hover:border-accent/40 shadow-sm"
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label[loc]}</div>
                    <div className="text-xs text-muted">{item.desc[loc]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-28">
            <div
              className="p-8 rounded-3xl border border-white/15 dark:border-white/10 relative overflow-hidden bg-[#0e0e11] text-white shadow-2xl"
              style={{
                boxShadow: "0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {labels.cardTitle[loc]}
                </span>
                <span className="flex items-center gap-1 text-xs text-accent font-semibold px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Analiz
                </span>
              </div>

              <div className="py-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                    {totalBudget} {loc === "en" ? "$" : "₼"}
                  </span>
                  <span className="text-white/50 text-sm font-medium">{labels.perMonth[loc]}</span>
                </div>
                <p className="text-xs text-white/50 mt-2">{labels.note[loc]}</p>
              </div>

              <div className="space-y-3 py-6 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {labels.includes[loc]}
                </div>
                <div className="space-y-2">
                  {labels.features[loc].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  scrollToSection("contact");
                }}
                className="w-full mt-4 py-4 rounded-xl font-bold text-white bg-accent hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/30 hover:scale-[1.02] cursor-pointer"
              >
                {labels.cta[loc]}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
