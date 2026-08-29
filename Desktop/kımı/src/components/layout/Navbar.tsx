"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Grid,
  Briefcase,
  TrendingUp,
  Calculator,
  Mail,
  Menu,
  X,
  Globe,
  ChevronUp,
} from "lucide-react";
import { locales, localeLabels } from "@/i18n/config";
import ThemeToggle from "@/components/layout/ThemeToggle";
import SoundToggle, { soundManager } from "@/components/effects/SoundToggle";
import { scrollToSection, useScrollNav } from "@/hooks/useScrollNav";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSection } = useScrollNav();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { targetId: "hero", label: t("home"), icon: Home, routeHref: "/" },
    { targetId: "services", label: t("services"), icon: Grid, routeHref: "/services" },
    { targetId: "stats", label: t("stats"), icon: TrendingUp, routeHref: "/about" },
    { targetId: "portfolio", label: t("portfolio"), icon: Briefcase, routeHref: "/portfolio" },
    { targetId: "calculator", label: t("calculator"), icon: Calculator, routeHref: "/calculator" },
    { targetId: "contact", label: t("contact"), icon: Mail, routeHref: "/contact" },
  ];

  const handleNavClick = (e: React.MouseEvent, targetId: string, routeHref: string) => {
    e.preventDefault();
    soundManager.playClick();
    setIsMobileMenuOpen(false);

    scrollToSection(targetId);
  };

  return (
    <>
      {/* ─────────────────────────── TOP HEADER ─────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "border-b border-white/10 shadow-lg shadow-black/20" : ""
        )}
        style={{
          background: isScrolled ? "rgba(8,8,8,0.88)" : "rgba(8,8,8,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "hero", "/")}
              className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-accent/25">
                <span className="text-white font-bold text-lg leading-none">A</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Azveb <span className="text-accent">Media</span>
              </span>
            </a>

            {/* Desktop Nav Links with High-speed Smooth Scroll */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.targetId;
                return (
                  <button
                    key={link.targetId}
                    onMouseEnter={() => soundManager.playHover()}
                    onClick={(e) => handleNavClick(e, link.targetId, link.routeHref)}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white hover:bg-white/[0.08]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-accent/25 rounded-lg border border-accent/40 shadow-[0_0_15px_rgba(255,107,53,0.3)]" />
                    )}
                    <span className="relative">{link.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Sound FX Toggle */}
              <SoundToggle />

              {/* Language Switcher — desktop */}
              <div className="hidden md:flex items-center gap-0.5 mr-1">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href="/"
                    locale={l}
                    onClick={() => {
                      soundManager.playClick();
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `/${l}`);
                      }
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide transition-all",
                      locale === l
                        ? "bg-accent text-white shadow-sm shadow-accent/30"
                        : "text-white/50 hover:text-white hover:bg-white/[0.10]"
                    )}
                  >
                    {l}
                  </Link>
                ))}
              </div>

              <ThemeToggle />

              {/* Mobile hamburger — tablet */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/[0.08] transition-colors text-white/70 hover:text-white"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Tablet dropdown menu */}
          <div
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-400",
              isMobileMenuOpen ? "max-h-[500px] pb-4" : "max-h-0"
            )}
          >
            <div className="flex flex-col gap-0.5 pt-3 border-t border-white/10">
              {navLinks.map((link) => (
                <button
                  key={link.targetId}
                  onClick={(e) => handleNavClick(e, link.targetId, link.routeHref)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full",
                    activeSection === link.targetId
                      ? "text-accent bg-accent/15 border border-accent/25"
                      : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  {link.label}
                </button>
              ))}
              {/* Language row */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 px-1">
                <Globe className="w-4 h-4 text-white/30 shrink-0" />
                {locales.map((l) => (
                  <Link
                    key={l}
                    href="/"
                    locale={l}
                    onClick={() => {
                      soundManager.playClick();
                      setIsMobileMenuOpen(false);
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `/${l}`);
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all",
                      locale === l
                        ? "bg-accent text-white shadow-sm shadow-accent/30"
                        : "text-white/40 hover:text-white hover:bg-white/[0.08]"
                    )}
                  >
                    {localeLabels[l]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ─────────────────── MOBILE BOTTOM TAB BAR (phones only) ──────────────── */}
      <nav
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Mobile navigation"
      >
        {/* Mobile drawer */}
        <div
          className={cn(
            "absolute left-4 right-4 overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{
            bottom: "calc(100% + 8px)",
            transform: isMobileMenuOpen ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(12,12,12,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                Menyu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 grid grid-cols-2 gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.targetId;
                return (
                  <button
                    key={link.targetId}
                    onClick={(e) => handleNavClick(e, link.targetId, link.routeHref)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left",
                      isActive
                        ? "bg-accent/20 text-accent border border-accent/25"
                        : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                    )}
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 px-4 pb-3 pt-1 border-t border-white/[0.07] mt-1">
              <Globe className="w-3.5 h-3.5 text-white/30 shrink-0" />
              {locales.map((l) => (
                <Link
                  key={l}
                  href="/"
                  locale={l}
                  onClick={() => {
                    soundManager.playClick();
                    setIsMobileMenuOpen(false);
                    if (typeof window !== "undefined") {
                      window.history.replaceState(null, "", `/${l}`);
                    }
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all",
                    locale === l
                      ? "bg-accent text-white"
                      : "text-white/40 hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Fixed Tab Bar ── */}
        <div
          className="mx-3 mb-3"
          style={{
            background: "rgba(10,10,10,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center justify-around px-1 py-1.5">
            {navLinks.slice(0, 4).map((link) => {
              const isActive = activeSection === link.targetId;
              return (
                <button
                  key={link.targetId}
                  onClick={(e) => handleNavClick(e, link.targetId, link.routeHref)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 min-w-[3.25rem] py-2 px-2 rounded-2xl transition-all duration-200",
                    isActive ? "text-accent bg-accent/15" : "text-white/50 hover:text-white/80"
                  )}
                >
                  <link.icon
                    className={cn(
                      "w-5 h-5",
                      isActive && "drop-shadow-[0_0_6px_rgba(255,107,53,0.8)]"
                    )}
                  />
                  <span className="text-[9px] font-medium leading-none">{link.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[3.25rem] py-2 px-2 rounded-2xl transition-all duration-200",
                isMobileMenuOpen ? "text-accent bg-accent/15" : "text-white/50 hover:text-white/80"
              )}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="text-[9px] font-medium leading-none">{t("menu")}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
