export type PortfolioCategory = "all" | "smm" | "production" | "development" | "branding";

export interface PortfolioItem {
  id: string;
  title: string;
  category: "smm" | "production" | "development" | "branding";
  client: string;
  image: string;
  stats: string;
  roas: string;
  desc: string;
  link?: string;
  videoUrl?: string;
}

export interface SiteSettings {
  general: {
    siteName: string;
    siteTitle: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    instagram: string;
    linkedin: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  features: {
    enableSoundFx: boolean;
    enableFluidDistortion: boolean;
    enableHologramTerminal: boolean;
    enable3DSequence: boolean;
    enableParticles: boolean;
  };
  services: {
    id: string;
    title: string;
    desc: string;
    tag: string;
    active: boolean;
  }[];
  portfolio: PortfolioItem[];
  stats: {
    clients: string;
    projects: string;
    growth: string;
    team: string;
  };
}

export const defaultSettings: SiteSettings = {
  general: {
    siteName: "Azveb Media",
    siteTitle: "Azveb Media | Rəqəmsal Marketinq və İnnovasiya Agentliyi",
    description: "Brendinizi böyüdən, transformasiya edən və önə çıxaran strateji rəqəmsal marketinq həlləri.",
    phone: "+994 50 123 45 67",
    email: "info@azveb.com",
    address: "Bakı şəh., Nizami küç. 142, Azure Business Center",
    whatsapp: "https://wa.me/994501234567",
    instagram: "https://instagram.com/azvebmedia",
    linkedin: "https://linkedin.com/company/azvebmedia",
  },
  hero: {
    badge: "Rəqəmsal Marketinq Agentliyi",
    title: "Rəqəmsal Dünyada",
    titleHighlight: "Zirvəyə Yüksəlin",
    subtitle: "Brendinizi böyüdən, satışlarınızı qatlayan və bazarda fərq yaradan strateji rəqəmsal marketinq.",
    primaryCta: "Layihəyə Başla",
    secondaryCta: "Portfelə Bax",
  },
  features: {
    enableSoundFx: true,
    enableFluidDistortion: true,
    enableHologramTerminal: true,
    enable3DSequence: true,
    enableParticles: true,
  },
  services: [
    {
      id: "smm",
      title: "Sosial Media İdarəetməsi & SMM",
      desc: "Məzmun strategiyası, icma idarəetməsi və inkişaf taktikaları ilə brendinizi zirvəyə daşıyırıq.",
      tag: "SMM / Viral",
      active: true,
    },
    {
      id: "targeting",
      title: "Hədəfli Reklam (Targeting & Performance)",
      desc: "Meta, TikTok və Google-da A/B testləri və pixel optimizasiyası ilə maksimum satış (ROAS).",
      tag: "4x - 8x Satış",
      active: true,
    },
    {
      id: "production",
      title: "Peşəkar Video & Foto Prodakşn",
      desc: "Studio və məkan çəkilişləri, 4K keyfiyyətli məhsul təqdimatları və kinematoqrafik montaj.",
      tag: "100% Sinematik",
      active: true,
    },
    {
      id: "reels",
      title: "Viral Reels & TikTok Məzmunu",
      desc: "Trend musiqilər və cəlbedici ssenarilərlə milyonlarla baxış toplayan qısa video formatları.",
      tag: "Viral Baxış",
      active: true,
    },
    {
      id: "seo",
      title: "SEO və Google 1-ci Səhifə",
      desc: "Texniki SEO, məzmun optimallaşdırması və backlink strategiyaları ilə davamlı pulsuz trafik.",
      tag: "250%+ Trafik",
      active: true,
    },
    {
      id: "web",
      title: "Ultra-Premium 3D Vebsaytlar",
      desc: "Next.js və 3D animasiyalarla yüksək sürətli, mobil uyğun və konversiyaya hesablanmış saytlar.",
      tag: "Lüks Nüfuz",
      active: true,
    },
  ],
  portfolio: [
    {
      id: "01",
      title: "ModaX Baku — E-Ticarət & SMM Dominasiyası",
      category: "smm",
      client: "ModaX Fashion",
      stats: "+340% İzləyici & Satış",
      roas: "7.4x ROAS",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      desc: "Baku Fashion Week tərəfdaşı üçün 4K video prodakşn, viral TikTok reels və Meta hədəfli reklam kampaniyası.",
    },
    {
      id: "02",
      title: "Grand Residence — 4K Dron & Kinematoqrafik Çəkiliş",
      category: "production",
      client: "Grand Holding",
      stats: "$2.4M+ Satış",
      roas: "VIP Funnel",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      desc: "Premium daşınmaz əmlak üçün 4K dron çəkilişləri, memarlıq filmi və yüksək gəlirli investorlara fərdi xüsusi reklamlar.",
    },
    {
      id: "03",
      title: "CloudSync Pro — Qlobal Next.js 3D Platforma",
      category: "development",
      client: "SaaS Enterprise",
      stats: "15,000+ İstifadəçi",
      roas: "12.0x ROI",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      desc: "35+ ölkəyə çıxış, Google 1-ci səhifə dominasiyası və konversiya yönümlü 3D Spatial landing page hazırlanması.",
    },
    {
      id: "04",
      title: "Bella Vista Restoran — Viral Reels & TikTok",
      category: "smm",
      client: "Bella Vista Group",
      stats: "1.2M+ Baxış",
      roas: "95% Doluluq",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      desc: "Yemək və xidmət konsepti üçün dinamik Reels ssenariləri, influenser PR gecələri və gecə-gündüz qastronomiya çəkilişləri.",
    },
    {
      id: "05",
      title: "Aura Cosmetic — 4K Studio Məhsul Çəkilişləri",
      category: "production",
      client: "Aura Beauty",
      stats: "100K+ Satış",
      roas: "6.2x ROAS",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      desc: "Lüks kosmetika brendi üçün studiya makro çəkilişləri, işıq ssenariləri və rəng korreksiyası.",
    },
    {
      id: "06",
      title: "FinTech Azerbaijan — Təhlükəsiz Bank Portalı",
      category: "development",
      client: "FinTech Corp",
      stats: "99.9% Uptime",
      roas: "Bank Standardı",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      desc: "Müasir texnologiyalarla hazırlanmış təhlükəsiz, ultra-sürətli onlayn ödəniş və idarəetmə platforması.",
    },
  ],
  stats: {
    clients: "150+",
    projects: "340+",
    growth: "280%",
    team: "25+",
  },
};
