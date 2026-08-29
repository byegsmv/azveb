"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/effects/MagneticButton";
import { ArrowRight, Sparkles } from "lucide-react";
import { scrollToSection } from "@/hooks/useScrollNav";
import { soundManager } from "@/components/effects/SoundToggle";
import SectionProceduralCanvas from "@/components/effects/SectionProceduralCanvas";

export default function CTA() {
  const t = useTranslations("cta");

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* 3D Energy Core Procedural Virtual Frame Engine */}
      <SectionProceduralCanvas theme="energy-core" />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-accent/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />

      {/* Animated border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-8"
          >
            <Sparkles className="w-8 h-8 text-accent" />
          </motion.div>

          <h2 className="text-display-lg font-bold mb-6 text-white">
            {t("title")}{" "}
            <span className="gradient-text">{t("title_highlight")}</span>
          </h2>

          <p className="text-muted text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              onClick={() => {
                soundManager.playClick();
                scrollToSection("calculator");
              }}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-hover transition-colors shadow-xl shadow-accent/25 cursor-pointer"
            >
              {t("button_primary")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <MagneticButton
              onClick={() => {
                soundManager.playClick();
                scrollToSection("calculator");
              }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              {t("button_secondary")}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
