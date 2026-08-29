"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import TextReveal from "@/components/effects/TextReveal";
import MagneticButton from "@/components/effects/MagneticButton";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const t = useTranslations("contact");
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Adınız gereklidir";
    if (!formData.email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }
    if (!formData.subject.trim()) newErrors.subject = "Konu gereklidir";
    if (!formData.message.trim()) newErrors.message = "Mesajınız gereklidir";
    if (formData.message.length < 10) newErrors.message = "Mesaj en az 10 karakter olmalıdır";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
              Contact
            </motion.span>
            <TextReveal as="h1" className="text-display-lg font-bold mb-6">
              {t("title")}
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted text-lg max-w-2xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">İletişim Bilgileri</h2>

              <div className="space-y-6 mb-12">
                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">E-posta</p>
                    <a href="mailto:hello@azveb.com" className="text-muted hover:text-accent transition-colors">
                      hello@azveb.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Telefon</p>
                    <a href="tel:+902121234567" className="text-muted hover:text-accent transition-colors">
                      +90 212 123 45 67
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Adres</p>
                    <p className="text-muted">
                      Levent Mahallesi, Büyükdere Caddesi No:123<br />
                      Şişli / İstanbul
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Working Hours */}
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <h3 className="font-semibold mb-4">Çalışma Saatleri</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Pazartesi - Cuma</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Cumartesi</span>
                    <span>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Pazar</span>
                    <span className="text-muted">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface border border-border rounded-2xl p-8">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Teşekkürler!</h3>
                  <p className="text-muted">{t("form.success")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-sm text-red-400">{t("form.error")}</p>
                    </motion.div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t("form.name")}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-surface-elevated border ${
                        errors.name ? "border-red-500" : "border-border"
                      } focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all`}
                      placeholder="Adınız Soyadınız"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t("form.email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-surface-elevated border ${
                        errors.email ? "border-red-500" : "border-border"
                      } focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      {t("form.subject")}
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-surface-elevated border ${
                        errors.subject ? "border-red-500" : "border-border"
                      } focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all`}
                      placeholder="Proje hakkında bilgi almak istiyorum"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {t("form.message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl bg-surface-elevated border ${
                        errors.message ? "border-red-500" : "border-border"
                      } focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none`}
                      placeholder="Mesajınızı buraya yazın..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <MagneticButton
                    onClick={() => {}}
                    className="w-full"
                  >
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t("form.submit")}
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
