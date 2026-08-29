"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "2026'da SEO: Yapay Zeka ve Arama Motorları",
    excerpt: "Google'ın AI Overview özelliği ve yeni arama algoritmaları karşısında SEO stratejilerinizi nasıl güncellemelisiniz?",
    category: "SEO",
    date: "15 Ocak 2026",
    readTime: "8 dk",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
  },
  {
    id: 2,
    title: "Sosyal Medya Trendleri: Kısa Form Video Stratejileri",
    excerpt: "Reels, Shorts ve TikTok için etkili içerik stratejileri ve büyüme taktikleri.",
    category: "Sosyal Medya",
    date: "10 Ocak 2026",
    readTime: "6 dk",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
  },
  {
    id: 3,
    title: "E-Ticaret Dönüşüm Optimizasyonu Rehberi",
    excerpt: "Sepet terk oranını azaltan ve dönüşümü artıran kanıtlanmış CRO taktikleri.",
    category: "E-Ticaret",
    date: "5 Ocak 2026",
    readTime: "10 dk",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  },
  {
    id: 4,
    title: "Marka Hikaye Anlatımı: Bağlantı Kurmanın Gücü",
    excerpt: "Duygusal bağlantı kuran marka hikayeleri nasıl yazılır? Örnekler ve çerçeveler.",
    category: "Marka",
    date: "28 Aralık 2025",
    readTime: "7 dk",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  },
  {
    id: 5,
    title: "Meta Ads 2026: Yeni Hedefleme ve Optimizasyon",
    excerpt: "iOS 14 sonrası dönemde Meta Ads kampanyalarınızı optimize etme stratejileri.",
    category: "Reklam",
    date: "20 Aralık 2025",
    readTime: "9 dk",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    id: 6,
    title: "İçerik Takvimi Oluşturma: 30 Günlük Plan",
    excerpt: "Sosyal medya ve blog için sürdürülebilir içerik takvimi nasıl oluşturulur?",
    category: "İçerik",
    date: "15 Aralık 2025",
    readTime: "5 dk",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
  },
];

export default function BlogPage() {
  const { ref, isInView } = useInView({ threshold: 0.05 });

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
              Blog
            </motion.span>
            <TextReveal as="h1" className="text-display-lg font-bold mb-6">
              Dijital Dünyadan İçgörüler
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted text-lg max-w-2xl mx-auto"
            >
              Dijital pazarlama, SEO, sosyal medya ve marka stratejisi hakkında uzman içerikler.
            </motion.p>
          </div>

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-muted text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Devamını Oku
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
