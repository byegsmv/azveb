"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import { Search, Lightbulb, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Keşif & Analiz",
    description: "Markanızı, rakiplerinizi ve hedef kitlenizi derinlemesine analiz ediyoruz. Veriye dayalı strateji oluşturuyoruz.",
    icon: Search,
    color: "#ff6b35",
  },
  {
    number: "02",
    title: "Strateji & Planlama",
    description: "Özel stratejinizi oluşturuyor, kanalları belirliyor ve net KPI'lar koyuyoruz.",
    icon: Lightbulb,
    color: "#6366f1",
  },
  {
    number: "03",
    title: "Uygulama & Yürütme",
    description: "Stratejiyi hayata geçiriyor, içerik üretiyor ve kampanyaları yönetiyoruz.",
    icon: Rocket,
    color: "#10b981",
  },
  {
    number: "04",
    title: "Ölçüm & Optimize",
    description: "Sürekli performans analizi yapıyor, A/B testleri uyguluyor ve ROI'yi maksimize ediyoruz.",
    icon: BarChart3,
    color: "#f59e0b",
  },
];

export default function Process() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Our Process
          </motion.span>
          <TextReveal as="h2" className="text-display-lg font-bold mb-6">
            Nasıl Çalışıyoruz?
          </TextReveal>
        </div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent/50 to-transparent"
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                  />
                </div>
              )}

              <div className="relative p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all group-hover:-translate-y-2 duration-300">
                {/* Step Number */}
                <span
                  className="text-6xl font-bold opacity-10 absolute top-4 right-4"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
