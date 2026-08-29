"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { scrollToSection } from "@/hooks/useScrollNav";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold">
                Azveb <span className="text-accent">Media</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {t("tagline")}
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:hello@azveb.com" className="flex items-center gap-2 text-muted hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                hello@azveb.com
              </a>
              <a href="tel:+902121234567" className="flex items-center gap-2 text-muted hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                +90 212 123 45 67
              </a>
              <span className="flex items-center gap-2 text-muted">
                <MapPin className="w-4 h-4" />
                Istanbul, Türkiye
              </span>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("links.company")}</h3>
            <ul className="space-y-3">
              {[
                { key: "services", id: "services" },
                { key: "stats", id: "stats" },
                { key: "portfolio", id: "portfolio" },
                { key: "calculator", id: "calculator" },
                { key: "contact", id: "contact" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-muted text-sm hover:text-accent transition-colors flex items-center gap-1 group cursor-pointer"
                  >
                    {tNav(item.key)}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t("links.services")}</h3>
            <ul className="space-y-3">
              {[
                "Sosyal Medya",
                "SEO & Organik Büyüme",
                "Dijital Reklamcılık",
                "Marka Stratejisi",
                "Web Tasarım",
                "İçerik Üretimi",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-muted text-sm hover:text-accent transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t("links.legal")}</h3>
            <ul className="space-y-3">
              {["Gizlilik Politikası", "Kullanım Koşulları", "Çerez Politikası"].map((item) => (
                <li key={item}>
                  <span className="text-muted text-sm cursor-pointer hover:text-accent transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Azveb Media. {t("rights")}
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "LinkedIn", "Twitter", "Behance"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-muted text-sm hover:text-accent transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
