"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import ParallaxWrapper from "@/components/effects/ParallaxWrapper";
import { Target, Users, Zap, Award } from "lucide-react";

const values = [
  { icon: Target, title: "Sonuç Odaklı", description: "Her stratejimiz ölçülebilir sonuçlar üzerine kuruludur." },
  { icon: Users, title: "İş Birliği", description: "Müşterilerimizle ortak çalışarak en iyi sonuçları elde ederiz." },
  { icon: Zap, title: "Yenilikçilik", description: "Sürekli gelişen dijital dünyada en güncel yaklaşımları kullanırız." },
  { icon: Award, title: "Kalite", description: "Her projede en yüksek kalite standartlarını hedefleriz." },
];

const team = [
  { name: "Ahmet Yılmaz", role: "Founder & CEO", initials: "AY" },
  { name: "Selin Kaya", role: "Creative Director", initials: "SK" },
  { name: "Mehmet Demir", role: "Head of Strategy", initials: "MD" },
  { name: "Zeynep Aydın", role: "Lead Developer", initials: "ZA" },
];

export default function AboutPage() {
  const { ref: valuesRef, isInView: valuesInView } = useInView({ threshold: 0.1 });
  const { ref: teamRef, isInView: teamInView } = useInView({ threshold: 0.1 });

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
              Hakkımızda
            </span>
            <h1 className="text-display-lg font-bold mb-6">
              Dijital Dünyada <span className="gradient-text">Fark Yaratan</span> Bir Ajans
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              2018'den beri markaların dijital dönüşümüne öncülük ediyoruz. Veriye dayalı stratejiler, 
              yaratıcı çözümler ve sürdürülebilir büyüme odaklı yaklaşımımızla 150'den fazla markaya hizmet verdik.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ParallaxWrapper speed={0.3}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-surface-elevated border border-border overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                    alt="Azveb Media Team"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-2xl border border-accent/20" />
              </div>
            </ParallaxWrapper>

            <div>
              <TextReveal as="h2" className="text-display-md font-bold mb-6">
                Misyonumuz
              </TextReveal>
              <p className="text-muted leading-relaxed mb-6">
                Markaların dijital potansiyellerini keşfetmelerine ve gerçekleştirmelerine yardımcı olmak. 
                Teknoloji, yaratıcılık ve stratejinin gücünü birleştirerek sürdürülebilir büyüme sağlamak.
              </p>
              <p className="text-muted leading-relaxed">
                Her projeye özel yaklaşımımız ve uzman ekibimizle, müşterilerimizin hedeflerine 
                ulaşmalarını sağlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <TextReveal as="h2" className="text-display-md font-bold mb-4">
              Değerlerimiz
            </TextReveal>
          </div>

          <motion.div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-muted text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <TextReveal as="h2" className="text-display-md font-bold mb-4">
              Ekibimiz
            </TextReveal>
            <p className="text-muted">Tutkulu uzmanlardan oluşan ekibimizle tanışın</p>
          </div>

          <motion.div
            ref={teamRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={teamInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <span className="text-2xl font-bold text-accent">{member.initials}</span>
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-muted text-sm">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
