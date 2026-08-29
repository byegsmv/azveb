"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import { MapPin, Briefcase, Clock, ChevronDown, CheckCircle } from "lucide-react";

const careers = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote / Istanbul",
    type: "Full-time",
    description: "Next.js ve React ekosisteminde uzman, performans odaklı frontend geliştirici arıyoruz.",
    requirements: [
      "5+ yıl React deneyimi",
      "TypeScript ve Next.js uzmanlığı",
      "Tailwind CSS ve modern CSS",
      "Web performans optimizasyonu",
      "Takım çalışması ve iletişim becerileri",
    ],
  },
  {
    id: 2,
    title: "Social Media Manager",
    department: "Marketing",
    location: "Istanbul",
    type: "Full-time",
    description: "Çeşitli müşteri portföyümüz için sosyal medya stratejileri geliştirecek yaratıcı bir yönetici.",
    requirements: [
      "3+ yıl sosyal medya yönetimi deneyimi",
      "İçerik üretimi ve yaratıcılık",
      "Analytics araçları (Google Analytics, Meta Business Suite)",
      "Türkçe ve İngilizce yeterlilik",
      "Trend takibi ve hızlı adapte olma",
    ],
  },
  {
    id: 3,
    title: "SEO Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Organik büyümeyi teknik SEO ve içerik stratejileri ile yönlendirecek uzman.",
    requirements: [
      "Teknik SEO uzmanlığı",
      "İçerik stratejisi deneyimi",
      "Google Analytics ve Search Console",
      "SEMrush / Ahrefs deneyimi",
      "Veri analizi yetkinliği",
    ],
  },
  {
    id: 4,
    title: "Content Creator",
    department: "Creative",
    location: "Istanbul",
    type: "Full-time",
    description: "Video, fotoğraf ve yazılı içerik üretecek, marka hikayeleri anlatan yaratıcı.",
    requirements: [
      "Video ve fotoğraf çekimi deneyimi",
      "Adobe Creative Suite (Premiere, Photoshop)",
      "Sosyal medya içerik formatları bilgisi",
      "Yaratıcı hikaye anlatımı",
      "Portfolyo sunumu",
    ],
  },
];

export default function CareersPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.05 });

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Kariyer
            </motion.span>
            <TextReveal as="h1" className="text-display-lg font-bold mb-6">
              Ekibimize Katılın
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted text-lg"
            >
              Tutkulu, yaratıcı ve sonuç odaklı profesyoneller arıyoruz.
            </motion.p>
          </div>

          <motion.div ref={ref} className="space-y-4">
            {careers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expandedId === career.id ? null : career.id)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{career.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {career.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {career.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {career.type}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === career.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedId === career.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-border pt-4">
                        <p className="text-muted mb-4">{career.description}</p>
                        <h4 className="font-semibold mb-3">Gereksinimler:</h4>
                        <ul className="space-y-2 mb-6">
                          {career.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm text-muted">
                              <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <button className="px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover transition-colors">
                          Başvur
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
