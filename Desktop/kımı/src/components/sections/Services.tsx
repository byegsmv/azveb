"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import BentoCard from "@/components/effects/BentoCard";
import SectionProceduralCanvas from "@/components/effects/SectionProceduralCanvas";
import {
  Share2,
  Target,
  Camera,
  Film,
  Users,
  Search,
  Megaphone,
  Palette,
  Globe,
} from "lucide-react";

const serviceIcons = [
  Share2,
  Target,
  Camera,
  Film,
  Users,
  Search,
  Megaphone,
  Palette,
  Globe,
];

const serviceKeys = [
  "social_media",
  "targeting",
  "production",
  "reels",
  "influencer",
  "seo",
  "ads",
  "branding",
  "web",
];

export default function Services() {
  const t = useTranslations("services");
  const { ref, isInView } = useInView({ threshold: 0.05 });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  // Bento layout classes for 9 items (balanced aesthetic grid)
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[380px]"; // SMM Featured
      case 1:
        return "md:col-span-2 lg:col-span-2"; // Targeting Wide
      case 2:
        return "md:col-span-2 lg:col-span-2"; // Production / Shooting
      case 3:
        return "md:col-span-1 lg:col-span-1"; // Reels
      case 4:
        return "md:col-span-1 lg:col-span-1"; // Influencer
      case 5:
        return "md:col-span-2 lg:col-span-2"; // SEO
      case 6:
        return "md:col-span-2 lg:col-span-2"; // Ads
      case 7:
        return "md:col-span-1 lg:col-span-1"; // Branding
      case 8:
        return "md:col-span-1 lg:col-span-1"; // Web
      default:
        return "md:col-span-2 lg:col-span-1";
    }
  };

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* 3D Matrix Nodes Procedural Virtual Frame Engine */}
      <SectionProceduralCanvas theme="matrix-nodes" />

      {/* Dynamic Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold uppercase tracking-widest mb-6"
          >
            {t("badge", { fallback: "Xidmətlərimiz" })}
          </motion.span>
          <TextReveal
            as="h2"
            className="text-display-lg font-bold mb-6 tracking-tight"
            delay={0.1}
          >
            {t("title")}
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-muted text-xl max-w-3xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6"
          style={{ perspective: "1200px" }}
        >
          {serviceKeys.map((key, index) => {
            const Icon = serviceIcons[index];
            return (
              <BentoCard
                key={key}
                index={index}
                title={t(`${key}.title`)}
                description={t(`${key}.description`)}
                Icon={Icon}
                className={getBentoClasses(index)}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
