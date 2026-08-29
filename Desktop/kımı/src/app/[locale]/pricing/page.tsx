"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import MagneticButton from "@/components/effects/MagneticButton";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Başlangıç",
    price: "5.000",
    period: "TL/ay",
    description: "Küçük işletmeler ve startup'lar için ideal",
    features: [
      "Sosyal Medya Yönetimi (2 platform)",
      "Aylık 8 içerik",
      "Temel SEO Optimizasyonu",
      "Aylık Performans Raporu",
      "E-posta Desteği",
    ],
    cta: "Başla",
    popular: false,
  },
  {
    name: "Profesyonel",
    price: "12.000",
    period: "TL/ay",
    description: "Büyüyen markalar için kapsamlı çözüm",
    features: [
      "Sosyal Medya Yönetimi (4 platform)",
      "Aylık 20 içerik",
      "Gelişmiş SEO & Blog",
      "Meta & Google Ads Yönetimi",
      "Haftalık Performans Raporu",
      "Öncelikli Destek",
      "Aylık Strateji Toplantısı",
    ],
    cta: "Başla",
    popular: true,
  },
  {
    name: "Kurumsal",
    price: "Özel",
    period: "fiyatlandırma",
    description: "Büyük ölçekli projeler için özel çözümler",
    features: [
      "Tüm Platform Yönetimi",
      "Sınırsız İçerik Üretimi",
      "Tam Kapsamlı SEO & SEM",
      "Özel Yazılım Geliştirme",
      "7/24 Destek",
      "Özel Hesap Yöneticisi",
      "Aylık CEO Raporu",
    ],
    cta: "İletişime Geç",
    popular: false,
  },
];

export default function PricingPage() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Fiyatlandırma
            </motion.span>
            <TextReveal as="h1" className="text-display-lg font-bold mb-6">
              Şeffaf Fiyatlandırma
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted text-lg max-w-2xl mx-auto"
            >
              İhtiyaçlarınıza uygun paket seçin, büyüdükçe ölçeklendirin.
            </motion.p>
          </div>

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? "border-accent bg-accent/5"
                    : "border-border bg-surface"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-full">
                      <Zap className="w-4 h-4" />
                      En Popüler
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  href="/contact"
                  className={`w-full block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-border hover:bg-surface-elevated"
                  }`}
                >
                  {plan.cta}
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
