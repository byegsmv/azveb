"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true; // Səs default olaraq açıqdır

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  // İlk istifadəçi toxunuşunda/klikində Web Audio kontekstini aktivləşdirmək üçün
  unlockAudio() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playHover() {
    if (!this.enabled) return;
    try {
      this.unlockAudio();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Zərif, incə fütüristik hover harmoniyası
      osc.frequency.setValueAtTime(750, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {
      // Audio autoplay policy
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.unlockAudio();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      // Dolğun və lüks klik hissi
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio autoplay policy
    }
  }
}

export const soundManager = new SoundFX();

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false); // Default olaraq açıq

  useEffect(() => {
    // Səsləri istifadəçinin ilk klik və ya hərəkətində hazırla
    const handleFirstInteraction = () => {
      soundManager.unlockAudio();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundManager.enabled = !nextState;
    if (!nextState) {
      soundManager.playClick();
    }
  };

  return (
    <button
      onClick={toggleSound}
      title={isMuted ? "Səsi Aç (Mikro-effektlər)" : "Səsi Bağla"}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-white/70 hover:text-white transition-all hover:bg-white/[0.08] cursor-pointer"
      style={{ background: "rgba(255,255,255,0.06)" }}
      aria-label="Sound Toggle"
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-white/40" />
      ) : (
        <Volume2 className="w-4 h-4 text-accent drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
      )}
    </button>
  );
}
