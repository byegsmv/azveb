"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Award,
  Layers,
  Cpu,
  Phone,
  ArrowRight,
  TrendingUp,
  Share2,
  Camera,
  Code2,
  Palette,
  X,
  Menu,
  ShieldCheck,
  BookOpen,
  Send,
  Dice5,
} from "lucide-react";
import { soundManager } from "@/components/effects/SoundToggle";
import { defaultSettings, PortfolioCategory, PortfolioItem } from "@/lib/siteSettings";

// ─── 30 RADİKALLY DİSTİNCT, ZERO-REPETITION VISUAL MASTER ENGINES ───
export type DistinctEngineType =
  | "voxel_cubes_explode"     // 1. 3D Bərk Voxel Kubiklər (Mausla partlayır, sözə yığılır)
  | "strive_layered_core"     // 2. Orijinal STRIVE Qara Dalğalı Nüvə & Ağ İşıq Gözü
  | "volumetric_plasma_smoke" // 3. Qatı Qaz Dumanı & Plazma Buludu (Mausla yarılır)
  | "liquid_mercury_droplets" // 4. Əriyən Xrom Civa Damlaları (Elastik yapışır və dartılır)
  | "cyber_glitch_slicing"    // 5. Oxunaqlı 3D Horizontal Piksel Qliç
  | "fireworks_supernova"     // 6. Parıldayan Pirotexnika & Qığılcım Saçılması
  | "silk_fabric_cloth"       // 7. 3D Həcmli İpək Parça / Maye Bayraq
  | "matrix_digital_rain"     // 8. Şaquli Axan Kiber Kod Yağışı
  | "glass_origami_crystal"   // 9. 3D Low-Poly Qatlanan Şüşə Heykəl
  | "magnetic_dust_vortex"    // 10. 600+ Ulduz Tozu Burulğanı (Mausa cəzb olunur)
  | "laser_energy_grid"       // 11. Perspektivli 3D Lazer Synthwave Toru
  | "kaleidoscope_mandala"    // 12. 8 Qatlı Fırlanan Optik Mandala
  | "black_hole_singularity"  // 13. Qravitasiyalı Qara Dəlik & İşıq Hadisə Üfüqü
  | "ascii_terminal_stream"   // 14. Canlı ASCII Terminal Matrisi & Simvollar
  | "dna_double_helix"        // 15. Fırlanan 3D DNT Molekul Heliksi
  | "sound_equalizer_bars"    // 16. Dinamik 3D Audio Spektr Barları
  | "meteor_shower_warp"      // 17. İşıq Sürətli Meteor / Hiperspace Tüneli
  | "topographic_contour_map" // 18. Canlı Topoqrafik Yüksəklik Xəritəsi
  | "golden_star_burst"       // 19. Qızılı Bürclər & Şəbəkə Toru
  | "quantum_string_waves"    // 20. Kvant Simləri & Harmonik Lazer Dalğaları
  | "hexagonal_honeycomb_shield" // 21. Kiber Altıbucaqlı Qalxan Toru (Mausla aktivləşir)
  | "bouncing_physics_spheres"// 22. Elastik Bərk Şarlar (Mausla toqquşur və sıçrayır)
  | "cyber_circuit_board"     // 23. Yaşıl Çip & Ana Plata Enerji İzləri
  | "floating_card_gallery"   // 24. 3D Fəzada Fırlanan Kartlar & Prizmalar
  | "hypnotic_spiral_tunnel"  // 25. Dərin Hipnoz Burulğanı & Spiral
  | "neon_vector_radar"       // 26. Hərbi Kiber Radar & Skaner Şüası
  | "floating_bubble_soap"    // 27. Şəffaf Sabun Köpükləri (Maus toxunanda partlayır)
  | "digital_clock_matrix"    // 28. Real-time Rəqəmsal Saat & Zaman Matrisi
  | "solar_eclipse_corona"    // 29. Günəş Tutulması & Alovlu Tac Plazması
  | "cyberpunk_city_skyline"; // 30. 3D Neon Kiber Meqapolis & Göydələnlər

export interface MasterEngineInfo {
  id: number;
  type: DistinctEngineType;
  name: string;
  badge: string;
}

export const masterEnginesList: MasterEngineInfo[] = [
  { id: 1, type: "voxel_cubes_explode", name: "3D Voxel Kubiklər", badge: "01 // VOXEL PHYSICS" },
  { id: 2, type: "strive_layered_core", name: "STRIVE Qara Nüvə", badge: "02 // STRIVE CORE" },
  { id: 3, type: "volumetric_plasma_smoke", name: "Plazma Duman Buludu", badge: "03 // VOLUMETRIC SMOKE" },
  { id: 4, type: "liquid_mercury_droplets", name: "Əriyən Civa Damlaları", badge: "04 // LIQUID MERCURY" },
  { id: 5, type: "cyber_glitch_slicing", name: "Kiber Piksel Qliç", badge: "05 // CYBER GLITCH" },
  { id: 6, type: "fireworks_supernova", name: "Supernova Pirotexnika", badge: "06 // PYRO SPARKS" },
  { id: 7, type: "silk_fabric_cloth", name: "İpək Parça Dalğalanması", badge: "07 // SILK FABRIC" },
  { id: 8, type: "matrix_digital_rain", name: "Matrix Kod Yağışı", badge: "08 // DIGITAL RAIN" },
  { id: 9, type: "glass_origami_crystal", name: "3D Şüşə Origami", badge: "09 // GLASS ORIGAMI" },
  { id: 10, type: "magnetic_dust_vortex", name: "Maqnit Ulduz Tozu", badge: "10 // MAGNETIC DUST" },
  { id: 11, type: "laser_energy_grid", name: "Perspektivli Lazer Toru", badge: "11 // LASER GRID" },
  { id: 12, type: "kaleidoscope_mandala", name: "Optik Mandala", badge: "12 // KALEIDOSCOPE" },
  { id: 13, type: "black_hole_singularity", name: "Kosmik Qara Dəlik", badge: "13 // BLACK HOLE" },
  { id: 14, type: "ascii_terminal_stream", name: "ASCII Kiber Terminal", badge: "14 // ASCII MATRIX" },
  { id: 15, type: "dna_double_helix", name: "3D DNT Heliksi", badge: "15 // DNA HELIX" },
  { id: 16, type: "sound_equalizer_bars", name: "Audio Spektr Barları", badge: "16 // EQUALIZER" },
  { id: 17, type: "meteor_shower_warp", name: "Hiperspace Meteor Tüneli", badge: "17 // WARP SPEED" },
  { id: 18, type: "topographic_contour_map", name: "Topoqrafik Xəritə", badge: "18 // TOPOGRAPHY" },
  { id: 19, type: "golden_star_burst", name: "Qızılı Bürc Toru", badge: "19 // CONSTELLATION" },
  { id: 20, type: "quantum_string_waves", name: "Kvant Sim Dalğaları", badge: "20 // QUANTUM WAVES" },
  { id: 21, type: "hexagonal_honeycomb_shield", name: "Altıbucaqlı Qalxan Toru", badge: "21 // HONEYCOMB" },
  { id: 22, type: "bouncing_physics_spheres", name: "Elastik Bərk Şarlar", badge: "22 // BOUNCING SPHERES" },
  { id: 23, type: "cyber_circuit_board", name: "Ana Plata & Çip Yolları", badge: "23 // CIRCUIT BOARD" },
  { id: 24, type: "floating_card_gallery", name: "3D Fırlanan Kartlar", badge: "24 // 3D CARDS" },
  { id: 25, type: "hypnotic_spiral_tunnel", name: "Hipnoz Spiral Tüneli", badge: "25 // HYPNO SPIRAL" },
  { id: 26, type: "neon_vector_radar", name: "Kiber Skaner Radarı", badge: "26 // CYBER RADAR" },
  { id: 27, type: "floating_bubble_soap", name: "Sabun Köpükləri", badge: "27 // SOAP BUBBLES" },
  { id: 28, type: "digital_clock_matrix", name: "Rəqəmsal Saat Matrisi", badge: "28 // TIME MATRIX" },
  { id: 29, type: "solar_eclipse_corona", name: "Günəş Tutulması Plazması", badge: "29 // SOLAR CORONA" },
  { id: 30, type: "cyberpunk_city_skyline", name: "3D Neon Kiber Şəhər", badge: "30 // CYBER CITY" },
];

interface StoryStep {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  displayWord: string;
  accentColor: string;
  gradient: string;
  actionButtonText: string;
  actionIcon: any;
  drawerType: "about" | "services" | "portfolio" | "ai" | "contact";
}

const pulseStorySteps: StoryStep[] = [
  {
    id: "01",
    badge: "01 // HAQQIMIZDA & MANİFESTO",
    title: "Azveb Media: Rəqəmsal Liderlik Mühəndisliyi.",
    subtitle: "Standart reklam erası bitdi. Brendləri bazarda 1 nömrə edən alqoritmik SMM, 4K Prodakşn və High-End Veb texnologiyaları.",
    displayWord: "AZVEB",
    accentColor: "#ffffff",
    gradient: "from-[#08080c] via-[#101018] to-[#040406]",
    actionButtonText: "Manifestomuzu & Komandanı Oxu",
    actionIcon: BookOpen,
    drawerType: "about",
  },
  {
    id: "02",
    badge: "02 // 6 ƏSAS BÖYÜMƏ GÜCÜ",
    title: "Bazar Liderliyi Üçün 6 Əsas Xidmət.",
    subtitle: "Dəqiq hədəfli reklamdan (Targetinq) viral TikTok çarxlarına, peşəkar studiya çəkilişlərindən 3D vebsaytlara qədər tam spektr.",
    displayWord: "XİDMƏT",
    accentColor: "#38bdf8",
    gradient: "from-[#030e16] via-[#061c2c] to-[#02070c]",
    actionButtonText: "Bütün Xidmətləri İncələ (6 Xidmət)",
    actionIcon: Layers,
    drawerType: "services",
  },
  {
    id: "03",
    badge: "03 // UĞUR HEKAYƏLƏRİ & PORTFEL",
    title: "7.4x Ortalama ROAS: Real Əl İşlərimiz.",
    subtitle: "SMM, 4K Video Prodakşn və Veb Development sahəsində Azərbaycanda və xaricdə imza atdığımız seçilmiş brend layihələri.",
    displayWord: "PORTFEL",
    accentColor: "#ec4899",
    gradient: "from-[#140310] via-[#260620] to-[#080206]",
    actionButtonText: "Portfel Qalereyasını Aç (SMM, Çəkiliş, Dev)",
    actionIcon: Award,
    drawerType: "portfolio",
  },
  {
    id: "04",
    badge: "04 // CANLI AI BAZAR SİMULYATORU",
    title: "Azveb AI: Satış və Baxış Potensialı Hesabla.",
    subtitle: "Şirkətinizin adını qeyd edin, süni intellekt alqoritmimiz saniyələr içində bazar potensialınızı və satış artımını hesablasın.",
    displayWord: "AI DATA",
    accentColor: "#a855f7",
    gradient: "from-[#100318] via-[#20062c] to-[#06020a]",
    actionButtonText: "Brendiniz Üçün AI Hesablaması Edin",
    actionIcon: Cpu,
    drawerType: "ai",
  },
  {
    id: "05",
    badge: "05 // BİRGƏ BAŞLAYAQ & START",
    title: "Brendinizi Zirvəyə Birlikdə Daşıyaq.",
    subtitle: "Bakı şəhəri, Azure Business Center. Azveb Media mütəxəssisləri ilə birbaşa əlaqə qurun və yeni dövrə start verin.",
    displayWord: "LİDERLİK",
    accentColor: "#10b981",
    gradient: "from-[#03120a] via-[#062414] to-[#020a05]",
    actionButtonText: "Birbaşa Əlaqə & Layihə Göndər",
    actionIcon: Phone,
    drawerType: "contact",
  },
];

interface VoxelParticle {
  origX: number;
  origY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function MakeMePulseInteractiveExperience() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeEngineIndex, setActiveEngineIndex] = useState(0);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<"about" | "services" | "portfolio" | "ai" | "contact" | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(defaultSettings.portfolio);
  const [selectedCat, setSelectedCat] = useState<PortfolioCategory>("all");
  const [selectedProjectModal, setSelectedProjectModal] = useState<PortfolioItem | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, speed: 0, isDown: false });

  const step = pulseStorySteps[currentStep];
  const currentEngine = masterEnginesList[activeEngineIndex];

  // Pick Next Random Engine from the 30 Unique List
  const assignRandomEngine = () => {
    let nextIdx = Math.floor(Math.random() * masterEnginesList.length);
    if (nextIdx === activeEngineIndex) nextIdx = (nextIdx + 1) % masterEnginesList.length;
    setActiveEngineIndex(nextIdx);
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.portfolio?.length > 0) {
          setPortfolio(res.data.portfolio);
        }
      })
      .catch((e) => console.log("Cached portfolio:", e));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const curX = e.clientX;
    const curY = e.clientY;
    const speed = Math.hypot(curX - mouseRef.current.x, curY - mouseRef.current.y);

    mouseRef.current = {
      x: curX,
      y: curY,
      speed: Math.min(speed, 60),
      isDown: mouseRef.current.isDown,
    };
  };

  // ─── 30 TAMAMİLƏ AYRI VƏ FƏRQLİ MƏNTİQLİ GPU MÜHƏRRİKİ ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      buildVoxelText();
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    let animationId: number;

    // 1. VOXEL CUBES GENERATOR
    let voxels: VoxelParticle[] = [];
    const buildVoxelText = () => {
      voxels = [];
      const off = document.createElement("canvas");
      const oCtx = off.getContext("2d");
      if (!oCtx) return;
      off.width = width;
      off.height = height;

      const fontSize = Math.min(width * 0.16, 170);
      oCtx.font = `900 ${fontSize}px sans-serif`;
      oCtx.textAlign = "center";
      oCtx.textBaseline = "middle";
      oCtx.fillStyle = "#ffffff";
      oCtx.fillText(step.displayWord, width / 2, height / 2);

      const data = oCtx.getImageData(0, 0, width, height).data;
      const stepSize = Math.max(7, Math.floor(width / 140));

      for (let y = 0; y < height; y += stepSize) {
        for (let x = 0; x < width; x += stepSize) {
          const idx = (y * width + x) * 4;
          if (data[idx + 3] > 140) {
            voxels.push({
              origX: x,
              origY: y,
              x: x + (Math.random() - 0.5) * 250,
              y: y + (Math.random() - 0.5) * 250,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              size: stepSize * 0.95,
              color: Math.random() > 0.35 ? "#ffffff" : step.accentColor,
            });
          }
        }
      }
    };
    buildVoxelText();

    // 2. VOLUMETRIC SMOKE CLOUD
    const smokePuffs = Array.from({ length: 40 }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 300,
      y: height / 2 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 80 + 70,
      baseAlpha: Math.random() * 0.35 + 0.15,
      color: [step.accentColor, "#818cf8", "#38bdf8", "#c084fc"][Math.floor(Math.random() * 4)],
    }));

    // 3. LIQUID CHROME METABALLS
    const chromeBlobs = Array.from({ length: 7 }, (_, i) => ({
      x: width / 2 + Math.cos(i) * 100,
      y: height / 2 + Math.sin(i) * 100,
      vx: 0,
      vy: 0,
      radius: 50 + (i % 3) * 20,
    }));

    // 4. FIREWORKS SPARKS
    const sparks = Array.from({ length: 150 }, () => ({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: Math.random() * 90 + 10,
      maxLife: 100,
      size: Math.random() * 4 + 1.5,
      color: ["#ffffff", "#f59e0b", "#ec4899", "#38bdf8", "#10b981"][Math.floor(Math.random() * 5)],
    }));

    // 5. MAGNETIC PARTICLES
    const dustParticles = Array.from({ length: 600 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? step.accentColor : "#ffffff",
    }));

    // 6. MATRIX CODE RAIN
    const columns = Math.floor(width / 24);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const chars = "AZVEBMEDIA0123456789";

    // 7. BOUNCING SPHERES (22)
    const spheres = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      radius: Math.random() * 22 + 16,
    }));

    // 8. SOAP BUBBLES (27)
    const bubbles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 30 + 20,
      speed: Math.random() * 1.5 + 0.5,
    }));

    // 9. METEOR TUNNEL
    const meteors = Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * 1000 + 10,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.016 + chargeProgress * 0.0008;

      const cx = width / 2;
      const cy = height / 2;
      const mouse = mouseRef.current;
      const mode = currentEngine.type;

      // ─────────────────────────────────────────────────────────────
      // 1. VOXEL CUBES EXPLODE
      // ─────────────────────────────────────────────────────────────
      if (mode === "voxel_cubes_explode") {
        ctx.save();
        const mouseRad = 120 + (isHolding ? chargeProgress * 3 : 0);
        const friction = 0.88;
        const spring = 0.07;

        voxels.forEach((v) => {
          const dx = v.x - mouse.x;
          const dy = v.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRad && dist > 0) {
            const force = (1 - dist / mouseRad) * (22 + mouse.speed * 0.5 + (isHolding ? chargeProgress * 0.4 : 0));
            const angle = Math.atan2(dy, dx);
            v.vx += Math.cos(angle) * force;
            v.vy += Math.sin(angle) * force;
          }

          const ox = v.origX - v.x;
          const oy = v.origY - v.y;
          v.vx += ox * spring;
          v.vy += oy * spring;
          v.vx *= friction;
          v.vy *= friction;
          v.x += v.vx;
          v.y += v.vy;

          ctx.fillStyle = "rgba(15, 15, 25, 0.95)";
          ctx.fillRect(v.x + 4, v.y + 4, v.size, v.size);
          ctx.fillStyle = v.color;
          ctx.fillRect(v.x, v.y, v.size, v.size);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.strokeRect(v.x, v.y, v.size, v.size);
        });
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 2. STRIVE LAYERED CORE
      // ─────────────────────────────────────────────────────────────
      else if (mode === "strive_layered_core") {
        ctx.save();
        const mouseOffX = (mouse.x - cx) * 0.12;
        const mouseOffY = (mouse.y - cy) * 0.12;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `300 ${Math.min(width * 0.16, 175)}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillText(step.displayWord, cx + mouseOffX * 0.4, cy + mouseOffY * 0.4);

        const discRad = 95 + chargeProgress * 1.3;
        for (let l = 15; l >= 1; l--) {
          const lRad = (discRad / 15) * l;
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.05) {
            const ripple = Math.sin(a * 10 + t * 4 + l * 0.5) * 6 + Math.cos(a * 6 - t * 2) * 4;
            const rx = cx + mouseOffX * 0.8 + Math.cos(a) * (lRad + ripple);
            const ry = cy + mouseOffY * 0.8 + Math.sin(a) * (lRad + ripple);
            if (a === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.fillStyle = l % 2 === 0 ? "#08080c" : "#14141c";
          ctx.fill();
          ctx.strokeStyle = l === 15 ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.15)";
          ctx.stroke();
        }

        const coreGlow = ctx.createRadialGradient(cx + mouseOffX * 0.8, cy + mouseOffY * 0.8, 0, cx + mouseOffX * 0.8, cy + mouseOffY * 0.8, 40);
        coreGlow.addColorStop(0, "#ffffff");
        coreGlow.addColorStop(0.6, "rgba(255, 255, 255, 0.8)");
        coreGlow.addColorStop(1, "transparent");
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx + mouseOffX * 0.8, cy + mouseOffY * 0.8, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 3. VOLUMETRIC PLASMA SMOKE
      // ─────────────────────────────────────────────────────────────
      else if (mode === "volumetric_plasma_smoke") {
        ctx.save();
        smokePuffs.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 0) {
            p.vx += (dx / dist) * 1.5;
            p.vy += (dy / dist) * 1.5;
          }

          p.x += p.vx + Math.cos(t + p.radius) * 0.5;
          p.y += p.vy + Math.sin(t + p.radius) * 0.5;
          p.vx *= 0.94;
          p.vy *= 0.94;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius + chargeProgress * 0.5);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.5, `${p.color}40`);
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.globalAlpha = p.baseAlpha + (isHolding ? 0.2 : 0);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + chargeProgress * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 4. LIQUID MERCURY DROPLETS
      // ─────────────────────────────────────────────────────────────
      else if (mode === "liquid_mercury_droplets") {
        ctx.save();
        chromeBlobs.forEach((blob, idx) => {
          const dx = mouse.x - blob.x;
          const dy = mouse.y - blob.y;
          const d = Math.hypot(dx, dy);

          if (d < 240 && d > 0) {
            blob.vx += (dx / d) * 2;
            blob.vy += (dy / d) * 2;
          }

          const targetX = cx + Math.cos(t * 1.4 + idx * 1.1) * (130 + chargeProgress * 1.2);
          const targetY = cy + Math.sin(t * 1.2 + idx * 1.3) * (110 + chargeProgress * 1.2);
          blob.vx += (targetX - blob.x) * 0.04;
          blob.vy += (targetY - blob.y) * 0.04;
          blob.vx *= 0.88;
          blob.vy *= 0.88;
          blob.x += blob.vx;
          blob.y += blob.vy;

          const grad = ctx.createRadialGradient(blob.x - 15, blob.y - 15, 0, blob.x, blob.y, blob.radius);
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.3, step.accentColor);
          grad.addColorStop(0.8, "#0f172a");
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(blob.x, blob.y, blob.radius + chargeProgress * 0.3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 5. CYBER GLITCH SLICING
      // ─────────────────────────────────────────────────────────────
      else if (mode === "cyber_glitch_slicing") {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = step.displayWord;
        const fontSize = Math.min(width * 0.15, 165);
        ctx.font = `900 ${fontSize}px sans-serif`;
        const spacing = fontSize * 0.8;
        const startX = cx - ((text.length - 1) * spacing) / 2;

        const slices = 28;
        for (let i = 0; i < slices; i++) {
          const sY = cy - fontSize * 0.7 + (i / slices) * (fontSize * 1.4);
          const sH = (fontSize * 1.4) / slices + 1;

          const mouseDist = Math.abs(sY - mouse.y);
          const mouseShift = mouseDist < 100 ? (1 - mouseDist / 100) * (mouse.x - cx) * 0.2 : 0;
          const noise = Math.sin(i * 0.5 + t * 3) * (8 + chargeProgress * 0.8);
          const shiftX = (noise + mouseShift) * (Math.random() > 0.45 ? 1 : -1);

          ctx.save();
          ctx.beginPath();
          ctx.rect(0, sY, width, sH);
          ctx.clip();

          if (Math.random() > 0.6) {
            ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.4)" : "rgba(160, 160, 180, 0.2)";
            ctx.fillRect(cx - Math.abs(shiftX) * 2 - 10, sY, Math.abs(shiftX) * 4 + 20, sH);
          }

          for (let c = 0; c < text.length; c++) {
            ctx.fillStyle = i % 4 === 0 ? "#1e293b" : "#ffffff";
            ctx.fillText(text[c], startX + c * spacing + shiftX * 0.5, cy);
          }
          ctx.restore();
        }
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 6. FIREWORKS SUPERNOVA
      // ─────────────────────────────────────────────────────────────
      else if (mode === "fireworks_supernova") {
        ctx.save();
        sparks.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 0) {
            p.vx += (dx / dist) * 3;
            p.vy += (dy / dist) * 3;
          }

          p.x += p.vx * (1 + chargeProgress * 0.04);
          p.y += p.vy * (1 + chargeProgress * 0.04);
          p.life -= 1;

          if (p.life <= 0) {
            p.x = cx + (Math.random() - 0.5) * 50;
            p.y = cy + (Math.random() - 0.5) * 50;
            const angle = Math.random() * Math.PI * 2;
            const spd = (Math.random() * 6 + 2) * (1 + chargeProgress * 0.05);
            p.vx = Math.cos(angle) * spd;
            p.vy = Math.sin(angle) * spd;
            p.life = p.maxLife;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = (p.life / p.maxLife) * (0.8 + chargeProgress * 0.002);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 7. SILK FABRIC CLOTH
      // ─────────────────────────────────────────────────────────────
      else if (mode === "silk_fabric_cloth") {
        ctx.save();
        const clothRows = 20;
        const clothCols = 30;
        const cellW = width / clothCols;
        const cellH = height / clothRows;

        for (let r = 0; r < clothRows; r++) {
          for (let c = 0; c < clothCols; c++) {
            const x = c * cellW;
            const y = r * cellH;

            const dMouse = Math.hypot(x - mouse.x, y - mouse.y);
            const mouseLift = dMouse < 200 ? (1 - dMouse / 200) * 35 : 0;
            const wave = Math.sin(c * 0.3 + t * 3) * Math.cos(r * 0.3 + t * 2) * 25 + mouseLift;

            const alpha = 0.2 + (wave + 25) / 100;
            ctx.fillStyle = r % 2 === 0 ? step.accentColor : "#ffffff";
            ctx.globalAlpha = Math.max(0.05, Math.min(alpha, 0.6));
            ctx.fillRect(x, y + wave, cellW - 2, cellH - 2);
          }
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 8. MATRIX DIGITAL RAIN
      // ─────────────────────────────────────────────────────────────
      else if (mode === "matrix_digital_rain") {
        ctx.save();
        ctx.fillStyle = step.accentColor;
        ctx.font = "15px monospace";
        ctx.globalAlpha = 0.65;

        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const charX = i * 24;
          const dM = Math.abs(charX - mouse.x);
          const pushY = dM < 80 ? 25 : 0;

          ctx.fillText(char, charX, y + pushY);
          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 16 + chargeProgress * 0.3;
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 9. GLASS ORIGAMI CRYSTAL
      // ─────────────────────────────────────────────────────────────
      else if (mode === "glass_origami_crystal") {
        ctx.save();
        const rad = 140 + Math.sin(t * 2) * 20 + chargeProgress * 1.5;
        const facets = 8;
        const pts: { x: number; y: number }[] = [];
        const mouseAngle = Math.atan2(mouse.y - cy, mouse.x - cx) * 0.15;

        for (let i = 0; i < facets; i++) {
          const angle = (i * 2 * Math.PI) / facets + t + mouseAngle;
          const x = cx + Math.cos(angle) * (rad + Math.sin(t * 3 + i) * 25);
          const y = cy + Math.sin(angle) * (rad + Math.cos(t * 3 + i) * 25);
          pts.push({ x, y });
        }

        for (let i = 0; i < pts.length; i++) {
          const next = pts[(i + 1) % pts.length];
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(next.x, next.y);
          ctx.lineTo(cx, cy);
          ctx.fillStyle = i % 2 === 0 ? `${step.accentColor}35` : "rgba(255, 255, 255, 0.12)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.14, 150)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 10. MAGNETIC DUST VORTEX
      // ─────────────────────────────────────────────────────────────
      else if (mode === "magnetic_dust_vortex") {
        ctx.save();
        dustParticles.forEach((p) => {
          const dx = (mouse.x !== -1000 ? mouse.x : cx) - p.x;
          const dy = (mouse.y !== -1000 ? mouse.y : cy) - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 10) {
            p.vx += (dx / dist) * (1.2 + chargeProgress * 0.03);
            p.vy += (dy / dist) * (1.2 + chargeProgress * 0.03);
          }

          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 11. LASER ENERGY GRID
      // ─────────────────────────────────────────────────────────────
      else if (mode === "laser_energy_grid") {
        ctx.save();
        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.45;

        const vX = cx + (mouse.x - cx) * 0.3;
        const vY = cy - 100 + (mouse.y - cy) * 0.3;

        for (let x = -width; x <= width * 2; x += 55) {
          ctx.beginPath();
          ctx.moveTo(vX, vY);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = cy - 40; y < height; y += (y - cy + 80) * 0.24) {
          const wave = Math.sin(t * 4 + y * 0.04) * (12 + chargeProgress * 0.3);
          ctx.beginPath();
          ctx.moveTo(0, y + wave);
          ctx.lineTo(width, y + wave);
          ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 12. KALEIDOSCOPE MANDALA
      // ─────────────────────────────────────────────────────────────
      else if (mode === "kaleidoscope_mandala") {
        ctx.save();
        const segments = 8;
        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.45;

        for (let s = 0; s < segments; s++) {
          const baseAngle = (s * 2 * Math.PI) / segments + t * 0.8;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(baseAngle);

          ctx.beginPath();
          for (let r = 30; r <= 180 + chargeProgress * 1.5; r += 35) {
            const wave = Math.sin(t * 3 + r * 0.05) * 20;
            ctx.arc(r, wave, 14, 0, Math.PI * 2);
          }
          ctx.stroke();
          ctx.restore();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 13. BLACK HOLE SINGULARITY
      // ─────────────────────────────────────────────────────────────
      else if (mode === "black_hole_singularity") {
        ctx.save();
        const holeX = cx + (mouse.x - cx) * 0.15;
        const holeY = cy + (mouse.y - cy) * 0.15;

        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(holeX, holeY, 65 + chargeProgress * 0.5, 0, Math.PI * 2);
        ctx.fill();

        dustParticles.slice(0, 180).forEach((p) => {
          const angle = Math.atan2(p.y - holeY, p.x - holeX) + 0.04;
          let dist = Math.hypot(p.x - holeX, p.y - holeY) - 1.2;
          if (dist <= 60) dist = 360;

          p.x = holeX + Math.cos(angle) * dist;
          p.y = holeY + Math.sin(angle) * dist;

          ctx.fillStyle = step.accentColor;
          ctx.globalAlpha = (dist / 360) * 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(holeX, holeY, 67 + chargeProgress * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.14, 150)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, holeX, holeY);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 14. ASCII TERMINAL STREAM
      // ─────────────────────────────────────────────────────────────
      else if (mode === "ascii_terminal_stream") {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "13px monospace";

        const asciiRows = Math.floor(height / 28);
        const asciiCols = Math.floor(width / 20);

        for (let r = 0; r < asciiRows; r++) {
          for (let c = 0; c < asciiCols; c++) {
            const x = c * 20;
            const y = r * 28;
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            const sym = d < 120 ? "#" : ((r + c + Math.floor(t * 10)) % 7 === 0 ? "1" : "0");
            if (d < 120) ctx.fillStyle = step.accentColor;
            else ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
            ctx.fillText(sym, x, y);
          }
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 15. DNA DOUBLE HELIX
      // ─────────────────────────────────────────────────────────────
      else if (mode === "dna_double_helix") {
        ctx.save();
        const strandSpacing = width / 35;

        for (let i = 0; i < 35; i++) {
          const x = i * strandSpacing;
          const phase = i * 0.35 + t * 2;
          const y1 = cy + Math.sin(phase) * (80 + chargeProgress * 0.8);
          const y2 = cy - Math.sin(phase) * (80 + chargeProgress * 0.8);

          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();

          ctx.fillStyle = step.accentColor;
          ctx.beginPath();
          ctx.arc(x, y1, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y2, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 16. SOUND EQUALIZER BARS
      // ─────────────────────────────────────────────────────────────
      else if (mode === "sound_equalizer_bars") {
        ctx.save();
        const barW = width / 40 - 6;

        for (let i = 0; i < 40; i++) {
          const x = i * (barW + 6);
          const dM = Math.abs(x - mouse.x);
          const mouseBoost = dM < 160 ? (1 - dM / 160) * 120 : 0;
          const barH = (Math.sin(i * 0.4 + t * 4) * 50 + 70 + mouseBoost + chargeProgress * 0.8);

          ctx.fillStyle = i % 2 === 0 ? step.accentColor : "#ffffff";
          ctx.fillRect(x, cy - barH / 2, barW, barH);
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 17. METEOR SHOWER WARP
      // ─────────────────────────────────────────────────────────────
      else if (mode === "meteor_shower_warp") {
        ctx.save();
        const speed = 14 + chargeProgress * 0.4;
        ctx.strokeStyle = step.accentColor;

        meteors.forEach((m) => {
          m.z -= speed;
          if (m.z <= 0) {
            m.z = 1000;
            m.x = (Math.random() - 0.5) * width;
            m.y = (Math.random() - 0.5) * height;
          }

          const k = 300 / m.z;
          const px = m.x * k + cx;
          const py = m.y * k + cy;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.fillStyle = step.accentColor;
            ctx.globalAlpha = 1 - m.z / 1000;
            ctx.beginPath();
            ctx.arc(px, py, (1 - m.z / 1000) * 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(m.x * (300 / (m.z + speed * 3)) + cx, m.y * (300 / (m.z + speed * 3)) + cy);
            ctx.stroke();
          }
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 18. TOPOGRAPHIC CONTOUR MAP
      // ─────────────────────────────────────────────────────────────
      else if (mode === "topographic_contour_map") {
        ctx.save();
        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 1.2;

        for (let r = 80; r < Math.max(width, height) * 0.7; r += 50) {
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.08) {
            const wave = Math.sin(a * 6 + t * 2 + r * 0.02) * (18 + chargeProgress * 0.2);
            const px = cx + Math.cos(a) * (r + wave);
            const py = cy + Math.sin(a) * (r + wave);
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 19. GOLDEN STAR BURST
      // ─────────────────────────────────────────────────────────────
      else if (mode === "golden_star_burst") {
        ctx.save();
        const starNodes: { x: number; y: number }[] = [];
        ctx.globalAlpha = 0.6;

        for (let s = 0; s < 30; s++) {
          const angle = (s * 2 * Math.PI) / 30 + t * 0.6;
          const dist = 80 + Math.sin(t * 2 + s) * 95 + chargeProgress * 1.5;
          const sx = cx + Math.cos(angle) * dist;
          const sy = cy + Math.sin(angle) * dist;
          starNodes.push({ x: sx, y: sy });

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < starNodes.length; i++) {
          for (let j = i + 1; j < starNodes.length; j++) {
            const d = Math.hypot(starNodes[i].x - starNodes[j].x, starNodes[i].y - starNodes[j].y);
            if (d < 110) {
              ctx.moveTo(starNodes[i].x, starNodes[i].y);
              ctx.lineTo(starNodes[j].x, starNodes[j].y);
            }
          }
        }
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 20. QUANTUM STRING WAVES
      // ─────────────────────────────────────────────────────────────
      else if (mode === "quantum_string_waves") {
        ctx.save();
        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 1.4;

        for (let j = -4; j <= 4; j++) {
          ctx.beginPath();
          for (let x = 0; x < width; x += 15) {
            const waveY =
              cy +
              j * 35 +
              Math.sin(x * 0.015 + t * 2 + j) * (25 + chargeProgress * 0.5) +
              Math.cos(t * 1.5 + x * 0.01) * 15;

            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 21. HEXAGONAL HONEYCOMB SHIELD
      // ─────────────────────────────────────────────────────────────
      else if (mode === "hexagonal_honeycomb_shield") {
        ctx.save();
        const hexRadius = 38;
        const hexH = Math.sqrt(3) * hexRadius;
        const hexW = 2 * hexRadius;

        for (let y = 0; y < height + hexH; y += hexH) {
          for (let x = 0; x < width + hexW; x += hexW * 0.75) {
            const rowOffset = (Math.floor(x / (hexW * 0.75)) % 2) * (hexH / 2);
            const hexY = y + rowOffset;
            const dM = Math.hypot(x - mouse.x, hexY - mouse.y);
            const active = dM < 160;

            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const hx = x + Math.cos(angle) * (hexRadius - 3);
              const hy = hexY + Math.sin(angle) * (hexRadius - 3);
              if (a === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fillStyle = active ? `${step.accentColor}55` : "rgba(255, 255, 255, 0.04)";
            ctx.fill();
            ctx.strokeStyle = active ? step.accentColor : "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = active ? 2 : 0.8;
            ctx.stroke();
          }
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 22. BOUNCING PHYSICS SPHERES
      // ─────────────────────────────────────────────────────────────
      else if (mode === "bouncing_physics_spheres") {
        ctx.save();
        spheres.forEach((s) => {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < s.radius || s.x > width - s.radius) s.vx *= -1;
          if (s.y < s.radius || s.y > height - s.radius) s.vy *= -1;

          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const d = Math.hypot(dx, dy);
          if (d < s.radius + 60 && d > 0) {
            s.vx -= (dx / d) * 3;
            s.vy -= (dy / d) * 3;
          }

          const grad = ctx.createRadialGradient(s.x - 5, s.y - 5, 0, s.x, s.y, s.radius);
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.5, step.accentColor);
          grad.addColorStop(1, "#090d16");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 23. CYBER CIRCUIT BOARD
      // ─────────────────────────────────────────────────────────────
      else if (mode === "cyber_circuit_board") {
        ctx.save();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;

        for (let i = 0; i < 18; i++) {
          const startX = (width / 18) * i;
          const branchY = cy + Math.sin(i * 1.2 + t * 2) * 120;
          ctx.beginPath();
          ctx.moveTo(startX, 0);
          ctx.lineTo(startX, branchY);
          ctx.lineTo(startX + 40, branchY + 40);
          ctx.lineTo(startX + 40, height);
          ctx.stroke();

          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.arc(startX + 40, branchY + 40, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 24. FLOATING CARD GALLERY
      // ─────────────────────────────────────────────────────────────
      else if (mode === "floating_card_gallery") {
        ctx.save();
        const cards = 6;
        for (let c = 0; c < cards; c++) {
          const cardAngle = (c * 2 * Math.PI) / cards + t * 0.8;
          const cardX = cx + Math.cos(cardAngle) * 160;
          const cardY = cy + Math.sin(cardAngle) * 70;

          ctx.save();
          ctx.translate(cardX, cardY);
          ctx.rotate(cardAngle * 0.5);
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.fillRect(-35, -50, 70, 100);
          ctx.strokeStyle = step.accentColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-35, -50, 70, 100);
          ctx.restore();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 25. HYPNOTIC SPIRAL TUNNEL
      // ─────────────────────────────────────────────────────────────
      else if (mode === "hypnotic_spiral_tunnel") {
        ctx.save();
        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        for (let a = 0; a < Math.PI * 18; a += 0.1) {
          const r = a * 6 + Math.sin(t * 3) * 15;
          const x = cx + Math.cos(a + t * 2) * r;
          const y = cy + Math.sin(a + t * 2) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 26. NEON VECTOR RADAR
      // ─────────────────────────────────────────────────────────────
      else if (mode === "neon_vector_radar") {
        ctx.save();
        const radarRad = 160 + chargeProgress * 1.2;
        ctx.strokeStyle = step.accentColor;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.arc(cx, cy, radarRad, 0, Math.PI * 2);
        ctx.arc(cx, cy, radarRad * 0.66, 0, Math.PI * 2);
        ctx.arc(cx, cy, radarRad * 0.33, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - radarRad, cy);
        ctx.lineTo(cx + radarRad, cy);
        ctx.moveTo(cx, cy - radarRad);
        ctx.lineTo(cx, cy + radarRad);
        ctx.stroke();

        // Rotating beam
        const beamAngle = t * 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(beamAngle) * radarRad, cy + Math.sin(beamAngle) * radarRad);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.14, 150)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 27. FLOATING BUBBLE SOAP
      // ─────────────────────────────────────────────────────────────
      else if (mode === "floating_bubble_soap") {
        ctx.save();
        bubbles.forEach((b) => {
          b.y -= b.speed;
          if (b.y < -b.radius) {
            b.y = height + b.radius;
            b.x = Math.random() * width;
          }

          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1.2;
          ctx.fillStyle = `${step.accentColor}18`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Highlight
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.2, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 28. DIGITAL CLOCK MATRIX
      // ─────────────────────────────────────────────────────────────
      else if (mode === "digital_clock_matrix") {
        ctx.save();
        ctx.font = "24px monospace";
        ctx.fillStyle = step.accentColor;
        ctx.globalAlpha = 0.5;

        for (let y = 50; y < height; y += 70) {
          const timeStr = new Date().toLocaleTimeString();
          ctx.fillText(`${timeStr} // AZVEB CORE METRIC`, 40, y);
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 29. SOLAR ECLIPSE CORONA
      // ─────────────────────────────────────────────────────────────
      else if (mode === "solar_eclipse_corona") {
        ctx.save();
        const sunRad = 110 + chargeProgress * 0.8;

        for (let ray = 0; ray < 60; ray++) {
          const rayAngle = (ray * 2 * Math.PI) / 60 + t * 0.5;
          const rayLen = sunRad + Math.sin(ray * 4 + t * 5) * 45 + 30;
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(rayAngle) * sunRad, cy + Math.sin(rayAngle) * sunRad);
          ctx.lineTo(cx + Math.cos(rayAngle) * rayLen, cy + Math.sin(rayAngle) * rayLen);
          ctx.stroke();
        }

        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(cx, cy, sunRad, 0, Math.PI * 2);
        ctx.fill();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.14, 150)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy);
        ctx.restore();
      }

      // ─────────────────────────────────────────────────────────────
      // 30. CYBERPUNK CITY SKYLINE
      // ─────────────────────────────────────────────────────────────
      else if (mode === "cyberpunk_city_skyline") {
        ctx.save();
        const bldCount = 16;
        const bldW = width / bldCount;

        for (let b = 0; b < bldCount; b++) {
          const bldH = 120 + Math.sin(b * 1.5) * 80 + (b % 3) * 40;
          const bX = b * bldW;
          const bY = height - bldH;

          ctx.fillStyle = b % 2 === 0 ? "#0c101d" : "#131b2e";
          ctx.fillRect(bX, bY, bldW - 4, bldH);
          ctx.strokeStyle = step.accentColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(bX, bY, bldW - 4, bldH);

          // Neon windows
          ctx.fillStyle = "#ffffff";
          for (let wy = bY + 15; wy < height - 15; wy += 25) {
            ctx.fillRect(bX + 8, wy, 6, 8);
          }
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.min(width * 0.15, 160)}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.displayWord, cx, cy - 80);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, [currentStep, chargeProgress, isHolding, activeEngineIndex, step.displayWord]);

  // ─── CLICK & HOLD CONTROLLER ───
  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".interactive-action")) return;
    soundManager.playHover();
    setIsHolding(true);
    mouseRef.current.isDown = true;

    holdIntervalRef.current = setInterval(() => {
      setChargeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          triggerNextStep();
          return 0;
        }
        return prev + 3;
      });
    }, 25);
  };

  const stopHold = () => {
    setIsHolding(false);
    mouseRef.current.isDown = false;
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setChargeProgress(0);
  };

  const triggerNextStep = () => {
    soundManager.playClick();
    setIsHolding(false);
    setChargeProgress(0);
    setCurrentStep((prev) => (prev + 1) % pulseStorySteps.length);
    assignRandomEngine();
  };

  const filteredPortfolio =
    selectedCat === "all" ? portfolio : portfolio.filter((p) => p.category === selectedCat);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden text-white select-none flex flex-col justify-between transition-colors duration-1000 bg-gradient-to-br ${step.gradient}`}
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      onMouseMove={handleMouseMove}
    >
      {/* ─── 30 UNİKAL VƏ TAM FƏRQLİ GPU MÜHƏRRİKİN KƏTANI ─── */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* ─── LOGO İLƏ BİRLƏŞDİRİLMİŞ AÇILIB-BAĞLANAN MENYU (TOP FLOATING HUD) ─── */}
      <header className="absolute top-6 inset-x-6 sm:inset-x-10 flex items-center justify-between z-40 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/15 shadow-2xl interactive-action">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center font-black text-white text-base shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-[#080814] rounded-xl flex items-center justify-center">
              {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
            </div>
          </button>

          <div
            onClick={() => {
              soundManager.playClick();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="px-3 pr-4 cursor-pointer"
          >
            <h1 className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
              AZVEB <span style={{ color: step.accentColor }}>MEDIA</span>
            </h1>
            <p className="text-[9px] font-mono text-white/40">Menyu & Naviqasiya</p>
          </div>
        </div>

        {/* Dynamic Mode Switcher Pill */}
        <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 interactive-action">
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              assignRandomEngine();
            }}
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white/80 flex items-center gap-1.5 cursor-pointer transition-all"
            title="30 Unikal Efektdən Təsadüfi Seç"
          >
            <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">EFEKT #{currentEngine.id}:</span> {currentEngine.name.toUpperCase()}
          </button>
        </div>
      </header>

      {/* ─── EXPANDABLE FULLSCREEN OVERLAY MENU ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl p-6 sm:p-12 flex flex-col justify-between interactive-action"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white">
                  A
                </div>
                <div>
                  <h2 className="text-base font-black text-white">AZVEB NAVİQASİYA</h2>
                  <p className="text-xs font-mono text-white/40">Fəsillər & Birbaşa Keçidlər</p>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto w-full py-8">
              {pulseStorySteps.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentStep(idx);
                    assignRandomEngine();
                    setIsMenuOpen(false);
                  }}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-2 group ${
                    currentStep === idx
                      ? "bg-white/10 border-white/40 shadow-2xl"
                      : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: s.accentColor }}>
                    {s.badge}
                  </span>
                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2">{s.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
              <span>Bakı şəh., Azure Business Center • bygsmv@gmail.com • +994 77 346 36 89</span>
              <a
                href="https://wa.me/994773463689"
                target="_blank"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25"
              >
                WhatsApp ilə Yazın
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── YUXARI MƏTN BLOKU (TOP CINEMATIC STORY HEADER) ─── */}
      <div className="pt-24 sm:pt-28 max-w-3xl mx-auto px-6 text-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest backdrop-blur-xl border border-white/10"
              style={{ backgroundColor: `${step.accentColor}18`, color: step.accentColor }}
            >
              {step.badge}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {step.title}
            </h2>

            <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto leading-relaxed font-light">
              {step.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── MƏRKƏZİ FƏZA ─── */}
      <div className="flex-1" />

      {/* ─── AŞAĞI FƏALİYYƏT & HOLD KONTROLLERİ (BOTTOM HUD) ─── */}
      <footer className="flex flex-col items-center justify-center z-30 pb-6 px-6 space-y-4">
        {/* YAZIYA UYĞUN BÖLMƏNİ AÇAN ƏSAS DÜYMƏ */}
        <div className="interactive-action">
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              setActiveDrawer(step.drawerType);
            }}
            className="px-7 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl transition-all hover:scale-105 cursor-pointer backdrop-blur-xl border border-white/20"
            style={{
              backgroundColor: step.accentColor === "#ffffff" ? "#ffffff" : step.accentColor,
              boxShadow: `0 10px 30px ${step.accentColor}40`,
              color: step.accentColor === "#ffffff" || step.accentColor === "#38bdf8" || step.accentColor === "#10b981" ? "#000000" : "#ffffff",
            }}
          >
            <step.actionIcon className="w-4 h-4" />
            {step.actionButtonText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CLICK & HOLD RING CONTROLLER */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center cursor-pointer">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={step.accentColor === "#ffffff" ? "#38bdf8" : step.accentColor}
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * chargeProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-white">
              {isHolding ? `${chargeProgress}%` : "HOLD"}
            </div>
          </div>

          <p className="text-[10px] font-mono uppercase tracking-widest text-white/50 animate-pulse">
            {isHolding ? "NÖVBƏTİ EFEKT YÜKLƏNİR..." : "MAUS İLƏ TOXUNUN VƏ YA BASIB SAXLAYIN (HOLD)"}
          </p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          DRAWER 1: HAQQIMIZDA & MANİFESTO (ABOUT US)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDrawer === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDrawer(null);
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-[#070712] border-l border-white/10 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
                      HAQQIMIZDA // 01
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">Manifestomuz & Missiyamız</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-white/70 leading-relaxed">
                  <p>
                    <strong className="text-white">Azveb Media</strong> — sadəcə bir reklam agentliyi deyil; data analitikası, süni intellekt alqoritmləri və dünya səviyyəli 4K prodakşnı bir araya gətirən rəqəmsal liderlik mühəndisliyidir.
                  </p>
                  <p>
                    Biz büdcələri boşuna yandıran standart şablonlara qarşıyıq. Hər bir brend üçün hədəf kütlənin psixologiyasını, platforma alqoritmlərini və konversiya tunellərini dərindən analiz edərək rekord nəticələr yaradırıq.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                      <div className="text-2xl font-black text-indigo-300">150+</div>
                      <div className="text-[10px] text-white/40 mt-1 uppercase">Uğurlu Müştəri</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                      <div className="text-2xl font-black text-cyan-300">7.4x</div>
                      <div className="text-[10px] text-white/40 mt-1 uppercase">Ortalama ROAS</div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/994501234567"
                target="_blank"
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
              >
                Komandamızla Əlaqə Qurun
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          DRAWER 2: XİDMƏTLƏRİMİZ (SERVICES)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDrawer === "services" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDrawer(null);
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-[#070712] border-l border-white/10 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                      XİDMƏTLƏRİMİZ (6 ƏSAS GÜC)
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">Bazar Liderliyi Mühərrikləri</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Sosial Media & SMM", desc: "Məzmun strategiyası, icma idarəetməsi və böyümə.", tag: "SMM", icon: Share2 },
                    { title: "Dəqiq Hədəfli Reklam", desc: "Meta, TikTok və Google-da A/B testləri ilə 4x-8x ROAS satışı.", tag: "Targetinq", icon: TrendingUp },
                    { title: "4K Video & Foto Prodakşn", desc: "Studiya və məkan çəkilişləri, kinematoqrafik montaj.", tag: "Prodakşn", icon: Camera },
                    { title: "Viral Reels & TikTok", desc: "Trend ssenarilər və milyonlarla baxış toplayan videolar.", tag: "Viral", icon: Sparkles },
                    { title: "Google SEO Dominasiyası", desc: "Axtarış sistemlərində 1-ci səhifə və davamlı üzvi trafik.", tag: "SEO", icon: Code2 },
                    { title: "3D Spatial Vebsaytlar", desc: "Dünya səviyyəli Next.js mühəndisliyi və yüksək sürət.", tag: "Veb", icon: Palette },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <s.icon className="w-4 h-4 text-cyan-400" />
                          {s.title}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                          {s.tag}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 pl-6 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/994501234567"
                target="_blank"
                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                Bu Xidmətlər Üçün Müraciət Edin
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          DRAWER 3: PORTFEL & ƏL İŞLƏRİ (PORTFOLIO)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDrawer === "portfolio" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDrawer(null);
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-full bg-[#070712] border-l border-white/10 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-pink-400 font-bold uppercase tracking-widest">
                      PORTFEL & ƏL İŞLƏRİ
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">Uğur Hekayələrimiz</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "all", label: "Hamısı" },
                    { id: "smm", label: "📱 SMM" },
                    { id: "production", label: "🎬 Çəkiliş" },
                    { id: "development", label: "💻 Veb" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id as any)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCat === cat.id
                          ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                          : "bg-white/5 text-white/50 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPortfolio.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProjectModal(proj)}
                      className="group border border-white/10 bg-[#0a0a16] rounded-2xl overflow-hidden p-3.5 space-y-3 cursor-pointer hover:border-pink-500/40 transition-all"
                    >
                      <div className="relative h-36 rounded-xl overflow-hidden border border-white/10">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-pink-300 text-[10px] uppercase font-mono">
                          {proj.category}
                        </span>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-emerald-400 text-xs font-bold">
                          {proj.stats}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40">{proj.client}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                          {proj.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                <span>Rəsmi Əl İşləri Qalereyası</span>
                <span className="text-pink-400 font-bold">AZVEB MEDIA</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          DRAWER 4: CANLI AI SİMULYATOR (AI SCANNER)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDrawer === "ai" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDrawer(null);
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-[#070712] border-l border-white/10 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">
                      AI CANLI SİMULYATOR
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">Bazar Potensialı Hesabla</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2">Şirkətinizin Adı:</label>
                    <input
                      type="text"
                      placeholder="Məs: Baku Luxury Fashion"
                      className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-white text-sm outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <div>
                      <div className="text-[10px] text-white/40">Təxmini ROAS</div>
                      <div className="text-lg font-black text-purple-300">6.2x - 8.5x</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40">Aylıq Baxış</div>
                      <div className="text-lg font-black text-cyan-300">500,000+</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40">Satış Artımı</div>
                      <div className="text-lg font-black text-emerald-400">+340%</div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/994773463689"
                target="_blank"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                Bu Nəticəni Əldə Etmək Üçün Yazın
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          DRAWER 5: BİRBAŞA ƏLAQƏ & KONSULTASİYA (CONTACT HQ)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDrawer === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveDrawer(null);
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-[#070712] border-l border-white/10 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                      ƏLAQƏ & KONSULTASİYA // 05
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">Layihənizi Göndərin</h3>
                  </div>
                  <button
                    onClick={() => setActiveDrawer(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs text-white/70">
                    <p><strong className="text-white">Fiziki Ünvan:</strong> Bakı şəh., Azure Business Center</p>
                    <p><strong className="text-white">Rəsmi E-poçt:</strong> bygsmv@gmail.com</p>
                    <p><strong className="text-white">Əlaqə Nömrələri:</strong> +994 77 346 36 89 / +994 55 253 43 76</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.open("https://wa.me/994773463689", "_blank");
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Adınız və Soyadınız"
                      required
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Əlaqə Nömrəniz (+994...)"
                      required
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs outline-none"
                    />
                    <textarea
                      rows={3}
                      placeholder="Layihəniz haqqında qısa məlumat..."
                      className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs outline-none resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> WhatsApp ilə Təsdiqləyin
                    </button>
                  </form>
                </div>
              </div>

              <div className="text-[10px] text-white/40 text-center">
                Müraciətiniz dərhal mütəxəssislərimiz tərəfindən cavablandırılacaq.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PROJECT LIGHTBOX
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProjectModal(null)}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl p-4 sm:p-8 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-[#0a0a18] border border-white/15 rounded-3xl p-6 space-y-5"
            >
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10">
                <img src={selectedProjectModal.image} alt={selectedProjectModal.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-pink-400 font-bold uppercase">{selectedProjectModal.category}</span>
                  <span className="font-bold text-emerald-400">{selectedProjectModal.stats}</span>
                </div>
                <h3 className="text-xl font-black text-white">{selectedProjectModal.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{selectedProjectModal.desc}</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 text-xs font-bold cursor-pointer"
                >
                  Bağla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
