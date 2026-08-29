"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import AnimatedCounter from "@/components/effects/AnimatedCounter";
import TextReveal from "@/components/effects/TextReveal";
import SectionProceduralCanvas from "@/components/effects/SectionProceduralCanvas";

const statsData = [
  { end: 150, suffix: "+", label: "clients" },
  { end: 340, suffix: "+", label: "projects" },
  { end: 280, suffix: "%", label: "growth" },
  { end: 25, suffix: "", label: "team" },
];

export default function Stats() {
  const t = useTranslations("stats");

  return (
    <section id="stats" className="relative py-24 overflow-hidden">
      {/* 3D Quantum Waves Procedural Canvas */}
      <SectionProceduralCanvas theme="quantum-waves" />
      {/* Background */}
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Divider */}
              {index > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-border" />
              )}

              <AnimatedCounter
                end={stat.end}
                suffix={stat.suffix}
                label={t(stat.label)}
                duration={2500}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
