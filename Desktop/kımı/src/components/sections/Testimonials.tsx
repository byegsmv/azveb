"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonialsData = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    role: "CEO, ModaX",
    content: "Azveb Media ile çalışmaya başladıktan sonra organik trafiğimiz %340 arttı. Ekip sadece teknik uzmanlık değil, aynı zamanda iş stratejisi anlayışı da getiriyor.",
    rating: 5,
    avatar: "AY",
  },
  {
    id: 2,
    name: "Selin Kaya",
    role: "Marketing Director, CloudSync",
    content: "SaaS ürünümüzün lansman kampanyası tam bir başarıydı. İlk ayda 10.000 kayıt ve 6 ayda $2M ARR'ye ulaştık. Sonuçlar konuşuyor.",
    rating: 5,
    avatar: "SK",
  },
  {
    id: 3,
    name: "Mehmet Demir",
    role: "Founder, Lezzet Grill",
    content: "Sosyal medya stratejimizi tamamen değiştirdiler. 8 ayda 500K takipçi ve 4 kat daha yüksek etkileşim oranı. Harika bir ekip.",
    rating: 5,
    avatar: "MD",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.3 });

  const next = () => setCurrent((prev) => (prev + 1) % testimonialsData.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-surface" />

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h2 className="text-display-md font-bold">Müşterilerimiz Ne Diyor?</h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-surface-elevated border border-border rounded-3xl p-8 md:p-12"
            >
              <Quote className="w-12 h-12 text-accent/30 mb-6" />

              <p className="text-xl md:text-2xl leading-relaxed mb-8 font-medium">
                "{testimonialsData[current].content}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
                    {testimonialsData[current].avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonialsData[current].name}</p>
                    <p className="text-muted text-sm">{testimonialsData[current].role}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: testimonialsData[current].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-border hover:bg-surface-elevated transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current ? "w-8 bg-accent" : "bg-border hover:bg-muted"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full border border-border hover:bg-surface-elevated transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
